// constantes y variables generales
const URL_API = "./../php/api.php";

/**
 * Formatear bytes a una unidad legible
 */
function formatBytes(bytes,decimals = 2 ) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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

const closeModalList = document.querySelectorAll('.close-modal');
closeModalList.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const dialog = closeModal.closest('dialog');
        if (dialog) {
            dialog.close();
        }
    });
});


//------------------ Ganadores Admin ------------------//
async function listarCategorias(){
    const data = new FormData();
    data.append('action', 'obtenerCategorias');

    return await fetchAPI(data);
}