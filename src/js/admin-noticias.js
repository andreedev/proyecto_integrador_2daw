const searchInput = document.getElementById('searchInput');
const btnAgregarNoticia = document.getElementById('addNews');
const status = document.querySelector('status');
const modalNoticia = document.getElementById('modalNoticia');
const newsListContainer = document.getElementById('newsListContainer');
const primaryModalActionBtn = document.getElementById('primaryModalActionBtn');

// componentes
const tituloInput = document.getElementById('tituloInput');
const descripcionInput = document.getElementById('descripcionInput');
const fechaPublicacion = document.getElementById('fechaPublicacion');
const imagenInput = document.getElementById('imagenInput');
const tituloModal = document.getElementById('tituloModal');
const notification = document.getElementById('notification');
const pagination = document.getElementById('pagination');

let modoModal = 'agregar'; // 'agregar' o 'editar'
let idNoticiaActual = null;
let pageSize = 5;

// Event Listeners
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        cargarNoticias();
    }
});

btnAgregarNoticia.addEventListener('click', () => {
    abrirModal('agregar');
    modoModal = 'agregar';
    tituloModal.textContent = 'Agregar noticia';
});

pagination.addEventListener('page-change', async (event) => {
    await cargarNoticias();
});


primaryModalActionBtn.addEventListener('click', async () => {
    if (modoModal === 'agregar') {
        if (!tituloInput.validate() || !descripcionInput.validate() || !imagenInput.validate()) {
            return;
        }
        const idArchivoFinal = await imagenInput.uploadIfNeeded();

        const response = await crearNoticia(
            tituloInput.value.trim(),
            descripcionInput.value.trim(),
            fechaPublicacion.getISOValue(),
            idArchivoFinal
        );

        if (response.status === 'success') {
            modalNoticia.close();
            cargarNoticias();
        } else {
            alert('Error al agregar la noticia: ' + response.message);
        }
    } else if (modoModal === 'editar') {
        // aqui falla
        if (!tituloInput.validate() || !descripcionInput.validate() || !imagenInput.validate()) {
            return;
        }
        const idArchivoFinal = await imagenInput.uploadIfNeeded();

        const response = await actualizarNoticia(
            idNoticiaActual,
            tituloInput.value.trim(),
            descripcionInput.value.trim(),
            fechaPublicacion.getISOValue(),
            idArchivoFinal
        );

        if (response.status === 'success') {
            modalNoticia.close();
            cargarNoticias();
        }
    }
});

function abrirModal(tipo, noticia = null) {
    modalNoticia.open();
    if (tipo === 'editar' && noticia) {
        tituloInput.setValue(noticia.nombreNoticia, true);
        descripcionInput.setValue(noticia.descripcionNoticia, true);
        fechaPublicacion.setDate(noticia.fechaNoticia);
        imagenInput.setAttachedMode(noticia.rutaImagenNoticia, noticia.idArchivoImagenNoticia);
        primaryModalActionBtn.textContent = 'Guardar cambios';
        tituloModal.textContent = 'Editar noticia';
    } else {
        tituloInput.clear();
        descripcionInput.clear();
        fechaPublicacion.clear();
        imagenInput.clear();
        primaryModalActionBtn.textContent = 'Agregar noticia';
    }
}

/**
 * Renderiza las noticias con construcción nativa del DOM
 */
function renderizarNoticias(noticias) {
    newsListContainer.innerHTML = '';

    noticias.forEach(noticia => {
        const noticiaDate = convertISOStringToDate(noticia.fechaNoticia);

        const statusClass = noticia.estadoNoticia=='Publicada' ? 'text-neutral-02' : 'text-success';
        const iconStatusClass = noticia.estadoNoticia=='Programada' ? 'icon-sand-clock' : 'icon-small-check';
        const fechaFormateada = humanizeDate(noticiaDate);

        const noticiaElement = document.createElement('div');
        noticiaElement.classList.add('news-container');

        const flexWrapper = document.createElement('div');
        flexWrapper.className = 'd-flex flex-column flex-md-row align-items-center';

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'news-image';
        const img = document.createElement('img');
        img.className = 'news-img';
        img.src = noticia.rutaImagenNoticia;
        img.alt = `Imagen de la noticia ${noticia.id}`;
        imageWrapper.appendChild(img);

        const infoContent = document.createElement('div');
        infoContent.className = 'w-100 p-16px position-relative gap-8px d-flex flex-column';

        const btnEditar = document.createElement('span');
        btnEditar.className = 'position-absolute icon-pencil w-24px h-24px bg-neutral-02 top-12px right-48px cursor-pointer hover-scale-1-10';
        btnEditar.addEventListener('click', () => {
            console.log('Editando noticia:', noticia.id);
            abrirModal('editar', noticia);
            modoModal = 'editar';
            idNoticiaActual = noticia.idNoticia;
        });

        const btnEliminar = document.createElement('span');
        btnEliminar.className = 'position-absolute icon-trash w-24px h-24px bg-primary-03 top-12px right-14px cursor-pointer hover-scale-1-10';
        btnEliminar.addEventListener('click', async () => {
            notification.show("¿Estás segur@ de eliminar la noticia?", {
                confirm: true,
                confirmText: "Eliminar",
                onConfirm: async () => {
                    const response = await eliminarNoticia(noticia.idNoticia);
                    if (response.status === 'success') cargarNoticias();
                    if (response.status === 'error') notification.show("Error al eliminar la noticia: " + response.message);
                }
            });
        });

        infoContent.innerHTML = `
            <div class="news-header">
                <p class="fs-20px fw-600">${noticia.nombreNoticia}</p>
            </div>
            <div class="d-flex flex-column gap-12px w-auto">
                <div class="d-flex align-items-center gap-12px">
                    <span class="icon-calendar bg-neutral-03 w-20px h-20px"></span>
                    <span>${fechaFormateada}</span>
                </div>
                <div class="d-flex align-items-center gap-12px">
                    <span class="${iconStatusClass} bg-neutral-03 w-20px h-20px"></span>
                    <div class="${statusClass}">${noticia.estadoNoticia}</div>
                </div>
            </div>
            <p class="news-paragraph">${noticia.descripcionNoticia}</p>
        `;

        infoContent.appendChild(btnEditar);
        infoContent.appendChild(btnEliminar);

        flexWrapper.appendChild(imageWrapper);
        flexWrapper.appendChild(infoContent);

        noticiaElement.appendChild(flexWrapper);
        newsListContainer.appendChild(noticiaElement);
    });
}

async function cargarNoticias() {
    const filtroNombre = searchInput.value.trim();
    const response = await listarNoticias(filtroNombre, pagination.currentPage, pageSize);
    if (response.status !== 'success') throw new Error('Error al cargar las noticias');
    const list = response.data.list;
    const totalRecords = response.data.totalRecords;
    const totalPages = response.data.totalPages;
    pagination.setAttribute('total-pages',totalPages);
    renderizarNoticias(list);
}


cargarNoticias();