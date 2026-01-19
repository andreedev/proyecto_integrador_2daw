// constantes y variables generales
const URL_API = "./../php/api.php";


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
