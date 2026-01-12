const modalVerDetalleEvento = document.querySelector('#modalVerDetalleEvento');

const closeModalList = modalVerDetalleEvento.querySelectorAll('.close-modal');

const eventoContainer = document.querySelector('.event-row');
const btnEliminarEvento = document.querySelector('.neutral-button');
const btnEditarEvento = document.querySelector('.primary-button');

const btnCrearEvento = document.getElementById('btnCrearEvento');



closeModalList.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const dialog = closeModal.closest('dialog');
        dialog.close();
    });
});


eventoContainer.addEventListener('click', () => {
    modalVerDetalleEvento.classList.remove('hidden-force');
    modalVerDetalleEvento.showModal();

});


btnEliminarEvento.addEventListener('click', () => {
    eventoContainer.remove();
    modalVerDetalleEvento.close();
});