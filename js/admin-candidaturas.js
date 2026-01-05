// MODAL: CAMBIAR ESTADO

const changeModal = document.getElementById('changeModal');
const reasonWrapper = document.getElementById('rejectReasonWrapper');
const closeChangeBtn = document.getElementById('closeModal');
const saveChangeBtn = document.getElementById('saveModal');
const statusSelect = document.getElementById('modalStatus');
const participantSpan = document.getElementById('modal-participant');
const currentStatusSpan = document.getElementById('modal-current-status');

const statusLabels = {
    review: 'En revisión',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    finalist: 'Finalista',
    winner: 'Ganador'
};

// SOLO botones Cambiar de la tabla
document.querySelectorAll('.actions .btn.change').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const participantName = row.querySelector('.participant').textContent;
        const currentStatus = btn.dataset.estado;

        participantSpan.textContent = participantName;
        currentStatusSpan.textContent = statusLabels[currentStatus];
        statusSelect.value = currentStatus;

        reasonWrapper.style.display = currentStatus === 'rejected' ? 'block' : 'none';
        changeModal.style.display = 'flex';
    });
});

statusSelect.addEventListener('change', () => {
    reasonWrapper.style.display = statusSelect.value === 'rejected' ? 'block' : 'none';
});

function closeChangeModal() {
    changeModal.style.display = 'none';
}

closeChangeBtn.addEventListener('click', closeChangeModal);

saveChangeBtn.addEventListener('click', () => {
    if (statusSelect.value === 'rejected') {
        const reason = document.getElementById('rejectReason').value.trim();
        if (!reason) {
            alert('Por favor, indique el motivo del rechazo.');
            return;
        }
    }
    alert('Estado actualizado correctamente.');
    closeChangeModal();
});

changeModal.querySelector('.modal-overlay')
    .addEventListener('click', closeChangeModal);


// MODAL: DOCUMENTOS

const documentsModal = document.getElementById('documentsModal');
const closeDocumentsBtn = document.getElementById('closeDocumentsModal');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// SOLO el botón "Documentos" (por texto, sin tocar HTML)
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

documentsModal.querySelector('.modal-overlay')
    .addEventListener('click', () => {
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

document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();

        const row = btn.closest('tr');

        document.getElementById('detail-id').textContent =
            `CD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        document.getElementById('detail-name').textContent =
            row.querySelector('.participant').textContent;

        document.getElementById('detail-email').textContent =
            row.querySelector('.email').textContent;

        document.getElementById('detail-id-number').textContent =
            `${Math.floor(Math.random() * 90000000) + 10000000}A`;

        document.getElementById('detail-exp').textContent =
            `EXP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;

        document.getElementById('detail-synopsis').textContent =
            row.querySelector('.synopsis').textContent;

        document.getElementById('detail-date-presented').textContent =
            row.cells[3].textContent;

        document.getElementById('detail-date-updated').textContent =
            row.cells[4].textContent;

        const statusText = row.querySelector('.badge').textContent.trim();
        const badge = document.getElementById('detail-status');

        badge.textContent = statusText;
        badge.className = 'badge ' + getBadgeClass(statusText);

        detailModal.style.display = 'flex';
    });
});

closeDetailBtn.addEventListener('click', () => {
    detailModal.style.display = 'none';
});

detailModal.querySelector('.modal-overlay')
    .addEventListener('click', () => {
        detailModal.style.display = 'none';
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

// Botón "Historial"
document.querySelectorAll('.actions .btn').forEach(btn => {
    if (btn.textContent.trim() === 'Historial') {
        btn.addEventListener('click', e => {
            e.preventDefault();

            const row = btn.closest('tr');

            // ID ficticio (igual que en detalle)
            document.getElementById('history-id').textContent =
                `CD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

            historyModal.style.display = 'flex';
        });
    }
});

closeHistoryBtn.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

historyModal.querySelector('.modal-overlay')
    .addEventListener('click', () => {
        historyModal.style.display = 'none';
    });
