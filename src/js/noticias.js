const iconHome = document.getElementById('iconHome');
const newsContainer = document.getElementById('newsContainer');

iconHome.addEventListener('click', () => {
    window.location.href = 'index.html';
});

function renderizarNoticias(noticias) {
    newsContainer.replaceChildren();

    noticias.forEach(noticia => {
        const noticiaElemento = document.createElement('div');
        noticiaElemento.classList.add('news-post');

        const imagenNoticia = document.createElement('img');
        imagenNoticia.classList.add('img-noticia');
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
        tituloNoticia.textContent = noticia.titulo;

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

async function cargarYRenderizarNoticias() {
    const listarNoticiasResponse = await listarNoticias('');
    if (listarNoticiasResponse.status === 'success') {
        const noticias = listarNoticiasResponse.data;
        renderizarNoticias(noticias);
    }
}

cargarYRenderizarNoticias();