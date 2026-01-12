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

let modo = 'pre-evento';
let pendingChanges = false;


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

changeMode('post-evento', false);

const sortable = new Sortable(imageGalleryContainer, {
    animation: 300,
    handle: '.drag-handle',
    ghostClass: 'sortable-ghost',
    onEnd: () => {
        updateOrderNumbers();
    }
});

imageDropZone.addEventListener('click', () => imageInput.click());

imageDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageDropZone.classList.add('border-primary-01');
});

imageDropZone.addEventListener('dragleave', () => {
    imageDropZone.classList.remove('border-primary-01');
});

imageDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    imageDropZone.classList.remove('border-primary-01');
    handleFiles(e.dataTransfer.files);
});

imageInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    const fileArray = Array.from(files);

    fileArray.forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            createGalleryItem(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

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

imageGalleryContainer.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.btn-remove');
    if (closeBtn) {
        closeBtn.closest('.gallery-item').remove();
        updateOrderNumbers();
    }
});

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
            
            <div class="icon-container-2 bg-neutral-05 btn-remove">
                <div class="icon-close w-16px h-16px bg-neutral-01"></div>
            </div>
        </div>
    `;
    imageGalleryContainer.appendChild(item);
    updateOrderNumbers();
}

createGalleryItem('../img/red-white-photo-white-black-camera.jpg');
createGalleryItem('../img/Foto_corto.png');
createGalleryItem('../img/red-white-photo-white-black-camera.jpg');
createGalleryItem('../img/Foto_corto.png');
createGalleryItem('../img/red-white-photo-white-black-camera.jpg');
createGalleryItem('../img/Foto_corto.png');