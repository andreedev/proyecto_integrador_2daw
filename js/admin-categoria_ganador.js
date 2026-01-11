// Referencias a elementos del DOM (Edición)
const editCategoryModal = document.getElementById('editCategoryModal');
const categoryNameInput = document.getElementById('categoryName');
const prizesContainer = document.getElementById('prizesContainer');
const addPrizeBtn = document.getElementById('addPrizeBtn');
const editCategoryForm = document.getElementById('editCategoryForm');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close');
const createCategoryModal = document.getElementById('createCategoryModal');
const newCategoryNameInput = document.getElementById('newCategoryName');
const newPrizesContainer = document.getElementById('newPrizesContainer');
const addNewPrizeBtn = document.getElementById('addNewPrizeBtn');
const createCategoryForm = document.getElementById('createCategoryForm');
const cancelCreateBtn = document.getElementById('cancelCreateBtn');

// Variables globales
let currentCategoryId = null;

// Función para abrir el modal de edición
function openEditModal(categoryId, categoryName, prizes) {
    currentCategoryId = categoryId;
    categoryNameInput.value = categoryName;

    // Limpiar contenedor de premios
    prizesContainer.innerHTML = '';

    // Rellenar premios
    prizes.forEach((prize, index) => {
        addPrizeToModal(prize.label, prize.value, index + 1);
    });

    // Mostrar modal
    editCategoryModal.style.display = 'flex';
}

// Función para añadir un premio al modal de edición
function addPrizeToModal(label = 'Nuevo premio', value = '', number = 1) {
    const prizeItem = document.createElement('div');
    prizeItem.className = 'prize-item';
    prizeItem.innerHTML = `
        <span class="prize-number">${number}</span>
        <input type="text" placeholder="Nombre del premio" value="${label}" required />
        <input type="number" placeholder="Valor €" value="${value}" min="0" step="10" />
        <button class="delete-btn"><img src="../img/icon/TrashIcon.svg" alt="Eliminar"></button>
    `;
    prizesContainer.appendChild(prizeItem);

    // Evento para eliminar premio
    prizeItem.querySelector('.delete-btn').addEventListener('click', () => {
        prizeItem.remove();
        updatePrizeNumbers();
    });
}

// Actualizar números de premios después de eliminar uno
function updatePrizeNumbers() {
    const prizeItems = prizesContainer.querySelectorAll('.prize-item');
    prizeItems.forEach((item, index) => {
        item.querySelector('.prize-number').textContent = index + 1;
    });
}

// Evento: Añadir nuevo premio (edición)
addPrizeBtn.addEventListener('click', () => {
    const nextNumber = prizesContainer.children.length + 1;
    addPrizeToModal(`Premio ${nextNumber}`, '', nextNumber);
});

// Evento: Cancelar (edición)
cancelBtn.addEventListener('click', () => {
    editCategoryModal.style.display = 'none';
    resetEditModal();
});

// Evento: Cerrar con X (edición)
closeBtn.addEventListener('click', () => {
    editCategoryModal.style.display = 'none';
    resetEditModal();
});

// Cerrar modal si se hace clic fuera (edición)
window.addEventListener('click', (e) => {
    if (e.target === editCategoryModal) {
        editCategoryModal.style.display = 'none';
        resetEditModal();
    }
});

// Función para resetear el modal de edición
function resetEditModal() {
    currentCategoryId = null;
    categoryNameInput.value = '';
    prizesContainer.innerHTML = '';
}

// Evento: Guardar cambios (edición)
editCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const categoryName = categoryNameInput.value.trim();
    const prizes = [];

    const prizeItems = prizesContainer.querySelectorAll('.prize-item');
    prizeItems.forEach((item, index) => {
        const label = item.querySelector('input[type="text"]').value.trim();
        const value = item.querySelector('input[type="number"]').valueAsNumber || 0;

        if (label) {
            prizes.push({
                label,
                value
            });
        }
    });

    if (!categoryName || prizes.length === 0) {
        alert("Por favor, completa el nombre de la categoría y al menos un premio.");
        return;
    }

    console.log({
        id: currentCategoryId,
        name: categoryName,
        prizes: prizes
    });

    alert("Categoría actualizada correctamente.");
    editCategoryModal.style.display = 'none';
    resetEditModal();
});

// FUNCIONES PARA EL MODAL DE CREACIÓN

// Función para abrir el modal de creación
function openCreateModal() {
    newCategoryNameInput.value = '';
    newPrizesContainer.innerHTML = '';
    // Añadir premio por defecto SOLO al abrir
    addNewPrizeToModal('Nuevo premio', 100, 1);
    createCategoryModal.style.display = 'flex';
}

// Función para añadir un premio al modal de creación
function addNewPrizeToModal(label = 'Nuevo premio', value = '', number = 1) {
    const prizeItem = document.createElement('div');
    prizeItem.className = 'prize-item';
    prizeItem.innerHTML = `
        <span class="prize-number">${number}</span>
        <input type="text" placeholder="Nombre del premio" value="${label}" required />
        <input type="number" placeholder="Valor €" value="${value}" min="0" step="10" />
        <button class="delete-btn"><img src="../img/icon/TrashIcon.svg" alt="Eliminar"></button>
    `;
    newPrizesContainer.appendChild(prizeItem);

    // Evento para eliminar premio
    prizeItem.querySelector('.delete-btn').addEventListener('click', () => {
        prizeItem.remove();
        updateNewPrizeNumbers();
    });
}

// Actualizar números de premios en modal de creación
function updateNewPrizeNumbers() {
    const prizeItems = newPrizesContainer.querySelectorAll('.prize-item');
    prizeItems.forEach((item, index) => {
        item.querySelector('.prize-number').textContent = index + 1;
    });
}

// Evento: Añadir nuevo premio (creación)
addNewPrizeBtn.addEventListener('click', () => {
    const nextNumber = newPrizesContainer.children.length + 1;
    addNewPrizeToModal(`Premio ${nextNumber}`, '', nextNumber);
});

// Evento: Cancelar (creación)
cancelCreateBtn.addEventListener('click', () => {
    createCategoryModal.style.display = 'none';
    resetCreateModal();
});

// Evento: Cerrar con X (creación)
document.querySelectorAll('#createCategoryModal .close').forEach(btn => {
    btn.addEventListener('click', () => {
        createCategoryModal.style.display = 'none';
        resetCreateModal();
    });
});

// Cerrar modal si se hace clic fuera (creación)
window.addEventListener('click', (e) => {
    if (e.target === createCategoryModal) {
        createCategoryModal.style.display = 'none';
        resetCreateModal();
    }
});

// Función para resetear el modal de creación
function resetCreateModal() {
    newCategoryNameInput.value = '';
    newPrizesContainer.innerHTML = '';
    //NO añadimos premio por defecto aquí (solo al abrir)
}

// Evento: Crear categoría → ¡AHORA ACTUALIZA LA LISTA!
createCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const categoryName = newCategoryNameInput.value.trim();
    const prizes = [];

    const prizeItems = newPrizesContainer.querySelectorAll('.prize-item');
    prizeItems.forEach((item, index) => {
        const label = item.querySelector('input[type="text"]').value.trim();
        const value = item.querySelector('input[type="number"]').valueAsNumber || 0;

        if (label) {
            prizes.push({
                label,
                value
            });
        }
    });

    if (!categoryName || prizes.length === 0) {
        alert("Por favor, completa el nombre de la categoría y al menos un premio.");
        return;
    }

    //CREAR LA NUEVA TARJETA VISUAL
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card';

    let prizesHTML = '';
    prizes.forEach(prize => {
        if (prize.value > 0) {
            prizesHTML += `
                <div class="prize-item">
                    <div class="prize-label">${prize.label}</div>
                    <div class="prize-value">${prize.value}€</div>
                </div>
            `;
        } else {
            prizesHTML += `
                <div class="prize-item">
                    <div class="prize-label">${prize.label}</div>
                </div>
            `;
        }
    });

    categoryCard.innerHTML = `
        <div class="category-header">
            <div class="category-title">${categoryName}</div>
        </div>
        <div class="prizes-list">
            ${prizesHTML}
        </div>
    `;

    // AÑADIR AL GRID
    document.querySelector('.categories-grid').appendChild(categoryCard);

    // HACERLA EDITABLE
    categoryCard.addEventListener('click', () => {
        openEditModal(Date.now(), categoryName, prizes);
    });

    // Mensaje y cierre
    alert("Categoría creada correctamente.");
    createCategoryModal.style.display = 'none';
    resetCreateModal();
});

// EVENTOS DE CLIC EN TARJETAS EXISTENTES Y BOTÓN "CREAR"

// Tarjetas existentes (cargadas inicialmente)
document.querySelectorAll('.category-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.category-title').textContent;
        const prizes = [];

        card.querySelectorAll('.prize-item').forEach((item) => {
            const label = item.querySelector('.prize-label').textContent;
            const valueText = item.querySelector('.prize-value')?.textContent;
            const value = valueText ? parseInt(valueText.replace('€', '').trim()) || 0 : 0;
            prizes.push({ label, value });
        });
        openEditModal(index + 1, title, prizes);
    });
});

// Botón "+ Crear categoría"
document.querySelector('.btn-create').addEventListener('click', (e) => {
    e.stopPropagation();
    openCreateModal();
});