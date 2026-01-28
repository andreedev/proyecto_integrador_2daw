const notificationModal = document.getElementById('notificationModal');
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

const clearBtn = document.getElementById('btnLimpiarFiltros');
const filtroTexto = document.getElementById('filtroTexto');
const filtroEstado = document.getElementById('filtroEstado');
const filtroFecha = document.getElementById('filtroFecha');

let activeChangeRow = null;
let activeDetailRow = null;
let candidaturas = [];
let candidaturaSeleccionada = null;

let paginaActual = 1;

filtroEstado.setOptions([
    {value: '', label: 'Todos los estados', default: true},
    {value: 'En revisión', label: 'En revisión'},
    {value: 'Aceptada', label: 'Aceptada'},
    {value: 'Rechazada', label: 'Rechazada'},
    {value: 'Finalista', label: 'Finalista'}
])

filtroFecha.addEventListener('date-change', (e) => {
    cargarCandidaturas();
});

filtroEstado.addEventListener('change', () => {
    cargarCandidaturas();
});

const statusLabels = {
    review: 'En revisión',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    finalist: 'Finalista'
};


function showNotification(message) {
    notificationMessage.textContent = message;
    notificationModal.open();
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
        case 'En revisión':
            return 'review';
        case 'Aceptada':
            return 'accepted';
        case 'Rechazada':
            return 'rejected';
        case 'Finalista':
            return 'finalist';
        default:
            return 'review';
    }
}

function formatDate(fecha) {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-ES');
}

async function cargarCandidaturas() {
    try {
        const texto = filtroTexto.value.trim();
        const estado = filtroEstado.value;
        const fecha = filtroFecha.getISOValue();
        const response = await mostrarCandidaturas(texto, estado, fecha);
        if (!response || response.status !== 'success') {
            showNotification('Error al cargar candidaturas');
            return;
        }
        candidaturas = response.data;
        paginaActual = response.currentPage;
        totalPaginas = response.totalPages;
        totalRecords = response.totalRecords;

        renderizarCandidaturas(candidaturas, paginaActual, totalPaginas, totalRecords);
    } catch (e) {
        console.error(e);
        showNotification('Error de comunicación con el servidor');
    }
}

function renderizarCandidaturas(lista, paginaActual, totalPaginas, totalCandidaturas) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    tbody.replaceChildren();

    lista.forEach(c => {
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

    const id = row.dataset.id;
    const c = candidaturas.find(item => item.id_candidatura == id);

    if (!c) return;

    const tituloCandidatura = document.getElementById('detail-title');
    if (tituloCandidatura) tituloCandidatura.textContent = `Detalle de Candidatura`;

    document.getElementById('nombreCortoInput').setValue(c.nombre_cortometraje || 'Sin título');
    document.getElementById('nombreParticipanteInput').setValue(c.participante || '-');
    document.getElementById('nroExpedienteInput').setValue(c.nro_expediente || 'EXP-2025-001');
    document.getElementById('nroDocumentoInput').setValue(c.dni || '-');
    document.getElementById('sinopsisInput').setValue(c.sinopsis || '-');
    document.getElementById('fechaPresentacionInput').setValue(formatDate(c.fecha_presentacion));
    document.getElementById('fechaActualizacionInput').setValue(formatDate(c.fecha_ultima_modificacion));

    const badge = document.getElementById('detail-status-badge');
    if (badge) {
        const estadoClave = getEstadoKey(c.estado);
        badge.textContent = statusLabels[estadoClave] || c.estado;
        badge.className = `badge ${getBadgeClass(c.estado)}`;
    }

    const rejectReasonDiv = document.getElementById('detail-reject-reason');
    const rejectReasonText = document.getElementById('reject-reason-text');
    if (c.estado === 'Rechazada' && c.reject_reason) {
        if (rejectReasonText) rejectReasonText.textContent = c.reject_reason;
        if (rejectReasonDiv) rejectReasonDiv.style.display = 'block';
    } else {
        if (rejectReasonDiv) rejectReasonDiv.style.display = 'none';
    }

    detailModal.style.display = 'flex';
}

// CARGAR HISTORIAL
function cargarHistorial(row) {
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';

    const historial = row.dataset.historial ? JSON.parse(row.dataset.historial) : [];

    // Mapeo de estados usando tus clases de colores
    const statusConfig = {
        'review': {class: 'st-review', label: 'En revisión', badge: 'badge-warning'},
        'rejected': {class: 'st-rejected', label: 'Rechazada', badge: 'badge-error'},
        'accepted': {class: 'st-accepted', label: 'Aceptada', badge: 'badge-success'},
        'finalist': {class: 'st-finalist', label: 'Nominado', badge: 'badge-info'},
        'winner': {class: 'st-winner', label: 'Ganador', badge: 'badge-primary'}
    };

    historial.forEach((item) => {
        const config = statusConfig[item.estado] || statusConfig['review'];
        const itemDiv = document.createElement('div');
        itemDiv.className = `timeline-item ${config.class}`;

        let messageHtml = '';
        // Caja de Error (Rechazo)
        if (item.estado === 'rejected' && row.dataset.rejectReason) {
            messageHtml = `
            <div class="status-msg-box msg-error">
                <span class="msg-icon-circle">!</span>
                <div class="msg-text">
                    <strong>Motivo del Rechazo:</strong>
                    <p>${row.dataset.rejectReason}</p>
                </div>
            </div>`;
        }
        // Caja de Información (Subsanación - si existe en tus datos)
        else if (item.subsanacion) {
            messageHtml = `
            <div class="status-msg-box msg-info">
                <span class="msg-icon-circle">!</span>
                <div class="msg-text">
                    <strong>Subsanación enviada:</strong>
                    <p>${item.subsanacion}</p>
                </div>
            </div>`;
        }

        itemDiv.innerHTML = `
        <div class="timeline-visual">
            <div class="icon-clock-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            </div>
            <div class="connector-line"></div>
        </div>
        <div class="timeline-details">
            <div class="status-row">
                <span class="status-badge ${config.badge}">${config.label}</span>
                <span class="status-date">${formatDate(item.fecha)}</span>
            </div>
            ${messageHtml}
        </div>
    `;
        container.appendChild(itemDiv);
    });
}

modalStatus.addEventListener('change', () => {
    reasonWrapper.style.display = modalStatus.value === 'Rechazada' ? 'block' : 'none';
});

closeChangeBtn.onclick = () => changeModal.style.display = 'none';
closeDetailBtn.onclick = () => detailModal.style.display = 'none';
document.getElementById('closeHistoryModal').onclick = () => historyModal.style.display = 'none';
document.getElementById('closeDocumentsModal').onclick = () => documentsModal.style.display = 'none';


clearBtn.addEventListener('click', async () => {
    filtroEstado.value = '';
    filtroTexto.value = '';
    filtroFecha.clear();
    await cargarCandidaturas();
});


cargarCandidaturas();