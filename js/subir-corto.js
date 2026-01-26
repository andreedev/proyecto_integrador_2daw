let step = 1;

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

const numberStep1 = document.getElementById('numberStep1');
const numberStep2 = document.getElementById('numberStep2');
const numberStep3 = document.getElementById('numberStep3');

const checkIconStep1 = document.getElementById('checkIconStep1');
const checkIconStep2 = document.getElementById('checkIconStep2');
const checkIconStep3 = document.getElementById('checkIconStep3');

const uploadShortFilmCardHeaderText = document.querySelector('.upload-short-film-card-header-text');
const uploadShortFilmCardHeaderSubtext = document.querySelector('.upload-short-film-card-header-subtext');

const cardBodyStep1 = document.getElementById('cardBodyStep1');
const cardBodyStep2 = document.getElementById('cardBodyStep2');
const cardBodyStep3 = document.getElementById('cardBodyStep3');

const step1ContinueBtn = document.getElementById('step1ContinueBtn');
const step2ContinueBtn = document.getElementById('step2ContinueBtn');
const step3ContinueBtn = document.getElementById('step3ContinueBtn');

const step2BackBtn = document.getElementById('step2BackBtn');
const step3BackBtn = document.getElementById('step3BackBtn');

const cortoSubidoExitoCard = document.getElementById('cortoSubidoExitoCard');
const uploadShortFilmCard = document.getElementById('uploadShortFilmCard');

// componentes
const nombreInput = document.getElementById('nombreInput');
const correoInput = document.getElementById('correoInput');
const passwordInput = document.getElementById('passwordInput');
const dniInput = document.getElementById('dniInput');
const nroExpedienteInput = document.getElementById('nroExpedienteInput');

const videoInput = document.getElementById('videoInput');
const posterInput = document.getElementById('posterInput');
const sinopsisInput = document.getElementById('sinopsisInput');
const contadorPalabras = document.getElementById('sinopsisTotalWords');
const fichaTecnicaInput = document.getElementById('fichaTecnicaInput');

step1ContinueBtn.addEventListener('click', () => {
    const inputs = [nombreInput, correoInput, passwordInput, dniInput, nroExpedienteInput];

    const resultados = inputs.map(input => input.validate(true).valid);

    if (resultados.includes(false)) {
        return;
    }

    switchStep(2);
});

step2ContinueBtn.addEventListener('click', () => {
    const inputs = [videoInput, posterInput, sinopsisInput];

    const resultados = inputs.map(input => input.validate(true).valid);

    if (resultados.includes(false)) {
        return;
    }

    switchStep(3);
});

step3ContinueBtn.addEventListener('click', () => {
    const inputs = [fichaTecnicaInput];

    const resultados = inputs.map(input => input.validate(true).valid);

    if (resultados.includes(false)) {
        return;
    }

    enviarCandidatura();
});

step2BackBtn.addEventListener('click', () => {
    switchStep(1);
});

step3BackBtn.addEventListener('click', () => {
    switchStep(2);
});


function switchStep(targetStep) {
    // reset all steps to default
    cardBodyStep1.classList.add('d-none');
    cardBodyStep2.classList.add('d-none');
    cardBodyStep3.classList.add('d-none');
    step1.classList.remove('active-step');
    step2.classList.remove('active-step');
    step3.classList.remove('active-step');
    numberStep1.classList.remove('d-none');
    numberStep2.classList.remove('d-none');
    numberStep3.classList.remove('d-none');
    checkIconStep1.classList.add('d-none');
    checkIconStep2.classList.add('d-none');
    checkIconStep3.classList.add('d-none');


    if (targetStep === 1){
        step1.classList.add('active-step');

        cardBodyStep1.classList.remove('d-none');

        uploadShortFilmCardHeaderText.textContent = 'Registro del Participante';
        uploadShortFilmCardHeaderSubtext.textContent = 'Paso 1 de 3';
        step = 1;
    }
    if (targetStep === 2){
        step1.classList.add('active-step');
        step2.classList.add('active-step');

        numberStep1.classList.add('d-none');
        checkIconStep1.classList.remove('d-none');

        cardBodyStep2.classList.remove('d-none');

        uploadShortFilmCardHeaderText.textContent = 'Datos del Cortometraje';
        uploadShortFilmCardHeaderSubtext.textContent = 'Paso 2 de 3';
        step = 2;
    }
    if (targetStep === 3){
        step1.classList.add('active-step');
        step2.classList.add('active-step');
        step3.classList.add('active-step');

        numberStep1.classList.add('d-none');
        numberStep2.classList.add('d-none');
        checkIconStep1.classList.remove('d-none');
        checkIconStep2.classList.remove('d-none');

        cardBodyStep3.classList.remove('d-none');

        uploadShortFilmCardHeaderText.textContent = 'Documentación';
        uploadShortFilmCardHeaderSubtext.textContent = 'Paso 3 de 3 - Último paso';
        step = 3;
    }
    if (targetStep === 4){
        step1.classList.add('active-step');
        step2.classList.add('active-step');
        step3.classList.add('active-step');

        numberStep1.classList.add('d-none');
        numberStep2.classList.add('d-none');
        numberStep3.classList.add('d-none');
        checkIconStep1.classList.remove('d-none');
        checkIconStep2.classList.remove('d-none');
        checkIconStep3.classList.remove('d-none');

        uploadShortFilmCard.classList.add('d-none');
        cortoSubidoExitoCard.classList.remove('d-none');
    }
}

async function enviarCandidatura() {

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const password = passwordInput.value.trim();
    const dni = dniInput.value.trim();
    const nroExpediente = nroExpedienteInput.value.trim();
    const idVideo = await videoInput.uploadIfNeeded();
    const idPoster = await posterInput.uploadIfNeeded();
    const sinopsis = sinopsisInput.value.trim();
    const idFichaTecnica = await fichaTecnicaInput.uploadIfNeeded();

    const response = await guardarCandidatura(nombre, correo, password, dni, nroExpediente, idVideo, idPoster, sinopsis, idFichaTecnica);

    if (response.status === 'success') {
        window.location.href = 'candidaturas.html';
    } else {
        alert('Hubo un error al enviar la candidatura');
    }
}


sinopsisInput.addEventListener('solid-input-word-count', (e) => {
    const { count } = e.detail;
    if (contadorPalabras) {
        contadorPalabras.textContent = count;
    }
});



switchStep(4);