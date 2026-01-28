const notificationModal = document.getElementById('notificationModal');
const notificationMessage = document.getElementById('notificationMessage');

const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');
const filtroTexto = document.getElementById('filtroTexto');
const filtroEstado = document.getElementById('filtroEstado');
const filtroFecha = document.getElementById('filtroFecha');
const totalCandidaturasSpan = document.getElementById('totalCandidaturas');
const paginacionCandidaturas = document.getElementById('paginacionCandidaturas');
const totalPorPagina = document.getElementById('totalPorPagina');
const modalCambiarEstado = document.getElementById('modalCambiarEstado');
const modaDocumentos = document.getElementById('modalDocumentos');
const modalDetalleCandidatura = document.getElementById('modalDetalleCandidatura');
const modalHistorialEstado = document.getElementById('modalHistorialEstado');
const guardarEstadoCandidatura = document.getElementById('guardarEstadoCandidatura');


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

btnLimpiarFiltros.addEventListener('click', async () => {
    filtroEstado.value = '';
    filtroTexto.value = '';
    filtroFecha.clear();
    await cargarCandidaturas();
});

btnAplicarFiltros.addEventListener('click', async () => {
    await cargarCandidaturas();
});

filtroTexto.addEventListener('solid-input-enter', async (e) => {
    if (e.detail.valid) {
        await cargarCandidaturas();
    }
});

paginacionCandidaturas.addEventListener('page-change', async (e) => {
    await cargarCandidaturas();
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

async function cargarCandidaturas() {
    try {
        const texto = filtroTexto.value.trim();
        const estado = filtroEstado.value;
        const fecha = filtroFecha.getISOValue();
        const pagina = paginacionCandidaturas.currentPage;
        const response = await mostrarCandidaturas(texto, estado, fecha, pagina);
        if (!response || response.status !== 'success') {
            showNotification('Error al cargar candidaturas');
            return;
        }
        const candidaturas = response.data;
        const paginaActual = response.currentPage;
        const totalPaginas = response.totalPages;
        const totalRecords = response.totalRecords;

        renderizarCandidaturas(candidaturas, paginaActual, totalPaginas, totalRecords);
    } catch (e) {
        console.error(e);
        showNotification('Error de comunicación con el servidor');
    }
}
/**
 * Unifica renderizado, asignación de eventos y actualización de UI
 */
function renderizarCandidaturas(lista, paginaActual, totalPaginas, totalCandidaturas) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    tbody.replaceChildren();

    lista.forEach(c => {
        const tr = document.createElement('tr');

        const estadoKey = getEstadoKey(c.estado);
        const estadoTexto = statusLabels[estadoKey] || c.estado;
        const fPresentacion = formatDateTimeToSpanish(c.fecha_presentacion);
        const fModificacion = formatDateTimeToSpanish(c.fecha_ultima_modificacion);

        const tdParticipante = document.createElement('td');
        tdParticipante.innerHTML = `
            <div class="participant">${c.participante}</div>
            <div class="email">${c.dni}</div>
        `;

        const tdSinopsis = document.createElement('td');
        tdSinopsis.className = 'synopsis';
        tdSinopsis.textContent = c.sinopsis || '-';

        const tdEstado = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `badge ${getBadgeClass(c.estado)}`;
        badge.textContent = estadoTexto;
        tdEstado.appendChild(badge);

        const tdFechaPres = document.createElement('td');
        tdFechaPres.textContent = fPresentacion;
        const tdFechaMod = document.createElement('td');
        tdFechaMod.textContent = fModificacion;

        const tdAcciones = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const btnDetail = createBtn('Detalle', 'secondary-button-02', () => abrirDetalle(c));
        const btnDocs = createBtn('Documentos', 'secondary-button-02', () => {
            activeDetailRow = tr;
            modalDocumentsModal.open();
        });
        const btnHistory = createBtn('Historial', 'secondary-button-02', () => {
            cargarHistorial(c);
            modalHistorialEstado.open();
        });
        const btnChange = createBtn('Cambiar', 'primary-button-02', () => {
            candidaturaSeleccionada = c;
            modalCambiarEstado.open();
        });

        actionsDiv.append(btnDetail, btnDocs, btnHistory, btnChange);
        tdAcciones.appendChild(actionsDiv);

        // Ensamblar fila
        tr.append(tdParticipante, tdSinopsis, tdEstado, tdFechaPres, tdFechaMod, tdAcciones);
        tbody.appendChild(tr);
    });

    // Actualización de contadores y paginación
    totalCandidaturasSpan.textContent = totalCandidaturas;
    totalPorPagina.textContent = lista.length;
    paginacionCandidaturas.setAttribute('current-page', paginaActual);
    paginacionCandidaturas.setAttribute('total-pages', totalPaginas);
}

/**
 * Helper para crear botones
 */
function createBtn(text, className, onClick) {
    const btn = document.createElement('button');
    btn.className = `${className} button-small`;
    btn.textContent = text;
    btn.onclick = onClick;
    return btn;
}

/**
 * Unifica la lógica de preparación del modal de documentos
 */
function showDocumentsModal(c) {
    const videoContainer = documentsModal.querySelector('#video-pane .video-container');
    const posterContainer = documentsModal.querySelector('#poster-pane .poster-container');
    const technicalContainer = documentsModal.querySelector('#technical-pane .technical-info');

    // Usamos el objeto c directamente en lugar de dataset
    videoContainer.innerHTML = `<img src="${c.video || '../img/Video_Cortometraje.png'}" alt="Video" class="video-placeholder">`;
    posterContainer.innerHTML = `<img src="${c.poster || '../img/Foto_corto.png'}" alt="Cartel" class="poster-placeholder">`;
    technicalContainer.innerHTML = `<img src="${c.technical || '../img/Ficha_Tecnica.png'}" alt="Ficha técnica">`;

    documentsModal.style.display = 'flex';
}

/**
 * Unifica la lógica de preparación del modal de cambio de estado
 */
function prepararModalCambio(c) {
    participantSpan.textContent = c.participante;
    currentStatusSpan.textContent = statusLabels[getEstadoKey(c.estado)] || c.estado;

    // Limpiar y llenar select del modal
    modalStatus.replaceChildren();
    let opciones = [];
    if (c.estado === 'En revisión') opciones = ['Aceptada', 'Rechazada'];
    else if (c.estado === 'Aceptada') opciones = ['Finalista'];
    else if (c.estado === 'Rechazada') opciones = ['En revisión'];

    opciones.forEach(est => {
        const opt = document.createElement('option');
        opt.value = est;
        opt.textContent = est;
        modalStatus.appendChild(opt);
    });

    document.getElementById('rejectReason').value = c.reject_reason || '';
    reasonWrapper.style.display = 'none';
}


guardarEstadoCandidatura.addEventListener('click', async () => {
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


