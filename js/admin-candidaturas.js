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
    const modalStatus = document.getElementById('modalStatus');
    const participantSpan = document.getElementById('modal-participant');
    const currentStatusSpan = document.getElementById('modal-current-status');
    const deleteCandidaturaBtn = document.getElementById('deleteCandidatura');

    // FILTROS
    const searchInput = document.querySelector('.filter-search input');
    const statusFilterSelect = document.querySelector('.filter-status select');
    const dateInput = document.querySelector('.filter-date input');
    const clearBtn = document.querySelector('.clear');

    let activeChangeRow = null;
    let activeDetailRow = null;
    let candidaturas = [];
    let candidaturaSeleccionada = null;

    // Variables para los filtros y paginación
    let filtroBusqueda = '';
    let filtroEstado = '';
    let filtroFecha = '';
    let paginaActual = 1;
    const candidaturasPorPagina = 5;

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

    // ACTUALIZAR TEXTO DE INFORMACIÓN
    function actualizarInfoPaginacion(candidaturasMostradas, totalCandidaturas) {
        const infoElement = document.querySelector('.pagination-info');
        if (infoElement) {
            infoElement.textContent = `Mostrando ${candidaturasMostradas} de ${totalCandidaturas} candidaturas`;
        }
    }

    // PINTAR BOTONES DE PAGINACIÓN
    function pintarPaginacion(paginaActualLocal, totalPaginas) {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';

        // Botón Anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<span>Anterior</span>';
        prevBtn.disabled = paginaActualLocal <= 1;
        prevBtn.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                cargarCandidaturas();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Botones de páginas
        for (let i = 1; i <= totalPaginas; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn';
            pageBtn.textContent = i;
            if (i === paginaActualLocal) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', (e) => {
                const numPagina = parseInt(e.target.textContent);
                paginaActual = numPagina;
                cargarCandidaturas();
            });
            paginationContainer.appendChild(pageBtn);
        }

        // Botón Siguiente
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<span>Siguiente</span>';
        nextBtn.disabled = paginaActualLocal >= totalPaginas;
        nextBtn.addEventListener('click', () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                cargarCandidaturas();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    // CARGA CANDIDATURAS DESDE API (con filtros y paginación)
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

            // Aplicar filtros
            let candidaturasFiltradas = [...candidaturas];

            if (filtroBusqueda) {
                candidaturasFiltradas = candidaturasFiltradas.filter(c =>
                    c.participante.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
                    (c.sinopsis && c.sinopsis.toLowerCase().includes(filtroBusqueda.toLowerCase()))
                );
            }

            if (filtroEstado) {
                candidaturasFiltradas = candidaturasFiltradas.filter(c => c.estado === filtroEstado);
            }

            if (filtroFecha) {
                const fechaFiltro = new Date(filtroFecha).toISOString().split('T')[0];
                candidaturasFiltradas = candidaturasFiltradas.filter(c => {
                    const fechaPresentacion = new Date(c.fecha_presentacion).toISOString().split('T')[0];
                    return fechaPresentacion === fechaFiltro;
                });
            }

            // Calcular total de páginas
            const totalPaginas = Math.ceil(candidaturasFiltradas.length / candidaturasPorPagina);

            // Asegurar que la página actual sea válida
            if (paginaActual > totalPaginas) {
                paginaActual = totalPaginas;
            }
            if (paginaActual < 1) {
                paginaActual = 1;
            }

            // Obtener candidaturas para la página actual
            const indiceInicio = (paginaActual - 1) * candidaturasPorPagina;
            const candidaturasPaginadas = candidaturasFiltradas.slice(indiceInicio, indiceInicio + candidaturasPorPagina);

            pintarTabla(candidaturasPaginadas, candidaturasFiltradas.length, totalPaginas);
        } catch (e) {
            console.error(e);
            showNotification('Error de comunicación con el servidor');
        }
    }

    // PINTAR TABLA (con paginación)
    function pintarTabla(candidaturasParaPintar = candidaturas, totalCandidaturas = candidaturas.length, totalPaginas = 1) {
        const tbody = document.querySelector('table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (candidaturasParaPintar.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No hay candidaturas para mostrar</td></tr>';
            actualizarInfoPaginacion(0, totalCandidaturas);
            pintarPaginacion(1, totalPaginas);
            return;
        }

        candidaturasParaPintar.forEach(c => {
            const tr = document.createElement('tr');
            tr.dataset.id = c.id_candidatura;
            tr.dataset.estado = getEstadoKey(c.estado);
            tr.dataset.rejectReason = c.reject_reason || '';
            tr.dataset.historial = JSON.stringify(c.historial || []);
            tr.dataset.video = c.video || '';
            tr.dataset.poster = c.poster || '';
            tr.dataset.technical = c.technical || '';

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
            tr.querySelector('.change').addEventListener('click', () => {
                candidaturaSeleccionada = c;
                modalStatus.replaceChildren();
                let estadosDisponibles = [];
                if (c.estado === 'En revisión') {
                    estadosDisponibles = ['Aceptada', 'Rechazada'];
                } else if (c.estado === 'Aceptada') {
                    estadosDisponibles = ['Finalista'];
                } else if (c.estado === 'Rechazada') {
                    estadosDisponibles = ['En revisión'];
                } 
                estadosDisponibles.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado;
                    option.textContent = estado;
                    modalStatus.appendChild(option);
                });
            });
            tbody.appendChild(tr);
        });

        asignarEventos();

        // Actualizar info de paginación
        actualizarInfoPaginacion(candidaturasParaPintar.length, totalCandidaturas);
        pintarPaginacion(paginaActual, totalPaginas);
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
                modalStatus.value = row.dataset.estado || 'review';
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
        
        const newEstado = modalStatus.value;
        console.log(newEstado);
        const reason = document.querySelector('#rejectReason').value.trim();

        if (newEstado === 'rejected' && !reason) {
            showNotification('Debe indicar un motivo para el rechazo');
            return;
        }
        console.log(candidaturaSeleccionada.id_candidatura);
        

        const formData = new FormData();
        formData.append('action', 'editarCandidatura');
        formData.append('idCandidatura', candidaturaSeleccionada.id_candidatura);
        formData.append('estado', newEstado);
        formData.append('reject_reason', reason);

        try {
            const response = await editarCandidatura(formData);
            console.log('Editar candidatura response:', response);
            if (response.status === 'success') {
                cargarCandidaturas();
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
    modalStatus.addEventListener('change', () => {
        reasonWrapper.style.display = modalStatus.value === 'Rechazada' ? 'block' : 'none';
    });

    // CIERRE MODALES
    closeChangeBtn.onclick = () => changeModal.style.display = 'none';
    closeDetailBtn.onclick = () => detailModal.style.display = 'none';
    document.getElementById('closeHistoryModal').onclick = () => historyModal.style.display = 'none';
    document.getElementById('closeDocumentsModal').onclick = () => documentsModal.style.display = 'none';

    // EVENTOS DE FILTROS
    searchInput.addEventListener('input', () => {
        filtroBusqueda = searchInput.value.trim();
        paginaActual = 1; // Resetear a primera página al filtrar
        cargarCandidaturas();
    });

    statusFilterSelect.addEventListener('change', () => {
        filtroEstado = statusFilterSelect.value === 'Todos los estados' ? '' : statusFilterSelect.value;
        paginaActual = 1; // Resetear a primera página al filtrar
        cargarCandidaturas();
    });

    dateInput.addEventListener('change', () => {
        filtroFecha = dateInput.value;
        paginaActual = 1; // Resetear a primera página al filtrar
        cargarCandidaturas();
    });

    clearBtn.addEventListener('click', () => {
        filtroBusqueda = '';
        filtroEstado = '';
        filtroFecha = '';
        searchInput.value = '';
        statusFilterSelect.value = 'Todos los estados';
        dateInput.value = '';
        paginaActual = 1;
        cargarCandidaturas();
    });

    // Inicio de la aplicación
    cargarCandidaturas();
});