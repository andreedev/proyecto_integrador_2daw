const btnCrearEdicion = document.querySelector('.admin-header-main-action-button');
const modalCrearEdicion = document.getElementById('modal-crear-edicion');

btnCrearEdicion.addEventListener('click', () => {
    modalCrearEdicion.showModal();
});