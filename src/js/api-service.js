/**
 * Cerrar sesión
 */
async function cerrarSesion() {
    const formData = new FormData();
    formData.append('action', 'cerrarSesion');

    return await fetchAPI(formData);
}

/**
 * Listar patrocinadores
 */
async function listarPatrocinadoresAdmin() {
    const data = new FormData();
    data.append('action', 'listarPatrocinadoresAdmin');

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

/**
 * Listar categorías
 */
async function listarCategoriasAdmin(){
    const data = new FormData();
    data.append('action', 'listarCategoriasAdmin');

    return await fetchAPI(data);
}

/**
 * Obtener categorías con premios
 */
async function obtenerCategoriasConPremios(page, pageSize) {
    const data = new FormData();
    data.append('action', 'obtenerCategoriasConPremios');
    data.append('page', page);
    data.append('pageSize', pageSize);

    return await fetchAPI(data);
}

/**
 * Agregar categoría con premios
 */
async function agregarCategoriaConPremios(nombreCategoria, premios) {
    const data = new FormData();
    data.append('action', 'agregarCategoriaConPremios');
    data.append('nombreCategoria', nombreCategoria);
    data.append('premios', JSON.stringify(premios));
    return await fetchAPI(data);
}

/**
 * Editar categoría con premios
 */
async function editarCategoriaConPremios(idCategoria, nombreCategoria, premios) {
    const data = new FormData();
    data.append('action', 'editarCategoriaConPremios');
    data.append('idCategoria', idCategoria);
    data.append('nombreCategoria', nombreCategoria);
    data.append('premios', JSON.stringify(premios));
    return await fetchAPI(data);
}

/**
 * Eliminar categoría
 */
async function eliminarCategoria(idCategoria) {
    const data = new FormData();
    data.append('action', 'eliminarCategoria');
    data.append('id_categoria', idCategoria);
    return await fetchAPI(data);
}

/**
 * Listar finalistas no ganadores
 */
async function listarFinalistasNoGanadores() {
    const data = new FormData();
    data.append('action', 'listarFinalistasNoGanadores');
    return await fetchAPI(data);
}

/**
 * Asignar ganador a una candidatura
 */
async function asignarGanador(idPremio, idCandidatura) {
    const data = new FormData();
    data.append('action', 'asignarGanador');
    data.append('idPremio', idPremio);
    data.append('idCandidatura', idCandidatura);
    return await fetchAPI(data);
}

/**
 * Desasignar ganador de una candidatura
 */
async function desasignarGanador(idPremio, idCandidatura) {
    const data = new FormData();
    data.append('action', 'desasignarGanador');
    data.append('idPremio', idPremio);
    data.append('idCandidatura', idCandidatura);
    return await fetchAPI(data);
}

/**
 * Actualiza los datos del pre-evento
 */
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

/**
 * Actualiza los datos del post-evento
 */
async function actualizarDatosPostEvento(resumenPostEvento, archivos){
    const data = new FormData();
    data.append('action', 'actualizarDatosPostEvento');
    data.append('archivos', JSON.stringify(archivos));
    data.append('resumenPostEvento', resumenPostEvento);

    return await fetchAPI(data);
}

/**
 * Actualiza una edición
 */
async function actualizarEdicion(idEdicion, anioEdicion, nroParticipantes, descripcion, idsArchivosGaleria, listaGanadores){
    const data = new FormData();
    data.append('action', 'actualizarEdicion');
    data.append('idEdicion', idEdicion);
    data.append('anioEdicion', anioEdicion);
    data.append('nroParticipantes', nroParticipantes);
    data.append('descripcion', descripcion);
    data.append('idsArchivosGaleria', JSON.stringify(idsArchivosGaleria));
    data.append('listaGanadores', JSON.stringify(listaGanadores));

    return await fetchAPI(data);
}

/**
 * Envía la edición actual a las ediciones anteriores
 */
async function enviarEdicionAAnteriores(anioEdicion, fechaEnvioEmailInformativo, fechaBorradoDatos){
    const data = new FormData();
    data.append('action', 'enviarEdicionAAnteriores');
    data.append('anioEdicion', anioEdicion);
    data.append('fechaEnvioEmailInformativo', fechaEnvioEmailInformativo);
    data.append('fechaBorradoDatos', fechaBorradoDatos);

    return await fetchAPI(data);
}

/**
 * Cargar configuración
 */
async function cargarConfiguracion() {
    const formData = new FormData();
    formData.append('action', 'obtenerConfiguracion');

    return await fetchAPI(formData);
}

/**
 * Guardar configuración
 */
async function listarNoticias(filtroNombre, page, pageSize) {
    const formData = new FormData();
    formData.append('action', 'listarNoticias');
    formData.append('filtroNombre', filtroNombre);
    formData.append('page', page);
    formData.append('pageSize', pageSize);

    return await fetchAPI(formData);
}

/**
 * Crear noticia
 */
async function crearNoticia(nombre, descripcion, fechaPublicacion, idArchivoImagen) {
    const formData = new FormData();
    formData.append('action', 'crearNoticia');
    formData.append('nombreNoticia', nombre);
    formData.append('descripcionNoticia', descripcion);
    formData.append('fechaPublicacionNoticia', fechaPublicacion);
    formData.append('idArchivoImagen', idArchivoImagen);

    return await fetchAPI(formData);
}


/**
 * Actualizar noticia
 */
async function actualizarNoticia(idNoticia, nombre, descripcion, fechaPublicacion, idArchivoImagen) {
    const formData = new FormData();
    formData.append('action', 'actualizarNoticia');
    formData.append('idNoticia', idNoticia);
    formData.append('nombreNoticia', nombre);
    formData.append('descripcionNoticia', descripcion);
    formData.append('fechaPublicacionNoticia', fechaPublicacion);
    formData.append('idArchivoImagen', idArchivoImagen);

    return await fetchAPI(formData);
}

/**
 * Eliminar noticia
 */
async function eliminarNoticia(idNoticia) {
    const formData = new FormData();
    formData.append('action', 'eliminarNoticia');
    formData.append('idNoticia', idNoticia);

    return await fetchAPI(formData);
}

/**
 * Obtener noticia por ID
 */
async function obtenerNoticiaPorId(idNoticia) {
    const formData = new FormData();
    formData.append('action', 'obtenerNoticiaPorId');
    formData.append('idNoticia', idNoticia);

    return await fetchAPI(formData);
}

/**
 * Listar eventos
 */
async function listarEventos(filtroFecha) {
    const formData = new FormData();
    formData.append('action', 'listarEventos');
    formData.append('filtroFecha', filtroFecha);

    return await fetchAPI(formData);
}

/**
 * Obtener evento por ID
 */
async function obtenerEventoPorId(idEvento) {
    const formData = new FormData();
    formData.append('action', 'obtenerEventoPorId');
    formData.append('idEvento', idEvento);

    return await fetchAPI(formData);
}

/**
 * Crear evento
 */
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

/**
 * Actualizar evento
 */
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

/**
 * Eliminar evento
 */
async function eliminarEvento(idEvento) {
    const formData = new FormData();
    formData.append('action', 'eliminarEvento');
    formData.append('idEvento', idEvento);

    return await fetchAPI(formData);
}

/**
 * Listar candidaturas para el admin
 */
async function listarCandidaturasAdmin(filtroTexto, filtroTipo, filtroEstado, filtroFecha, page, pageSize) {
    const data = new FormData();
    data.append('action', 'listarCandidaturasAdmin');
    data.append('filtroTexto', filtroTexto);
    data.append('filtroTipo', filtroTipo);
    data.append('filtroEstado', filtroEstado);
    data.append('filtroFecha', filtroFecha);
    data.append('page', page);
    data.append('pageSize', pageSize);
    return await fetchAPI(data);
}

/**
 * Actualizar estado de una candidatura
 */
async function actualizarEstadoCandidatura(idCandidatura, nuevoEstadoCandidatura, $motivoCambioEstado) {
    const data = new FormData();
    data.append('action', 'actualizarEstadoCandidatura');
    data.append('idCandidatura', idCandidatura);
    data.append('nuevoEstadoCandidatura', nuevoEstadoCandidatura);
    data.append('motivoCambioEstado', $motivoCambioEstado);
    return await fetchAPI(data);
}

/**
 * Obtener historial de una candidatura
 */
async function obtenerHistorialCandidatura(idCandidatura) {
    const data = new FormData();
    data.append('action', 'obtenerHistorialCandidatura');
    data.append('idCandidatura', idCandidatura);
    return await fetchAPI(data);
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
 * Guarda la candidatura
 */
async function guardarCandidatura(nombre, correo, password, dni, nroExpediente, idVideo, idPoster, titulo, sinopsis, idFichaTecnica, tipoCandidatura) {
    const data = new FormData();
    data.append('action', 'guardarCandidatura');
    data.append('nombre', nombre);
    data.append('correo', correo);
    data.append('password', password);
    data.append('dni', dni);
    data.append('nroExpediente', nroExpediente);
    data.append('idVideo', idVideo);
    data.append('idPoster', idPoster);
    data.append('titulo', titulo);
    data.append('sinopsis', sinopsis);
    data.append('idFichaTecnica', idFichaTecnica);
    data.append('tipoCandidatura', tipoCandidatura);

    return await fetchAPI(data);
}

/**
 * Listar candidaturas de un participante
 */
async function listarCandidaturasParticipante(page, pageSize){
    const data = new FormData();
    data.append('action', 'listarCandidaturasParticipante');
    data.append('page', page);
    data.append('pageSize', pageSize);

    return await fetchAPI(data);
}

/**
 * Obtener datos de la gala
 */
async function obtenerDatosGala(){
    const data = new FormData();
    data.append('action', 'obtenerDatosGala');

    return await fetchAPI(data);
}

/**
 * Actualizar candidatura
 */
async function actualizarCandidatura(idCandidatura, titulo, sinopsis, idPoster, idFichaTecnica, idTrailer, mensajeSubsanacion) {
    const data = new FormData();
    data.append('action', 'actualizarCandidatura');
    data.append('idCandidatura', idCandidatura);
    data.append('titulo', titulo);
    data.append('sinopsis', sinopsis);
    data.append('idPoster', idPoster);
    data.append('idFichaTecnica', idFichaTecnica);
    data.append('idTrailer', idTrailer);
    data.append('mensajeSubsanacion', mensajeSubsanacion);

    return await fetchAPI(data);
}

/**
 * Obtener datos para la home
 */
async function obtenerDatosHome(){
    const data = new FormData();
    data.append('action', 'obtenerDatosHome');

    return await fetchAPI(data);
}

/**
 * Obtener fechas de eventos por mes y año
 */
async function obtenerFechasEventoPorMesAnio(mes, anio) {
    const data = new FormData();
    data.append('action', 'obtenerFechasEventoPorMesAnio');
    data.append('mes', mes);
    data.append('anio', anio);

    return await fetchAPI(data);
}

/**
 * Listar ediciones
 */
async function listarEdiciones(tipo, page){
    const data = new FormData();
    data.append('action', 'listarEdiciones');
    data.append('tipo', tipo);
    data.append('page', page);

    return await fetchAPI(data);
}

async function crearEdicion(anioEdicion, nroParticipantes, resumen, idsArchivosGaleria, ganadores, tipo){
    const data = new FormData();
    data.append('action', 'crearEdicion');
    data.append('anioEdicion', anioEdicion);
    data.append('nroParticipantes', nroParticipantes);
    data.append('resumen', resumen);
    data.append('idsArchivosGaleria', JSON.stringify(idsArchivosGaleria));
    data.append('ganadores', JSON.stringify(ganadores));
    data.append('tipo', tipo);

    return await fetchAPI(data);
}

/**
 * Eliminar edición
 */
async function eliminarEdicion(idEdicion){
    const data = new FormData();
    data.append('action', 'eliminarEdicion');
    data.append('idEdicion', idEdicion);

    return await fetchAPI(data);
}

/**
 * Obtener datos del participante
 */
async function obtenerDatosParticipante(){
    const data = new FormData();
    data.append('action', 'obtenerDatosParticipante');

    return await fetchAPI(data);
}

/**
 * Obtener datos de una edición anterior por ID
 */
async function obtenerEdicionAnteriorById(idEdicion) {
    const data = new FormData();
    data.append('action', 'obtenerEdicionAnteriorById');
    data.append('idEdicion', idEdicion);

    return await fetchAPI(data);
}