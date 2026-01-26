let step = 1;

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

const uploadShortFilmCardHeader = document.querySelector('.upload-short-film-card-header');
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
    if (targetStep === 1){
        cardBodyStep2.classList.add('hidden-force');
        cardBodyStep3.classList.add('hidden-force');
        step1.classList.remove('completed-step');
        step2.classList.remove('active-step', 'completed-step');
        step3.classList.remove('active-step');
        cardBodyStep1.classList.remove('hidden-force');
        uploadShortFilmCardHeader.classList.remove('step-2' , 'step-3');
        uploadShortFilmCardHeader.classList.add('step-1');
        uploadShortFilmCardHeaderText.textContent = 'Registro del Participante';
        uploadShortFilmCardHeaderSubtext.textContent = 'Paso 1 de 3';
        step = 1;
    }
    if (targetStep === 2){
        cardBodyStep1.classList.add('hidden-force');
        cardBodyStep3.classList.add('hidden-force');
        step1.classList.add('completed-step');
        step2.classList.add('active-step');
        step3.classList.remove('active-step');
        cardBodyStep2.classList.remove('hidden-force');
        uploadShortFilmCardHeader.classList.remove('step-1' , 'step-3');
        uploadShortFilmCardHeader.classList.add('step-2');
        uploadShortFilmCardHeaderText.textContent = 'Datos del Cortometraje';
        uploadShortFilmCardHeaderSubtext.textContent = 'Paso 2 de 3';
        step = 2;
    }
    if (targetStep === 3){
        cardBodyStep1.classList.add('hidden-force');
        cardBodyStep2.classList.add('hidden-force');
        step1.classList.add('completed-step');
        step2.classList.add('active-step', 'completed-step');
        step3.classList.add('active-step');
        uploadShortFilmCardHeader.classList.remove('step-1' , 'step-2');
        uploadShortFilmCardHeader.classList.add('step-3');
        cardBodyStep3.classList.remove('hidden-force');
        uploadShortFilmCardHeader.classList.remove('step-1' , 'step-2');
        uploadShortFilmCardHeader.classList.add('step-3');
        uploadShortFilmCardHeaderText.textContent = 'Documentación';
        uploadShortFilmCardHeaderSubtext.textContent = 'Paso 3 de 3 - Último paso';
        step = 3;
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



switchStep(1);