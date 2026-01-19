const preEventoCards = document.querySelectorAll('.preEventoCard');
const postEventoCards = document.querySelectorAll('.postEventoCard');
const preEventoButton = document.getElementById('preEventoButton');
const postEventoButton = document.getElementById('postEventoButton');

const generalMessage = document.getElementById('generalMessage');
const tituloEventoInput = document.getElementById('tituloEventoInput');
const tituloEventoErrorMessage = document.getElementById('tituloEventoErrorMessage');
const fechaEventoInput = document.getElementById('fechaEventoInput');
const fechaEventoErrorMessage = document.getElementById('fechaEventoErrorMessage');
const horaEventoInput = document.getElementById('horaEventoInput');
const horaEventoErrorMessage = document.getElementById('horaEventoErrorMessage');
const ubicacionEventoInput = document.getElementById('ubicacionEventoInput');
const ubicacionEventoErrorMessage = document.getElementById('ubicacionEventoErrorMessage');
const descripcionInput = document.getElementById('descripcionInput');
const descripcionErrorMessage = document.getElementById('descripcionErrorMessage');
const urlStreamingInput = document.getElementById('urlStreamingInput');
const urlStreamingErrorMessage = document.getElementById('urlStreamingErrorMessage');
const fechaUltimaModificacionText = document.getElementById('fechaUltimaModificacionText');

const publishChangesButton = document.getElementById('publishChangesButton');
const unsavedChangesWarning = document.getElementById('unsavedChangesWarning');

const streamingToggleContainer = document.getElementById('streamingToggleContainer');
const streamingToggleButton = document.getElementById('streamingToggleButton');
const streamingHelperText = document.getElementById('streamingHelperText');
const streamingIndicatorText = document.getElementById('streamingIndicatorText');
const urlStreamingContainer = document.getElementById('urlStreamingContainer');

const sendToPreviousEditionsButton = document.getElementById('sendToPreviousEditionsButton');
const modalEnviarEdicionesAnteriores = document.getElementById('modalEnviarEdicionesAnteriores');
const closeEnviarEdicionesAnterioresModalButtons = document.querySelectorAll('.closeEnviarEdicionesAnterioresModal');

const filesDropZone = document.getElementById('fileDropZone');
const fileInput = document.getElementById('fileInput');
const galleryContainer = document.getElementById('galleryContainer');
const noFilesHelperText = document.getElementById('noFilesHelperText');
const uploadedFilesCount = document.getElementById('uploadedFilesCount');

const postEventoResumenInput = document.getElementById('postEventoResumenInput');
const postEventoResumenErrorMessage = document.getElementById('postEventoResumenErrorMessage');

const yearEdicionInput = document.getElementById('yearEdicionInput');
const yearEditionErrorMessage = document.getElementById('yearEditionErrorMessage');
const nroParticipantesInput = document.getElementById('nroParticipantesInput');
const nroParticipantesErrorMessage = document.getElementById('nroParticipantesErrorMessage');
const fechaEnvioEmailInformativoInput = document.getElementById('fechaEnvioEmailInformativoInput');
const fechaEnvioEmailInformativoErrorMessage = document.getElementById('fechaEnvioEmailInformativoErrorMessage');
const fechaBorradoDatosInput = document.getElementById('fechaBorradoDatosInput');
const fechaBorradoDatosInputErrorMessage = document.getElementById('fechaBorradoDatosInputErrorMessage');


let modo = 'pre-evento';
let configuracionActual = null;
let loadingConfiguracion = true;
let idEdicion = null;

const fechaEventoDateTimePicker = new AirDatepicker(fechaEventoInput, {
    minDate: new Date(),
    autoClose: true,
    dateFormat: 'dd/MM/yyyy',
    buttons: ['today', 'clear'],
    locale: {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        clear: 'Limpiar',
        firstDay: 1
    },
    buttons: [
        {
            content: 'Hoy',
            className: 'custom-today-button',
            onClick: (dp) => {
                let date = new Date();
                dp.selectDate(date);
                dp.setViewDate(date);
                dp.hide();
            }
        },
        'clear'
    ],
    onSelect({date}) {
        console.log('fechaEventoDateTimePicker changed');
        revisarSiHayCambios()
    }
});
const horaEventoDateTimePicker = new AirDatepicker(horaEventoInput, {
    timepicker: true,
    onlyTimepicker: true,
    startDate: new Date().setHours(8, 0, 0),
    minHours: 7,
    maxHours: 22,
    timeFormat: 'HH:mm',
    minutesStep: 15,
    buttons: [
        {
            content: 'Ahora',
            onClick: (dp) => {
                let now = new Date();
                let currentHour = now.getHours();

                if (currentHour >= 8 && currentHour <= 20) {
                    dp.selectDate(now);
                } else {
                    let startRange = new Date();
                    startRange.setHours(8, 0);
                    dp.selectDate(startRange);
                }
                dp.hide();
            }
        },
        {
            content: 'Limpiar',
            onClick: (dp) => {
                dp.clear();
                dp.hide();
            }
        }
    ],
    onlyTimepicker: true,
    onSelect({date, formattedDate}) {
        console.log('horaEventoDateTimePicker changed');
        revisarSiHayCambios()
    }
});
const yearEdicionDateTimePicker = new AirDatepicker(yearEdicionInput, {
    timepicker: true,
    onlyTimepicker: true,
    minHours: 7,
    maxHours: 22,
    timeFormat: 'HH:mm',
    minutesStep: 15,
    buttons: [
        {
            content: 'Ahora',
            onClick: (dp) => {
                let now = new Date();
                let currentHour = now.getHours();

                if (currentHour >= 8 && currentHour <= 20) {
                    dp.selectDate(now);
                } else {
                    let startRange = new Date();
                    startRange.setHours(8, 0);
                    dp.selectDate(startRange);
                }
                dp.hide();
            }
        },
        {
            content: 'Limpiar',
            onClick: (dp) => {
                dp.clear();
                dp.hide();
            }
        }
    ],
    onlyTimepicker: true,
    onSelect({date, formattedDate}) {
        console.log('yearEdicionDateTimePicker changed');
        revisarSiHayCambios()
    }
});

tituloEventoInput.addEventListener('input', revisarSiHayCambios);
fechaEventoInput.addEventListener('input', revisarSiHayCambios);
horaEventoInput.addEventListener('input', revisarSiHayCambios);
ubicacionEventoInput.addEventListener('input', revisarSiHayCambios);
descripcionInput.addEventListener('input', revisarSiHayCambios);
urlStreamingInput.addEventListener('input', revisarSiHayCambios);
postEventoResumenInput.addEventListener('input', revisarSiHayCambios);
yearEdicionInput.addEventListener('input', revisarSiHayCambios);
nroParticipantesInput.addEventListener('input', revisarSiHayCambios);
fechaEnvioEmailInformativoInput.addEventListener('input', revisarSiHayCambios);
fechaBorradoDatosInput.addEventListener('input', revisarSiHayCambios);

streamingToggleButton.addEventListener('click', () => {
    const isActive = streamingToggleContainer.classList.contains('enabled');
    streamingToggleContainer.classList.toggle('enabled');
    if (isActive) {
        streamingIndicatorText.textContent = 'OFF';
        streamingHelperText.textContent = 'El enlace estará oculto para los visitantes';
        urlStreamingContainer.classList.add('hidden-force');
    } else {
        streamingIndicatorText.textContent = 'EN VIVO';
        streamingHelperText.textContent = 'El enlace será visible en la landing pública';
        urlStreamingContainer.classList.remove('hidden-force');
    }
    revisarSiHayCambios();
});

preEventoButton.addEventListener('click', () => {
    cambiarModo('pre-evento');
    revisarSiHayCambios()
});

postEventoButton.addEventListener('click', () => {
    cambiarModo('post-evento');
    revisarSiHayCambios();
});

tituloEventoInput.addEventListener('blur', () => validateTituloEvento(true));
fechaEventoInput.addEventListener('blur', () => validateFechaEvento(true));
horaEventoInput.addEventListener('blur', () => validateHoraEvento(true));
ubicacionEventoInput.addEventListener('blur', () => validateUbicacionEvento(true));
descripcionInput.addEventListener('blur', () => validateDescripcionEvento(true));
urlStreamingInput.addEventListener('blur', () => validateUrlStreaming(true));

postEventoResumenInput.addEventListener('blur', () => validatePostEventoResumen(true));

yearEdicionInput.addEventListener('blur', () => validateYearEdicion(true));
nroParticipantesInput.addEventListener('blur', () => validateNroParticipantes(true));
fechaEnvioEmailInformativoInput.addEventListener('blur', () => validateFechaEnvioEmailInformativo(true));
fechaBorradoDatosInput.addEventListener('blur', () => validateFechaBorradoDatos(true));

publishChangesButton.addEventListener('click', () => publicarCambios());

function cambiarModo(newMode) {
    modo = newMode;
    if (newMode === 'pre-evento') {
        preEventoCards.forEach(card => card.classList.remove('hidden-force'));
        postEventoCards.forEach(card => card.classList.add('hidden-force'));

        preEventoButton.classList.add('active');
        postEventoButton.classList.remove('active');

        sendToPreviousEditionsButton.classList.add('hidden-force');

    } else if (newMode === 'post-evento') {
        preEventoCards.forEach(card => card.classList.add('hidden-force'));
        postEventoCards.forEach(card => card.classList.remove('hidden-force'));

        postEventoButton.classList.add('active');
        preEventoButton.classList.remove('active');

        sendToPreviousEditionsButton.classList.remove('hidden-force');

        modo = 'post-evento';
    }
}
function validateTituloEvento(messageOnError) {
    if (tituloEventoInput.value.trim() === '') {
        if (messageOnError) tituloEventoErrorMessage.textContent = 'El título del evento no puede estar vacío';
        if (messageOnError) tituloEventoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    tituloEventoErrorMessage.classList.add('hidden-force');
    return true;
}
function validateFechaEvento(messageOnError) {
    if (fechaEventoInput.value === '') {
        if (messageOnError) fechaEventoErrorMessage.textContent = 'La fecha del evento no puede estar vacía';
        if (messageOnError) fechaEventoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    fechaEventoErrorMessage.classList.add('hidden-force');
    return true;
}
function validateHoraEvento(messageOnError) {
    if (horaEventoInput.value === '') {
        if (messageOnError) horaEventoErrorMessage.textContent = 'La hora del evento no puede estar vacía';
        if (messageOnError) horaEventoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    horaEventoErrorMessage.classList.add('hidden-force');
    return true;
}
function validateUbicacionEvento(messageOnError) {
    if (ubicacionEventoInput.value.trim() === '') {
        if (messageOnError) ubicacionEventoErrorMessage.textContent = 'La ubicación del evento no puede estar vacía';
        if (messageOnError) ubicacionEventoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    ubicacionEventoErrorMessage.classList.add('hidden-force');
    return true;
}
function validateDescripcionEvento(messageOnError) {
    if (descripcionInput.value.trim() === '') {
        if (messageOnError) descripcionErrorMessage.textContent = 'La descripción del evento no puede estar vacía';
        if (messageOnError) descripcionErrorMessage.classList.remove('hidden-force');
        return false;
    }
    descripcionErrorMessage.classList.add('hidden-force');
    return true;
}
function validateYearEdicion(messageOnError) {
    if (yearEdicionInput.value.trim() === '' || isNaN(yearEdicionInput.value) || parseInt(yearEdicionInput.value) < 2000) {
        if (messageOnError) yearEditionErrorMessage.textContent = 'Ingresa un año valido';
        if (messageOnError) yearEditionErrorMessage.classList.remove('hidden-force');
        return false;
    }
    yearEditionErrorMessage.classList.add('hidden-force');
    return true;
}
function validateNroParticipantes(messageOnError) {
    if (nroParticipantesInput.value.trim() === '' || isNaN(nroParticipantesInput.value) || parseInt(nroParticipantesInput.value) < 1) {
        if (messageOnError) nroParticipantesErrorMessage.textContent = 'Ingresa un número válido';
        if (messageOnError) nroParticipantesErrorMessage.classList.remove('hidden-force');
        return false;
    }
    nroParticipantesErrorMessage.classList.add('hidden-force');
    return true;
}
function validateFechaEnvioEmailInformativo(messageOnError) {
    if (fechaEnvioEmailInformativoInput.value === '') {
        if (messageOnError) fechaEnvioEmailInformativoErrorMessage.textContent = 'La fecha no puede estar vacía';
        if (messageOnError) fechaEnvioEmailInformativoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    fechaEnvioEmailInformativoErrorMessage.classList.add('hidden-force');
    return true;
}
function validateFechaBorradoDatos(messageOnError) {
    if (fechaBorradoDatosInput.value === '') {
        if (messageOnError) fechaBorradoDatosInputErrorMessage.textContent = 'La fecha no puede estar vacía';
        if (messageOnError) fechaBorradoDatosInputErrorMessage.classList.remove('hidden-force');
        return false;
    }
    fechaBorradoDatosInputErrorMessage.classList.add('hidden-force');
    return true;
}
function validateUrlStreaming(messageOnError) {
    if (urlStreamingInput.value.trim() === '') {
        if (messageOnError) urlStreamingErrorMessage.textContent = 'Ingresa una URL válida';
        if (messageOnError) urlStreamingErrorMessage.classList.remove('hidden-force');
        return false;
    }
    urlStreamingErrorMessage.classList.add('hidden-force');
    return true;
}
function validatePostEventoResumen(messageOnError) {
    if (postEventoResumenInput.value.trim() === '') {
        if (messageOnError) postEventoResumenErrorMessage.textContent = 'El resumen del evento no puede estar vacío';
        if (messageOnError) postEventoResumenErrorMessage.classList.remove('hidden-force');
        return false;
    }
    postEventoResumenErrorMessage.classList.add('hidden-force');
    return true;
}

async function publicarCambios() {
    if (modo === 'pre-evento') {
        const isTituloValid = validateTituloEvento(true);
        const isFechaValid = validateFechaEvento(true);
        const isHoraValid = validateHoraEvento(true);
        const isUbicacionValid = validateUbicacionEvento(true);
        const isDescripcionValid = validateDescripcionEvento(true);
        const isUrlStreamingValid = validateUrlStreaming(true);

        if (!isTituloValid || !isFechaValid || !isHoraValid || !isUbicacionValid || !isDescripcionValid || !isUrlStreamingValid) {
            updateGeneralMessage('Por favor, corrige los errores antes de publicar los cambios', 'text-error-01');
            return;
        }

        unsavedChangesWarning.classList.add('hidden-force');
        updateGeneralMessage('Guardando cambios', 'text-information-01');

        const updatePreEventDataResponse = await actualizarDatosPreEvento(tituloEventoInput.value, fechaEventoInput.value, horaEventoInput.value, ubicacionEventoInput.value, descripcionInput.value, streamingToggleContainer.classList.contains('enabled') ? 'true' : 'false', urlStreamingInput.value);
        if (updatePreEventDataResponse.status !== 'success') {
            updateGeneralMessage('Error guardando datos del pre-evento', 'text-error-01');
            return;
        }
    }
    if (modo === 'post-evento') {
        const isResumenValid = validatePostEventoResumen(true);

        unsavedChangesWarning.classList.add('hidden-force');
        updateGeneralMessage('Guardando cambios', 'text-information-01');


        const idArchivoList = [];
        const items = Array.from(galleryContainer.querySelectorAll(".gallery-item"));

        for (const item of items) {
            const img = item.querySelector("img");
            const vid = item.querySelector("video");
            const media = img || vid;

            if (!media) continue;

            let finalId = null;

            if (media.dataset.isNew === "true" && media.filePayload) {
                try {
                    const uploadRes = await subirArchivo(media.filePayload);
                    if (uploadRes.status === 'success')  finalId = uploadRes.data.idArchivo;
                } catch (err) {
                    console.error(err);
                    return updateGeneralMessage("Error subiendo archivo", "text-error-01");
                }
            }
            else if (media.dataset.idArchivo) {
                finalId = media.dataset.idArchivo;
            }

            if (finalId) {
                idArchivoList.push(parseInt(finalId));
            }
        }

        if (!isResumenValid) {
            updateGeneralMessage('Por favor, corrige los errores antes de publicar los cambios', 'text-error-01');
            return;
        }

        const updatePostEventDataResponse = await actualizarDatosPostEvento(postEventoResumenInput.value, idArchivoList);
        if (updatePostEventDataResponse.status !== 'success') {
            updateGeneralMessage('Error guardando datos del post-evento', 'text-error-01');
            return;
        }

    }

    await cargarConfiguracionWeb();
    unsavedChangesWarning.classList.add('hidden-force');
    updateGeneralMessage('Cambios guardados exitosamente', 'text-success-01');
}

function updateGeneralMessage(message, className) {
    generalMessage.classList.remove('text-error-01', 'text-success-01', 'text-information-01');
    generalMessage.classList.add(className);
    generalMessage.textContent = message;
}

function renderizarUI(data) {
    let config = data.configuracion;
    let archivos = data.archivosPostEvento;
    let edicionActual = data.edicionActual;
    if (!config) return;

    const modo = config.modo;
    if (modo === 'pre-evento') {
        cambiarModo('pre-evento');
    } else {
        cambiarModo('post-evento');
    }

    fechaUltimaModificacionText.textContent = config.fechaUltimaModificacionConfiguracion;
    tituloEventoInput.value = config.galaPreEventoTitulo || '';

    if (config.galaPreEventoFecha) {
        let date = convertToDate(config.galaPreEventoFecha);
        fechaEventoDateTimePicker.selectDate(date, { silent: true });
    }
    if (config.galaPreEventoHora) {
        let date = convertTimeToDate(config.galaPreEventoHora);
        horaEventoDateTimePicker.selectDate(date, { silent: true });
    }

    ubicacionEventoInput.value = config.galaPreEventoUbicacion || '';
    descripcionInput.value = config.galaPreEventoDescripcion || '';

    const isStreaming = config.galaPreEventoStreamingActivo === 'true';
    streamingToggleContainer.classList.toggle('enabled', isStreaming);
    streamingIndicatorText.textContent = isStreaming ? 'EN VIVO' : 'OFF';

    if (isStreaming) {
        urlStreamingContainer.classList.remove('hidden-force');
    } else {
        urlStreamingContainer.classList.add('hidden-force');
    }
    urlStreamingInput.value = config.galaPreEventoStreamingUrl || '';
    postEventoResumenInput.value = edicionActual.resumenEvento;
    yearEdicionInput.value = edicionActual.anioEdicion || '';
    nroParticipantesInput.value = edicionActual.nroParticipantes || '';
    fechaEnvioEmailInformativoInput.value = edicionActual.fechaEnvioEmailInformativo || '';
    fechaBorradoDatosInput.value = edicionActual.fechaBorradoDatos || '';

    galleryContainer.innerHTML = "";
    if (archivos && Array.isArray(archivos)) {
        archivos.forEach(file => {
            createGalleryItem(file.url, file.tipo, file.id);
        });
    }
    updateOrderNumbers();
    setTimeout(() => {
        loadingConfiguracion = false;
    }, 50);
}

/**
 * Revisa si hay cambios en el formulario y muestra u oculta el aviso correspondiente
 */
function revisarSiHayCambios() {
    if (loadingConfiguracion || !configuracionActual) return;

    let hasChanges = false;
    let reasons = [];

    const dbConfig = configuracionActual.configuracion || configuracionActual;
    const dbFiles = configuracionActual.archivosPostEvento || [];

    if (modo !== dbConfig.modo) {
        reasons.push(`Modo: UI(${modo}) vs DB(${dbConfig.modo})`);
        hasChanges = true;
    }

    let checks = {};

    if (modo === 'pre-evento') {
        checks = {
            titulo: [tituloEventoInput.value.trim(), dbConfig.galaPreEventoTitulo || ''],
            fecha: [fechaEventoInput.value, dbConfig.galaPreEventoFecha || ''],
            hora: [horaEventoInput.value, dbConfig.galaPreEventoHora || ''],
            ubicacion: [ubicacionEventoInput.value.trim(), dbConfig.galaPreEventoUbicacion || ''],
            descripcion: [descripcionInput.value.trim(), dbConfig.galaPreEventoDescripcion || ''],
            streaming: [streamingToggleContainer.classList.contains('enabled') ? 'true' : 'false', dbConfig.galaPreEventoStreamingActivo || 'false'],
            url: [urlStreamingInput.value.trim(), dbConfig.galaPreEventoStreamingUrl || '']
        };

    } else if (modo === 'post-evento') {

        const uiFiles = Array.from(galleryContainer.querySelectorAll('.gallery-item')).map(item => {
            const img = item.querySelector('img');
            const video = item.querySelector('video');
            const media = img || video;

            if (!media) return null;

            return media.src.split('#')[0].split('?')[0];
        }).filter(src => src !== null); // Remove any nulls

        const dbFileUrls = dbFiles.map(file => file.url);

        checks = {
            resumen: [postEventoResumenInput.value.trim(), dbConfig.galaPostEventoResumen || ''],
            galeria: [JSON.stringify(uiFiles), JSON.stringify(dbFileUrls)]
        };

    }

    for (const [key, [valUI, valDB]] of Object.entries(checks)) {
        if (valUI !== valDB) {
            reasons.push(`${key}: UI("${valUI}") vs DB("${valDB}")`);
            hasChanges = true;
        }
    }

    if (hasChanges) {
        // console.log("Cambios detectados:", reasons);
        unsavedChangesWarning.classList.remove('hidden-force');
    } else {
        unsavedChangesWarning.classList.add('hidden-force');
    }
}


/**
 * Convierte DD/MM/YYYY a un objeto Date
 */
function convertToDate(string) {
    if (!string || string.trim() === "") return null;
    const parts = string.split('/');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
}

/**
 * Convierte HH:mm a un objeto Date
 */
function convertTimeToDate(timeString) {
    if (!timeString || timeString.trim() === "") return null;
    const parts = timeString.split(':');
    if (parts.length !== 2) return null;

    const [hours, minutes] = parts;
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
}


function handleFiles(files) {
    const fileArray = Array.from(files);
    let invalidFiles = false;

    fileArray.forEach(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) {
            invalidFiles = true;
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        const type = isImage ? 'imagen' : 'video';

        const mediaElement = createGalleryItem(objectUrl, type);
        mediaElement.dataset.isNew = "true";
        mediaElement.filePayload = file;
    });

    if (invalidFiles) triggerShakeError(filesDropZone);
}

function triggerShakeError(element) {
    const target = element || filesDropZone;

    target.classList.add('shake-error');
    setTimeout(() => {
        target.classList.remove('shake-error');
    }, 400);
}

const updateOrderNumbers = () => {
    const items = galleryContainer.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        item.querySelector('.order-badge').textContent = index + 1;
    });
    uploadedFilesCount.textContent = items.length;
    if (items.length > 0) {
        noFilesHelperText.classList.add('hidden-force');
    } else {
        noFilesHelperText.classList.remove('hidden-force');
    }
};

function createGalleryItem(url, tipo, id=null) {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    let mediaHtml = '';
    if (tipo === 'video') {
        const videoSrc = url.includes('#') ? url : url + '#t=0.5';
        mediaHtml = `<video src="${videoSrc}" class="gallery-item-image" preload="metadata"></video>`;
    } else {
        mediaHtml = `<img src="${url}" class="gallery-item-image" alt="Uploaded">`;
    }

    div.innerHTML = `
        <div class="order-badge">0</div>
        ${mediaHtml}
        <div class="gallery-item-overlay">
            <div class="icon-container-2 bg-neutral-05 drag-handle">
                <div class="icon-drag w-16px h-16px bg-neutral-01"></div>
            </div>
            <div class="icon-container-2 bg-neutral-05 btn-remove-file">
                <div class="icon-close w-16px h-16px bg-neutral-01"></div>
            </div>
        </div>
    `;

    const mediaElement = div.querySelector('img, video');

    if (id) {
        mediaElement.dataset.idArchivo = id;
    }

    galleryContainer.appendChild(div);
    updateOrderNumbers();

    if (!loadingConfiguracion) {
        revisarSiHayCambios();
    }

    return mediaElement;
}


const fileSortable = new Sortable(galleryContainer, {
    animation: 300,
    ghostClass: 'sortable-ghost',
    filter: '.btn-remove',
    preventOnFilter: false,
    onEnd: () => {
        updateOrderNumbers();
        revisarSiHayCambios();
    }
});

function createVideoItem(src) {
    const item = document.createElement('div');
    item.className = 'video-item';
    item.innerHTML = `
        <div class="order-badge">0</div>
        
        <video src="${src}#t=0.5" preload="metadata"></video>
        
        <div class="gallery-item-overlay">
            <div class="icon-container-2 bg-neutral-05 drag-handle">
                <div class="icon-drag w-16px h-16px bg-neutral-01"></div>
            </div>
            
            <div class="icon-container-2 bg-neutral-05 btn-remove-video">
                <div class="icon-close w-16px h-16px bg-neutral-01"></div>
            </div>
        </div>
    `;
    galleryContainer.appendChild(item);
    updateVideoOrder();
    revisarSiHayCambios();
}

function updateVideoOrder() {
    const items = galleryContainer.querySelectorAll('.video-item');
    items.forEach((item, index) => {
        const badge = item.querySelector('.order-badge');
        if(badge) badge.textContent = index + 1;
    });

    uploadedFilesCount.textContent = items.length;

    if (items.length > 0) {
        noFilesHelperText.classList.add('hidden-force');
    } else {
        noFilesHelperText.classList.remove('hidden-force');
    }
}

async function cargarConfiguracionWeb() {
    const formData = new FormData();
    formData.append('action', 'obtenerConfiguracionWeb');

    const response = await fetch(URL_API, {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(result => {
            configuracionActual = result.data;
            idEdicion = result.data.edicionActual ? result.data.edicionActual.idEdicion : null;
            renderizarUI(result.data);
        })
        .catch(error => {
            console.error('Error al cargar la configuración web:', error);
        });
}

async function eliminarArchivo(idArchivo) {
    const formData = new FormData();
    formData.append('action', 'eliminarArchivo');
    formData.append('idArchivo', idArchivo);

    const response = await fetch(URL_API, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.status === 'success') {
        return true;
    }
    throw new Error('Error al borrar el archivo');
}

galleryContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-remove-video');
    if (btn) {
        btn.closest('.video-item').remove();
        updateVideoOrder();
        revisarSiHayCambios();
    }
});

filesDropZone.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover'].forEach(eventName => {
    filesDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        filesDropZone.classList.add('drag-over');
    });
});
['dragleave', 'drop'].forEach(eventName => {
    filesDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        filesDropZone.classList.remove('drag-over');
    });
});

filesDropZone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files) );

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
});

galleryContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.btn-remove-file');
    if (removeBtn) {
        removeBtn.closest('.gallery-item').remove();
        updateOrderNumbers();
        revisarSiHayCambios();
    }
});

sendToPreviousEditionsButton.addEventListener('click', () => {
    modalEnviarEdicionesAnteriores.showModal();
});

closeEnviarEdicionesAnterioresModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        modalEnviarEdicionesAnteriores.close();
    });
});

cargarConfiguracionWeb();