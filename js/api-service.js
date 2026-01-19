// -------------------- CONSTANTES Y VARIABLES --------------------
const URL_API = "./../php/api.php";

// -------------------- UTILIDADES --------------------
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
 * Función para realizar peticiones a la API
 */
async function fetchAPI(data = null) {
    const options = {
        method: 'POST',
        headers: {}
    };

    if (typeof data === 'string') { // JSON crudo
        options.body = data;
        options.headers['Content-Type'] = 'application/json';
    } else if (data instanceof FormData) {
        options.body = data; // FormData se encarga del Content-Type
    }

    try {
        const response = await fetch(URL_API, options);
        const text = await response.text();

        if (!text) {
            console.warn("Respuesta vacía del servidor");
            return { status: 'error', message: 'Respuesta vacía del servidor' };
        }

        try {
            return JSON.parse(text);
        } catch {
            console.error("No se pudo parsear JSON:", text);
            return { status: 'error', message: 'Respuesta no JSON', raw: text };
        }
    } catch (err) {
        console.error("Error en fetchAPI:", err);
        return { status: 'error', message: 'Error de conexión', error: err };
    }
}

// -------------------- PATRICINADORES --------------------
async function listarPatrocinadores() {
    const data = new FormData();
    data.append('action', 'listarPatrocinadores');
    return await fetchAPI(data);
}

async function agregarPatrocinador(nombre, idArchivoLogo) {
    const data = new FormData();
    data.append('action', 'agregarPatrocinador');
    data.append('nombre', nombre);
    data.append('idArchivoLogo', idArchivoLogo);
    return await fetchAPI(data);
}

async function actualizarPatrocinador(idPatrocinador, nombre, idArchivoLogo) {
    const data = new FormData();
    data.append('action', 'actualizarPatrocinador');
    data.append('idPatrocinador', idPatrocinador);
    data.append('nombre', nombre);
    data.append('idArchivoLogo', idArchivoLogo);
    return await fetchAPI(data);
}

async function eliminarPatrocinador(idPatrocinador) {
    const data = new FormData();
    data.append('action', 'eliminarPatrocinador');
    data.append('idPatrocinador', idPatrocinador);
    return await fetchAPI(data);
}

async function subirArchivo(file) {
    const formData = new FormData();
    formData.append('action', 'subirArchivo');
    formData.append('file', file);

    const result = await fetchAPI(formData);
    if (result.status === 'success') return result;

    throw new Error('Error al subir el archivo');
}

const closeModalList = document.querySelectorAll('.close-modal');
closeModalList.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const dialog = closeModal.closest('dialog');
        if (dialog) dialog.close();
    });
});

// -------------------- CATEGORÍAS Y PREMIOS --------------------

// Obtener todas las categorías con sus premios
async function obtenerCategoriasConPremios() {
    const data = new FormData();
    data.append('action', 'obtenerCategoriasConPremios');
    return await fetchAPI(data);
}

// Agregar categoría con premios (CORREGIDO: usa FormData)
async function agregarCategoriaConPremios(nombreCategoria, premios) {
    const data = new FormData();
    data.append('action', 'agregarCategoriaConPremios');
    data.append('nombreCategoria', nombreCategoria);
    data.append('premios', JSON.stringify(premios));
    return await fetchAPI(data);
}

// Editar categoría con premios (CORREGIDO: usa FormData)
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
