const modalVerDetalleEvento = document.getElementById('modalVerDetalleEvento');
const closeModalList = document.querySelectorAll('.close-modal');

closeModalList.forEach(closeModal => {
    closeModal.addEventListener('click', () => {
        const dialog = closeModal.closest('dialog');
        dialog.close();
    });
});

const eventRows = document.querySelectorAll('.event-row');
eventRows.forEach(row => {
    row.addEventListener('click', () => {
        const idEvento = row.getAttribute('data-evento-id');
        modalVerDetalleEvento.showModal();
    });
});


