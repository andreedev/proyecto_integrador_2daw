const modalVerDetalleEvento = document.getElementById('modalVerDetalleEvento');
const closeModalList = document.querySelectorAll('.close-modal');

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


// Cerrar modales
closeModalList.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const dialog = closeModal.closest('dialog');
        dialog.close();
    });
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



