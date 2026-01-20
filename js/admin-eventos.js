const modalVerDetalleEvento = document.getElementById('modalVerDetalleEvento');

const eventRows = document.querySelectorAll('.event-row');
const btnEditarEvento = document.querySelector('.primary-button');

const btnAgregarEvento = document.getElementById('btnAgregarEvento');
const modalAgregarEvento = document.getElementById('modalAgregarEvento');

const modalEditarEvento = document.getElementById('modalEditarEvento');

const nombreErrorMessageAgregarEvento = document.querySelector('.nombre-error-message-agregar-evento');
const fechaErrorMessageAgregarEvento = document.getElementById('msgErrorFechaAgregarEvento');


const ubicacionErrorMessageAgregarEvento = document.querySelector('.ubicacion-error-message-agregar-evento');
const descripcionErrorMessageAgregarEvento = document.querySelector('.descripcion-error-message-agregar-evento');
const imgErrorMessageAgregarEvento = document.querySelector('.img-error-message-agregar-evento');


const eventNameEditar = document.getElementById('eventNameEditar');
const eventDateEditar = document.getElementById('eventDateEditar');
const eventEndTimeEditar = document.getElementById('eventEndTimeEditar');
const eventLocationEditar = document.getElementById('eventLocationEditar');
const eventDescriptionEditar = document.getElementById('eventDescriptionEditar');
const eventImageEditar = document.getElementById('eventImageEditar');

const nombreErrorMessageEditarEvento = document.querySelector('.nombre-error-message-editar-evento');
const fechaErrorMessageEditarEvento = document.querySelector('.fecha-error-message-editar-evento');
const horaInicioErrorMessageEditarEvento = document.querySelector('.hora-inicio-error-message-editar-evento');
const horaFinErrorMessageEditarEvento = document.querySelector('.hora-fin-error-message-editar-evento');
const ubicacionErrorMessageEditarEvento = document.querySelector('.ubicacion-error-message-editar-evento');
const descripcionErrorMessageEditarEvento = document.querySelector('.descripcion-error-message-editar-evento');
const imgErrorMessageEditarEvento = document.querySelector('.img-error-message-editar-evento');

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

const btnConfirmarAgregarEvento = document.getElementById('btnConfirmarAgregarEvento');

const btnEliminarEvento = document.getElementById('btnEliminarEvento');

const horaInicioEventoEditar = document.getElementById('horaInicioEventoEditar');

let idEvento = null;

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

eventNameEditar.addEventListener('blur', () => {
    if(eventNameEditar.value.trim() === '') {
        nombreErrorMessageEditarEvento.textContent = 'El nombre del evento es obligatorio.';
    } else {
        nombreErrorMessageEditarEvento.textContent = '';
    }
});

eventDateEditar.addEventListener('blur', () => {
    if(eventDateEditar.value.trim() === '') {
        fechaErrorMessageEditarEvento.textContent = 'La fecha del evento es obligatoria.';
    } else {
        fechaErrorMessageEditarEvento.textContent = '';
    }
});

horaInicioEventoEditar.addEventListener('blur', () => {
    if(horaInicioEventoEditar.value.trim() === '') {
        horaInicioErrorMessageEditarEvento.textContent = 'La hora de inicio es obligatoria.';
    } else {
        horaInicioErrorMessageEditarEvento.textContent = '';
    }
});

eventEndTimeEditar.addEventListener('blur', () => {
    if(eventEndTimeEditar.value.trim() === '') {
        horaFinErrorMessageEditarEvento.textContent = 'La hora de finalización es obligatoria.';
    } else {
        horaFinErrorMessageEditarEvento.textContent = '';
    }
});

eventLocationEditar.addEventListener('blur', () => {
    if(eventLocationEditar.value.trim() === '') {
        ubicacionErrorMessageEditarEvento.textContent = 'La ubicación del evento es obligatoria.';  
    } else {
        ubicacionErrorMessageEditarEvento.textContent = '';
    }   
});

eventDescriptionEditar.addEventListener('blur', () => {
    if(eventDescriptionEditar.value.trim() === '') {
        descripcionErrorMessageEditarEvento.textContent = 'La descripción del evento es obligatoria.';
    } else {
        descripcionErrorMessageEditarEvento.textContent = '';
    }
});

eventImageEditar.addEventListener('blur', () => {
    if(eventImageEditar.files.length === 0) {
        imgErrorMessageEditarEvento.textContent = 'La imagen del evento es obligatoria.';
    } else {
        imgErrorMessageEditarEvento.textContent = '';
    }   
});

eventRows.forEach(row => {
    row.addEventListener('click', () => {
        modalVerDetalleEvento.showModal();
    });
});


btnAgregarEvento.addEventListener('click', () => {
    modalAgregarEvento.showModal();
});


btnEditarEvento.addEventListener('click', () => {
    modalVerDetalleEvento.close();
    modalEditarEvento.showModal();
});

btnConfirmarAgregarEvento.addEventListener('click', () => {
    agregarEventoEvent();
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
    onSelect({date}) {
        fechaHumana.textContent= humanizeDate(date);
        cargarEventos(convertDateToISOString(date));
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

    eventos.forEach(evento => {
        const eventContainer = document.createElement('div');
        eventContainer.classList.add('event-row');
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
            idEvento = evento.idEvento;
        });

        const eventStartDuration = document.createElement('div');
        eventStartDuration.classList.add('event-start-duration');

        const eventStartTime = document.createElement('span');
        eventStartTime.classList.add('event-start-time', 'fw-500');
        eventStartTime.textContent = evento.horaInicioEvento.substring(0,5);

        const startTime = new Date(`1970-01-01T${evento.horaInicioEvento}Z`);
        const endTime = new Date(`1970-01-01T${evento.horaFinEvento}Z`);
        const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
        const eventDuration = document.createElement('span');
        eventDuration.classList.add('event-duration');
        eventDuration.textContent = `${durationInHours}h`;

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

        eventContainer.appendChild(eventStartDuration);
        eventContainer.appendChild(imgEvent);
        eventContainer.appendChild(eventInfo);
        eventContainer.appendChild(verticalLine);

        eventsContainer.appendChild(eventContainer);


    });
}

async function cargarEventos(date='') {
    const response = await listarEventos(date);
    if (response.status === 'success') {
        renderizarEventos(response.data);
    }
}

const imagenEventoDynamicDropZone =  setupDynamicDropZone(
    document.getElementById('imagenEventoAgregar'),
    ['PNG', 'JPG', 'JPEG'],
    5* 1024 * 1024, // 5MB
    (file) => {
        console.log('Archivo agregado:', file.name);
    }
);

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

    cargarEventos();
}

async function eliminarEventoEvent() {
    modalVerDetalleEvento.close();
    let response = await eliminarEvento(idEvento);
    if (response.status !== 'success') throw new Error('Error al eliminar el evento');
    cargarEventos();
}
