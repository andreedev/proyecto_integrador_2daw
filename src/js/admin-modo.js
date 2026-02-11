const preEventoCards = document.querySelectorAll('.preEventoCard');
const postEventoCards = document.querySelectorAll('.postEventoCard');
const preEventoButton = document.getElementById('preEventoButton');
const postEventoButton = document.getElementById('postEventoButton');

const generalMessage = document.getElementById('generalMessage');
const tituloEventoInput = document.getElementById('tituloEventoInput');
const fechaEventoInput = document.getElementById('fechaEventoInput');
const horaEventoInput = document.getElementById('horaEventoInput');
const ubicacionEventoInput = document.getElementById('ubicacionEventoInput');
const descripcionInput = document.getElementById('descripcionInput');
const urlStreamingInput = document.getElementById('urlStreamingInput');

const publishChangesButton = document.getElementById('publishChangesButton');
const unsavedChangesWarning = document.getElementById('unsavedChangesWarning');

const streamingToggleContainer = document.getElementById('streamingToggleContainer');
const streamingToggleButton = document.getElementById('streamingToggleButton');
const streamingHelperText = document.getElementById('streamingHelperText');
const streamingIndicatorText = document.getElementById('streamingIndicatorText');

const sendToPreviousEditionsButton = document.getElementById('sendToPreviousEditionsButton');
const modalEnviarEdicionesAnteriores = document.getElementById('modalEnviarEdicionesAnteriores');

const postEventoResumenInput = document.getElementById('postEventoResumenInput');

const yearEdicionInput = document.getElementById('yearEdicionInput');
const nroParticipantesText = document.getElementById('nroParticipantesText');
const fechaEnvioEmailInformativoInput = document.getElementById('fechaEnvioEmailInformativoInput');
const fechaBorradoDatosInput = document.getElementById('fechaBorradoDatosInput');

const confirmarEnviarEdicionesAnterioresBtn = document.getElementById('confirmarEnviarEdicionesAnterioresBtn');
const modalEdicionCreadaExito = document.getElementById('modalEdicionCreadaExito');

const manageEventsButton = document.getElementById('manageEventsButton');
const loadingBar = document.getElementById('loadingBar');
const fileInputEdicionActual = document.getElementById('fileInputEdicionActual');


let modo = 'pre-evento';
let configuracionActual = null;
let loadingConfiguracion = true;
let idEdicion = null;

streamingToggleButton.addEventListener('click', () => {
    renderizarStreamingToggle();
    checkPendingChanges();
});

preEventoButton.addEventListener('click', () => {
    cambiarModo('pre-evento');
    checkPendingChanges()
});

postEventoButton.addEventListener('click', () => {
    cambiarModo('post-evento');
    checkPendingChanges();
});


publishChangesButton.addEventListener('click', () => publicarCambios());

sendToPreviousEditionsButton.addEventListener('click', () => {
    modalEnviarEdicionesAnteriores.open();
});

confirmarEnviarEdicionesAnterioresBtn.addEventListener('click', async () => {
    const validYear = yearEdicionInput.validate(true).valid;

    if (!validYear) {
        return;
    }

    notification.show('¿Estás completamente segur@ de enviar esta edición a Ediciones Anteriores?',{
        confirm: true,
        confirmText: "Continuar",
        onConfirm: async () => {
            const response = await enviarEdicionAAnteriores(parseInt(yearEdicionInput.value), fechaEnvioEmailInformativoInput.getISOValue(), fechaBorradoDatosInput.getISOValue());
            if (response.status === 'success') {
                notification.show('Edición enviada a ediciones anteriores exitosamente');
                modalEnviarEdicionesAnteriores.close();
                modalEdicionCreadaExito.showModal();
                setTimeout(() => {
                    modalEdicionCreadaExito.close();
                    loadConfig();
                }, 4000);
            } else {
                notification.show('Error enviando a ediciones anteriores. Por favor intenta nuevamente.');
            }
        }
    });
});

function renderizarStreamingToggle(value=null) {
    if (value !== null) {
        if (value === 'true' || value === true) {
            streamingToggleContainer.classList.add('enabled');
        } else {
            streamingToggleContainer.classList.remove('enabled');
        }
    } else {
        streamingToggleContainer.classList.toggle('enabled');
    }

    const isActive = streamingToggleContainer.classList.contains('enabled');

    if (isActive) {
        streamingIndicatorText.textContent = 'EN VIVO';
        streamingHelperText.textContent = 'El enlace será visible en la landing pública';
        urlStreamingInput.show();
    } else {
        streamingIndicatorText.textContent = 'OFF';
        streamingHelperText.textContent = 'El enlace estará oculto para los visitantes';
        urlStreamingInput.hide();
    }
}


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



async function publicarCambios() {

    if (modo === 'pre-evento') {
        const isTituloValid = tituloEventoInput.validate(true).valid;
        const isUbicacionValid = ubicacionEventoInput.validate(true).valid;
        const isDescripcionValid = descripcionInput.validate(true).valid;
        const isUrlStreamingValid = streamingToggleContainer.classList.contains('enabled') ? urlStreamingInput.validate(true).valid : true;

        if (!isTituloValid || !isUbicacionValid || !isDescripcionValid || !isUrlStreamingValid) {
            return;
        }

        loadingBar.show();

        const updatePreEventDataResponse = await actualizarDatosPreEvento(tituloEventoInput.value, fechaEventoInput.getISOValue(), horaEventoInput.getISOValue(), ubicacionEventoInput.value, descripcionInput.value, streamingToggleContainer.classList.contains('enabled') ? 'true' : 'false', urlStreamingInput.value);

        loadingBar.hide();
        
        if (updatePreEventDataResponse.status !== 'success') {
            notification.show('Error guardando datos del pre-evento. Por favor intenta nuevamente.');
            return;
        }
    } else if (modo === 'post-evento') {
        const isResumenValid = postEventoResumenInput.validate(true).valid;

        if (!isResumenValid) {
            return;
        }

        loadingBar.show();

        const galleryIds = await fileInputEdicionActual.uploadIfNeeded();

        const updatePostEventDataResponse = await actualizarDatosPostEvento(postEventoResumenInput.value, galleryIds);

        loadingBar.hide();

        if (updatePostEventDataResponse.status !== 'success') {
            notification.show('Error guardando datos del post-evento. Por favor intenta nuevamente.');
            return;
        }

    }

    notification.show('Cambios guardados exitosamente');
    await loadConfig();
}

function updateGeneralMessage(message, className, autoRemove=false) {
    generalMessage.classList.remove('text-error-01', 'text-success-01', 'text-success-02', 'text-information-01', 'text-information-02');
    generalMessage.classList.add(className);
    generalMessage.textContent = message;
    if (autoRemove) {
        setTimeout(() => {
            generalMessage.textContent = '';
        }, 3500);
    }
}

function renderizarDatosPrePostEvento(data) {
    let config = data.configuracion;
    let archivos = data.archivosPostEvento;
    let edicionActual = data.edicionActual;
    if (!config) return;

    const modo = config.modo;
    if (modo === 'pre-evento') {
        cambiarModo('pre-evento');
    } else {
        cambiarModo('post-evento');
        sendToPreviousEditionsButton.disabled = false;
    }

    tituloEventoInput.setValue(config.galaPreEventoTitulo, true);
    fechaEventoInput.setDate(config.galaPreEventoFecha);
    horaEventoInput.setDate(config.galaPreEventoHora);
    ubicacionEventoInput.setValue(config.galaPreEventoUbicacion, true)
    descripcionInput.setValue(config.galaPreEventoDescripcion, true)

    renderizarStreamingToggle(config.galaPreEventoStreamingActivo);
    urlStreamingInput.setValue(config.galaPreEventoStreamingUrl, true);
    postEventoResumenInput.setValue(edicionActual.resumenEvento, true);
    nroParticipantesText.textContent = edicionActual.nroParticipantes;

    fileInputEdicionActual.setAttachedMode(archivos.map(a => a.url), archivos.map(a => a.id), true);

    setTimeout(() => {
        loadingConfiguracion = false;
    }, 50);
}

/**
 * Revisa si hay cambios en el formulario y muestra u oculta el aviso correspondiente
 */
function checkPendingChanges() {
    if (loadingConfiguracion || !configuracionActual) return;

    let hasChanges = false;
    let reasons = [];

    const dbConfig = configuracionActual;

    if (modo !== dbConfig.configuracion.modo) {
        reasons.push(`Modo: UI(${modo}) vs DB(${dbConfig.configuracion.modo})`);
        hasChanges = true;
    }

    let checks = {};

    if (modo === 'pre-evento') {
        checks = {
            titulo: [tituloEventoInput.value.trim(), dbConfig.configuracion.galaPreEventoTitulo || ''],
            fecha: [fechaEventoInput.getISOValue(), dbConfig.configuracion.galaPreEventoFecha || ''],
            hora: [horaEventoInput.getISOValue(), dbConfig.configuracion.galaPreEventoHora || ''],
            ubicacion: [ubicacionEventoInput.value.trim(), dbConfig.configuracion.galaPreEventoUbicacion || ''],
            descripcion: [descripcionInput.value.trim(), dbConfig.configuracion.galaPreEventoDescripcion || ''],
            streaming: [streamingToggleContainer.classList.contains('enabled') ? 'true' : 'false', dbConfig.configuracion.galaPreEventoStreamingActivo || 'false'],
            url: [urlStreamingInput.value.trim(), dbConfig.configuracion.galaPreEventoStreamingUrl || '']
        };

    } else if (modo === 'post-evento') {

        checks = {
            resumen: [postEventoResumenInput.value.trim(), dbConfig.edicionActual.resumenEvento || '']
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
        unsavedChangesWarning.classList.remove('d-none');
    } else {
        unsavedChangesWarning.classList.add('d-none');
    }
}


async function loadConfig() {
    const response = await cargarConfiguracion();
    if (response.status === 'success') {
        configuracionActual = response.data;
        renderizarDatosPrePostEvento(response.data);
    } else {
        notification.show('Error cargando configuración. Por favor recarga la página.');
    }
}


manageEventsButton.addEventListener('click', () => {
    const selectedDate = fechaEventoDateTimePicker.selectedDates[0];
    const formattedFecha = convertDateToISOString(selectedDate || new Date());
    window.location.href = `admin-eventos.html?fecha=${formattedFecha}`;
});

loadConfig();