// === FUNCIONES AUXILIARES PARA MODALES PERSONALIZADOS ===
const confirmationModal = document.getElementById('confirmationModal');
const notificationModal = document.getElementById('notificationModal');
const confirmationMessage = document.getElementById('confirmationMessage');
const notificationMessage = document.getElementById('notificationMessage');

function showConfirmation(message, onConfirm) {
    confirmationMessage.textContent = message;
    confirmationModal.style.display = 'flex';
    document.getElementById('confirmYes').onclick = () => {
        confirmationModal.style.display = 'none';
        if (typeof onConfirm === 'function') onConfirm();
    };
    document.getElementById('confirmNo').onclick = () => {
        confirmationModal.style.display = 'none';
    };
    confirmationModal.querySelector('.modal-overlay').onclick = () => {
        confirmationModal.style.display = 'none';
    };
}

function showNotification(message) {
    notificationMessage.textContent = message;
    notificationModal.style.display = 'flex';
    document.getElementById('closeNotification').onclick = () => {
        notificationModal.style.display = 'none';
    };
    notificationModal.querySelector('.modal-overlay').onclick = () => {
        notificationModal.style.display = 'none';
    };
}

// MODAL: CAMBIAR ESTADO
const changeModal = document.getElementById('changeModal');
const reasonWrapper = document.getElementById('rejectReasonWrapper');
const closeChangeBtn = document.getElementById('closeModal');
const saveChangeBtn = document.getElementById('saveModal');
const statusSelect = document.getElementById('modalStatus');
const participantSpan = document.getElementById('modal-participant');
const currentStatusSpan = document.getElementById('modal-current-status');

// Mapa de etiquetas de estado
const statusLabels = {
    review: 'En revisión',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    finalist: 'Finalista',
    winner: 'Ganador'
};

// Almacenar la fila activa al abrir el modal   
let activeChangeRow = null;

// Abrir modal "Cambiar estado"
document.querySelectorAll('.actions .btn.change').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const participantName = row.querySelector('.participant').textContent;
        const currentStatus = btn.dataset.estado;

        participantSpan.textContent = participantName;
        currentStatusSpan.textContent = statusLabels[currentStatus];
        statusSelect.value = currentStatus;
        activeChangeRow = row;

        // Cargar motivo si ya existe
        const existingReason = row.dataset.rejectReason || '';
        document.getElementById('rejectReason').value = existingReason;

        reasonWrapper.style.display = currentStatus === 'rejected' ? 'block' : 'none';
        changeModal.style.display = 'flex';
    });
});

// Mostrar/ocultar campo de motivo al cambiar estado
statusSelect.addEventListener('change', () => {
    reasonWrapper.style.display = statusSelect.value === 'rejected' ? 'block' : 'none';
});

// Cerrar modal
function closeChangeModal() {
    changeModal.style.display = 'none';
}
closeChangeBtn.addEventListener('click', closeChangeModal);
changeModal.querySelector('.modal-overlay').addEventListener('click', closeChangeModal);

// Guardar cambios
saveChangeBtn.addEventListener('click', () => {
    const newStatus = statusSelect.value;

    if (newStatus === 'rejected') {
        const reason = document.getElementById('rejectReason').value.trim();
        if (!reason) {
            showNotification('Por favor, indique el motivo del rechazo.');
            return;
        }
        activeChangeRow.dataset.rejectReason = reason;
        const badge = activeChangeRow.querySelector('.badge');
        badge.className = 'badge rejected';
        badge.innerHTML = 'Rechazada';
    } else {
        // Si se cambia a otro estado, eliminar el motivo
        delete activeChangeRow.dataset.rejectReason;

        const displayText = statusLabels[newStatus] || newStatus;

        const badge = activeChangeRow.querySelector('.badge');
        badge.className = 'badge ' + newStatus;
        badge.textContent = displayText;
    }
    showNotification('Estado actualizado correctamente.');
    closeChangeModal();
});

// MODAL: DOCUMENTOS
const documentsModal = document.getElementById('documentsModal');
const closeDocumentsBtn = document.getElementById('closeDocumentsModal');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

document.querySelectorAll('.actions .btn').forEach(btn => {
    if (btn.textContent.trim() === 'Documentos') {
        btn.addEventListener('click', e => {
            e.preventDefault();
            documentsModal.style.display = 'flex';
        });
    }
});

closeDocumentsBtn.addEventListener('click', () => {
    documentsModal.style.display = 'none';
});
documentsModal.querySelector('.modal-overlay').addEventListener('click', () => {
    documentsModal.style.display = 'none';
});

// Tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(`${button.dataset.tab}-pane`).classList.add('active');
    });
});

// MODAL: DETALLE
const detailModal = document.getElementById('detailModal');
const closeDetailBtn = document.getElementById('closeDetailModal');

let activeDetailRow = null;

document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const row = btn.closest('tr');
        activeDetailRow = row;

        document.getElementById('detail-id').textContent =
            `CD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        document.getElementById('detail-name').textContent = row.querySelector('.participant').textContent;
        document.getElementById('detail-email').textContent = row.querySelector('.email').textContent;
        document.getElementById('detail-id-number').textContent = `${Math.floor(Math.random() * 90000000) + 10000000}A`;
        document.getElementById('detail-exp').textContent = `EXP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
        document.getElementById('detail-synopsis').textContent = row.querySelector('.synopsis').textContent;
        document.getElementById('detail-date-presented').textContent = row.cells[3].textContent;
        document.getElementById('detail-date-updated').textContent = row.cells[4].textContent;

        const statusText = row.querySelector('.badge').textContent.trim();
        const badge = document.getElementById('detail-status');
        badge.textContent = statusText;
        badge.className = 'badge ' + getBadgeClass(statusText);

        // Mostrar motivo de rechazo si aplica
        const rejectReasonDiv = document.getElementById('detail-reject-reason');
        const rejectReasonText = document.getElementById('reject-reason-text');
        const rejectReason = row.dataset.rejectReason;

        if (statusText.includes('Rechazada') && rejectReason) {
            rejectReasonText.textContent = rejectReason;
            rejectReasonDiv.style.display = 'block';
        } else {
            rejectReasonDiv.style.display = 'none';
        }

        detailModal.style.display = 'flex';
    });
});

closeDetailBtn.addEventListener('click', () => {
    detailModal.style.display = 'none';
});
detailModal.querySelector('.modal-overlay').addEventListener('click', () => {
    detailModal.style.display = 'none';
});

// Botón de eliminar candidatura
document.getElementById('deleteCandidatura').addEventListener('click', () => {
    if (!activeDetailRow) return;

    const participantName = activeDetailRow.querySelector('.participant')?.textContent || 'el participante';
    const message = `¿Está seguro de que desea eliminar la candidatura de ${participantName}? Esta acción no se puede deshacer.`;

    showConfirmation(message, () => {
        activeDetailRow.remove();
        detailModal.style.display = 'none';
        showNotification('Candidatura eliminada correctamente.');
    });
});

function getBadgeClass(status) {
    if (status.includes('En revisión')) return 'review';
    if (status.includes('Aceptada')) return 'accepted';
    if (status.includes('Rechazada')) return 'rejected';
    if (status.includes('Finalista')) return 'finalist';
    if (status.includes('Ganador')) return 'winner';
    return 'review';
}

// MODAL: HISTORIAL
const historyModal = document.getElementById('historyModal');
const closeHistoryBtn = document.getElementById('closeHistoryModal');

document.querySelectorAll('.actions .btn').forEach(btn => {
    if (btn.textContent.trim() === 'Historial') {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const row = btn.closest('tr');
            document.getElementById('history-id').textContent =
                `CD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            historyModal.style.display = 'flex';
        });
    }
});

closeHistoryBtn.addEventListener('click', () => {
    historyModal.style.display = 'none';
});
historyModal.querySelector('.modal-overlay').addEventListener('click', () => {
    historyModal.style.display = 'none';
});