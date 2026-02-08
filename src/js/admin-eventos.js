const eventsContainer = document.getElementById('eventsContainer');
const filtroFecha = document.getElementById('filtroFecha');
const hoyBtn = document.getElementById('hoyBtn');

const modalVerDetalleEvento = document.getElementById('modalVerDetalleEvento');
const modalActualizarEvento = document.getElementById('modalActualizarEvento');
const modalCrearEvento = document.getElementById('modalCrearEvento');
const notification = document.getElementById('notification');
const btnEliminar = document.getElementById('btnEliminar');
const btnOpenModalActualizar = document.getElementById('btnOpenModalActualizar');
const btnActualizar = document.getElementById('btnActualizar');
const btnCrear = document.getElementById('btnCrear');
const btnOpenModalCrear = document.getElementById('btnOpenModalCrear');

const nombreEventoInputView = document.getElementById('nombreEventoInputView');
const descripcionEventoInputView = document.getElementById('descripcionEventoInputView');
const ubicacionEventoInputView = document.getElementById('ubicacionEventoInputView');
const fechaEventoInputView = document.getElementById('fechaEventoInputView');
const horaInicioEventoInputView = document.getElementById('horaInicioEventoInputView');
const horaFinEventoInputView = document.getElementById('horaFinEventoInputView');
const imagenEventoInputView = document.getElementById('imagenEventoInputView');

const nombreEventoInputEdit = document.getElementById('nombreEventoInputEdit');
const descripcionEventoInputEdit = document.getElementById('descripcionEventoInputEdit');
const ubicacionEventoInputEdit = document.getElementById('ubicacionEventoInputEdit');
const fechaEventoInputEdit = document.getElementById('fechaEventoInputEdit');
const horaInicioEventoInputEdit = document.getElementById('horaInicioEventoInputEdit');
const horaFinEventoInputEdit = document.getElementById('horaFinEventoInputEdit');
const imagenEventoInputEdit = document.getElementById('imagenEventoInputEdit');

const nombreEventoInputCreate = document.getElementById('nombreEventoInputCreate');
const descripcionEventoInputCreate = document.getElementById('descripcionEventoInputCreate');
const ubicacionEventoInputCreate = document.getElementById('ubicacionEventoInputCreate');
const fechaEventoInputCreate = document.getElementById('fechaEventoInputCreate');
const horaInicioEventoInputCreate = document.getElementById('horaInicioEventoInputCreate');
const horaFinEventoInputCreate = document.getElementById('horaFinEventoInputCreate');
const imagenEventoInputCreate = document.getElementById('imagenEventoInputCreate');

let eventoSeleccionado = null;

filtroFecha.addEventListener('date-change', async () => {
    await refreshEventos();
})

hoyBtn.addEventListener('click', async () => {
    filtroFecha.setDate(new Date());
})

function handleVerDetalleEvento() {
    nombreEventoInputView.value = eventoSeleccionado.nombreEvento;
    descripcionEventoInputView.value = eventoSeleccionado.descripcionEvento;
    ubicacionEventoInputView.value = eventoSeleccionado.ubicacionEvento;
    fechaEventoInputView.setDate(eventoSeleccionado.fechaEvento);
    horaInicioEventoInputView.setDate(eventoSeleccionado.horaInicioEvento);
    horaFinEventoInputView.setDate(eventoSeleccionado.horaFinEvento);
    imagenEventoInputView.setPreviewMode(eventoSeleccionado.rutaImagenEvento);
    modalVerDetalleEvento.open();
}

btnOpenModalActualizar.addEventListener('click', () => {
    nombreEventoInputEdit.setValue(eventoSeleccionado.nombreEvento, true);
    descripcionEventoInputEdit.setValue(eventoSeleccionado.descripcionEvento, true);
    ubicacionEventoInputEdit.setValue(eventoSeleccionado.ubicacionEvento, true);
    fechaEventoInputEdit.setDate(eventoSeleccionado.fechaEvento);
    horaInicioEventoInputEdit.setDate(eventoSeleccionado.horaInicioEvento);
    horaFinEventoInputEdit.setDate(eventoSeleccionado.horaFinEvento);
    imagenEventoInputEdit.setAttachedMode(eventoSeleccionado.rutaImagenEvento, eventoSeleccionado.idArchivoImagenEvento, true);
    modalVerDetalleEvento.close();
    modalActualizarEvento.open();
});

btnOpenModalCrear.addEventListener('click', () => {
    nombreEventoInputCreate.value = '';
    descripcionEventoInputCreate.value = '';
    ubicacionEventoInputCreate.value = '';
    fechaEventoInputCreate.setDate(new Date());
    horaInicioEventoInputCreate.setDate('09:00');
    horaFinEventoInputCreate.setDate('10:00');
    imagenEventoInputCreate.resetPreviewMode();
    modalCrearEvento.open();
});

btnActualizar.addEventListener('click', handleActualizarEvento);
btnCrear.addEventListener('click', handleAgregarEvento);
btnEliminar.addEventListener('click', handleEliminarEvento);


/**
 * Renderizar eventos
 */
function renderizarEventos(eventos) {
    eventsContainer.replaceChildren();
    if (eventos.length === 0) return;

    const eventosOrdenados = [...eventos].sort((a, b) =>
        a.horaInicioEvento.localeCompare(b.horaInicioEvento)
    );

    let maxEndTimeSoFar = new Date(`1970-01-01T${eventosOrdenados[0].horaFinEvento}Z`);

    eventosOrdenados.forEach((evento, index) => {
        const eventContainer = document.createElement('div');
        eventContainer.classList.add('event-row');

        const leftSide = document.createElement('div');
        leftSide.classList.add('d-flex', 'align-items-center', 'flex-grow-1', 'gap-8px');

        eventContainer.addEventListener('click', () => {
            eventoSeleccionado = evento;
            handleVerDetalleEvento();
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
        img.className = 'img aspect-ratio-4-3 object-fit-cover';
        img.src = evento.rutaImagenEvento;
        img.alt = 'Imagen del evento';

        imgEvent.appendChild(img);

        const eventInfo = document.createElement('div');
        eventInfo.classList.add('event-info');

        const eventName = document.createElement('span');
        eventName.classList.add('event-name', 'text-truncate');
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

        const siguienteEvento = eventosOrdenados[index + 1];

        if (siguienteEvento) {
            const currentEventEnd = new Date(`1970-01-01T${evento.horaFinEvento}Z`);
            const nextEventStart = new Date(`1970-01-01T${siguienteEvento.horaInicioEvento}Z`);

            if (currentEventEnd > maxEndTimeSoFar) {
                maxEndTimeSoFar = currentEventEnd;
            }

            const diffInMinutes = (nextEventStart - maxEndTimeSoFar) / (1000 * 60);

            if (diffInMinutes > 0) {
                const eventFreeTime = document.createElement('div');
                eventFreeTime.classList.add('event-free-time');

                const iconTime = document.createElement('span');
                iconTime.classList.add('icon-time');

                const freeTimeText = document.createElement('span');
                freeTimeText.classList.add('free-time-text');

                // Usamos tu función humanizeDuration o cálculo manual
                const hours = Math.floor(diffInMinutes / 60);
                const mins = Math.round(diffInMinutes % 60);
                let duracionTexto = hours > 0 ? `${hours}h ` : '';
                duracionTexto += mins > 0 ? `${mins}min` : '';

                freeTimeText.textContent = `${duracionTexto.trim()} libre`;

                eventFreeTime.appendChild(iconTime);
                eventFreeTime.appendChild(freeTimeText);
                eventsContainer.appendChild(eventFreeTime);

                maxEndTimeSoFar = nextEventStart;
            }
        }

    });
}

async function refreshEventos() {
    const fechaSeleccionada = filtroFecha.getISOValue();
    const response = await listarEventos(fechaSeleccionada);
    if (response.status === 'success') {
        renderizarEventos(response.data);
    }
}



/**
 * Agregar evento
 */
async function handleAgregarEvento() {
    const validNombre = nombreEventoInputCreate.validate().valid;
    const validDescripcion = descripcionEventoInputCreate.validate().valid;
    const validUbicacion = ubicacionEventoInputCreate.validate().valid;
    const validImagen = imagenEventoInputCreate.validate();

    if (!validNombre || !validDescripcion || !validUbicacion || !validImagen) {
        return;
    }

    const nombre = nombreEventoInputCreate.value.trim();
    const descripcion = descripcionEventoInputCreate.value.trim();
    const ubicacion = ubicacionEventoInputCreate.value.trim();
    const fecha = fechaEventoInputCreate.getISOValue();
    const horaInicio = horaInicioEventoInputCreate.getISOValue();
    const horaFin = horaFinEventoInputCreate.getISOValue();
    const idArchivo = await imagenEventoInputCreate.uploadIfNeeded()

    const response = await validarExisteEventoMismaFechaHoraInicioYHoraFin(null, fecha, horaInicio, horaFin);
    if(response.existeAlgunEvento){
        notification.show("Alerta: existen eventos que se solapan en fecha y hora. ¿Deseas continuar de todas formas?", {
            confirm: true,
            confirmText: "Continuar",
            onConfirm: async () => {
                await handleAgregarEventoApi(nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivo);
            }
        });
        return;
    } else {
        await handleAgregarEventoApi(nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivo);
    }


}

async function handleAgregarEventoApi(nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivo) {
    const response = await crearEvento(nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivo);
    if (response.status !== 'success') {
        notification.show('Error al crear el evento');
        return;
    }

    modalCrearEvento.close();
    notification.show('Evento creado correctamente');
    await refreshEventos();
}

/**
 * Eliminar evento
 */
async function handleEliminarEvento() {
    notification.show("¿Estás segur@ de eliminar este evento?", {
        confirm: true,
        confirmText: "Eliminar",
        onConfirm: async () => {
            let response = await eliminarEvento(eventoSeleccionado.idEvento);
            if (response.status !== 'success'){
                notification.show('Error al eliminar el evento');
                return;
            }
            modalVerDetalleEvento.close();
            refreshEventos();
        }
    });

}


/**
 * Actualizar evento
 */
async function handleActualizarEvento() {
    const validNombre = nombreEventoInputEdit.validate().valid;
    const validDescripcion = descripcionEventoInputEdit.validate().valid;
    const validUbicacion = ubicacionEventoInputEdit.validate().valid;
    const validImagen = imagenEventoInputEdit.validate();

    if (!validNombre || !validDescripcion || !validUbicacion || !validImagen) {
        return;
    }

    const idEvento = eventoSeleccionado.idEvento;
    const nombre = nombreEventoInputEdit.value.trim();
    const descripcion = descripcionEventoInputEdit.value.trim();
    const ubicacion = ubicacionEventoInputEdit.value.trim();
    const fecha = fechaEventoInputEdit.getISOValue();
    const horaInicio = horaInicioEventoInputEdit.getISOValue();
    const horaFin = horaFinEventoInputEdit.getISOValue();
    const idArchivoImagen = await imagenEventoInputEdit.uploadIfNeeded()

    const response = await validarExisteEventoMismaFechaHoraInicioYHoraFin(idEvento, fecha, horaInicio, horaFin);
    if(response.existeAlgunEvento){
        notification.show("Alerta: existen eventos que se solapan en fecha y hora. ¿Deseas continuar de todas formas?", {
            confirm: true,
            confirmText: "Continuar",
            onConfirm: async () => {
                await handleActualizarEventoApi(idEvento, nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivoImagen);
            }
        });
        return;
    } else {
        await handleActualizarEventoApi(idEvento, nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivoImagen);
    }

}

async function handleActualizarEventoApi(idEvento, nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivoImagen) {
    const response = await actualizarEvento(idEvento, nombre, descripcion, ubicacion, fecha, horaInicio, horaFin, idArchivoImagen);
    if (response.status !== 'success') {
        notification.show('Error al actualizar el evento');
        return;
    }

    modalActualizarEvento.close();
    notification.show('Evento actualizado correctamente');
    await refreshEventos();
}

(function checkPathParams(){
    const urlParams = new URLSearchParams(window.location.search);
    const fechaParam = urlParams.get('fecha');
    if (fechaParam) {
        let date = new Date(fechaParam)
        setTimeout(() => {
            filtroFecha.setDate(date);
        }, 500);
    }
})()