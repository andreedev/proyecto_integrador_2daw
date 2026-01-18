const btnDesasignar = document.querySelector('.boton-asignar-desasignar');

const modalDesasignar = document.getElementById('modal-desasignar');
const btnCancelarCerrarModalDesasignar = document.querySelector('.cancel-modal-desasignar');
const btnAceptarDesasignar = document.querySelector('.aceptar-modal-desasignar');

btnDesasignar.addEventListener('click', () => {
    modalDesasignar.showModal();
});

btnCancelarCerrarModalDesasignar.addEventListener('click', () => {
    modalDesasignar.close();
});


