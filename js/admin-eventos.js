const modalVerDetalleEvento = document.getElementById('modalVerDetalleEvento');

const eventRows = document.querySelectorAll('.event-row');
const btnEditarEvento = document.getElementById('btnEditarEvento');

const btnAgregarEvento = document.getElementById('btnAgregarEvento');
const modalAgregarEvento = document.getElementById('modalAgregarEvento');

const nombreErrorMessageAgregarEvento = document.querySelector('.nombre-error-message-agregar-evento');
const fechaErrorMessageAgregarEvento = document.getElementById('msgErrorFechaAgregarEvento');


const ubicacionErrorMessageAgregarEvento = document.querySelector('.ubicacion-error-message-agregar-evento');
const descripcionErrorMessageAgregarEvento = document.querySelector('.descripcion-error-message-agregar-evento');
const imgErrorMessageAgregarEvento = document.querySelector('.img-error-message-agregar-evento');


const filtroFechaInput = document.getElementById('filtroFechaInput');
const fechaHumana = document.getElementById('fechaHumana');
const todayBtn = document.getElementById('todayBtn');
const eventsContainer = document.getElementById('eventsContainer');

const imgDetalleEvento = document.getElementById('imgDetalleEvento');
const nombreDetalleEvento = document.getElementById('nombreDetalleEvento');
const fechaDetalleEvento = document.getElementById('fechaDetalleEvento');
const horaInicioDetalleEvento = document.getElementById('horaInicioDetalleEvento');
const horaFinDetalleEvento = document.getElementById('horaFinDetalleEvento');
const ubicacionDetalleEvento = document.getElementById('ubicacionDetalleEvento');
const descripcionDetalleEvento = document.getElementById('descripcionDetalleEvento');

const eventNameAgregar = document.getElementById('eventNameAgregar');
const fechaEventoAgregar = document.getElementById('fechaEventoAgregar');

const horaInicioEventoAgregar = document.getElementById('horaInicioEventoAgregar');
const msgErrorHoraInicioAgregar = document.getElementById('msgErrorHoraInicioAgregar');

const horaFinEventoAgregar = document.getElementById('horaFinEventoAgregar');
const msgErrorHoraFinAgregar = document.getElementById('msgErrorHoraFinAgregar');

const ubicacionEventoAgregar = document.getElementById('ubicacionEventoAgregar');
const descripcionEventoAgregar = document.getElementById('descripcionEventoAgregar');
const imagenEventoAgregar = document.getElementById('imagenEventoAgregar');

const btnConfirmarEvento = document.getElementById('btnConfirmarAgregarEvento');

const btnEliminarEvento = document.getElementById('btnEliminarEvento');

const modalTitle = document.getElementById('modalTitle');

let eventoSeleccionado = null;

let tipoModal = 'agregar'; // agregar, editar

const imagenEventoDynamicDropZone =  setupDynamicDropZone(
    document.getElementById('imagenEventoAgregar'),
    ['PNG', 'JPG', 'JPEG'],
    5* 1024 * 1024, // 5MB
    (file) => {
        console.log('Archivo agregado:', file.name);
    }
);

// Mensajes de error si se pierde el foco
eventNameAgregar.addEventListener('blur', () => {
    if(eventNameAgregar.value.trim() === '') {
        nombreErrorMessageAgregarEvento.textContent = 'El nombre del evento es obligatorio.';
    } else {
        nombreErrorMessageAgregarEvento.textContent = '';
    }
});

fechaEventoAgregar.addEventListener('blur', () => {
    if(fechaEventoAgregar.value.trim() === '') {
        fechaErrorMessageAgregarEvento.textContent = 'La fecha del evento es obligatoria.';
    } else {
        fechaErrorMessageAgregarEvento.textContent = '';
    }
});

horaInicioEventoAgregar.addEventListener('blur', () => {
    if(horaInicioEventoAgregar.value.trim() === '') {
        msgErrorHoraInicioAgregar.textContent = 'La hora de inicio es obligatoria.';
    } else {
        msgErrorHoraInicioAgregar.textContent = '';
    }
});

horaFinEventoAgregar.addEventListener('blur', () => {
    if(horaFinEventoAgregar.value.trim() === '') {
        msgErrorHoraFinAgregar.textContent = 'La hora de finalización es obligatoria.';
    } else {
        msgErrorHoraFinAgregar.textContent = '';
    }
});

ubicacionEventoAgregar.addEventListener('blur', () => {
    if(ubicacionEventoAgregar.value.trim() === '') {
        ubicacionErrorMessageAgregarEvento.textContent = 'La ubicación del evento es obligatoria.';
    } else {
        ubicacionErrorMessageAgregarEvento.textContent = '';
    }
});

descripcionEventoAgregar.addEventListener('blur', () => {
    if(descripcionEventoAgregar.value.trim() === '') {
        descripcionErrorMessageAgregarEvento.textContent = 'La descripción del evento es obligatoria.';
    } else {
        descripcionErrorMessageAgregarEvento.textContent = '';
    }
});

imagenEventoAgregar.addEventListener('blur', () => {
    if(imagenEventoAgregar.files.length === 0) {
        imgErrorMessageAgregarEvento.textContent = 'La imagen del evento es obligatoria.';
    } else {
        imgErrorMessageAgregarEvento.textContent = '';
    }
});


eventRows.forEach(row => {
    row.addEventListener('click', () => {
        modalVerDetalleEvento.showModal();
    });
});


btnAgregarEvento.addEventListener('click', () => {
    modalAgregarEvento.showModal();
    modalTitle.textContent = 'Agregar Evento';
    btnConfirmarEvento.textContent = 'Agregar evento';
    tipoModal = 'agregar';
});



btnEditarEvento.addEventListener('click', () => {
    modalVerDetalleEvento.close();
    modalAgregarEvento.showModal();
    modalTitle.textContent = 'Editar Evento';
    eventNameAgregar.value = eventoSeleccionado.nombreEvento;
    fechaEventoAgregar.value = eventoSeleccionado.fechaEvento;
    horaInicioEventoAgregar.value = eventoSeleccionado.horaInicioEvento;
    horaFinEventoAgregar.value = eventoSeleccionado.horaFinEvento;
    ubicacionEventoAgregar.value = eventoSeleccionado.ubicacionEvento;
    descripcionEventoAgregar.value = eventoSeleccionado.descripcionEvento;
    const nombreArchivo = eventoSeleccionado.rutaImagenEvento.split('/').pop();
    imagenEventoDynamicDropZone.setAttachedMode(nombreArchivo)
    btnConfirmarEvento.textContent = 'Guardar cambios';
    tipoModal = 'editar';
});

btnConfirmarEvento.addEventListener('click', () => {
    if (tipoModal === 'agregar') agregarEventoEvent();
    if (tipoModal === 'editar') actualizarEventoEvent();
});

btnEliminarEvento.addEventListener('click', () => {
    eliminarEventoEvent();
});

const filtroFechaDateTimePicker = new AirDatepicker(filtroFechaInput, {
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
    async onSelect({date}) {
        fechaHumana.textContent = humanizeDate(date);
        await refreshEventos(convertDateToISOString(date));
    }
});

setTodayDate(filtroFechaDateTimePicker);

todayBtn.addEventListener('click', () => {
    setTodayDate(filtroFechaDateTimePicker)
});

function setTodayDate(picker) {
    const today = new Date();
    picker.selectDate(today);
    picker.setViewDate(today);
    if (picker === filtroFechaDateTimePicker) {
        fechaHumana.textContent= humanizeDate(today);
    }
}

const fechaEventoAgregarDatePicker = new AirDatepicker(fechaEventoAgregar, {
    container: modalAgregarEvento,
    autoClose: true,
    dateFormat: 'yyyy-MM-dd',
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

    }
});

setTodayDate(fechaEventoAgregarDatePicker);

const horaInicioDateTimePicker = new AirDatepicker(horaInicioEventoAgregar, {
    container: modalAgregarEvento,
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
    }
});

setTodayDate(horaInicioDateTimePicker);

const horaFinEventoAgregarDatePicker = new AirDatepicker(horaFinEventoAgregar, {
    container: modalAgregarEvento,
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
    }
});

setTodayDate(horaFinEventoAgregarDatePicker);


/**
 * Renderizar eventos
 */
function renderizarEventos(eventos) {
    eventsContainer.replaceChildren();

    // calcular espacios vacios entre eventos
    let espaciosVacios = [];
    for (let i = 0; i < eventos.length - 1; i++) {
        for (let j = i + 1; j < eventos.length; j++) {
            const eventoActual = eventos[i];
            const siguienteEvento = eventos[j];

            const endTimeActual = new Date(`1970-01-01T${eventoActual.horaFinEvento}Z`);
            const startTimeSiguiente = new Date(`1970-01-01T${siguienteEvento.horaInicioEvento}Z`);

            const diffInHours = (startTimeSiguiente - endTimeActual) / (1000 * 60 * 60);

            if (diffInHours > 0) {
                eventos[i].tieneEspacioDespues = true;
                eventos[i].duracionEspacioDespues = diffInHours;
                espaciosVacios.push({
                    desdeIdEvento: eventoActual.idEvento,
                    hastaIdEvento: siguienteEvento.idEvento,
                    duracionMinutos: diffInHours * 60,
                    duracionHoras: diffInHours
                });
            }
        }
    }

    eventos.forEach(evento => {
        const eventContainer = document.createElement('div');
        eventContainer.classList.add('event-row');

        const leftSide = document.createElement('div');
        leftSide.classList.add('d-flex', 'align-items-center', 'flex-grow-1', 'gap-8px');

        eventContainer.addEventListener('click', () => {
            imgDetalleEvento.src = evento.rutaImagenEvento;
            nombreDetalleEvento.textContent = evento.nombreEvento;
            const fechaEvento = convertISOStringToDate(evento.fechaEvento);
            fechaDetalleEvento.textContent = humanizeDate(fechaEvento);
            horaInicioDetalleEvento.textContent = evento.horaInicioEvento.substring(0,5);
            horaFinDetalleEvento.textContent = evento.horaFinEvento.substring(0,5);
            ubicacionDetalleEvento.textContent = evento.ubicacionEvento;
            descripcionDetalleEvento.textContent = evento.descripcionEvento;
            modalVerDetalleEvento.showModal();
            eventoSeleccionado = evento;
            horaInicioDateTimePicker.update({selectedDates: [new Date(`1970-01-01T${evento.horaInicioEvento}`)]});
            horaFinEventoAgregarDatePicker.update({selectedDates: [new Date(`1970-01-01T${evento.horaFinEvento}`)]});
        });

        const eventStartDuration = document.createElement('div');
        eventStartDuration.classList.add('event-start-duration');

        const eventStartTime = document.createElement('span');
        eventStartTime.classList.add('event-start-time', 'fw-500');
        eventStartTime.textContent = evento.horaInicioEvento.substring(0,5);

        const startTime = new Date(`1970-01-01T${evento.horaInicioEvento}Z`);
        const endTime = new Date(`1970-01-01T${evento.horaFinEvento}Z`);
        const durationInMinutes = (endTime - startTime) / (1000 * 60);
        const eventDuration = document.createElement('span');
        eventDuration.classList.add('event-duration');
        eventDuration.textContent = humanizeDuration(durationInMinutes);

        eventStartDuration.appendChild(eventStartTime);
        eventStartDuration.appendChild(eventDuration);

        const imgEvent = document.createElement('div');
        imgEvent.classList.add('img-event');

        const img = document.createElement('img');
        img.classList.add('img');
        img.src = evento.rutaImagenEvento;
        img.alt = 'Imagen del evento';

        imgEvent.appendChild(img);

        const eventInfo = document.createElement('div');
        eventInfo.classList.add('event-info');

        const eventName = document.createElement('span');
        eventName.classList.add('event-name');
        eventName.textContent = evento.nombreEvento;

        const eventHour = document.createElement('div');
        eventHour.classList.add('event-hour');

        const iconoHora = document.createElement('span');
        iconoHora.classList.add('icono-hora');

        const eventTimeInfo = document.createElement('span');
        eventTimeInfo.classList.add('event-time-info');
        eventTimeInfo.textContent = `${evento.horaInicioEvento.substring(0,5)} - ${evento.horaFinEvento.substring(0,5)}`;

        eventHour.appendChild(iconoHora);
        eventHour.appendChild(eventTimeInfo);

        const eventLocation = document.createElement('div');
        eventLocation.classList.add('event-location');

        const iconoUbicacion = document.createElement('span');
        iconoUbicacion.classList.add('icono-ubicacion');

        const eventLocationInfo = document.createElement('span');
        eventLocationInfo.classList.add('event-location-info');
        eventLocationInfo.textContent = evento.ubicacionEvento;

        eventLocation.appendChild(iconoUbicacion);
        eventLocation.appendChild(eventLocationInfo);

        eventInfo.appendChild(eventName);
        eventInfo.appendChild(eventHour);
        eventInfo.appendChild(eventLocation);

        const verticalLine = document.createElement('span');
        verticalLine.classList.add('vertical-line');

        leftSide.appendChild(eventStartDuration);
        leftSide.appendChild(imgEvent);
        leftSide.appendChild(eventInfo);

        eventContainer.appendChild(leftSide);
        eventContainer.appendChild(verticalLine);

        eventsContainer.appendChild(eventContainer);

        if (evento.tieneEspacioDespues) {
            const espacioVacio = espaciosVacios.find(e => e.desdeIdEvento === evento.idEvento);
            if (espacioVacio) {
                const eventFreeTime = document.createElement('div');
                eventFreeTime.classList.add('event-free-time');

                const iconTime = document.createElement('span');
                iconTime.classList.add('icon-time');

                const freeTimeText = document.createElement('span');
                freeTimeText.classList.add('free-time-text');
                const duracionHoras = Math.floor(espacioVacio.duracionHoras);
                const duracionMinutos = Math.round((espacioVacio.duracionHoras - duracionHoras) * 60);
                let duracionTexto = '';
                if (duracionHoras > 0) {
                    duracionTexto += `${duracionHoras}h `;
                }
                if (duracionMinutos > 0) {
                    duracionTexto += `${duracionMinutos}min `;
                }
                freeTimeText.textContent = `${duracionTexto.trim()} libre`;

                eventFreeTime.appendChild(iconTime);
                eventFreeTime.appendChild(freeTimeText);

                eventsContainer.appendChild(eventFreeTime);
            }
        }

    });
}

async function refreshEventos(date) {
    if (!date) {
        date = convertDateToISOString(new Date());
    }
    // if there is selected date in the date picker, use that date
    date = filtroFechaDateTimePicker.selectedDates[0] ? convertDateToISOString(filtroFechaDateTimePicker.selectedDates[0]) : date;
    const response = await listarEventos(date);
    if (response.status === 'success') {
        renderizarEventos(response.data);
    }
}



/**
 * Agregar evento
 */
async function agregarEventoEvent() {
    let isValid = true;

    if (eventNameAgregar.value.trim() === '') {
        nombreErrorMessageAgregarEvento.textContent = 'El nombre del evento es obligatorio.';
        isValid = false;
    } else {
        nombreErrorMessageAgregarEvento.textContent = '';
    }

    if (fechaEventoAgregar.value.trim() === '') {
        fechaErrorMessageAgregarEvento.textContent = 'La fecha del evento es obligatoria.';
        isValid = false;
    } else {
        fechaErrorMessageAgregarEvento.textContent = '';
    }

    if (horaInicioEventoAgregar.value.trim() === '') {
        msgErrorHoraInicioAgregar.textContent = 'La hora de inicio es obligatoria.';
        isValid = false;
    } else {
        msgErrorHoraInicioAgregar.textContent = '';
    }

    if (horaFinEventoAgregar.value.trim() === '') {
        msgErrorHoraFinAgregar.textContent = 'La hora de finalización es obligatoria.';
        isValid = false;
    } else {
        msgErrorHoraFinAgregar.textContent = '';
    }

    if (ubicacionEventoAgregar.value.trim() === '') {
        ubicacionErrorMessageAgregarEvento.textContent = 'La ubicación del evento es obligatoria.';
        isValid = false;
    } else {
        ubicacionErrorMessageAgregarEvento.textContent = '';
    }

    if (descripcionEventoAgregar.value.trim() === '') {
        descripcionErrorMessageAgregarEvento.textContent = 'La descripción del evento es obligatoria.';
        isValid = false;
    } else {
        descripcionErrorMessageAgregarEvento.textContent = '';
    }

    if (!isValid) {
        return;
    }

    const nombre = eventNameAgregar.value.trim();
    const fecha = fechaEventoAgregar.value.trim();
    const horaInicio = horaInicioEventoAgregar.value.trim();
    const horaFin = horaFinEventoAgregar.value.trim();
    const ubicacion = ubicacionEventoAgregar.value.trim();
    const descripcion = descripcionEventoAgregar.value.trim();
    const imagen = imagenEventoDynamicDropZone.getFile();

    let responseUploadFile = await subirArchivo(imagen);
    if (responseUploadFile.status !== 'success') throw new Error('Error al subir la imagen del evento');
    const idArchivo = responseUploadFile.data.idArchivo;

    let response = await crearEvento(nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivo);
    if (response.status !== 'success') throw new Error('Error al crear el evento');

    modalAgregarEvento.close();

    eventNameAgregar.value = '';
    ubicacionEventoAgregar.value = '';
    descripcionEventoAgregar.value = '';
    imagenEventoDynamicDropZone.clear();

    refreshEventos();
}

/**
 * Eliminar evento
 */
async function eliminarEventoEvent() {
    let response = await eliminarEvento(eventoSeleccionado.idEvento);
    if (response.status !== 'success') throw new Error('Error al eliminar el evento');

    modalVerDetalleEvento.close();
    refreshEventos();
}



/**
 * Actualizar evento
 */
async function actualizarEventoEvent() {
    let isValid = true;

    if (eventNameAgregar.value.trim() === '') {
        nombreErrorMessageAgregarEvento.textContent = 'El nombre del evento es obligatorio.';
        isValid = false;
    } else {
        nombreErrorMessageAgregarEvento.textContent = '';
    }

    if (fechaEventoAgregar.value.trim() === '') {
        fechaErrorMessageAgregarEvento.textContent = 'La fecha del evento es obligatoria.';
        isValid = false;
    } else {
        fechaErrorMessageAgregarEvento.textContent = '';
    }

    if (horaInicioEventoAgregar.value.trim() === '') {
        msgErrorHoraInicioAgregar.textContent = 'La hora de inicio es obligatoria.';
        isValid = false;
    } else {
        msgErrorHoraInicioAgregar.textContent = '';
    }

    if (horaFinEventoAgregar.value.trim() === '') {
        msgErrorHoraFinAgregar.textContent = 'La hora de finalización es obligatoria.';
        isValid = false;
    } else {
        msgErrorHoraFinAgregar.textContent = '';
    }

    if (ubicacionEventoAgregar.value.trim() === '') {
        ubicacionErrorMessageAgregarEvento.textContent = 'La ubicación del evento es obligatoria.';
        isValid = false;
    } else {
        ubicacionErrorMessageAgregarEvento.textContent = '';
    }

    if (descripcionEventoAgregar.value.trim() === '') {
        descripcionErrorMessageAgregarEvento.textContent = 'La descripción del evento es obligatoria.';
        isValid = false;
    } else {
        descripcionErrorMessageAgregarEvento.textContent = '';
    }

    if (!isValid) {
        return;
    }

    const nombre = eventNameAgregar.value.trim();
    const fecha = fechaEventoAgregar.value.trim();
    const horaInicio = horaInicioEventoAgregar.value.trim();
    const horaFin = horaFinEventoAgregar.value.trim();
    const ubicacion = ubicacionEventoAgregar.value.trim();
    const descripcion = descripcionEventoAgregar.value.trim();
    const imagen = imagenEventoDynamicDropZone.getFile();

    let idArchivoFinal = null;
    if(imagen){
        let responseUploadFile = await subirArchivo(imagen);
        if (responseUploadFile.status !== 'success') throw new Error('Error al subir la imagen del evento');
        idArchivoFinal = responseUploadFile.data.idArchivo;
    } else {
        idArchivoFinal = eventoSeleccionado.idArchivoImagenEvento;
    }

    let response = await actualizarEvento(eventoSeleccionado.idEvento, nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivoFinal);
    if (response.status !== 'success') throw new Error('Error al crear el evento');

    modalAgregarEvento.close();
    eventNameAgregar.value = '';
    ubicacionEventoAgregar.value = '';
    descripcionEventoAgregar.value = '';
    imagenEventoDynamicDropZone.clear();


    refreshEventos();
}