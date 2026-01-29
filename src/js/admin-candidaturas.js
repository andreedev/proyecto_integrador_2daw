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
const modalDocumentos = document.getElementById('modalDocumentos');
const modalDetalleCandidatura = document.getElementById('modalDetalleCandidatura');
const modalHistorialEstado = document.getElementById('modalHistorialEstado');

const nombreParticipanteInput = document.getElementById('nombreParticipanteInput');
const nroExpedienteInput = document.getElementById('nroExpedienteInput');
const estadoActualInput = document.getElementById('estadoActualInput');
const nuevoEstadoCandidatura = document.getElementById('nuevoEstadoCandidatura');
const motivoCambioEstado = document.getElementById('motivoCambioEstado');
const btnConfimarCambioEstado = document.getElementById('btnConfimarCambioEstado');
const textoAyudaCambioEstado = document.getElementById('textoAyudaCambioEstado');

const estadoCandidaturaBadge = document.getElementById('estadoCandidaturaBadge');
const nombreCortoInput = document.getElementById('nombreCortoInput');
const nombreParticipante2 = document.getElementById('nombreParticipante2');
const nroExpedienteInput2 = document.getElementById('nroExpedienteInput2');
const nroDocumentoInput = document.getElementById('nroDocumentoInput');
const sinopsisInput = document.getElementById('sinopsisInput');
const fechaPresentacionInput = document.getElementById('fechaPresentacionInput');
const fechaActualizacionInput = document.getElementById('fechaActualizacionInput');
const btnVerDocumentos = document.getElementById('btnVerDocumentos');

let candidaturaSeleccionada = null;

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

nuevoEstadoCandidatura.addEventListener('change', (e) => {
    const estadoSeleccionado = e.target.value;
    actualizarEstadoMotivoRechazoInput(estadoSeleccionado);
});

btnVerDocumentos.addEventListener('click', () => {
    modalDetalleCandidatura.close();
    modalDocumentos.open();
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

        const btnDetail = createBtn('Detalle', 'secondary-button-02', () =>{
            candidaturaSeleccionada = c;
            renderizarDetalleCandidatura(c);
            modalDetalleCandidatura.open();
        });
        const btnDocs = createBtn('Documentos', 'secondary-button-02', () => {
            candidaturaSeleccionada = c;
            renderizarDocumentos(c);
            modalDocumentos.open();
        });
        const btnHistory = createBtn('Historial', 'secondary-button-02', async () => {
            if (renderizarHistorial(await cargarHistorialCandidatura(c.id_candidatura))){
                modalHistorialEstado.open();
            }
        });
        const btnChange = createBtn('Cambiar', 'primary-button-02', () => {
            candidaturaSeleccionada = c;
            modalCambiarEstado.open();
            nombreParticipanteInput.setValue(c.participante);
            nroExpedienteInput.setValue(c.nroExpediente);
            estadoActualInput.setValue(estadoTexto);
            if (c.estado === 'En revisión') {
                nuevoEstadoCandidatura.setOptions([
                    {value: 'Aceptada', label: 'Aceptada'},
                    {value: 'Rechazada', label: 'Rechazada'}
                ]);
                actualizarEstadoMotivoRechazoInput('Aceptada');
            } else if (c.estado === 'Aceptada') {
                nuevoEstadoCandidatura.setOptions([
                    {value: 'Finalista', label: 'Finalista'}
                ]);
                actualizarEstadoMotivoRechazoInput('Finalista');
            } else if (c.estado === 'Rechazada') {
                nuevoEstadoCandidatura.setOptions([
                    {value: 'En revisión', label: 'En revisión'}
                ]);
                actualizarEstadoMotivoRechazoInput('En revisión');
            }
            candidaturaSeleccionada = c;
        });

        actionsDiv.append(btnDetail, btnDocs, btnHistory);
        if (c.estado == 'Aceptada' || c.estado == 'En revisión') {
            actionsDiv.appendChild(btnChange);
        }
        tdAcciones.appendChild(actionsDiv);

        tr.append(tdParticipante, tdSinopsis, tdEstado, tdFechaPres, tdFechaMod, tdAcciones);
        tbody.appendChild(tr);
    });

    // Actualización de contadores y paginación
    totalCandidaturasSpan.textContent = totalCandidaturas;
    totalPorPagina.textContent = lista.length;
    paginacionCandidaturas.setAttribute('current-page', paginaActual);
    paginacionCandidaturas.setAttribute('total-pages', totalPaginas);
}


function actualizarEstadoMotivoRechazoInput(estado){
    if (estado === 'Rechazada') {
        textoAyudaCambioEstado.textContent = 'Indique el motivo del rechazo (visible para el participante)';
        motivoCambioEstado.required = true;
    } else {
        textoAyudaCambioEstado.textContent = 'Registre el motivo de este cambio para el historial interno';
        motivoCambioEstado.required = false;
    }
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

function renderizarDocumentos(c) {
    const videoCont = document.getElementById('videoCorto');
    const cartelImg = document.getElementById('cartel');
    const fichaCont = document.getElementById('fichaTecnica');

    const tabVideo = document.querySelector('[data-tab="video"]');
    if (tabVideo) tabVideo.click();

    videoCont.innerHTML = `
            <video 
                id="playerCandidatura"
                width="100%" 
                height="100%" 
                controls 
                preload="metadata" 
                class="rounded-8px"
                style="background: #000; object-fit: contain;"
                poster="${c.rutaCartel || ''}"
            >
                <source src="${c.rutaVideo}" type="video/mp4">
                Tu navegador no soporta la reproducción de video.
            </video>`;

    cartelImg.src = c.rutaCartel || '../img/Foto_corto.png';

    fichaCont.innerHTML = `
            <div class="d-flex flex-column gap-12px w-100">
                <div class="d-flex justify-space-between align-center">
                    <span class="fs-14px fw-600 text-neutral-02">Documento PDF</span>
                    <a href="${c.rutaFicha}" target="_blank" class="text-primary-03 fs-12px fw-600 d-flex align-center gap-4px">
                        Ver en otra pestaña
                    </a>
                </div>
                <embed 
                    src="${c.rutaFicha}" 
                    type="application/pdf" 
                    width="100%" 
                    height="260px" 
                    class="rounded-8px border-solid border-neutral-05"
                />
            </div>`;
}

btnConfimarCambioEstado.addEventListener('click', async () => {
    if (!motivoCambioEstado.validate(true).valid) return;

    const response = await editarCandidatura(candidaturaSeleccionada.id_candidatura,  nuevoEstadoCandidatura.value, motivoCambioEstado.value.trim());
    if (!response || response.status !== 'success') {
        showNotification('Error al cambiar el estado de la candidatura');
        return;
    }
    showNotification('Estado de la candidatura actualizado correctamente');
    modalCambiarEstado.close();
    await cargarCandidaturas();
});

function renderizarDetalleCandidatura(candidatura) {
    estadoCandidaturaBadge.textContent = candidatura.estado;
    estadoCandidaturaBadge.className = `badge ${getBadgeClass(candidatura.estado)}`;
    nombreCortoInput.value= candidatura.nombre_cortometraje || '-';
    nombreParticipante2.value = candidatura.participante || '-';
    nroExpedienteInput2.value = candidatura.nroExpediente || '-';
    nroDocumentoInput.value = candidatura.dni || '-';
    sinopsisInput.value = candidatura.sinopsis || '-';
    fechaPresentacionInput.setDate(convertISOStringToDate(candidatura.fecha_presentacion));
    fechaActualizacionInput.setDate(convertISOStringToDate(candidatura.fecha_ultima_modificacion));
}


async function cargarHistorialCandidatura(idCandidatura) {
    const response = await obtenerHistorialCandidatura(idCandidatura);
    if (!response || response.status !== 'success') {
        showNotification('Error al cargar el historial de la candidatura');
        return;
    }
    if (!response.data || response.data.length === 0) {
        showNotification('No hay historial disponible para esta candidatura');
        return;
    }
    return response.data;
}

function renderizarHistorial(historial) {
    if (!historial || historial.length === 0) return false;
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';

    const statusConfig = {
        'En revisión': { color: 'warning', icon: 'icon-warning' },
        'Rechazada':   { color: 'error', icon: 'icon-clock' },
        'Aceptada':    { color: 'success', icon: 'icon-check' },
        'Finalista':   { color: 'information', icon: 'icon-clock' },
        'Nominado':    { color: 'information', icon: 'icon-clock' },
        'Ganador':     { color: 'primary-03', icon: 'icon-trophy' }
    };

    historial.forEach((item, index) => {
        const config = statusConfig[item.estado] || statusConfig['En revisión'];
        const isRechazada = item.estado === 'Rechazada';

        const itemDiv = document.createElement('div');
        itemDiv.className = `timeline-item d-flex gap-24px mb-32px position-relative z-index-1`;

        let messageHtml = '';
        if (item.motivo && item.motivo.trim() !== "") {
            const bgBox = isRechazada ? 'bg-error-04' : 'bg-information-04';
            const borderBox = isRechazada ? 'border-solid border-error-03' : 'border-information-02';
            const textColor = isRechazada ? 'text-error-01' : 'text-information-01';

            messageHtml = `
            <div class="d-flex gap-16px p-16px mt-12px rounded-8px border-solid border-1px ${bgBox} ${borderBox}">
                <div class="w-32px h-32px border-radius-50 d-flex align-items-center justify-content-center border-solid border-2px ${borderBox} ${textColor} fw-bold fs-18px">
                    ${isRechazada ? '!' : 'i'}
                </div>
                <div class="d-flex flex-column gap-4px w-100">
                    <span class="fs-14px fw-700 ${textColor}">${isRechazada ? 'Motivo del Rechazo:' : 'Subsanación enviada:'}</span>
                    <p class="fs-14px m-0 ${textColor}">${item.motivo}</p>
                </div>
            </div>`;
        }

        itemDiv.innerHTML = `
            <div class="d-flex flex-column align-items-center position-relative">
                <div class="w-40px h-40px border-radius-50 d-flex align-items-center justify-content-center bg-neutral-09 border-solid border-${config.color}-02 text-${config.color}-01 shadow-01">
                    <span class="icon-clock w-20px h-20px bg-${config.color}-01"></span>
                </div>
            </div>

            <div class="d-flex flex-column flex-1 w-100">
                <div class="d-flex align-items-center gap-16px">
                    <span class="px-12px py-4px rounded-4px fs-12px fw-600 bg-${config.color}-04 text-${config.color}-01 border-solid  border-${config.color}-02">
                        ${item.estado.toUpperCase()}
                    </span>
                    <span class="fs-14px text-neutral-04">
                        ${formatDateTimeToSpanish(item.fechaHora)}
                    </span>
                </div>
                ${messageHtml}
            </div>
        `;
        container.appendChild(itemDiv);
    });
    return true;
}


document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => {
            p.classList.replace('d-block', 'd-none');
        });

        tab.classList.add('active');
        const targetPane = document.getElementById(`pane-${tab.dataset.tab}`);
        targetPane.classList.replace('d-none', 'd-block');
    });
});