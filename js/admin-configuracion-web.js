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

const imageDropZone = document.getElementById('imageDropZone');
const imageInput = document.getElementById('imageInput');
const imageGalleryContainer = document.getElementById('imageGalleryContainer');
const noImagesHelperText = document.getElementById('noImagesHelperText');
const uploadedImagesCount = document.getElementById('uploadedImagesCount');

const videoDropZone = document.getElementById('videoDropZone');
const videoInput = document.getElementById('videoInput');
const videoGalleryContainer = document.getElementById('videoGalleryContainer');
const uploadedVideosCount = document.getElementById('uploadedVideosCount');
const noVideosHelperText = document.getElementById('noVideosHelperText');

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
let rutasArchivosSubidos = [];

/**
 * Inicialización de los DateTimePickers
 */
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


/**
 *
 *
 *
 *
 * Listeners
 *
 *
 *
 */

/**
 * Monitoreo de cambios en los inputs
 */
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

/**
 * Manejo del toggle de streaming
 */
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

publishChangesButton.addEventListener('click', () => publishChanges());

/**
 *
 *
 *
 *
 * Funciones
 *
 *
 *
 *
 *
 */

/**
 * Cambia el modo de la interfaz entre 'pre-evento' y 'post-evento'
 */
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

async function publishChanges() {
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
    }
    if (modo === 'post-evento') {
        const isResumenValid = validatePostEventoResumen(true);
        const isYearValid = validateYearEdicion(true);
        const isNroParticipantesValid = validateNroParticipantes(true);
        const isFechaEnvioEmailValid = validateFechaEnvioEmailInformativo(true);
        const isFechaBorradoDatosValid = validateFechaBorradoDatos(true);

        if (!isResumenValid || !isYearValid || !isNroParticipantesValid || !isFechaEnvioEmailValid || !isFechaBorradoDatosValid) {
            updateGeneralMessage('Por favor, corrige los errores antes de publicar los cambios', 'text-error-01');
            return;
        }
    }

    unsavedChangesWarning.classList.add('hidden-force');
    // remove all classes
    updateGeneralMessage('Guardando cambios', 'text-information-01');

    const archivosParaGuardar = [];
    let ordenContador = 1;

    const imageGalleryItems = Array.from(imageGalleryContainer.querySelectorAll('.gallery-item img'));
    for (const img of imageGalleryItems) {
        let path = "";
        if (img.dataset.isNew === "true" && img.filePayload) {
            try {
                path = await subirArchivo(img.filePayload);
            } catch (error) {
                updateGeneralMessage('Error subiendo imagen', 'text-error-01');
                return;
            }
        } else {
            path = img.src.includes('uploads/') ? 'uploads/' + img.src.split('uploads/')[1] : img.src;
        }

        archivosParaGuardar.push({ tipo: 'imagen', ruta: path, orden: ordenContador++ });
    }

    const videoGalleryItems = Array.from(videoGalleryContainer.querySelectorAll('.video-item video'));
    for (const vid of videoGalleryItems) {
        let path = "";
        if (vid.dataset.isNew === "true" && vid.filePayload) {
            path = await subirArchivo(vid.filePayload);
        } else {
            let cleanUrl = vid.src.split('#')[0].split('?')[0];
            path = cleanUrl.includes('uploads/') ? 'uploads/' + cleanUrl.split('uploads/')[1] : cleanUrl;
        }

        archivosParaGuardar.push({ tipo: 'video', ruta: path, orden: ordenContador++ });
    }

    if (modo === 'post-evento') {
        try {
            await guardarPostEventoArchivo(archivosParaGuardar);
        } catch (error) {
            console.log(error);
            generalMessage.textContent = "Error al organizar la galería en la base de datos";
            return;
        }
    }

    await actualizarConfiguracionWeb();
    updateGeneralMessage('Cambios guardados exitosamente', 'text-success-01');
}

function updateGeneralMessage(message, className) {
    generalMessage.classList.remove('text-error-01', 'text-success-01', 'text-information-01');
    generalMessage.classList.add(className);
    generalMessage.textContent = message;
}

function renderizarUI(config, imagenesGaleriaPostEvento, videosGaleriaPostEvento) {
    if (!config) return;

    if (config.modo === 'pre-evento') {
        cambiarModo('pre-evento');
    } else if (config.modo === 'post-evento') {
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

    postEventoResumenInput.value = config.galaPostEventoResumen || '';

    try {
        imageGalleryContainer.innerHTML = '';
        videoGalleryContainer.innerHTML = '';

        imagenesGaleriaPostEvento.forEach(imgSrc => {
            if (imgSrc) createGalleryItem(imgSrc);
        });

        videosGaleriaPostEvento.forEach(videoObj => {
            if (videoObj.url) {
                createVideoItem(videoObj.url);
            }
        });
    } catch (e) {
        console.error("Error al parsear las galerías:", e);
    }

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

    if (modo !== configuracionActual.modo) {
        reasons.push(`Modo: UI(${modo}) vs DB(${configuracionActual.modo})`);
        hasChanges = true;
    }

    let checks = {};
    if (modo === 'pre-evento') {
        checks = {
            titulo: [tituloEventoInput.value.trim(), configuracionActual.galaPreEventoTitulo || ''],
            fecha: [fechaEventoInput.value, configuracionActual.galaPreEventoFecha || ''],
            hora: [horaEventoInput.value, configuracionActual.galaPreEventoHora || ''],
            ubicacion: [ubicacionEventoInput.value.trim(), configuracionActual.galaPreEventoUbicacion || ''],
            descripcion: [descripcionInput.value.trim(), configuracionActual.galaPreEventoDescripcion || ''],
            streaming: [streamingToggleContainer.classList.contains('enabled') ? 'true' : 'false', configuracionActual.galaPreEventoStreamingActivo || 'false'],
            url: [urlStreamingInput.value.trim(), configuracionActual.galaPreEventoStreamingUrl || '']
        };


    }else if (modo === 'post-evento') {
        checks = {
            resumen: [postEventoResumenInput.value.trim(), configuracionActual.galaPostEventoResumen || ''],
            imagenes: [JSON.stringify(Array.from(imageGalleryContainer.querySelectorAll('.gallery-item img')).map(img => img.src)), configuracionActual.galaPostEventoGaleriaImagenes || '[]'],
            videos: [JSON.stringify(Array.from(videoGalleryContainer.querySelectorAll('.video-item video')).map(video => ({ url: video.src }))), configuracionActual.galaPostEventoGaleriaVideos || '[]']
        };
    }

    for (const [key, [valUI, valDB]] of Object.entries(checks)) {
        if (valUI !== valDB) {
            reasons.push(`${key}: UI("${valUI}") vs DB("${valDB}")`);
            hasChanges = true;
        }
    }

    if (hasChanges) {
        // console.log("Cambios detectados en:", reasons);
        unsavedChangesWarning.classList.remove('hidden-force');
    } else {
        unsavedChangesWarning.classList.add('hidden-force');
    }
}


/**
 *
 *
 *
 *
 *
 *
 *  Utils
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

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


/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

/**
 * Manejo de la carga de imágenes mediante arrastrar y soltar o selección de archivos
 */
imageDropZone.addEventListener('click', () => imageInput.click());

/**
 * Eventos de dragenter, dragover, dragleave y drop
 *
 */
['dragenter', 'dragover'].forEach(eventName => {
    imageDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        const isFile = e.dataTransfer.types.includes('Files');
        if (isFile) {
            imageDropZone.classList.add('drag-over');
        } else {
            triggerShakeError(imageDropZone);
        }
    });
});
['dragleave', 'drop'].forEach(eventName => {
    imageDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        imageDropZone.classList.remove('drag-over');
    });
});

/**
 * Evento de drop para el área de arrastre
 */
imageDropZone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files) );

/**
 * Evento al recibir archivos desde el input de archivo
 */
imageInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const objectUrl = URL.createObjectURL(file);

        const imgElement = createGalleryItem(objectUrl);

        imgElement.dataset.isNew = "true";
        imgElement.filePayload = file;
    });
});

/**
 * Maneja los archivos cargados y los agrega a la galería
 */
function handleFiles(files) {
    const fileArray = Array.from(files);
    let hasError = false;

    fileArray.forEach(file => {
        if (!file.type.startsWith('image/')) {
            hasError = true;
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            createGalleryItem(e.target.result);
        };
        reader.readAsDataURL(file);
    });

    if (hasError) triggerShakeError(imageDropZone);
}

/**
 * Genera una animación de error
 */
function triggerShakeError(element) {
    const target = element || imageDropZone;

    target.classList.add('shake-error');
    setTimeout(() => {
        target.classList.remove('shake-error');
    }, 400);
}

/**
 * Actualiza los números de orden de las imágenes en la galería
 */
const updateOrderNumbers = () => {
    const items = imageGalleryContainer.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        item.querySelector('.order-badge').textContent = index + 1;
    });
    uploadedImagesCount.textContent = items.length;
    if (items.length > 0) {
        noImagesHelperText.classList.add('hidden-force');
    } else {
        noImagesHelperText.classList.remove('hidden-force');
    }
};

/**
 * Manejo del evento de clic para eliminar imágenes de la galería
 */
imageGalleryContainer.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.btn-remove-image');
    if (closeBtn) {
        closeBtn.closest('.gallery-item').remove();
        updateOrderNumbers();
        revisarSiHayCambios();
        // Borrar archivo del servidor
        let archivoSrc = closeBtn.closest('.gallery-item').querySelector('img').src;
    }
});

/**
 * Crea un nuevo elemento de galería con la imagen proporcionada
 */
function createGalleryItem(url) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <div class="order-badge">0</div>
        <img src="${url}" class="gallery-item-image" alt="Uploaded">
        
        <div class="gallery-item-overlay">
            <div class="icon-container-2 bg-neutral-05 drag-handle">
                <div class="icon-drag w-16px h-16px bg-neutral-01"></div>
            </div>
            
            <div class="icon-container-2 bg-neutral-05 btn-remove-image">
                <div class="icon-close w-16px h-16px bg-neutral-01"></div>
            </div>
        </div>
    `;
    imageGalleryContainer.appendChild(item);
    updateOrderNumbers();
    revisarSiHayCambios();
}


/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

const videoSortable = new Sortable(videoGalleryContainer, {
    animation: 300,
    ghostClass: 'sortable-ghost',
    filter: '.btn-remove-video',
    preventOnFilter: false,
    onEnd: () => {
        updateVideoOrder();
        revisarSiHayCambios();
    }
});
const imageSortable = new Sortable(imageGalleryContainer, {
    animation: 300,
    ghostClass: 'sortable-ghost',
    filter: '.btn-remove',
    preventOnFilter: false,
    onEnd: () => {
        updateOrderNumbers();
        revisarSiHayCambios();
    }
});

/**
 * Eventos dragenter, dragover, dragleave y drop para vídeos
 */
['dragenter', 'dragover'].forEach(eventName => {
    videoDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        const isFile = e.dataTransfer.types.includes('Files');
        if (isFile) {
            videoDropZone.classList.add('drag-over');
        } else {
            triggerShakeError(videoDropZone);
        }
    });
});

['dragleave', 'drop'].forEach(eventName => {
    videoDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        videoDropZone.classList.remove('drag-over');
    });
});
videoDropZone.addEventListener('click', () => videoInput.click());
videoDropZone.addEventListener('drop', (e) => {
    handleVideoFiles(e.dataTransfer.files);
});
videoInput.addEventListener('change', (e) => handleVideoFiles(e.target.files));

/**
 * Maneja los archivos de vídeo cargados
 *
 */
function handleVideoFiles(files) {
    const fileArray = Array.from(files);
    let hasError = false;

    fileArray.forEach(file => {
        if (!file.type.startsWith('video/')) {
            hasError = true;
            return;
        }
        const url = URL.createObjectURL(file);
        createVideoItem(url);
    });

    if (hasError) triggerShakeError(videoDropZone);
}

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
    videoGalleryContainer.appendChild(item);
    updateVideoOrder();
    revisarSiHayCambios();
}

function updateVideoOrder() {
    const items = videoGalleryContainer.querySelectorAll('.video-item');
    items.forEach((item, index) => {
        const badge = item.querySelector('.order-badge');
        if(badge) badge.textContent = index + 1;
    });

    uploadedVideosCount.textContent = items.length;

    if (items.length > 0) {
        noVideosHelperText.classList.add('hidden-force');
    } else {
        noVideosHelperText.classList.remove('hidden-force');
    }
}

videoGalleryContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-remove-video');
    if (btn) {
        btn.closest('.video-item').remove();
        updateVideoOrder();
        revisarSiHayCambios();
    }
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

sendToPreviousEditionsButton.addEventListener('click', () => {
    modalEnviarEdicionesAnteriores.showModal();
});

closeEnviarEdicionesAnterioresModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        modalEnviarEdicionesAnteriores.close();
    });
});

/**
 *
 *
 *
 *
 *
 *
 *  Llamadas a la API
 *
 *
 *
 *
 *

 */

/**
 * Carga la configuración web desde el servidor
 */
async function cargarConfiguracionWeb() {
    const formData = new FormData();
    formData.append('action', 'obtenerConfiguracionWeb');

    const response = await fetch(URL_API, {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => {
            configuracionActual = data.data;
            renderizarUI(data.data.configuracion, data.data.galeriaImagenesPostEvento, data.data.galeriaVideosPostEvento);
        })
        .catch(error => {
            console.error('Error al cargar la configuración web:', error);
        });
}

/**
 * Actualiza la configuración web en el servidor
 */
async function actualizarConfiguracionWeb() {
    const formData = new FormData();
    formData.append('action', 'actualizarConfiguracionWeb');
    formData.append('modo', modo);
    if (modo === 'pre-evento') {
        formData.append('galaPreEventoTitulo', tituloEventoInput.value.trim());
        formData.append('galaPreEventoFecha', fechaEventoInput.value);
        formData.append('galaPreEventoHora', horaEventoInput.value);
        formData.append('galaPreEventoUbicacion', ubicacionEventoInput.value.trim());
        formData.append('galaPreEventoDescripcion', descripcionInput.value.trim());
        formData.append('galaPreEventoStreamingActivo', streamingToggleContainer.classList.contains('enabled') ? 'true' : 'false');
        formData.append('galaPreEventoStreamingUrl', urlStreamingInput.value.trim());
    }
    if (modo === 'post-evento') {
        formData.append('galaPostEventoResumen', postEventoResumenInput.value.trim());
    }

    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            await cargarConfiguracionWeb();
            unsavedChangesWarning.classList.add('hidden-force');
        } else {
            console.error('Error:', result.message);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

async function guardarPostEventoArchivo(archivos){
    const formData = new FormData();
    formData.append('action', 'procesarGaleriaPostEvento');
    formData.append('archivos', JSON.stringify(archivos));

    const response = await fetch(URL_API, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return result;
}

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
        return result.rutaArchivo;
    }
    throw new Error('Error al subir el archivo');
}

async function borrarArchivo(rutaArchivo) {
    const formData = new FormData();
    formData.append('action', 'borrarArchivo');
    formData.append('rutaArchivo', rutaArchivo);

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


/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */



cargarConfiguracionWeb();