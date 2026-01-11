const preEventoCards = document.querySelectorAll('.preEventoCard');
const postEventoCards = document.querySelectorAll('.postEventoCard');
const preEventoButton = document.getElementById('preEventoButton');
const postEventoButton = document.getElementById('postEventoButton');

const streamingToggleContainer = document.getElementById('streamingToggleContainer');
const streamingToggleButton = document.getElementById('streamingToggleButton');
const streamingHelperText = document.getElementById('streamingHelperText');
const streamingIndicatorText = document.getElementById('streamingIndicatorText');
const urlStreamingContainer = document.getElementById('urlStreamingContainer');

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
    preEventoCards.forEach(card => card.classList.remove('hidden-force'));
    postEventoCards.forEach(card => card.classList.add('hidden-force'));

    preEventoButton.classList.add('active');
    postEventoButton.classList.remove('active');

    modo = 'pre-evento';
});

postEventoButton.addEventListener('click', () => {
    preEventoCards.forEach(card => card.classList.add('hidden-force'));
    postEventoCards.forEach(card => card.classList.remove('hidden-force'));

    postEventoButton.classList.add('active');
    preEventoButton.classList.remove('active');

    modo = 'post-evento';
});

