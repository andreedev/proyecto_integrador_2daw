const preEventoCards = document.querySelectorAll('.preEventoCard');
const postEventoCards = document.querySelectorAll('.postEventoCard');
const preEventoButton = document.getElementById('preEventoButton');
const postEventoButton = document.getElementById('postEventoButton');

const publishChangesButton = document.getElementById('publishChangesButton');
const unsavedChangesWarning = document.getElementById('unsavedChangesWarning');

const streamingToggleContainer = document.getElementById('streamingToggleContainer');
const streamingToggleButton = document.getElementById('streamingToggleButton');
const streamingHelperText = document.getElementById('streamingHelperText');
const streamingIndicatorText = document.getElementById('streamingIndicatorText');
const urlStreamingContainer = document.getElementById('urlStreamingContainer');

const sendToPreviousEditionsButton = document.getElementById('sendToPreviousEditionsButton');

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


createGalleryItem('../img/red-white-photo-white-black-camera.jpg');
createGalleryItem('../img/Foto_corto.png');
createGalleryItem('../img/red-white-photo-white-black-camera.jpg');
createGalleryItem('../img/Foto_corto.png');
createGalleryItem('../img/red-white-photo-white-black-camera.jpg');
createGalleryItem('../img/Foto_corto.png');

createVideoItem('../video/file_example_MP4_480_1_5MG.mp4', 'file_example_MP4_480_1_5MG.mp4');
createVideoItem('../video/file_example_MP4_480_1_5MG.mp4', 'file_example_MP4_480_1_5MG.mp4');
createVideoItem('../video/file_example_MP4_480_1_5MG.mp4', 'file_example_MP4_480_1_5MG.mp4');

changeMode('post-evento', false);
