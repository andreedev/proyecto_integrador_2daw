const modalVerDetalleEvento = document.querySelector('#modalVerDetalleEvento');

closeModalList.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const dialog = closeModal.closest('dialog');
        dialog.close();
    });
});

