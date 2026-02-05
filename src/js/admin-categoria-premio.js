const editCategoryModal = document.getElementById('editCategoryModal');
const createCategoryModal = document.getElementById('createCategoryModal');
const categoriesGrid = document.getElementById('categoriesGrid');
const notification = document.getElementById("notification");
const pagination = document.getElementById("pagination");
const btnOpenCreateCategoryModal = document.getElementById("btnOpenCreateCategoryModal");
const btnCrear = document.getElementById("btnCrear");
const agregarCardPremio = document.getElementById("agregarCardPremio");


let currentCategoryId = null;
let pageSize = 6;

btnOpenCreateCategoryModal.addEventListener('click', () => {
    createCategoryModal.open();
});

btnCrear.addEventListener('click', () => {
    createCategoryModal.open();
});

agregarCardPremio.addEventListener('click', () => {

});


pagination.addEventListener('page-change', async (e) => {
    await cargarCategorias();
});


//     try {
//         await agregarCategoriaConPremios(categoryName, premios);
//         createCategoryModal.style.display = 'none';
//         resetCreateModal();
//         cargarCategorias();


/**
 * Carga las categorías
 */
async function cargarCategorias() {
    const response = await obtenerCategoriasConPremios(pagination.currentPage, pageSize);
    if (response.status !== 'success') {
        notification.show("Error al cargar categorías");
    }
    const categorias = response.data.list;
    renderizarCategorias(categorias);

    pagination.setAttribute('current-page', response.data.page);
    pagination.setAttribute('total-pages', response.data.totalPages);
}

function renderizarCategorias(categorias) {
    categoriesGrid.replaceChildren()

    categorias.forEach(categoria => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.dataset.id = categoria.idCategoria;

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
        editBtn.dataset.id = categoria.idCategoria;
        editBtn.dataset.nombre = categoria.nombre;
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            editCategoryModal.open();
            openEditModal(categoria.idCategoria, categoria.nombre, categoria.premios);
        })

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-icono';
        deleteBtn.dataset.id = categoria.idCategoria;
        deleteBtn.dataset.nombre = categoria.nombre;
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // CLAVE para que no se abra el modal de editar
            notification.show("¿Estás seguro de eliminar?", {
                confirm: true,
                confirmText: "Eliminar",
                onConfirm: ()  => {
                    handleEliminarCategoria(categoria.idCategoria);
                }
            });
        })

        categoryIcons.append(editBtn, deleteBtn);

        categoryHeader.append(titleIconGroup, categoryIcons);

        const prizesList = document.createElement('div');
        prizesList.className = 'prizes-list gap-8px d-flex flex-column';

        categoria.premios.forEach(premio => {
            const nuevoPremio = document.createElement('prize-component');

            nuevoPremio.setData({
                idPremio: premio.idPremio,
                nombre: premio.nombre,
                incluyeDinero: premio.incluyeDinero,
                cantidadDinero: premio.cantidadDinero,
                incluyeObjetoAdicional: premio.incluyeObjetoAdicional,
                objetoAdicional: premio.objetoAdicional,
                removable: false
            });

            prizesList.appendChild(nuevoPremio);
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


cargarCategorias();