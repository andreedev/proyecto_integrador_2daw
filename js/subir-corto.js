let step = 1;

const nombreInput = document.getElementById('nombreInput');
const nombreErrorMessage = document.getElementById('nombreErrorMessage');
const correoInput = document.getElementById('correoInput');
const correoErrorMessage = document.getElementById('correoErrorMessage');
const switchPasswordVisible = document.getElementById('switchPasswordVisible');
const passwordInput = document.getElementById('passwordInput');
const passwordErrorMessage = document.getElementById('passwordErrorMessage');
const passwordHelperText = document.getElementById('passwordHelperText');
const dniInput = document.getElementById('dniInput');
const dniErrorMessage = document.getElementById('dniErrorMessage');
const nroExpedienteInput = document.getElementById('nroExpedienteInput');
const nroExpedienteErrorMessage = document.getElementById('nroExpedienteErrorMessage');

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

const videoInput = document.getElementById('videoInput');
const videoDropZone = document.getElementById('videoDropZone');

const posterInput = document.getElementById('posterInput');
const posterDropZone = document.getElementById('posterDropZone');

const sinopsisInput = document.getElementById('sinopsisInput');
const MAX_SINOPSIS_WORDS = 100;
const sinopsisTotalWords = document.getElementById('sinopsisTotalWords');

switchPasswordVisible.addEventListener('click', switchPasswordVisibility);

nombreInput.addEventListener('blur', ()=> validateNombreInput(true));
correoInput.addEventListener('blur', ()=> validateEmailInput(true));
passwordInput.addEventListener('blur', ()=> validatePasswordInput(true));
dniInput.addEventListener('blur', ()=> validateDniInput(true));
nroExpedienteInput.addEventListener('blur', ()=> validateNroExpedienteInput(true));

nombreInput.addEventListener('keyup', ()=> validateStep1Form());
correoInput.addEventListener('keyup', ()=> validateStep1Form());
passwordInput.addEventListener('keyup',  ()=> validateStep1Form());
dniInput.addEventListener('keyup', () => validateStep1Form());
nroExpedienteInput.addEventListener('keyup', () => validateStep1Form());

step1ContinueBtn.addEventListener('click', () => {
    if (!validateStep1Form()) return;
    switchStep(2);
});

step2BackBtn.addEventListener('click', () => {
    switchStep(1);
});

step3BackBtn.addEventListener('click', () => {
    switchStep(2);
});

/**
 * Contador de palabras para la sinopsis
 */
sinopsisInput.addEventListener('keyup', () => {
    const words = sinopsisInput.value.trim().split(/\s+/);
    if (words.length > MAX_SINOPSIS_WORDS) {
        sinopsisInput.value = words.slice(0, MAX_SINOPSIS_WORDS).join(' ');
    }
    sinopsisTotalWords.textContent = words.length;
});


function switchPasswordVisibility() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        switchPasswordVisible.classList.remove('icon-eye');
        switchPasswordVisible.classList.add('icon-eye-off');
    } else {
        passwordInput.type = 'password';
        switchPasswordVisible.classList.remove('icon-eye-off');
        switchPasswordVisible.classList.add('icon-eye');
    }
}

function validateNombreInput(messageOnError) {
    nombreInput.value = nombreInput.value.replace(/\s+/g, ' ').trim();

    if (nombreInput.value === ''){
        if (messageOnError) nombreErrorMessage.textContent = 'Ingresa tus nombres y apellidos';
        return false;
    }
    nombreErrorMessage.textContent = '';
    return true;
}

function validateEmailInput(messageOnError) {
    correoInput.value = correoInput.value.replace(/\s+/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correoInput.value === '') {
        if (messageOnError) correoErrorMessage.textContent = 'Ingresa tu correo electrónico';
        return false;
    }
    if (!emailRegex.test(correoInput.value)) {
        if (messageOnError)  correoErrorMessage.textContent = 'Ingresa un correo electrónico válido';
        return false;
    }
    correoErrorMessage.textContent = '';
    return true;
}

function validatePasswordInput(messageOnError) {
    passwordInput.value = passwordInput.value.replace(/\s+/g, '');

    if (passwordInput.value === '') {
        if (messageOnError) passwordErrorMessage.textContent = 'Ingresa una contraseña';
        if (messageOnError) passwordHelperText.style.display = 'none';
        return false;
    }
    if (passwordInput.value.length < 8) {
        if (messageOnError) passwordErrorMessage.textContent = 'La contraseña debe tener al menos 8 caracteres';
        if (messageOnError)passwordHelperText.style.display = 'none';
        return false;
    }
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(passwordInput.value)) {
        if (messageOnError) passwordErrorMessage.textContent = 'La contraseña debe incluir al menos un número';
        if (messageOnError) passwordHelperText.style.display = 'none';
        return false;
    }
    passwordHelperText.style.display = 'block';
    passwordErrorMessage.textContent = '';
    return true;
}

function validateDniInput(messageOnError) {
    dniInput.value = dniInput.value.replace(/\s+/g, '');

    if (dniInput.value === '') {
        if (messageOnError) dniErrorMessage.textContent = 'Ingresa tu DNI o pasaporte';
        return false;
    }
    if (dniInput.value.length < 8 || dniInput.value.length > 15) {
        if (messageOnError) dniErrorMessage.textContent = 'El DNI o pasaporte debe tener entre 8 y 15 dígitos';
        return false;
    }
    dniErrorMessage.textContent = '';
    return true;
}

function validateNroExpedienteInput(messageOnError) {
    nroExpedienteInput.value = nroExpedienteInput.value.replace(/\s+/g, '');

    if (nroExpedienteInput.value === '') {
        if (messageOnError) nroExpedienteErrorMessage.textContent = 'Ingresa tu número de expediente';
        return false;
    }
    nroExpedienteErrorMessage.textContent = '';
    return true;
}

function validateStep1Form() {
    if (validateNombreInput(false) &&
        validateEmailInput(false) &&
        validatePasswordInput(false) &&
        validateDniInput(false) &&
        validateNroExpedienteInput(false)) {
        step1ContinueBtn.disabled = false;
        return true;
    } else {
        step1ContinueBtn.disabled = true;
        return false;
        // step1ContinueBtn.disabled = false;
        // return true;
    }
}

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

/**
 * Configura una zona de arrastrar y soltar para un input de archivo
 */
function setupDropZone(zoneId, inputId) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);

    zone.addEventListener('click', () => input.click());

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
        input.files = e.dataTransfer.files;
        console.log("Archivo cargado en " + zoneId, input.files[0].name);
    });

    input.addEventListener('change', () => {
        if (input.files.length) {
            console.log("Archivo seleccionado en " + zoneId, input.files[0].name);
        }
    });
}

setupDropZone('videoDropZone', 'videoInput');
setupDropZone('posterDropZone', 'posterInput');
switchStep(1);