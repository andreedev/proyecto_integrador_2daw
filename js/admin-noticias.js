const searchInput = document.getElementById('searchInput');
const btnAgregarNoticia = document.getElementById('addNews');
const status = document.querySelector('status');
const modalNoticia = document.getElementById('modalNoticia');
const newsListContainer = document.getElementById('newsListContainer');
const primaryModalActionBtn = document.getElementById('primaryModalActionBtn');

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        cargarNoticias();
    }
});

btnAgregarNoticia.addEventListener('click', () => {
    modalNoticia.showModal()
});

primaryModalActionBtn.addEventListener('click', async () => {

});


/**
 * Renderiza las noticias
 */
function renderizarNoticias(noticias) {
    newsListContainer.innerHTML = '';
    noticias.forEach(noticia => {
        const noticiaDate = convertISOStringToDate(noticia.fechaNoticia)
        const publicada = noticiaDate> new Date();
        let estado = '';
        let statusClass = '';
        let iconClass = '';
        if (!publicada){
            estado = 'Programada';
            statusClass = 'text-neutral-02';
            iconClass = 'icon-sand-clock';
        } else {
            estado = 'Publicado';
            statusClass = 'text-success';
            iconClass = 'icon-small-check';
        }


        const fechaFormateada = humanizeDate(noticiaDate);

        const noticiaElement = document.createElement('div');
        noticiaElement.classList.add('news-container');
        noticiaElement.innerHTML = `
            <div class="d-flex flex-column flex-md-row align-items-center">
                <div class="news-image">
                    <img class="news-img" src="${noticia.rutaImagenNoticia}" alt="Imagen de la noticia ${noticia.id}">
                </div>
                <div class="w-100 p-16px position-relative gap-8px d-flex flex-column">
                    <div class="news-header">
                        <p class="fs-20px fw-600">${noticia.nombreNoticia}</p>
                    </div>
                    <div class="d-flex flex-column gap-12px w-auto">
                        <div class="d-flex align-items-center gap-12px">
                            <span class="icon-calendar bg-neutral-03 w-20px h-20px"></span>
                            <span>${fechaFormateada}</span>
                        </div>
                        <div class="d-flex align-items-center gap-12px">
                            <span class="${iconClass} bg-neutral-03 w-20px h-20px"></span>
                            <div class="${statusClass}">${estado}</div>
                        </div>
                    </div>
                    <p class="news-paragraph">${noticia.descripcionNoticia}</p>
                    <span class="position-absolute icon-pencil w-24px h-24px bg-neutral-02 top-12px right-48px cursor-pointer hover-scale-1-10"></span>
                    <span class="position-absolute icon-trash  w-24px h-24px bg-primary-03 top-12px right-14px cursor-pointer hover-scale-1-10"></span>
                </div>
            </div>
        `;
        newsListContainer.appendChild(noticiaElement);
    });
}

async function cargarNoticias() {
    const filtroNombre = searchInput.value.trim();
    const response = await listarNoticias(filtroNombre);
    if (response.status !== 'success') throw new Error('Error al cargar las noticias');
    renderizarNoticias(response.data);
}


cargarNoticias();