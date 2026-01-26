/** Constantes globales */
const URL_API = "./../php/api.php";

/**
 *
 *
 * Funciones comunes en toda la aplicación
 *
 *
 */


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
                    <div class="d-flex flex-column me-0 flex-grow-1 min-w-0">
                        <div class="fs-14px text-truncate"></div>
                        <div class="fs-12px text-neutral-02"></div>
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
(function setupModalCloseButtons() {
    document.addEventListener('DOMContentLoaded', () => {
        const closeModalList = document.querySelectorAll('.close-modal');
        closeModalList.forEach(closeModal => {
            closeModal.addEventListener('click', () => {
                const dialog = closeModal.closest('dialog');
                if (dialog) dialog.close();
            });
        });
    });
})();

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
 * Convertir objeto Date a ISO String YYYY-MM-DD
 */
function convertDateToISOString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha de tipo Date a formato legible en español
 */
function humanizeDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Function para humanizar duracion en minutos a formato legible
 * Ejemplos:
 * 90   -> "1h 30m"
 * 45   -> "45m"
 */
function humanizeDuration(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let result = '';
    if (hrs > 0) {
        result += `${hrs}h `;
    }
    if (mins > 0) {
        result += `${mins}m`;
    }
    return result.trim();
}


/**
 * Funcion para pausar la ejecucion por un tiempo determinado
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
 * Inyectar estilos CSS externos en el documento
 * @param {string} url - URL del archivo CSS externo
 * @param {string} id - ID único para el elemento <style>
 */
const pendingStyles = {};
window.injectExternalStyles = async function(url, id) {
    if (document.getElementById(id)) return;

    if (pendingStyles[id]) return pendingStyles[id]

    pendingStyles[id] = (async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load: ${url}`);
            const cssText = await response.text();

            const style = document.createElement('style');
            style.id = id;
            style.textContent = cssText;

            const utilsLink = document.querySelector('link[href*="utils.css"]');
            if (utilsLink) {
                utilsLink.parentNode.insertBefore(style, utilsLink);
            } else {
                document.head.appendChild(style);
            }
        } catch (err) {
            console.error("CSS Injection Error:", err);
        } finally {
            delete pendingStyles[id];
        }
    })();

    return pendingStyles[id];
};