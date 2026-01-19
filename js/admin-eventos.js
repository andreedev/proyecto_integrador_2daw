const modalVerDetalleEvento = document.getElementById('modalVerDetalleEvento');

const eventRows = document.querySelectorAll('.event-row');
const btnEliminarEvento = document.querySelector('.neutral-button');
const btnEditarEvento = document.querySelector('.primary-button');

const btnAgregarEvento = document.getElementById('btnAgregarEvento');
const modalAgregarEvento = document.getElementById('modalAgregarEvento');

const modalEditarEvento = document.getElementById('modalEditarEvento');

const eventNameAgregar = document.getElementById('eventNameAgregar');
const eventDateAgregar = document.getElementById('eventDateAgregar');
const eventStartTimeAgregar = document.getElementById('eventStartTimeAgregar');
const eventEndTimeAgregar = document.getElementById('eventEndTimeAgregar');
const eventLocationAgregar = document.getElementById('eventLocationAgregar');
const eventDescriptionAgregar = document.getElementById('eventDescriptionAgregar');
const eventImageAgregar = document.getElementById('eventImageAgregar');

const nombreErrorMessageAgregarEvento = document.querySelector('.nombre-error-message-agregar-evento');
const fechaErrorMessageAgregarEvento = document.querySelector('.fecha-error-message-agregar-evento');
const horaInicioErrorMessageAgregarEvento = document.querySelector('.hora-inicio-error-message-agregar-evento');
const horaFinErrorMessageAgregarEvento = document.querySelector('.hora-fin-error-message-agregar-evento');
const ubicacionErrorMessageAgregarEvento = document.querySelector('.ubicacion-error-message-agregar-evento');
const descripcionErrorMessageAgregarEvento = document.querySelector('.descripcion-error-message-agregar-evento');
const imgErrorMessageAgregarEvento = document.querySelector('.img-error-message-agregar-evento');


const eventNameEditar = document.getElementById('eventNameEditar');
const eventDateEditar = document.getElementById('eventDateEditar');
const eventStartTimeEditar = document.getElementById('eventStartTimeEditar');
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

// Mensajes de error si se pierde el foco
eventNameAgregar.addEventListener('blur', () => {
    if(eventNameAgregar.value.trim() === '') {
        nombreErrorMessageAgregarEvento.textContent = 'El nombre del evento es obligatorio.';
    } else {
        nombreErrorMessageAgregarEvento.textContent = '';
    }
});

eventDateAgregar.addEventListener('blur', () => {
    if(eventDateAgregar.value.trim() === '') {
        fechaErrorMessageAgregarEvento.textContent = 'La fecha del evento es obligatoria.';
    } else {
        fechaErrorMessageAgregarEvento.textContent = '';
    }
});

eventStartTimeAgregar.addEventListener('blur', () => {
    if(eventStartTimeAgregar.value.trim() === '') {
        horaInicioErrorMessageAgregarEvento.textContent = 'La hora de inicio es obligatoria.';
    } else {
        horaInicioErrorMessageAgregarEvento.textContent = '';
    }
});

eventEndTimeAgregar.addEventListener('blur', () => {
    if(eventEndTimeAgregar.value.trim() === '') {
        horaFinErrorMessageAgregarEvento.textContent = 'La hora de finalización es obligatoria.';
    } else {
        horaFinErrorMessageAgregarEvento.textContent = '';
    }
});

eventLocationAgregar.addEventListener('blur', () => {
    if(eventLocationAgregar.value.trim() === '') {
        ubicacionErrorMessageAgregarEvento.textContent = 'La ubicación del evento es obligatoria.';
    } else {
        ubicacionErrorMessageAgregarEvento.textContent = '';
    }
});

eventDescriptionAgregar.addEventListener('blur', () => {
    if(eventDescriptionAgregar.value.trim() === '') {
        descripcionErrorMessageAgregarEvento.textContent = 'La descripción del evento es obligatoria.';
    } else {
        descripcionErrorMessageAgregarEvento.textContent = '';
    }
});

eventImageAgregar.addEventListener('blur', () => {
    if(eventImageAgregar.files.length === 0) {
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

eventStartTimeEditar.addEventListener('blur', () => {
    if(eventStartTimeEditar.value.trim() === '') {
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


btnEliminarEvento.addEventListener('click', () => {
   modalVerDetalleEvento.close();
   eventRows[0].remove();
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
        console.log('fechaEventoDateTimePicker changed');
        fechaHumana.textContent= humanizeDate(date);
    }
});
setTodayDate();

todayBtn.addEventListener('click', () => {
    setTodayDate()
});

function setTodayDate() {
    const today = new Date();
    filtroFechaDateTimePicker.selectDate(today);
    filtroFechaDateTimePicker.setViewDate(today);
    fechaHumana.textContent= humanizeDate(today);
}

/**
 * Renderizar eventos
 */
function renderizarEventos(eventos) {
    eventsContainer.replaceChildren();

    eventos.forEach(evento => {
        const eventRow = document.createElement('div');
        eventRow.classList.add('event-row');

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

        eventRow.appendChild(eventStartDuration);
        eventRow.appendChild(imgEvent);
        eventRow.appendChild(eventInfo);
        eventRow.appendChild(verticalLine);

        eventsContainer.appendChild(eventRow);

    });
}

async function cargarEventos() {
    const response = await listarEventos();
    if (response.status === 'success') {
        renderizarEventos(response.data);
    }
}


cargarEventos();