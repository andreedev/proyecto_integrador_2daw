const iconCasa = document.getElementById('iconCasa');
const noticias = document.getElementById('noticias');
const smallTitleNoticia = document.getElementById('smallTitleNoticia');

const noticiaTitle = document.getElementById('noticiaTitle');
const noticiaDate = document.getElementById('noticiaDate');

const imgNoticiaDetailed = document.getElementById('imgNoticiaDetailed');
const noticiaDescription = document.getElementById('noticiaDescription');

iconCasa.addEventListener('click', () => {
    window.location.href = 'index.html';
});

noticias.addEventListener('click', () => {
    window.location.href = 'noticias.html';
});

function renderizarNoticia(noticia) {
    smallTitleNoticia.textContent = noticia.nombreNoticia;
    noticiaTitle.textContent = noticia.nombreNoticia;
    noticiaDate.textContent = humanizeDate(convertISOStringToDate(noticia.fechaNoticia));
    imgNoticiaDetailed.src = noticia.rutaImagenNoticia;
    imgNoticiaDetailed.alt = 'Imagen noticia';
    noticiaDescription.textContent = noticia.descripcionNoticia;
}


async function cargarYRenderizarNoticia() {
    const urlParams = new URLSearchParams(window.location.search);
    const idNoticia = urlParams.get('id');

    if (idNoticia) {
        const obtenerNoticiaResponse = await obtenerNoticiaPorId(idNoticia);
        if (obtenerNoticiaResponse.status === 'success') {
            const noticia = obtenerNoticiaResponse.data;
            renderizarNoticia(noticia);
        }
    }
}

cargarYRenderizarNoticia();