const modalVerDetalleEvento = document.querySelector('#modalVerDetalleEvento');

const closeModalList = modalVerDetalleEvento.querySelectorAll('.close-modal');

closeModalList.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const dialog = closeModal.closest('dialog');
        dialog.close();
    });
});

