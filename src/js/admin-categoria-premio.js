const modalActualizarCategoria = document.getElementById('modalActualizarCategoria');
const modalCrearCategoria = document.getElementById('modalCrearCategoria');
const categoriesGrid = document.getElementById('categoriesGrid');
const notification = document.getElementById("notification");
const pagination = document.getElementById("pagination");
const btnOpenCreateCategoryModal = document.getElementById("btnOpenCreateCategoryModal");
const btnCrear = document.getElementById("btnCrear");
const prizeManagerCrear = document.getElementById("prizeManagerCrear");
const prizeManagerActualizar = document.getElementById("prizeManagerActualizar");
const nombreCategoriaInputCrear = document.getElementById("nombreCategoriaInputCrear");
const nombreCategoriaActualizar = document.getElementById("nombreCategoriaActualizar");
const btnActualizar = document.getElementById("btnActualizar");

let pageSize = 4;
let categoriaSeleccionada = null;

btnOpenCreateCategoryModal.addEventListener('click', () => {
    modalCrearCategoria.open();
});

btnCrear.addEventListener('click', () => {
    handleCrearCategoria();
});

btnActualizar.addEventListener('click', () => {
    handleActualizarCategoria();
});

pagination.addEventListener('page-change', async (e) => {
    await cargarCategorias();
});

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
            categoriaSeleccionada = categoria;
            e.stopPropagation()
            renderizarModalActualizarCategoria(categoria);
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

            const data = {
                idPremio: premio.idPremio,
                nombre: premio.nombre,
                incluyeDinero: premio.incluyeDinero,
                cantidadDinero: premio.cantidadDinero,
                incluyeObjetoAdicional: premio.incluyeObjetoAdicional,
                objetoAdicional: premio.objetoAdicional,
                removable: false
            };
            nuevoPremio.setData(data);

            prizesList.appendChild(nuevoPremio);
        });

        categoryCard.append(categoryHeader, prizesList);

        categoriesGrid.appendChild(categoryCard);
    });
}


async function handleCrearCategoria() {
    const validateName = nombreCategoriaInputCrear.validate().valid;
    const premios = prizeManagerCrear.getData();

    if (!validateName) {
        return;
    }
    if (premios.length === 0) {
        notification.show("La categoría debe tener al menos un premio.");
        return;
    }

    const nombre = nombreCategoriaInputCrear.value.trim();

    const response = await agregarCategoriaConPremios(nombre, premios);
    if (response.status === 'success'){
        notification.show("Categoría creada correctamente");
        modalCrearCategoria.close();
        nombreCategoriaInputCrear.clear();
        prizeManagerCrear.clear();
    } else {
        notification.show(response.message);
    }
    await cargarCategorias();
}

function renderizarModalActualizarCategoria(categoria) {
    nombreCategoriaActualizar.setValue(categoria.nombre, true);
    categoria.premios.forEach(premio => {
        premio.removable = true;
    });
    prizeManagerActualizar.setData(categoria.premios);
    modalActualizarCategoria.open();
}

async function handleActualizarCategoria() {
    const validateName = nombreCategoriaActualizar.validate().valid;
    const premios = prizeManagerActualizar.getData();
    if (!validateName) {
        return;
    }
    if (premios.length === 0) {
        notification.show("La categoría debe tener al menos un premio.");
        return;
    }

    const nombre = nombreCategoriaActualizar.value.trim();

    btnActualizar.disabled = true;

    const response = await editarCategoriaConPremios(categoriaSeleccionada.idCategoria, nombre, premios)
    ç
    btnActualizar.disabled = false;

    if (response.status === 'success'){
        notification.show("Categoría actualizada correctamente");
        nombreCategoriaActualizar.clear();
        prizeManagerActualizar.clear();
        modalActualizarCategoria.close();
    } else {
        notification.show(response.message);
    }
    await cargarCategorias();
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