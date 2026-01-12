const preEventoCards = document.querySelectorAll('.preEventoCard');
const postEventoCards = document.querySelectorAll('.postEventoCard');
const preEventoButton = document.getElementById('preEventoButton');
const postEventoButton = document.getElementById('postEventoButton');

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
let pendingChanges = false;

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
});

preEventoButton.addEventListener('click', () => {
    changeMode('pre-evento', true);
});

postEventoButton.addEventListener('click', () => {
    changeMode('post-evento', true);
});

/**
 * Cambia el modo de la interfaz entre 'pre-evento' y 'post-evento'
 */
function changeMode(newMode, pendingChanges) {
    if (newMode === 'pre-evento') {
        preEventoCards.forEach(card => card.classList.remove('hidden-force'));
        postEventoCards.forEach(card => card.classList.add('hidden-force'));

        preEventoButton.classList.add('active');
        postEventoButton.classList.remove('active');

        sendToPreviousEditionsButton.classList.add('hidden-force');

        modo = 'pre-evento';
    } else if (newMode === 'post-evento') {
        preEventoCards.forEach(card => card.classList.add('hidden-force'));
        postEventoCards.forEach(card => card.classList.remove('hidden-force'));

        postEventoButton.classList.add('active');
        preEventoButton.classList.remove('active');

        sendToPreviousEditionsButton.classList.remove('hidden-force');

        modo = 'post-evento';
    }
    if (pendingChanges) {
        publishChangesButton.classList.remove('disabled');
        pendingChanges = true;
        unsavedChangesWarning.classList.remove('hidden-force');
    }
}

tituloEventoInput.addEventListener('blur', () => validateTituloEvento());
fechaEventoInput.addEventListener('blur', () => validateFechaEvento());
horaEventoInput.addEventListener('blur', () => validateHoraEvento());
ubicacionEventoInput.addEventListener('blur', () => validateUbicacionEvento());
descripcionInput.addEventListener('blur', () => validateDescripcionEvento());
urlStreamingInput.addEventListener('blur', () => validateUrlStreaming());

postEventoResumenInput.addEventListener('blur', () => validatePostEventoResumen());

yearEdicionInput.addEventListener('blur', () => validateYearEdicion());
nroParticipantesInput.addEventListener('blur', () => validateNroParticipantes());
fechaEnvioEmailInformativoInput.addEventListener('blur', () => validateFechaEnvioEmailInformativo());
fechaBorradoDatosInput.addEventListener('blur', () => validateFechaBorradoDatos());

function validateTituloEvento() {
    if (tituloEventoInput.value.trim() === '') {
        tituloEventoErrorMessage.textContent = 'El título del evento no puede estar vacío';
        tituloEventoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    tituloEventoErrorMessage.classList.add('hidden-force');
    return true;
}

function validateFechaEvento() {
    if (fechaEventoInput.value === '') {
        fechaEventoErrorMessage.textContent = 'La fecha del evento no puede estar vacía';
        fechaEventoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    fechaEventoErrorMessage.classList.add('hidden-force');
    return true;
}

function validateHoraEvento() {
    if (horaEventoInput.value === '') {
        horaEventoErrorMessage.textContent = 'La hora del evento no puede estar vacía';
        horaEventoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    horaEventoErrorMessage.classList.add('hidden-force');
    return true;
}

function validateUbicacionEvento() {
    if (ubicacionEventoInput.value.trim() === '') {
        ubicacionEventoErrorMessage.textContent = 'La ubicación del evento no puede estar vacía';
        ubicacionEventoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    ubicacionEventoErrorMessage.classList.add('hidden-force');
    return true;
}

function validateDescripcionEvento() {
    if (descripcionInput.value.trim() === '') {
        descripcionErrorMessage.textContent = 'La descripción del evento no puede estar vacía';
        descripcionErrorMessage.classList.remove('hidden-force');
        return false;
    }
    descripcionErrorMessage.classList.add('hidden-force');
    return true;
}

function validateYearEdicion() {
    if (yearEdicionInput.value.trim() === '' || isNaN(yearEdicionInput.value) || parseInt(yearEdicionInput.value) < 2000) {
        yearEditionErrorMessage.textContent = 'Ingresa un año valido';
        yearEditionErrorMessage.classList.remove('hidden-force');
        return false;
    }
    yearEditionErrorMessage.classList.add('hidden-force');
    return true;
}

function validateNroParticipantes() {
    if (nroParticipantesInput.value.trim() === '' || isNaN(nroParticipantesInput.value) || parseInt(nroParticipantesInput.value) < 1) {
        nroParticipantesErrorMessage.textContent = 'Ingresa un número válido';
        nroParticipantesErrorMessage.classList.remove('hidden-force');
        return false;
    }
    nroParticipantesErrorMessage.classList.add('hidden-force');
    return true;
}

function validateFechaEnvioEmailInformativo() {
    if (fechaEnvioEmailInformativoInput.value === '') {
        fechaEnvioEmailInformativoErrorMessage.textContent = 'La fecha no puede estar vacía';
        fechaEnvioEmailInformativoErrorMessage.classList.remove('hidden-force');
        return false;
    }
    fechaEnvioEmailInformativoErrorMessage.classList.add('hidden-force');
    return true;
}

function validateFechaBorradoDatos() {
    if (fechaBorradoDatosInput.value === '') {
        fechaBorradoDatosInputErrorMessage.textContent = 'La fecha no puede estar vacía';
        fechaBorradoDatosInputErrorMessage.classList.remove('hidden-force');
        return false;
    }
    fechaBorradoDatosInputErrorMessage.classList.add('hidden-force');
    return true;
}

function validateUrlStreaming() {
    if (urlStreamingInput.value.trim() === '') {
        urlStreamingErrorMessage.textContent = 'Ingresa una URL válida';
        urlStreamingErrorMessage.classList.remove('hidden-force');
        return false;
    }
    urlStreamingErrorMessage.classList.add('hidden-force');
    return true;
}

function validatePostEventoResumen() {
    if (postEventoResumenInput.value.trim() === '') {
        postEventoResumenErrorMessage.textContent = 'El resumen del evento no puede estar vacío';
        postEventoResumenErrorMessage.classList.remove('hidden-force');
        return false;
    }
    postEventoResumenErrorMessage.classList.add('hidden-force');
    return true;
}

publishChangesButton.addEventListener('click', () => publishChanges());

function publishChanges() {
    if (modo === 'pre-evento') {
        const isTituloValid = validateTituloEvento();
        const isFechaValid = validateFechaEvento();
        const isHoraValid = validateHoraEvento();
        const isUbicacionValid = validateUbicacionEvento();
        const isDescripcionValid = validateDescripcionEvento();
        const isUrlStreamingValid = validateUrlStreaming();

        if (isTituloValid && isFechaValid && isHoraValid && isUbicacionValid && isDescripcionValid && isUrlStreamingValid) {
            pendingChanges = false;
            publishChangesButton.classList.add('disabled');
            unsavedChangesWarning.classList.add('hidden-force');
        }

        guardarConfiguracion();
    } else if (modo === 'post-evento') {
        const isResumenValid = validatePostEventoResumen();
        const isYearValid = validateYearEdicion();
        const isNroParticipantesValid = validateNroParticipantes();
        const isFechaEnvioEmailValid = validateFechaEnvioEmailInformativo();
        const isFechaBorradoDatosValid = validateFechaBorradoDatos();

        if (isResumenValid && isYearValid && isNroParticipantesValid && isFechaEnvioEmailValid && isFechaBorradoDatosValid) {
            pendingChanges = false;
            publishChangesButton.classList.add('disabled');
            unsavedChangesWarning.classList.add('hidden-force');
        }

        guardarConfiguracion();
    }
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
imageInput.addEventListener('change', (e) => handleFiles(e.target.files) );

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
    }
});

/**
 * Crea un nuevo elemento de galería con la imagen proporcionada
 */
function createGalleryItem(src) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <div class="order-badge">0</div>
        <img src="${src}" class="gallery-item-image" alt="Uploaded">
        
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
    onEnd: updateVideoOrder
});
const imageSortable = new Sortable(imageGalleryContainer, {
    animation: 300,
    ghostClass: 'sortable-ghost',
    filter: '.btn-remove',
    preventOnFilter: false,
    onEnd: updateOrderNumbers
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
    e.preventDefault();
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
        createVideoItem(url, file.name);
    });

    if (hasError) triggerShakeError(videoDropZone);
}

function createVideoItem(src, fileName) {
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

changeMode('pre-evento', false);

async function cargarConfiguracionWeb() {
    const formData = new FormData();
    formData.append('action', 'obtenerConfiguracionWeb');

    const response = await fetch(URL_API, {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => {
            actualizarInterfazConConfiguracion(data.data);
        })
        .catch(error => {
            console.error('Error al cargar la configuración web:', error);
        });
}


function actualizarInterfazConConfiguracion(config) {
    if (config.modo_concurso === 'pre-evento') {
        changeMode('pre-evento', false);
    } else if (config.modo_concurso === 'post-evento') {
        changeMode('pre-evento', false);
    }

    tituloEventoInput.value = config.gala_titulo_evento_principal;
    fechaEventoInput.value = config.gala_fecha_evento_principal;
    horaEventoInput.value = config.gala_hora_evento_principal;
    ubicacionEventoInput.value = config.gala_ubicacion_evento;
    descripcionInput.value = config.gala_descripcion_evento_principal;

    if (config.gala_streaming_activo === 'true') {
        streamingToggleContainer.classList.add('enabled');
        streamingIndicatorText.textContent = 'EN VIVO';
        streamingHelperText.textContent = 'El enlace será visible en la landing pública';
        urlStreamingContainer.classList.remove('hidden-force');
    } else {
        streamingToggleContainer.classList.remove('enabled');
        streamingIndicatorText.textContent = 'OFF';
        streamingHelperText.textContent = 'El enlace estará oculto para los visitantes';
        urlStreamingContainer.classList.add('hidden-force');
    }
    urlStreamingInput.value = config.gala_streaming_url;

    postEventoResumenInput.value = config.gala_post_evento_resumen;

    const imagenes = JSON.parse(config.gala_post_evento_galeria_imagenes);
    const videos = JSON.parse(config.gala_post_evento_galeria_videos);

    imagenes.forEach(imgSrc => {
        createGalleryItem(imgSrc);
    });

    videos.forEach(videoSrc => {
        createVideoItem(videoSrc.url, videoSrc.name);
    });
}

async function guardarConfiguracion() {
    return;

    const formData = new FormData();
    formData.append('action', 'guardarConfiguracionWeb');

    const datosConfig = {
        modo_concurso: modo,
        gala_titulo_evento_principal: tituloEventoInput.value.trim(),
        gala_fecha_evento_principal: fechaEventoInput.value,
        gala_hora_evento_principal: horaEventoInput.value,
        gala_ubicacion_evento: ubicacionEventoInput.value.trim(),
        gala_descripcion_evento_principal: descripcionInput.value.trim(),
        gala_streaming_activo: streamingToggleContainer.classList.contains('enabled') ? 'true' : 'false',
        gala_streaming_url: urlStreamingInput.value.trim(),
        gala_post_evento_resumen: postEventoResumenInput.value.trim()
    };

    for (const [key, value] of Object.entries(datosConfig)) {
        formData.append(`configuracion[${key}]`, value);
    }

    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('¡Configuración guardada!');
        } else {
            console.error('Error:', result.message);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

cargarConfiguracionWeb();