const iconHome = document.getElementById('iconHome');
const newsContainer = document.getElementById('newsContainer');
const pagination = document.getElementById('pagination');
const notification = document.getElementById('notification');

let pageSize = 8;

iconHome.addEventListener('click', () => {
    window.location.href = 'index.html';
});

function renderizarNoticias(noticias) {
    newsContainer.replaceChildren();

    noticias.forEach(noticia => {
        const noticiaElemento = document.createElement('div');
        noticiaElemento.classList.add('news-post');

        const imagenNoticia = document.createElement('img');
        imagenNoticia.className = 'img-noticia aspect-ratio-4-3 object-fit-cover';
        imagenNoticia.src = noticia.rutaImagenNoticia;
        imagenNoticia.alt = 'Imagen noticia';

        const contenidoNoticia = document.createElement('div');
        contenidoNoticia.classList.add('news-post-content');

        const fechaTituloTexto = document.createElement('div');
        fechaTituloTexto.classList.add('news-date-title-text');

        const fechaNoticia = document.createElement('span');
        fechaNoticia.classList.add('news-date');
        fechaNoticia.textContent = humanizeDate(convertISOStringToDate(noticia.fechaNoticia));

        const tituloNoticia = document.createElement('div');
        tituloNoticia.classList.add('news-title');
        tituloNoticia.textContent = noticia.nombreNoticia;

        const descripcionNoticia = document.createElement('div');
        descripcionNoticia.classList.add('news-description');
        descripcionNoticia.textContent = noticia.descripcionNoticia;

        fechaTituloTexto.appendChild(fechaNoticia);
        fechaTituloTexto.appendChild(tituloNoticia);
        fechaTituloTexto.appendChild(descripcionNoticia);

        contenidoNoticia.appendChild(fechaTituloTexto);

        noticiaElemento.appendChild(imagenNoticia);
        noticiaElemento.appendChild(contenidoNoticia);

        noticiaElemento.addEventListener('click', () => {
            window.location.href = `detalle_noticia.html?id=${noticia.idNoticia}`;
        });

        newsContainer.appendChild(noticiaElemento);
    });
}

pagination.addEventListener('page-change', async (event) => {
    await cargarNoticias();
});

async function cargarNoticias() {
    const listarNoticiasResponse = await listarNoticias('', pagination.currentPage, pageSize);
    if (listarNoticiasResponse.status === 'success') {
        const list = listarNoticiasResponse.data.list;
        const totalPages = listarNoticiasResponse.data.totalPages;
        pagination.setAttribute('total-pages', totalPages);
        renderizarNoticias(list);
    }
}

cargarNoticias();