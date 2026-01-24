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
async function editarCandidatura(formData) {
    return await fetchAPI(formData);
}

/**
 * Llama al API para obtener las bases legales
 */
async function obtenerBasesLegales(){
    const data = new FormData();
    data.append('action', 'obtenerBasesLegales');

    return await fetchAPI(data);
}

/**
 * Llama a la API para obtener las FAQs
 */
async function obtenerPreguntasFrecuentes(){
    const data = new FormData();
    data.append('action', 'obtenerPreguntasFrecuentes');
    return await fetchAPI(data);
}