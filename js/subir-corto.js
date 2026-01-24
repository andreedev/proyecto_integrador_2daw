let step = 1;

const nombreInput = document.getElementById('inputNamePar');
const nombreErrorMessage = document.getElementById('nombreErrorMessage');
const correoInput = document.getElementById('inputCorreo');
const correoErrorMessage = document.getElementById('correoErrorMessage');
const switchPasswordVisible = document.getElementById('switchPasswordVisible');
const passwordInput = document.getElementById('inputPassword');
const passwordErrorMessage = document.getElementById('passwordErrorMessage');
const passwordHelperText = document.getElementById('passwordHelperText');
const dniInput = document.getElementById('dniInput');
const dniErrorMessage = document.getElementById('dniErrorMessage');
const nroExpedienteInput = document.getElementById('nroExpedienteInput');
const nroExpedienteErrorMessage = document.getElementById('nroExpedienteErrorMessage');

const iconNombre = document.getElementById('iconNombre');
const iconCorreo = document.getElementById('iconCorreo');
const iconPassword = document.getElementById('iconPassword');
const iconDni = document.getElementById('iconDni');
const iconNroExpediente = document.getElementById('iconNroExpediente');
const labelNombre = document.getElementById('labelNombre');
const labelCorreo = document.getElementById('labelCorreo');
const labelPassword = document.getElementById('labelPassword');
const labelDni = document.getElementById('labelDni');
const labelNroExpediente = document.getElementById('labelNroExpediente');

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
const videoFileUpdatedCard = document.getElementById('videoFileUpdatedCard');
const videoErrorMessage = document.getElementById('videoErrorMessage');

const posterInput = document.getElementById('posterInput');
const posterDropZone = document.getElementById('posterDropZone');
const posterFileUpdatedCard = document.getElementById('posterFileUpdatedCard');
const posterErrorMessage = document.getElementById('posterErrorMessage');

const sinopsisInput = document.getElementById('sinopsisInput');
const MAX_SINOPSIS_WORDS = 100;
const sinopsisTotalWords = document.getElementById('sinopsisTotalWords');
const sinopsisErrorMessage = document.getElementById('sinopsisErrorMessage');
const iconSinopsis = document.getElementById('iconSinopsis');
const labelSinopsis = document.getElementById('labelSinopsis');

//switchPasswordVisible.addEventListener('click', switchPasswordVisibility);

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

sinopsisInput.addEventListener('blur', () => validateSinopsisInput(true));
sinopsisInput.addEventListener('keyup', () => validateStep2Form());

step1ContinueBtn.addEventListener('click', () => {
    if (!validateStep1Form()) return;
    switchStep(2);
});

step2ContinueBtn.addEventListener('click', () => {
    if (!validateStep2Form()) return;
    switchStep(3);
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
        if (messageOnError) nombreErrorMessage.textContent = '* Ingresa tus nombres y apellidos';
        iconNombre.classList.add("cross");
        labelNombre.classList.add("incorrecto");
        labelNombre.classList.remove("label-arriba");
        return false;
    }
    nombreErrorMessage.textContent = ''; 
    iconNombre.classList.remove("cross");
    labelNombre.classList.remove("incorrecto");
    iconNombre.classList.add("check");
    labelNombre.classList.add("label-arriba");
    return true;
}

function validateEmailInput(messageOnError) {
    correoInput.value = correoInput.value.replace(/\s+/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correoInput.value === '') {
        if (messageOnError) correoErrorMessage.textContent = '* Ingresa tu correo electrónico';
        labelCorreo.classList.add("incorrecto");
        iconCorreo.classList.add("cross");
        return false;
    }
    if (!emailRegex.test(correoInput.value)) {
        if (messageOnError)  correoErrorMessage.textContent = '* Ingresa un correo electrónico válido';
        labelCorreo.classList.add("incorrecto");
        iconCorreo.classList.add("cross");
        labelCorreo.classList.add("label-arriba");
        return false;
    }
    correoErrorMessage.textContent = '';
    labelCorreo.classList.remove("incorrecto");
    iconCorreo.classList.remove("cross");
    iconCorreo.classList.add("check");
    labelCorreo.classList.add("label-arriba");
    return true;
}

function validatePasswordInput(messageOnError) {
    passwordInput.value = passwordInput.value.replace(/\s+/g, '');

    if (passwordInput.value === '') {
        if (messageOnError) passwordErrorMessage.textContent = '* Ingresa una contraseña';
        labelPassword.classList.add("incorrecto");
        iconPassword.classList.add("cross");
        if (messageOnError) passwordHelperText.style.display = 'none';
        return false;
    }
    if (passwordInput.value.length < 8) {
        if (messageOnError) passwordErrorMessage.textContent = '* La contraseña debe tener al menos 8 caracteres';
        labelPassword.classList.add("incorrecto");
        iconPassword.classList.add("cross");
        labelPassword.classList.add("label-arriba");
        if (messageOnError)passwordHelperText.style.display = 'none';
        return false;
    }
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(passwordInput.value)) {
        if (messageOnError) passwordErrorMessage.textContent = '* La contraseña debe incluir al menos un número';
        if (messageOnError) passwordHelperText.style.display = 'none';
        labelPassword.classList.add("incorrecto");
        iconPassword.classList.add("cross");
        return false;
    }
    passwordHelperText.style.display = 'block';
    passwordErrorMessage.textContent = '';
    labelPassword.classList.remove("incorrecto");
    iconPassword.classList.remove("cross");
    iconPassword.classList.add("check");
    labelPassword.classList.add("label-arriba");
    return true;
}

function validateDniInput(messageOnError) {
    dniInput.value = dniInput.value.replace(/\s+/g, '');

    if (dniInput.value === '') {
        if (messageOnError) dniErrorMessage.textContent = '* Ingresa tu DNI o pasaporte';
        labelDni.classList.add("incorrecto");
        iconDni.classList.add("cross");
        return false;
    }
    if (dniInput.value.length < 8 || dniInput.value.length > 15) {
        if (messageOnError) dniErrorMessage.textContent = '* El DNI o pasaporte debe tener entre 8 y 15 dígitos';
        labelDni.classList.add("incorrecto");
        iconDni.classList.add("cross");
        labelDni.classList.add("label-arriba");
        return false;
    }
    dniErrorMessage.textContent = '';
    labelDni.classList.remove("incorrecto");
    iconDni.classList.remove("cross");
    iconDni.classList.add("check");
    labelDni.classList.add("label-arriba");
    return true;
}

function validateNroExpedienteInput(messageOnError) {
    nroExpedienteInput.value = nroExpedienteInput.value.replace(/\s+/g, '');

    if (nroExpedienteInput.value === '') {
        if (messageOnError) nroExpedienteErrorMessage.textContent = '* Ingresa tu número de expediente';
        labelNroExpediente.classList.add("incorrecto");
        iconNroExpediente.classList.add("cross");
        return false;
    }
    nroExpedienteErrorMessage.textContent = '';
    labelNroExpediente.classList.remove("incorrecto");
    iconNroExpediente.classList.remove("cross");
    iconNroExpediente.classList.add("check");
    labelNroExpediente.classList.add("label-arriba");
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
 * Configura una zona de arrastrar y soltar con validación de tipo y tamaño
 */
function setupDropZone(zoneId, inputId, cardId, nameSpanId, sizeSpanId, removeBtnId, errorSpanId, allowedExtensions, maxSizeBytes) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    const card = document.getElementById(cardId);
    const nameSpan = document.getElementById(nameSpanId);
    const sizeSpan = document.getElementById(sizeSpanId);
    const removeBtn = document.getElementById(removeBtnId);
    const errorSpan = document.getElementById(errorSpanId);

    const triggerShake = () => {
        zone.classList.add('shake-error');
        setTimeout(() => {
            zone.classList.remove('shake-error');
        }, 400);
    };

    const validateFile = (file) => {
        errorSpan.textContent = "";

        // Validar Extensión
        const fileName = file.name.toLowerCase();
        const isInvalidType = !allowedExtensions.some(ext => fileName.endsWith(ext.toLowerCase()));

        if (isInvalidType) {
            errorSpan.textContent = `Formato no válido. Solo se permite: ${allowedExtensions.join(', ')}`;
            triggerShake();
            return false;
        }

        // Validar Tamaño
        if (file.size > maxSizeBytes) {
            errorSpan.textContent = `El archivo es demasiado grande. Máximo permitido: ${formatBytes(maxSizeBytes)}`;
            triggerShake();
            return false;
        }

        return true;
    };

    const updateUI = (file) => {
        if (!file) return;
        zone.classList.add('hidden-force');
        card.classList.remove('hidden-force');
        nameSpan.textContent = file.name;
        sizeSpan.textContent = formatBytes(file.size);
    };

    const clearFile = () => {
        input.value = '';
        card.classList.add('hidden-force');
        zone.classList.remove('hidden-force');
        errorSpan.textContent = '';
    };

    zone.addEventListener('click', () => input.click());

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearFile();
        validateStep2Form();
    });

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
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length && validateFile(files[0])) {
            input.files = files;
            updateUI(files[0]);
            validateStep2Form(false);
        }
    });

    input.addEventListener('change', () => {
        if (input.files.length) {
            if (validateFile(input.files[0])) {
                updateUI(input.files[0]);
                validateStep2Form(false);
            } else {
                input.value = "";
            }
        }
    });
}

// Vídeo: .mov, .mp4 | Máximo 2GB (2 * 1024 * 1024 * 1024)
setupDropZone(
    'videoDropZone',
    'videoInput',
    'videoFileUpdatedCard',
    'videoFileName',
    'videoFileSize',
    'removeVideoFileBtn',
    'videoErrorMessage',
    ['.mov', '.mp4'],
    2147483648
);

// Poster: .jpg, .tif | Máximo 10MB (10 * 1024 * 1024)
setupDropZone(
    'posterDropZone',
    'posterInput',
    'posterFileUpdatedCard',
    'posterFileName',
    'posterFileSize',
    'removePosterFileBtn',
    'posterErrorMessage',
    ['.jpg', '.jpeg', '.tif', '.tiff'],
    10485760
);


function validateVideoInput(messageOnError) {
    if (videoInput.files.length === 0) {
        if (messageOnError) videoErrorMessage.textContent = 'Por favor, sube el vídeo del cortometraje';
        return false;
    } else {
        videoErrorMessage.textContent = '';
        return true;
    }
}

function validatePosterInput(messageOnError) {
    if (posterInput.files.length === 0) {
        if (messageOnError) posterErrorMessage.textContent = 'Por favor, sube el cartel del cortometraje';
        return false;
    } else {
        posterErrorMessage.textContent = '';
        return true;
    }
}

function validateSinopsisInput(messageOnError) {
    if (sinopsisInput.value.trim() === '') {
        if (messageOnError) sinopsisErrorMessage.textContent = 'Por favor, escribe la sinopsis del cortometraje';
        labelSinopsis.classList.add("incorrecto");
        iconSinopsis.classList.add("cross");
        return false;
    }

    const words = sinopsisInput.value.trim().split(/\s+/);
    if (words.length > MAX_SINOPSIS_WORDS) {
        if (messageOnError) sinopsisErrorMessage.textContent = `La sinopsis no debe exceder de ${MAX_SINOPSIS_WORDS} palabras`;
        labelSinopsis.classList.add("incorrecto");
        iconSinopsis.classList.add("cross");
        labelSinopsis.classList.add("label-arriba");
        return false;
    }

    sinopsisErrorMessage.textContent = '';
    labelSinopsis.classList.remove("incorrecto");
    iconSinopsis.classList.remove("cross");
    iconSinopsis.classList.add("check");
    labelSinopsis.classList.add("label-arriba");
    return true;
}

function validateStep2Form() {
    if (validateVideoInput(false) &&
        validatePosterInput(false) &&
        validateSinopsisInput(false)) {
        step2ContinueBtn.disabled = false;
        return true;
    } else {
        step2ContinueBtn.disabled = true;
        return false;
    }
}


switchStep(1);