// constantes y variables generales
const URL_API = "./../php/api.php";

/**
 *  Configurar zona de arrastre generica para subir archivos
 */
function setupDynamicDropZone(container, allowedExtensions, maxSizeBytes, validateFunctionCallback) {
    if (!container) return;

    container.innerHTML = `
        <div class="drop-zone-wrapper">
            <div class="imageDropZone h-100px d-flex flex-column align-items-center justify-content-center cursor-pointer border-dashed border-neutral-04">
                <input type="file" accept="${allowedExtensions.map(ext => '.' + ext).join(',')}" hidden>
                <div class="contenidoInput">
                    <div class="d-flex flex-column align-items-center">
                        <span class="icon-upload d-block w-24px h-24px bg-neutral-01"></span>
                        <span class="textoSubirArchivo d-block mt-8px text-neutral-03 fs-14px">Haz clic o arrastra y suelta el archivo aquí</span>
                    </div>
                </div>
            </div>
            <div class="archivo-aceptado hidden-force">
                <div class="d-flex align-items-center px-16px py-8px bg-success-04 min-w-1px flex-shrink-1 gap-12px">
                    <div class="border-radius-50 bg-success-03 p-8px d-flex justify-center align-items-center ">
                        <span class="icon-small-check w-24px h-24px bg-neutral-02 d-flex"></span>
                    </div>
                    <div class="datosArchivo flex-grow-1 min-w-0">
                        <div class="archivo-nombre text-truncate"></div>
                        <div class="archivo-tamanio"></div>
                    </div>
                    <span class="icon-close d-block w-24px h-24px bg-neutral-01 cursor-pointer btnEliminarArchivo"></span>
                </div>
            </div>
            <div class="mensajeError text-error-01 fs-12px mt-2"></div>
        </div>
    `;

    const zone = container.querySelector('.imageDropZone');
    const input = container.querySelector('input[type="file"]');
    const card = container.querySelector('.archivo-aceptado');
    const nameSpan = container.querySelector('.archivo-nombre');
    const sizeSpan = container.querySelector('.archivo-tamanio');
    const removeBtn = container.querySelector('.btnEliminarArchivo');
    const errorSpan = container.querySelector('.mensajeError');

    const triggerShake = () => {
        zone.classList.add('shake-error');
        setTimeout(() => zone.classList.remove('shake-error'), 400);
    };

    const validateFile = (file) => {
        errorSpan.textContent = "";
        const fileName = file.name.toLowerCase();
        const isInvalidType = !allowedExtensions.some(ext => fileName.endsWith(ext.toLowerCase()));

        if (isInvalidType) {
            errorSpan.textContent = `Formato no válido. Solo: ${allowedExtensions.join(', ')}`;
            triggerShake();
            return false;
        }

        if (file.size > maxSizeBytes) {
            errorSpan.textContent = `Muy grande. Máximo: ${formatBytes(maxSizeBytes)}`;
            triggerShake();
            return false;
        }
        return true;
    };

    const updateUI = (file) => {
        if (!file) return;
        zone.classList.add('hidden-force');
        card.classList.remove('hidden-force');
        nameSpan.textContent = file.name;
        sizeSpan.textContent = formatBytes(file.size);
    };

    const clearFile = () => {
        input.value = '';
        card.classList.add('hidden-force');
        zone.classList.remove('hidden-force');
        errorSpan.textContent = '';
    };

    // Event Listeners
    zone.addEventListener('click', () => input.click());

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearFile();
        if (validateFunctionCallback) validateFunctionCallback(null);
    });

    ['dragenter', 'dragover'].forEach(name => {
        zone.addEventListener(name, (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(name => {
        zone.addEventListener(name, (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
        });
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length && validateFile(files[0])) {
            input.files = files;
            updateUI(files[0]);
            if (validateFunctionCallback) validateFunctionCallback(files[0]);
        }
    });

    input.addEventListener('change', () => {
        if (input.files.length) {
            if (validateFile(input.files[0])) {
                updateUI(input.files[0]);
                if (validateFunctionCallback) validateFunctionCallback(input.files[0]);
            } else {
                input.value = "";
            }
        }
    });

    return {
        getFile: () => (input.files.length > 0 ? input.files[0] : null),
        clear: () => clearFile(),
        getInputElement: () => input,
        setAttachedMode: (fileName) => {
            zone.classList.add('hidden-force');
            card.classList.remove('hidden-force');
            nameSpan.textContent = fileName;
            sizeSpan.classList.add('hidden-force');
            errorSpan.textContent = '';
        }
    };
}

/**
 * Cerrar modales al hacer clic en elementos con la clase 'close-modal'
 */
const closeModalList = document.querySelectorAll('.close-modal');
closeModalList.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const dialog = closeModal.closest('dialog');
        if (dialog) dialog.close();
    });
});

/**
 * Formatear bytes a una unidad legible
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Convierte ISO String YYYY-MM-DD a objeto Date
 */
function convertISOStringToDate(string) {
    const parts = string.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
}

/**
 * Convertir objecto Date a ISO String YYYY-MM-DD
 */
function convertDateToISOString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha a formato legible en español
 */
function humanizeDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Funcion para realizar peticiones a la API
 */
async function fetchAPI( data = null) {
    const options = {
        method: 'POST',
    };

    if (data) {
        options.body = data;
    }

    return await fetch(URL_API, options)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

/**
 * Listar patrocinadores
 */
async function listarPatrocinadores() {
    const data = new FormData();
    data.append('action', 'listarPatrocinadores');

    return await fetchAPI(data);
}

/**
 * Agregar patrocinador
 */
async function agregarPatrocinador(nombre, idArchivoLogo) {
    const data = new FormData();
    data.append('action', 'agregarPatrocinador');
    data.append('nombre', nombre);
    data.append('idArchivoLogo', idArchivoLogo);
    return await fetchAPI(data);
}

/**
 *  Actualizar patrocinador
 */
async function actualizarPatrocinador(idPatrocinador, nombre, idArchivoLogo) {
    const data = new FormData();
    data.append('action', 'actualizarPatrocinador');
    data.append('idPatrocinador', idPatrocinador);
    data.append('nombre', nombre);
    data.append('idArchivoLogo', idArchivoLogo);
    return await fetchAPI(data);
}

/**
 * Eliminar patrocinador
 */
async function eliminarPatrocinador(idPatrocinador) {
    const data = new FormData();
    data.append('action', 'eliminarPatrocinador');
    data.append('idPatrocinador', idPatrocinador);
    return await fetchAPI(data);
}

/**
 * Subir archivo
 */
async function subirArchivo(file) {
    const formData = new FormData();
    formData.append('action', 'subirArchivo');
    formData.append('file', file);

    const response = await fetch(URL_API, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.status === 'success') {
        return result;
    }
    throw new Error('Error al subir el archivo');
}

async function listarCategorias(){
    const data = new FormData();
    data.append('action', 'obtenerCategorias');

    return await fetchAPI(data);
}

// Obtener todas las categorías con sus premios
async function obtenerCategoriasConPremios() {
    const data = new FormData();
    data.append('action', 'obtenerCategoriasConPremios');
    return await fetchAPI(data);
}

// Agregar categoría con premios
async function agregarCategoriaConPremios(nombreCategoria, premios) {
    const data = new FormData();
    data.append('action', 'agregarCategoriaConPremios');
    data.append('nombreCategoria', nombreCategoria);
    data.append('premios', JSON.stringify(premios));
    return await fetchAPI(data);
}

// Editar categoría con premios
async function editarCategoriaConPremios(idCategoria, nombreCategoria, premios) {
    const data = new FormData();
    data.append('action', 'editarCategoriaConPremios');
    data.append('idCategoria', idCategoria);
    data.append('nombreCategoria', nombreCategoria);
    data.append('premios', JSON.stringify(premios));
    return await fetchAPI(data);
}

// Eliminar categoría con premios
async function eliminarCategoria(idCategoria) {
    const data = new FormData();
    data.append('action', 'eliminarCategoria');
    data.append('id_categoria', idCategoria);
    return await fetchAPI(data);
}

// -------------------- GANADORES --------------------
async function listarFinalistasNoGanadores() {
    const data = new FormData();
    data.append('action', 'listarFinalistasNoGanadores');
    return await fetchAPI(data);
}

async function asignarGanador(idPremio, idCandidatura) {
    const data = new FormData();
    data.append('action', 'asignarGanador');
    data.append('idPremio', idPremio);
    data.append('idCandidatura', idCandidatura);
    return await fetchAPI(data);
}

async function desasignarGanador(idPremio, idCandidatura) {
    const data = new FormData();
    data.append('action', 'desasignarGanador');
    data.append('idPremio', idPremio);
    data.append('idCandidatura', idCandidatura);
    return await fetchAPI(data);
}

async function actualizarDatosPreEvento(galaPreEventoTitulo,galaPreEventoFecha,galaPreEventoHora,galaPreEventoUbicacion,galaPreEventoDescripcion,galaPreEventoStreamingActivo,galaPreEventoStreamingUrl){
    const data = new FormData();
    data.append('action', 'actualizarDatosPreEvento');
    data.append('galaPreEventoTitulo', galaPreEventoTitulo.trim());
    data.append('galaPreEventoFecha', galaPreEventoFecha.trim());
    data.append('galaPreEventoHora', galaPreEventoHora.trim());
    data.append('galaPreEventoUbicacion', galaPreEventoUbicacion.trim());
    data.append('galaPreEventoDescripcion', galaPreEventoDescripcion.trim());
    data.append('galaPreEventoStreamingActivo', galaPreEventoStreamingActivo);
    data.append('galaPreEventoStreamingUrl', galaPreEventoStreamingUrl.trim());

    return await fetchAPI(data);
}

async function actualizarDatosPostEvento(resumenPostEvento, archivos){
    const data = new FormData();
    data.append('action', 'actualizarDatosPostEvento');
    data.append('archivos', JSON.stringify(archivos));
    data.append('resumenPostEvento', resumenPostEvento);

    return await fetchAPI(data);
}

async function actualizarEdicion(idEdicion, nombreEdicion, anioEdicion, resumenEvento, nroParticipantes, fechaEnvioEmailInformativo, fechaBorradoDatos){
    const data = new FormData();
    data.append('action', 'actualizarEdicion');
    data.append('idEdicion', idEdicion);
    data.append('nombreEdicion', nombreEdicion);
    data.append('anioEdicion', anioEdicion);
    data.append('resumenEvento', resumenEvento);
    data.append('nroParticipantes', nroParticipantes);
    data.append('fechaEnvioEmailInformativo', fechaEnvioEmailInformativo);
    data.append('fechaBorradoDatos', fechaBorradoDatos);

    return await fetchAPI(data);
}

async function enviarEdicionAAnteriores(anioEdicion, fechaEnvioEmailInformativo, fechaBorradoDatos){
    const data = new FormData();
    data.append('action', 'enviarEdicionAAnteriores');
    data.append('anioEdicion', anioEdicion);
    data.append('fechaEnvioEmailInformativo', fechaEnvioEmailInformativo);
    data.append('fechaBorradoDatos', fechaBorradoDatos);

    return await fetchAPI(data);
}

async function cargarConfiguracion() {
    const formData = new FormData();
    formData.append('action', 'obtenerConfiguracion');

    return await fetchAPI(formData);
}

async function listarNoticias(filtroNombre) {
    const formData = new FormData();
    formData.append('action', 'listarNoticias');
    formData.append('filtroNombre', filtroNombre);

    return await fetchAPI(formData);
}


async function listarEventos(filtroFecha) {
    const formData = new FormData();
    formData.append('action', 'listarEventos');
    formData.append('filtroFecha', filtroFecha);

    return await fetchAPI(formData);
}

async function crearEvento(nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivoImagen) {
    const formData = new FormData();
    formData.append('action', 'crearEvento');
    formData.append('nombreEvento', nombre);
    formData.append('descripcionEvento', descripcion);
    formData.append('ubicacionEvento', ubicacion);
    formData.append('fechaEvento', fecha);
    formData.append('horaInicioEvento', horaInicio);
    formData.append('horaFinEvento', horaFin);
    formData.append('idArchivoImagen', idArchivoImagen);

    return await fetchAPI(formData);
}

async function actualizarEvento(idEvento, nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivoImagen) {
    const formData = new FormData();
    formData.append('action', 'actualizarEvento');
    formData.append('idEvento', idEvento);
    formData.append('nombreEvento', nombre);
    formData.append('descripcionEvento', descripcion);
    formData.append('ubicacionEvento', ubicacion);
    formData.append('fechaEvento', fecha);
    formData.append('horaInicioEvento', horaInicio);
    formData.append('horaFinEvento', horaFin);
    formData.append('idArchivoImagen', idArchivoImagen);

    return await fetchAPI(formData);
}

async function eliminarEvento(idEvento) {
    const formData = new FormData();
    formData.append('action', 'eliminarEvento');
    formData.append('idEvento', idEvento);

    return await fetchAPI(formData);
}

// Función para mostrar las Candidaturas
async function mostrarCandidaturas() {
    const data = new FormData();
    data.append('action', 'mostrarCandidaturas');
    return await fetchAPI(data);
}


//Función para editar una candidatura
async function editarCandidatura(idCandidatura, nombre, descripcion, idCategoria) {
    const data = new FormData();
    data.append('action', 'editarCandidatura');
    data.append('idCandidatura', idCandidatura);
    data.append('nombre', nombre);
    data.append('descripcion', descripcion);
    data.append('idCategoria', idCategoria);
    return await fetchAPI(data);
}

//Función para eliminar una candidatura
async function eliminarCandidatura(idCandidatura) {
    const data = new FormData();
    data.append('action', 'eliminarCandidatura');
    data.append('idCandidatura', idCandidatura);
    return await fetchAPI(data);
}