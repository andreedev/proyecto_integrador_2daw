// -------------------- REFERENCIAS --------------------
const editCategoryModal = document.getElementById('editCategoryModal');
const categoryNameInput = document.getElementById('categoryName');
const prizesContainer = document.getElementById('prizesContainer');
const addPrizeBtn = document.getElementById('addPrizeBtn');
const editCategoryForm = document.getElementById('editCategoryForm');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('#editCategoryModal .close');

const createCategoryModal = document.getElementById('createCategoryModal');
const newCategoryNameInput = document.getElementById('newCategoryName');
const newPrizesContainer = document.getElementById('newPrizesContainer');
const addNewPrizeBtn = document.getElementById('addNewPrizeBtn');
const createCategoryForm = document.getElementById('createCategoryForm');
const cancelCreateBtn = document.getElementById('cancelCreateBtn');

const categoriesGrid = document.getElementById('categoriesGrid');
const errorMessage = document.querySelector(".error-message");

// Modal confirmar eliminación
const confirmDeleteModal = document.getElementById("confirmDeleteModal");
const confirmDeleteMessage = document.getElementById("confirmDeleteMessage");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const closeDeleteBtn = document.querySelector('#confirmDeleteModal .close');

let currentCategoryId = null;
let categoriaAEliminar = null;

// -------------------- VALIDACIONES --------------------
newCategoryNameInput.addEventListener("blur", () => {
    errorMessage.textContent = newCategoryNameInput.value.trim() === ""
        ? "El nombre de la categoría es obligatorio."
        : "";
});

// -------------------- FUNCIONES MODAL EDICIÓN --------------------
function openEditModal(categoryId, categoryName, prizes) {
    currentCategoryId = categoryId;
    categoryNameInput.value = categoryName;
    prizesContainer.innerHTML = '';

    prizes.forEach((prize, index) => {
        addPrizeToModal(prize.nombre, prize.cantidad_dinero, index + 1, prize.id_premio);
    });

    editCategoryModal.style.display = 'flex';
}

function addPrizeToModal(label = 'Nuevo premio', value = '', number = 1, idPremio = null) {
    const prizeItem = document.createElement('div');
    prizeItem.className = 'prize-item';
    prizeItem.dataset.idPremio = idPremio;
    prizeItem.innerHTML = `
        <span class="prize-number">${number}</span>
        <input type="text" placeholder="Nombre del premio" value="${label}" required />
        <input type="number" placeholder="Valor €" value="${value}" min="0" step="10" />
        <button class="delete-btn"><img src="../img/icon/icon-trash.svg" alt="Eliminar"></button>
    `;
    prizesContainer.appendChild(prizeItem);

    prizeItem.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        prizeItem.remove();
        updatePrizeNumbers();
    });
}

function updatePrizeNumbers() {
    prizesContainer.querySelectorAll('.prize-item').forEach((item, index) => {
        item.querySelector('.prize-number').textContent = index + 1;
    });
}

addPrizeBtn.addEventListener('click', () => {
    addPrizeToModal(`Premio ${prizesContainer.children.length + 1}`, '', prizesContainer.children.length + 1);
});

cancelBtn.addEventListener('click', () => {
    editCategoryModal.style.display = 'none';
    resetEditModal();
});

closeBtn.addEventListener('click', () => {
    editCategoryModal.style.display = 'none';
    resetEditModal();
});

window.addEventListener('click', (e) => {
    if (e.target === editCategoryModal) resetEditModal();
});

function resetEditModal() {
    currentCategoryId = null;
    categoryNameInput.value = '';
    prizesContainer.innerHTML = '';
}

// -------------------- GUARDAR CAMBIOS --------------------
editCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoryName = categoryNameInput.value.trim();
    const premios = [];
    prizesContainer.querySelectorAll('.prize-item').forEach(item => {
        const label = item.querySelector('input[type="text"]').value.trim();
        const value = item.querySelector('input[type="number"]').valueAsNumber || 0;
        if (label) premios.push({
            id_premio: item.dataset.idPremio ? parseInt(item.dataset.idPremio) : undefined,
            nombre: label,
            cantidad_dinero: value,
            incluye_dinero: value > 0 ? 1 : 0
        });
    });

    if (!categoryName || premios.length === 0) {
        alert("Completa el nombre y al menos un premio.");
        return;
    }

    try {
        await editarCategoriaConPremios(currentCategoryId, categoryName, premios);
        editCategoryModal.style.display = 'none';
        resetEditModal();
        cargarCategorias();
    } catch (err) {
        console.error(err);
        alert("Error al actualizar categoría");
    }
});

// -------------------- MODAL CREACIÓN --------------------
function openCreateModal() {
    newCategoryNameInput.value = '';
    newPrizesContainer.innerHTML = '';
    addNewPrizeToModal('Nuevo premio', 100, 1);
    createCategoryModal.style.display = 'flex';
}

function addNewPrizeToModal(label = 'Nuevo premio', value = '', number = 1) {
    const prizeItem = document.createElement('div');
    prizeItem.className = 'prize-item';
    prizeItem.innerHTML = `
        <span class="prize-number">${number}</span>
        <input type="text" placeholder="Nombre del premio" value="${label}" required />
        <input type="number" placeholder="Valor €" value="${value}" min="0" step="10" />
        <button class="delete-btn"><img src="../img/icon/icon-trash.svg" alt="Eliminar"></button>
    `;
    newPrizesContainer.appendChild(prizeItem);

    prizeItem.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        prizeItem.remove();
        updateNewPrizeNumbers();
    });
}

function updateNewPrizeNumbers() {
    newPrizesContainer.querySelectorAll('.prize-item').forEach((item, index) => {
        item.querySelector('.prize-number').textContent = index + 1;
    });
}

addNewPrizeBtn.addEventListener('click', () => {
    addNewPrizeToModal(`Premio ${newPrizesContainer.children.length + 1}`, '', newPrizesContainer.children.length + 1);
});

cancelCreateBtn.addEventListener('click', () => {
    createCategoryModal.style.display = 'none';
    resetCreateModal();
});

document.querySelectorAll('#createCategoryModal .close').forEach(btn => {
    btn.addEventListener('click', () => {
        createCategoryModal.style.display = 'none';
        resetCreateModal();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === createCategoryModal) resetCreateModal();
});

function resetCreateModal() {
    newCategoryNameInput.value = '';
    newPrizesContainer.innerHTML = '';
}

// -------------------- CREAR CATEGORÍA --------------------
createCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoryName = newCategoryNameInput.value.trim();
    const premios = [];
    newPrizesContainer.querySelectorAll('.prize-item').forEach(item => {
        const label = item.querySelector('input[type="text"]').value.trim();
        const value = item.querySelector('input[type="number"]').valueAsNumber || 0;
        if (label) premios.push({ nombre: label, cantidad_dinero: value, incluye_dinero: value > 0 ? 1 : 0 });
    });

    if (!categoryName || premios.length === 0) {
        alert("Completa nombre y al menos un premio.");
        return;
    }

    try {
        await agregarCategoriaConPremios(categoryName, premios);
        createCategoryModal.style.display = 'none';
        resetCreateModal();
        cargarCategorias();
    } catch (err) {
        console.error(err);
        alert("Error al crear categoría");
    }
});

// -------------------- BOTÓN CREAR --------------------
document.querySelector('.btn-create').addEventListener('click', e => {
    e.stopPropagation();
    openCreateModal();
});

// -------------------- CARGAR CATEGORÍAS --------------------
async function cargarCategorias() {
    try {
        const response = await obtenerCategoriasConPremios();
        if (response.status !== 'success') {
            console.error("Error al obtener categorías:", response);
            return;
        }
        pintarCategorias(response.data);
    } catch (err) {
        console.error(err);
    }
}

function pintarCategorias(categorias) {
    categoriesGrid.innerHTML = '';

    categorias.forEach(categoria => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.dataset.id = categoria.id_categoria;

        let premiosHTML = '';
        categoria.premios.forEach(premio => {
            premiosHTML += premio.cantidad_dinero > 0
                ? `<div class="prize-item"><div class="prize-label">${premio.nombre}</div><div class="prize-value">${premio.cantidad_dinero}€</div></div>`
                : `<div class="prize-item"><div class="prize-label">${premio.nombre}</div></div>`;
        });

        categoryCard.innerHTML = `
            <div class="category-header">
                <div class="category-title">${categoria.nombre}</div>
                <div class="category-icons">
                    <span 
                        class="delete-icono"
                        data-id="${categoria.id_categoria}"
                        data-nombre="${categoria.nombre}">
                    </span>
                </div>
            </div>
            <div class="prizes-list">${premiosHTML}</div>
        `;

        // Abrir modal editar
        categoryCard.addEventListener('click', () => {
            openEditModal(categoria.id_categoria, categoria.nombre, categoria.premios);
        });

        // Botón eliminar (modal propio)
        const deleteBtn = categoryCard.querySelector('.delete-icono');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // CLAVE para que no se abra el modal de editar
            categoriaAEliminar = deleteBtn.dataset.id;
            confirmDeleteMessage.textContent = `¿Seguro que deseas eliminar "${deleteBtn.dataset.nombre}"?`;
            confirmDeleteModal.classList.remove("hidden-force");
        });

        categoriesGrid.appendChild(categoryCard);
    });
}

// -------------------- MODAL CONFIRMAR ELIMINACIÓN --------------------
cancelDeleteBtn.addEventListener('click', () => {
    confirmDeleteModal.classList.add("hidden-force");
    categoriaAEliminar = null;
});

closeDeleteBtn.addEventListener('click', () => {
    confirmDeleteModal.classList.add("hidden-force");
    categoriaAEliminar = null;
});

confirmDeleteBtn.addEventListener('click', async () => {
    if (!categoriaAEliminar) return;

    try {
        await eliminarCategoria(categoriaAEliminar);
        confirmDeleteModal.classList.add("hidden-force");
        categoriaAEliminar = null;
        cargarCategorias();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar categoría");
    }
});

// -------------------- INICIALIZACIÓN --------------------
document.addEventListener("DOMContentLoaded", () => cargarCategorias());
