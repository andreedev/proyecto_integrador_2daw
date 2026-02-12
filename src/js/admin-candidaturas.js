const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');
const filtroTexto = document.getElementById('filtroTexto');
const filtroTipo = document.getElementById('filtroTipo');
const filtroEstado = document.getElementById('filtroEstado');
const filtroFecha = document.getElementById('filtroFecha');
const totalCandidaturasSpan = document.getElementById('totalCandidaturas');
const paginacionCandidaturas = document.getElementById('paginacionCandidaturas');
const totalPorPagina = document.getElementById('totalPorPagina');
const modalDocumentos = document.getElementById('modalDocumentos');
const modalDetalleCandidatura = document.getElementById('modalDetalleCandidatura');
const modalHistorialEstado = document.getElementById('modalHistorialEstado');

const nuevoEstadoCandidatura = document.getElementById('nuevoEstadoCandidatura');
const motivoCambioEstado = document.getElementById('motivoCambioEstado');
const btnConfimarCambioEstado = document.getElementById('btnConfimarCambioEstado');
const textoAyudaCambioEstado = document.getElementById('textoAyudaCambioEstado');

const nombreCortoInput = document.getElementById('nombreCortoInput');
const nombreParticipante2 = document.getElementById('nombreParticipante2');
const nroExpedienteInput2 = document.getElementById('nroExpedienteInput2');
const nroDocumentoInput = document.getElementById('nroDocumentoInput');
const sinopsisInput = document.getElementById('sinopsisInput');
const fechaPresentacionInput = document.getElementById('fechaPresentacionInput');
const fechaActualizacionInput = document.getElementById('fechaActualizacionInput');
const btnVerDocumentos = document.getElementById('btnVerDocumentos');
const btnVolverAModalDetalle = document.getElementById('btnVolverAModalDetalle');

const notification = document.getElementById('notification');
const totalPalabras = document.getElementById('totalPalabras');

const bodyTablaCandidaturas = document.getElementById('bodyTablaCandidaturas');
const skeletonCandidaturas = document.getElementById('skeletonCandidaturas');
const tablaWrapper = document.getElementById('tablaWrapper');

let candidaturaSeleccionada = null;
let pageSize=5;

filtroEstado.setOptions([
    {value: '', label: 'Todos los estados', default: true},
    {value: 'En revisión', label: 'En revisión'},
    {value: 'Aceptada', label: 'Aceptada'},
    {value: 'Rechazada', label: 'Rechazada'},
    {value: 'Finalista', label: 'Finalista'}
])

filtroTipo.setOptions([
    {value: '', label: 'Todos los tipos', default: true},
    {value: 'alumno', label: 'Alumno'},
    {value: 'alumni', label: 'Alumni'}
]);

filtroFecha.addEventListener('date-change', (e) => {
    cargarCandidaturas();
});

filtroEstado.addEventListener('change', () => {
    cargarCandidaturas();
});

filtroTipo.addEventListener('change', () => {
    cargarCandidaturas();
});

btnLimpiarFiltros.addEventListener('click', async () => {
    filtroTipo.value = '';
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
    renderizarDocumentos(candidaturaSeleccionada);
    modalDocumentos.open();
});

btnVolverAModalDetalle.addEventListener('click', () => {
    renderizarDetalleCandidatura(candidaturaSeleccionada);
    modalDetalleCandidatura.open();
});

const statusLabels = {
    review: 'En revisión',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    finalist: 'Finalista'
};


function getBadgeClass(status) {
    if (!status) return 'review';
    if (status.includes(ESTADOS_CANDIDATURA.EN_REVISION)) return 'review';
    if (status.includes(ESTADOS_CANDIDATURA.ACEPTADA)) return 'accepted';
    if (status.includes(ESTADOS_CANDIDATURA.RECHAZADA)) return 'rejected';
    if (status.includes(ESTADOS_CANDIDATURA.FINALISTA)) return 'finalist';
    return 'review';
}

function getEstadoKey(status) {
    switch (status) {
        case ESTADOS_CANDIDATURA.EN_REVISION:
            return 'review';
        case ESTADOS_CANDIDATURA.ACEPTADA:
            return 'accepted';
        case ESTADOS_CANDIDATURA.RECHAZADA:
            return 'rejected';
        case ESTADOS_CANDIDATURA.FINALISTA:
            return 'finalist';
    }
}

/**
 * Carga y renderiza las candidaturas según los filtros y paginación
 */
async function cargarCandidaturas() {
    skeletonCandidaturas.show(tablaWrapper);

    const texto = filtroTexto.value.trim();
    const estado = filtroEstado.value;
    const tipo = filtroTipo.value;
    const fecha = filtroFecha.getISOValue();
    const page = paginacionCandidaturas.currentPage;
    const response = await listarCandidaturasAdmin(texto, tipo, estado, fecha, page, pageSize);
    if (!response || response.status !== 'success') {
        notification.show('Error al cargar candidaturas');
        return;
    }
    const candidaturas = response.data.list;
    const paginaActual = response.data.currentPage;
    const totalPaginas = response.data.totalPages;
    const totalRecords = response.data.totalRecords;

    renderizarCandidaturas(candidaturas, paginaActual, totalPaginas, totalRecords);

    await sleep(300)

    skeletonCandidaturas.hide(tablaWrapper);
}
/**
 * Unifica renderizado, asignación de eventos y actualización de UI
 */
function renderizarCandidaturas(lista, paginaActual, totalPaginas, totalCandidaturas) {

    bodyTablaCandidaturas.replaceChildren();

    lista.forEach(c => {
        const tr = document.createElement('tr');

        const estadoKey = getEstadoKey(c.estado);
        const estadoTexto = statusLabels[estadoKey] || c.estado;
        const fPresentacion = formatDateTimeToSpanish(c.fechaPresentacion);
        const fModificacion = formatDateTimeToSpanish(c.fechaUltimaModificacion);

        const tdParticipante = document.createElement('td');
        tdParticipante.innerHTML = `
            <div class="participant">${c.participante}</div>
            <div class="email">${c.dni}</div>
        `;

        const tdTitulo = document.createElement('td');
        tdTitulo.className = 'fw-500 fs-14px max-w-200px';
        tdTitulo.textContent = c.titulo;

        const tdSinopsis = document.createElement('td');
        tdSinopsis.className = 'text-neutral-04 fs-12px max-w-200px';
        const divSinopsis = document.createElement('div');
        divSinopsis.className = ' text-truncate-multiline-3';
        divSinopsis.textContent = c.sinopsis;
        tdSinopsis.appendChild(divSinopsis);

        const tdTipoCandidatura = document.createElement('td');
        tdTipoCandidatura.textContent = capitalize(c.tipoCandidatura);

        const tdEstado = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `badge ${getBadgeClass(c.estado)} text-nowrap`;
        badge.textContent = estadoTexto;
        tdEstado.appendChild(badge);

        const tdFechaPres = document.createElement('td');
        tdFechaPres.textContent = fPresentacion;
        const tdFechaMod = document.createElement('td');
        tdFechaMod.textContent = fModificacion;

        const tdAcciones = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const btnDetail = createBtn('Detalle', 'primary-button-02', () =>{
            candidaturaSeleccionada = c;
            renderizarDetalleCandidatura(c);
            modalDetalleCandidatura.open();
        });
        const btnHistory = createBtn('Ver historial', 'secondary-button-02', async () => {
            if (renderizarHistorial(await cargarHistorialCandidatura(c.idCandidatura))){
                modalHistorialEstado.open();
            }
        });

        actionsDiv.append(btnDetail);
        actionsDiv.append(btnHistory);

        tdAcciones.appendChild(actionsDiv);

        tr.append(tdParticipante, tdTitulo, tdSinopsis, tdTipoCandidatura, tdEstado, tdFechaPres, tdFechaMod, tdAcciones);
        bodyTablaCandidaturas.appendChild(tr);
    });

    // Actualización de contadores y paginación
    totalCandidaturasSpan.textContent = totalCandidaturas;
    totalPorPagina.textContent = lista.length;
    paginacionCandidaturas.setAttribute('current-page', paginaActual);
    paginacionCandidaturas.setAttribute('total-pages', totalPaginas);
}




/**
 * Funcion para crear botones de forma dinámica con estilos y eventos asignados
 */
function createBtn(text, className, onClick) {
    const btn = document.createElement('button');
    btn.className = `${className} button-small`;
    btn.textContent = text;
    btn.onclick = onClick;
    return btn;
}

/**
 * Renderiza los documentos asociados a la candidatura
 */
function renderizarDocumentos(c) {
    const videoCorto = document.getElementById('videoCorto');
    const cartelImg = document.getElementById('cartel');
    const fichaTecnicaContainer = document.getElementById('fichaTecnica');
    const trailerCorto = document.getElementById('trailerCorto');

    const tabVideo = document.querySelector('[data-tab="video"]');
    if (tabVideo) tabVideo.click();

    videoCorto.setSource(c.rutaVideo);

    cartelImg.src = c.rutaCartel;

    fichaTecnicaContainer.innerHTML = `
            <div class="d-flex flex-column gap-12px w-100">
                <div class="d-flex justify-space-between align-center">
                    <span class="fs-14px fw-600 text-neutral-02">PDF</span>
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


    if (c.rutaTrailer) {
        trailerCorto.setSource(c.rutaTrailer);
    }
}

btnConfimarCambioEstado.addEventListener('click', async () => {
    if (!motivoCambioEstado.validate(true).valid) return;

    if (!nuevoEstadoCandidatura.value) {
        notification.show('Seleccione un nuevo estado para la candidatura');
        return;
    }

    const response = await actualizarEstadoCandidatura(candidaturaSeleccionada.idCandidatura,  nuevoEstadoCandidatura.value, motivoCambioEstado.value.trim());
    if (!response || response.status !== 'success') {
        notification.show('Error al cambiar el estado de la candidatura');
        return;
    }
    notification.show('Estado de la candidatura actualizado correctamente');
    modalDetalleCandidatura.close();
    await cargarCandidaturas();
});

function renderizarDetalleCandidatura(candidatura) {
    nombreCortoInput.value= candidatura.titulo || '-';
    nombreParticipante2.value = candidatura.participante || '-';
    nroExpedienteInput2.value = candidatura.nroExpediente || '-';
    nroDocumentoInput.value = candidatura.dni || '-';
    sinopsisInput.value = candidatura.sinopsis || '-';
    totalPalabras.textContent = countWords(candidatura.sinopsis)
    fechaPresentacionInput.value = formatDateTimeToSpanish(candidatura.fechaPresentacion)
    fechaActualizacionInput.value = formatDateTimeToSpanish(candidatura.fechaUltimaModificacion);
    if (candidatura.estado === ESTADOS_CANDIDATURA.EN_REVISION) {
        nuevoEstadoCandidatura.setOptions([
            {value: '', label: 'Seleccione un nuevo estado', default: true},
            {value: ESTADOS_CANDIDATURA.ACEPTADA, label: ESTADOS_CANDIDATURA.ACEPTADA},
            {value: ESTADOS_CANDIDATURA.RECHAZADA, label: ESTADOS_CANDIDATURA.RECHAZADA}
        ]);
        nuevoEstadoCandidatura.disabled = false;
        btnConfimarCambioEstado.disabled = false;

    } else if (candidatura.estado === ESTADOS_CANDIDATURA.ACEPTADA) {
        nuevoEstadoCandidatura.setOptions([
            {value: '', label: 'Seleccione un nuevo estado', default: true},
            {value: ESTADOS_CANDIDATURA.FINALISTA, label: ESTADOS_CANDIDATURA.FINALISTA}
        ]);
        nuevoEstadoCandidatura.disabled = false;
        btnConfimarCambioEstado.disabled = false;

    } else if (candidatura.estado === ESTADOS_CANDIDATURA.RECHAZADA) {
        nuevoEstadoCandidatura.setOptions([
            {value: '', label: 'Seleccione un nuevo estado', default: true},
        ]);
        nuevoEstadoCandidatura.disabled = true
        btnConfimarCambioEstado.disabled = true;

    } else if (candidatura.estado === ESTADOS_CANDIDATURA.FINALISTA) {
        nuevoEstadoCandidatura.setOptions([
            {value: '', label: 'Seleccione un nuevo estado', default: true},
        ]);
        nuevoEstadoCandidatura.disabled = true;
        btnConfimarCambioEstado.disabled = true;
    }
    actualizarEstadoMotivoRechazoInput('');
}

function actualizarEstadoMotivoRechazoInput(estado){
    textoAyudaCambioEstado.classList.add('d-none');
    if (estado === ESTADOS_CANDIDATURA.RECHAZADA) {
        textoAyudaCambioEstado.classList.remove('d-none');
        textoAyudaCambioEstado.textContent = 'Indique el motivo del rechazo (visible para el participante)';
        motivoCambioEstado.required = true;
        motivoCambioEstado.show();
    } else {
        motivoCambioEstado.required = false;
        motivoCambioEstado.hide();
    }
}


async function cargarHistorialCandidatura(idCandidatura) {
    const response = await obtenerHistorialCandidatura(idCandidatura);
    if (!response || response.status !== 'success') {
        notification.show('Error al cargar el historial de la candidatura');
        return;
    }
    if (!response.data || response.data.length === 0) {
        notification.show('No hay historial disponible para esta candidatura');
        return;
    }
    return response.data;
}

function renderizarHistorial(historial) {
    if (!historial || historial.length === 0) return false;
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';

    const statusConfig = {
        'En revisión': { color: 'information', icon: 'icon-warning' },
        'Rechazada':   { color: 'error', icon: 'icon-clock' },
        'Aceptada':    { color: 'success', icon: 'icon-check' },
        'Finalista':   { color: 'information', icon: 'icon-clock' },
        'Ganador':     { color: 'primary-03', icon: 'icon-trophy' }
    };

    historial.forEach((item, index) => {

        const config = statusConfig[item.estado];
        const isRechazada = item.estado === ESTADOS_CANDIDATURA.RECHAZADA;

        const itemDiv = document.createElement('div');
        itemDiv.className = `timeline-item d-flex align-items-center gap-24px mb-32px position-relative z-index-1`;

        let messageHtml = '';
        if (item.motivo && item.motivo.trim() !== "") {
            const bgBox = isRechazada ? 'bg-error-04' : 'bg-information-04';
            const borderBox = isRechazada ? 'border-solid border-error-03' : 'border-information-02';
            const textColor = isRechazada ? 'text-error-01' : 'text-information-01';

            messageHtml = `
            <div class="d-flex gap-16px p-16px mt-12px rounded-8px border-solid border-1px ${bgBox} ${borderBox}">
                <div class="w-32px h-32px border-radius-50 d-flex align-items-center justify-content-center fw-bold fs-18px">
                <span class="icon-warning w-24px h-24px bg-${config.color}-01 "></span>
            </div>
                <div class="d-flex flex-column gap-4px w-100">
                    <span class="fs-14px fw-400 ${textColor}">${isRechazada ? 'Motivo del Rechazo:' : 'Subsanación enviada:'}</span>
                    <p class="fs-14px fw-600 m-0 ${textColor}">${item.motivo}</p>
                </div>
            </div>`;
        }

        itemDiv.innerHTML = `
            <div class="d-flex flex-column align-items-center position-relative">
                <div class="w-40px h-40px border-radius-50 d-flex align-items-center justify-content-center bg-neutral-09 border-solid border-${config.color}-02 text-${config.color}-01 shadow-01 bg-${config.color}-04">
                    <span class="icon-clock w-20px h-20px bg-${config.color}-01"></span>
                </div>
            </div>

            <div class="d-flex flex-column flex-1 w-100">
                <div class="d-flex align-items-center gap-16px">
                    <span class="px-12px py-4px rounded-4px fs-8px fw-600 bg-${config.color}-04 text-${config.color}-01 border-solid border-${config.color}-02">
                        ${item.estado.toUpperCase()}
                    </span>
                    <span class="fs-12px text-neutral-04">
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
            p.classList.replace('d-flex', 'd-none');
        });

        tab.classList.add('active');
        const targetPane = document.getElementById(`pane-${tab.dataset.tab}`);
        targetPane.classList.replace('d-none', 'd-flex');
    });
});