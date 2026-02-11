/** Constantes globales */
const URL_API = "./../php/api.php";
const ESTADOS_CANDIDATURA = {
    EN_REVISION: 'En revisión',
    ACEPTADA: 'Aceptada',
    RECHAZADA: 'Rechazada',
    FINALISTA: 'Finalista',
    GANADOR: 'Ganador'
};

/**
 *
 *
 * Funciones comunes en toda la aplicación
 *
 *
 */

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
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
    return `${value} ${sizes[i]}`;
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
async function fetchAPI(data = null) {
    const options = { method: 'POST' };
    if (data) options.body = data;

    try {
        const response = await fetch(URL_API, options);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `Error servidor: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en fetchAPI:', error);
        throw error;
    }
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

/**
 * Valida si un string tiene un formato de email válido
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
 * Formatea una fecha (string o Date) a formato DD/MM/YYYY
 * Soporta formatos con hora como "2026-01-26 03:52:04"
 * @param {string|Date} dateSource
 * @returns {string} Fecha formateada o string vacío si es inválida
 */
function formatDateToSpanish(dateSource) {
    if (!dateSource) return '';
    const normalizedSource = typeof dateSource === 'string'
        ? dateSource.replace(' ', 'T')
        : dateSource;

    const date = new Date(normalizedSource);

    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


/**
 * Formatea una fecha y hora (string o Date) a formato DD/MM/YYYY HH:MM
 * @param dateSource
 * @returns {string}: Fecha y hora formateada o string vacío si es inválida
 *
 * Ejemplo: "26/01/2026 15:30"
 */
function formatDateTimeToSpanish(dateSource) {
    const normalized = normalizeDateInput(dateSource);
    const date = new Date(normalized);

    if (!normalized || isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date).replace(',', '');
}

/**
 * Convierte fecha DD/MM/YYYY a formato Google Calendar YYYYMMDD
 * @param {string} spanishDate - Fecha en formato DD/MM/YYYY
 * @returns {string} Fecha en formato YYYYMMDD
 */
function convertSpanishDateToGoogleCalendar(spanishDate) {
    if (!spanishDate) return '';

    const [dia, mes, anio] = spanishDate.split('/');
    return `${anio}${mes.padStart(2, '0')}${dia.padStart(2, '0')}`;
}


/**
 * Normaliza strings de fecha para compatibilidad (Sustituye espacio por T)
 *  Convierte "YYYY-MM-DD HH:mm:ss" a "YYYY-MM-DDTHH:mm:ss"
 */
function normalizeDateInput(dateSource) {
    if (!dateSource) return null;
    if (dateSource instanceof Date) return dateSource;
    return dateSource.replace(' ', 'T');
}


/**
 * Convierte una fecha a formato largo: "31 de enero de 2026"
 * @param {string|Date} dateSource - Soporta "YYYY-MM-DD", "DD/MM/YYYY" o Date object
 * @returns {string} Fecha formateada o vacío si es inválida
 */
function formatDateToLongSpanish(dateSource) {
    if (typeof dateSource === 'string' && dateSource.includes('/')) {
        const [day, month, year] = dateSource.split('/');
        dateSource = `${year}-${month}-${day}`;
    }

    const normalized = normalizeDateInput(dateSource);
    const date = new Date(normalized);

    if (!normalized || isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}


/**
 * Capitaliza la primera letra de un string
 */
function capitalize(str) {
    if (!str || typeof str !== 'string') return '';

    return str.charAt(0).toUpperCase() + str.slice(1);
};


/**
 * Escucha cambios en el tamaño de la pantalla y ejecuta un callback con las nuevas dimensiones como parámetro.
 * @param {Function} callback - Funcion de callback que recibe un objeto { width, height }
 * @returns {Function} - Function para remover el listener
 */
function watchScreenSize(callback) {
    let timeoutId;

    function getDimensions() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    function handleResize() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function() {
            callback(getDimensions());
        }, 150);
    }

    callback(getDimensions());

    window.addEventListener('resize', handleResize);

    return function() {
        window.removeEventListener('resize', handleResize);
    };
}

/**
 * Cuenta palabras reales ignorando espacios múltiples,
 * saltos de línea y caracteres especiales solitarios.
 */
function countWords(text) {
    if (!text || typeof text !== 'string') return 0;

    // Match busca grupos de caracteres alfanuméricos
    // El regex \p{L} soporta caracteres con tildes y eñes (Unicode)
    const words = text.match(/[\w\u00C0-\u00ff]+/g);

    return words ? words.length : 0;
}

/**
 * Desplaza suavemente la vista hasta un elemento específico o al inicio de la página si no se proporciona un elemento
 */
function scrollToElement(element) {
    if (element){
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Registra una promesa global para mantener el splash visible
 * hasta que la página termine de cargar sus datos de la API
 * Solo usar en páginas que requieran este comportamiento.
 * @returns {Function} resolvePageReady - Llamar cuando los datos estén renderizados
 */
function registerPageReady() {
    let resolvePageReady;
    window.pageReady = new Promise(resolve => {
        resolvePageReady = resolve;
    });
    return resolvePageReady;
}

/**
 * Detecta si el usuario está en un dispositivo móvil basándose en características como el tamaño de pantalla y la capacidad táctil.
 * @returns {boolean} true si se detecta un entorno móvil, false en caso contrario
 */
const isMobileEnv = () => {
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hasNoHover = window.matchMedia("(hover: none)").matches;
    const isSmallScreen = window.innerWidth < 768;
    return (hasCoarsePointer || hasNoHover) && isSmallScreen;
};