document.addEventListener('DOMContentLoaded', () => {
    // VARIABLES DEL DOM
    const confirmationModal = document.getElementById('confirmationModal');
    const notificationModal = document.getElementById('notificationModal');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const notificationMessage = document.getElementById('notificationMessage');

    const closeDetailBtn = document.getElementById('closeDetailModal');
    const detailModal = document.getElementById('detailModal');
    const documentsModal = document.getElementById('documentsModal');
    const historyModal = document.getElementById('historyModal');
    const changeModal = document.getElementById('changeModal');

    const reasonWrapper = document.getElementById('rejectReasonWrapper');
    const closeChangeBtn = document.getElementById('closeModal');
    const saveChangeBtn = document.getElementById('saveModal');
    const statusSelect = document.getElementById('modalStatus');
    const participantSpan = document.getElementById('modal-participant');
    const currentStatusSpan = document.getElementById('modal-current-status');
    const deleteCandidaturaBtn = document.getElementById('deleteCandidatura'); // ← Añadido

    let activeChangeRow = null;
    let activeDetailRow = null;
    let candidaturas = [];

    const statusLabels = {
        review: 'En revisión',
        accepted: 'Aceptada',
        rejected: 'Rechazada',
        finalist: 'Finalista'
    };

    // MODALES (CONFIRMACIÓN Y NOTIFICACIÓN)
    function showConfirmation(message, onConfirm) {
        confirmationMessage.textContent = message;
        confirmationModal.style.display = 'flex';
        document.getElementById('confirmYes').onclick = () => {
            confirmationModal.style.display = 'none';
            if (typeof onConfirm === 'function') onConfirm();
        };
        document.getElementById('confirmNo').onclick = () => {
            confirmationModal.style.display = 'none';
        };
    }

    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationModal.style.display = 'flex';
        document.getElementById('closeNotification').onclick = () => {
            notificationModal.style.display = 'none';
        };
    }

    // FUNCIONES AUXILIARES
    function getBadgeClass(status) {
        if (!status) return 'review';
        if (status.includes('En revisión')) return 'review';
        if (status.includes('Aceptada')) return 'accepted';
        if (status.includes('Rechazada')) return 'rejected';
        if (status.includes('Finalista')) return 'finalist';
        return 'review';
    }

    function getEstadoKey(status) {
        switch (status) {
            case 'En revisión': return 'review';
            case 'Aceptada': return 'accepted';
            case 'Rechazada': return 'rejected';
            case 'Finalista': return 'finalist';
            default: return 'review';
        }
    }

    function formatDate(fecha) {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleString('es-ES');
    }

    // CARGA CANDIDATURAS DESDE API
    async function cargarCandidaturas() {
        try {
            const response = await mostrarCandidaturas();
            if (!response || response.status !== 'success') {
                showNotification('Error al cargar candidaturas');
                return;
            }
            candidaturas = response.data || [];

            // Añadir historial simulado
            candidaturas.forEach(c => {
                if (!c.historial) {
                    c.historial = [
                        { fecha: c.fecha_presentacion, estado: 'review' },
                        { fecha: c.fecha_ultima_modificacion, estado: c.estado }
                    ];
                }
            });

            pintarTabla();
        } catch (e) {
            console.error(e);
            showNotification('Error de comunicación con el servidor');
        }
    }

    // PINTAR TABLA
    function pintarTabla() {
        const tbody = document.querySelector('table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        candidaturas.forEach(c => {
            const tr = document.createElement('tr');
            tr.dataset.id = c.id_candidatura;
            tr.dataset.estado = getEstadoKey(c.estado);
            tr.dataset.rejectReason = c.reject_reason || '';
            tr.dataset.historial = JSON.stringify(c.historial || []);
            tr.dataset.video = c.video || '';
            tr.dataset.poster = c.poster || '';
            tr.dataset.technical = c.technical || '';

            // ✅ CORREGIDO: Mostrar texto legible del estado
            const estadoTexto = statusLabels[getEstadoKey(c.estado)] || c.estado;

            tr.innerHTML = `
                <td>
                    <div class="participant">${c.participante}</div>
                    <div class="email">${c.dni}</div>
                </td>
                <td class="synopsis">${c.sinopsis || '-'}</td>
                <td>
                    <span class="badge ${getBadgeClass(c.estado)}">${estadoTexto}</span>
                </td>
                <td>${formatDate(c.fecha_presentacion)}</td>
                <td>${formatDate(c.fecha_ultima_modificacion)}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-detail">Detalle</button>
                        <button class="btn btn-docs">Documentos</button>
                        <button class="btn btn-history">Historial</button>
                        <button class="btn change">Cambiar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        asignarEventos();
    }

    // ASIGNAR EVENTOS
    function asignarEventos() {
        document.querySelectorAll('.btn.change').forEach(btn => {
            btn.onclick = () => {
                const row = btn.closest('tr');
                if (!row) return;
                activeChangeRow = row;
                participantSpan.textContent = row.querySelector('.participant')?.textContent || '-';
                currentStatusSpan.textContent = statusLabels[row.dataset.estado] || row.dataset.estado;
                statusSelect.value = row.dataset.estado || 'review';
                document.getElementById('rejectReason').value = row.dataset.rejectReason || '';
                reasonWrapper.style.display = row.dataset.estado === 'rejected' ? 'block' : 'none';
                changeModal.style.display = 'flex';
            };
        });

        document.querySelectorAll('.btn-detail').forEach(btn => {
            btn.onclick = () => abrirDetalle(btn.closest('tr'));
        });

        document.querySelectorAll('.btn-docs').forEach(btn => {
            btn.onclick = () => {
                const row = btn.closest('tr');
                if (!row) return;
                activeDetailRow = row;
                cargarDocumentos(row);
                documentsModal.style.display = 'flex';
            };
        });

        document.querySelectorAll('.btn-history').forEach(btn => {
            btn.onclick = () => {
                const row = btn.closest('tr');
                if (!row) return;
                activeDetailRow = row;
                cargarHistorial(row);
                historyModal.style.display = 'flex';
            };
        });

        document.querySelectorAll('#documentsModal .tab-btn').forEach(tabBtn => {
            tabBtn.onclick = () => {
                const target = tabBtn.dataset.tab;
                document.querySelectorAll('#documentsModal .tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('#documentsModal .tab-pane').forEach(p => p.classList.remove('active'));
                tabBtn.classList.add('active');
                document.getElementById(target + '-pane').classList.add('active');
            };
        });
    }

    // CARGAR DOCUMENTOS
    function cargarDocumentos(row) {
        const videoContainer = documentsModal.querySelector('#video-pane .video-container');
        const posterContainer = documentsModal.querySelector('#poster-pane .poster-container');
        const technicalContainer = documentsModal.querySelector('#technical-pane .technical-info');

        videoContainer.innerHTML = `<img src="${row.dataset.video || '../img/Video_Cortometraje.png'}" alt="Video" class="video-placeholder">`;
        posterContainer.innerHTML = `<img src="${row.dataset.poster || '../img/Foto_corto.png'}" alt="Cartel" class="poster-placeholder">`;
        technicalContainer.innerHTML = `<img src="${row.dataset.technical || '../img/Ficha_Tecnica.png'}" alt="Ficha técnica">`;
    }

    // GUARDAR CAMBIO DE ESTADO
    saveChangeBtn.addEventListener('click', async () => {
        if (!activeChangeRow) return;
        const idCandidatura = activeChangeRow.dataset.id;
        const newEstado = statusSelect.value;
        const reason = newEstado === 'rejected' ? document.getElementById('rejectReason').value.trim() : '';

        if (newEstado === 'rejected' && !reason) {
            showNotification('Debe indicar un motivo para el rechazo');
            return;
        }

        const formData = new FormData();
        formData.append('action', 'editarCandidatura');
        formData.append('idCandidatura', idCandidatura);
        formData.append('estado', newEstado);
        formData.append('reject_reason', reason);

        try {
            const response = await editarCandidatura(formData);
            console.log('Editar candidatura response:', response);
            if (response.status === 'success') {
                const index = candidaturas.findIndex(c => c.id_candidatura == idCandidatura);
                if (index !== -1) {
                    candidaturas[index].estado = newEstado;
                    candidaturas[index].reject_reason = reason;
                    candidaturas[index].historial.push({ fecha: new Date(), estado: newEstado });
                }

                activeChangeRow.dataset.estado = newEstado;
                activeChangeRow.dataset.rejectReason = reason;

                const badge = activeChangeRow.querySelector('.badge');
                badge.textContent = statusLabels[newEstado];
                badge.className = 'badge ' + newEstado;

                changeModal.style.display = 'none';
                showNotification('Estado actualizado correctamente');
            } else {
                showNotification(response.message || 'Error al actualizar');
            }
        } catch (e) {
            console.error(e);
            showNotification('Error al actualizar el estado');
        }
    });

    // ABRIR DETALLE
    function abrirDetalle(row) {
        if (!row) return;
        activeDetailRow = row;
        document.getElementById('detail-id').textContent = row.dataset.id;
        document.getElementById('detail-name').textContent = row.querySelector('.participant')?.textContent || '-';
        document.getElementById('detail-email').textContent = row.querySelector('.email')?.textContent || '-';
        document.getElementById('detail-synopsis').textContent = row.querySelector('.synopsis')?.textContent || '-';

        const badge = document.getElementById('detail-status');
        badge.textContent = statusLabels[row.dataset.estado] || row.dataset.estado;
        badge.className = 'badge ' + row.dataset.estado;

        const rejectReasonDiv = document.getElementById('detail-reject-reason');
        const rejectReasonText = document.getElementById('reject-reason-text');
        if (row.dataset.estado === 'rejected' && row.dataset.rejectReason) {
            rejectReasonText.textContent = row.dataset.rejectReason;
            rejectReasonDiv.style.display = 'block';
        } else {
            rejectReasonDiv.style.display = 'none';
        }

        // ✅ AÑADIDO: Evento para eliminar candidatura
        deleteCandidaturaBtn.onclick = () => {
            const idCandidatura = row.dataset.id;
            showConfirmation(
                `¿Estás seguro de que quieres eliminar la candidatura ${idCandidatura}?`,
                async () => {
                    try {
                        const response = await eliminarCandidatura(idCandidatura);
                        console.log('Eliminar candidatura response:', response);

                        if (response.status === 'success') {
                            // Eliminar de la lista local
                            candidaturas = candidaturas.filter(c => c.id_candidatura != idCandidatura);

                            // Eliminar de la tabla DOM
                            row.remove();

                            // Cerrar el modal
                            detailModal.style.display = 'none';

                            showNotification('Candidatura eliminada correctamente');
                        } else {
                            showNotification(response.message || 'Error al eliminar');
                        }
                    } catch (e) {
                        console.error(e);
                        showNotification('Error al eliminar la candidatura');
                    }
                }
            );
        };

        detailModal.style.display = 'flex';
    }

    // CARGAR HISTORIAL
    function cargarHistorial(row) {
        const timelineContainer = historyModal.querySelector('.timeline');
        timelineContainer.innerHTML = '';
        const historial = row.dataset.historial ? JSON.parse(row.dataset.historial) : [];
        historial.forEach(item => {
            const div = document.createElement('div');
            div.className = 'timeline-item';
            div.innerHTML = `
                <span class="timeline-date">${formatDate(item.fecha)}</span>
                <span class="timeline-status">${statusLabels[item.estado] || item.estado}</span>
            `;
            timelineContainer.appendChild(div);
        });
    }

    // MOTIVO DE RECHAZO
    statusSelect.addEventListener('change', () => {
        reasonWrapper.style.display = statusSelect.value === 'rejected' ? 'block' : 'none';
    });

    // CIERRE MODALES
    closeChangeBtn.onclick = () => changeModal.style.display = 'none';
    closeDetailBtn.onclick = () => detailModal.style.display = 'none';
    document.getElementById('closeHistoryModal').onclick = () => historyModal.style.display = 'none';
    document.getElementById('closeDocumentsModal').onclick = () => documentsModal.style.display = 'none';

    // Inicio de la aplicación y del muestreo de tablas
    cargarCandidaturas();
});