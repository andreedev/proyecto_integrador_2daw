// -------------------- REFERENCIAS --------------------
const editCategoryModal = document.getElementById('editCategoryModal');
// const categoryNameInput = document.getElementById('categoryName');
// const prizesContainer = document.getElementById('prizesContainer');
// const addPrizeBtn = document.getElementById('addPrizeBtn');
// const editCategoryForm = document.getElementById('editCategoryForm');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('#editCategoryModal .close');

// const createCategoryModal = document.getElementById('createCategoryModal');
// const newCategoryNameInput = document.getElementById('newCategoryName');
// const newPrizesContainer = document.getElementById('newPrizesContainer');
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

const notification = document.getElementById("notification");


let currentCategoryId = null;
let categoriaAEliminar = null;

// -------------------- VALIDACIONES --------------------
// newCategoryNameInput.addEventListener("blur", () => {
//     errorMessage.textContent = newCategoryNameInput.value.trim() === ""
//         ? "El nombre de la categoría es obligatorio."
//         : "";
// });

// -------------------- FUNCIONES MODAL EDICIÓN --------------------
function openEditModal(categoryId, categoryName, prizes) {
    currentCategoryId = categoryId;
    categoryNameInput.value = categoryName;
    prizesContainer.innerHTML = '';

    prizes.forEach((prize, index) => {
        addPrizeToModal(prize.nombre, prize.cantidad_dinero, index + 1, prize.id_premio);
    });

    editCategoryModal.open();
}

// function addPrizeToModal(label = 'Nuevo premio', value = '', number = 1, idPremio = null) {
//     const prizeItem = document.createElement('div');
//     prizeItem.className = 'prize-item';
//     prizeItem.dataset.idPremio = idPremio;
//     prizeItem.innerHTML = `
//         <span class="prize-number">${number}</span>
//         <input type="text" placeholder="Nombre del premio" value="${label}" required />
//         <input type="number" placeholder="Valor €" value="${value}" min="0" step="10" />
//         <button class="delete-btn"><img src="../img/icon/icon-trash.svg" alt="Eliminar"></button>
//     `;
//     prizesContainer.appendChild(prizeItem);
//
//     prizeItem.querySelector('.delete-btn').addEventListener('click', (e) => {
//         e.stopPropagation();
//         prizeItem.remove();
//         updatePrizeNumbers();
//     });
// }

// function updatePrizeNumbers() {
//     prizesContainer.querySelectorAll('.prize-item').forEach((item, index) => {
//         item.querySelector('.prize-number').textContent = index + 1;
//     });
// }
//
// addPrizeBtn.addEventListener('click', () => {
//     addPrizeToModal(`Premio ${prizesContainer.children.length + 1}`, '', prizesContainer.children.length + 1);
// });

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

// // -------------------- MODAL CREACIÓN --------------------
function openCreateModal() {

    createCategoryModal.open();
    newCategoryNameInput.value = '';
    newPrizesContainer.innerHTML = '';
    addNewPrizeToModal('Nuevo premio', 100, 1);
}
//
// function addNewPrizeToModal(label = 'Nuevo premio', value = '', number = 1) {
//     const prizeItem = document.createElement('div');
//     prizeItem.className = 'prize-item';
//     prizeItem.innerHTML = `
//         <span class="prize-number">${number}</span>
//         <input type="text" placeholder="Nombre del premio" value="${label}" required />
//         <input type="number" placeholder="Valor €" value="${value}" min="0" step="10" />
//         <button class="delete-btn"><img src="../img/icon/icon-trash.svg" alt="Eliminar"></button>
//     `;
//     newPrizesContainer.appendChild(prizeItem);
//
//     prizeItem.querySelector('.delete-btn').addEventListener('click', (e) => {
//         e.stopPropagation();
//         prizeItem.remove();
//         updateNewPrizeNumbers();
//     });
// }
//
// function updateNewPrizeNumbers() {
//     newPrizesContainer.querySelectorAll('.prize-item').forEach((item, index) => {
//         item.querySelector('.prize-number').textContent = index + 1;
//     });
// }
//
// addNewPrizeBtn.addEventListener('click', () => {
//     addNewPrizeToModal(`Premio ${newPrizesContainer.children.length + 1}`, '', newPrizesContainer.children.length + 1);
// });
//
cancelCreateBtn.addEventListener('click', () => {
    createCategoryModal.style.display = 'none';
    resetCreateModal();
});
//
// document.querySelectorAll('#createCategoryModal .close').forEach(btn => {
//     btn.addEventListener('click', () => {
//         createCategoryModal.style.display = 'none';
//         resetCreateModal();
//     });
// });
//
// window.addEventListener('click', (e) => {
//     if (e.target === createCategoryModal) resetCreateModal();
// });
//
// function resetCreateModal() {
//     newCategoryNameInput.value = '';
//     newPrizesContainer.innerHTML = '';
// }
//
// // -------------------- CREAR CATEGORÍA --------------------
// createCategoryForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//
//     const categoryName = newCategoryNameInput.value.trim();
//     const premios = [];
//     newPrizesContainer.querySelectorAll('.prize-item').forEach(item => {
//         const label = item.querySelector('input[type="text"]').value.trim();
//         const value = item.querySelector('input[type="number"]').valueAsNumber || 0;
//         if (label) premios.push({ nombre: label, cantidad_dinero: value, incluye_dinero: value > 0 ? 1 : 0 });
//     });
//
//     if (!categoryName || premios.length === 0) {
//         alert("Completa nombre y al menos un premio.");
//         return;
//     }
//
//     try {
//         await agregarCategoriaConPremios(categoryName, premios);
//         createCategoryModal.style.display = 'none';
//         resetCreateModal();
//         cargarCategorias();
//     } catch (err) {
//         console.error(err);
//         alert("Error al crear categoría");
//     }
// });

// -------------------- BOTÓN MOSTRAR MODAL CREAR CATEGORÍA --------------------
document.getElementById('btnCreate').addEventListener('click', e => {
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
    categoriesGrid.replaceChildren()

    categorias.forEach(categoria => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.dataset.id = categoria.id_categoria;

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';

        const titleIconGroup = document.createElement('div');
        titleIconGroup.className = 'title-icon d-flex align-items-center justify-content-start gap-12px';

        const iconTag = document.createElement('span');
        iconTag.className = 'icon-tag w-36px h-36px bg-neutral-01';

        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = categoria.nombre;

        titleIconGroup.append(iconTag, categoryTitle);

        const categoryIcons = document.createElement('div');
        categoryIcons.className = 'category-icons d-flex align-items-center justify-content-center gap-8px';

        const editBtn = document.createElement('span');
        editBtn.className = 'icon-pencil w-24px h-24px bg-neutral-01';
        editBtn.dataset.id = categoria.id_categoria;
        editBtn.dataset.nombre = categoria.nombre;
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            editCategoryModal.open();
            openEditModal(categoria.id_categoria, categoria.nombre, categoria.premios);
        })

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-icono';
        deleteBtn.dataset.id = categoria.id_categoria;
        deleteBtn.dataset.nombre = categoria.nombre;
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // CLAVE para que no se abra el modal de editar
            notification.show("¿Estás seguro de eliminar?", {
                confirm: true,
                confirmText: "Eliminar",
                onConfirm: ()  => {
                    handleEliminarCategoria(categoria.id_categoria);
                }
            });
        })

        categoryIcons.append(editBtn, deleteBtn);

        categoryHeader.append(titleIconGroup, categoryIcons);

        const prizesList = document.createElement('div');
        prizesList.className = 'prizes-list';

        categoria.premios.forEach(premio => {
            const prizeItem = document.createElement('div');
            prizeItem.className = 'prize-item';

            if (premio.cantidad_dinero > 0) {
                const prizeLabel = document.createElement('div');
                prizeLabel.className = 'prize-label d-flex justify-content-start align-items-center gap-10px';

                const iconTrophy = document.createElement('span');
                iconTrophy.className = 'icon-trophy w-24px h-24px bg-neutral-01';

                prizeLabel.append(iconTrophy, document.createTextNode(premio.nombre));

                const prizeValue = document.createElement('div');
                prizeValue.className = 'prize-value d-flex justify-content-end align-items-center gap-10px';

                const iconMoney = document.createElement('span');
                iconMoney.className = 'icon-money w-24px h-24px bg-neutral-01';

                prizeValue.append(iconMoney, document.createTextNode(`${premio.cantidad_dinero}€`));

                prizeItem.append(prizeLabel, prizeValue);
            } else {
                const simpleLabel = document.createElement('div');
                simpleLabel.className = 'prize-label';
                simpleLabel.textContent = premio.nombre;
                prizeItem.appendChild(simpleLabel);
            }

            prizesList.appendChild(prizeItem);
        });

        categoryCard.append(categoryHeader, prizesList);

        categoriesGrid.appendChild(categoryCard);
    });
}


async function handleEliminarCategoria(categoryId) {
    const response = await eliminarCategoria(categoryId);
    if (response.status === 'success'){
        notification.show("Categoría eliminada correctamente.");
    } else {
        notification.show(response.message);
    }
    await cargarCategorias();
}

// -------------------- INICIALIZACIÓN --------------------
document.addEventListener("DOMContentLoaded", () => cargarCategorias());
