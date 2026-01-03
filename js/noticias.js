/*DATOS DE LAS NOTICIAS*/
const newsData = {
    1: {
        title: "Título de la noticia 1",
        subtitle: "Subtítulo de la noticia",
        content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Curabitur blandit tempus porttitor.</p>
        `
    },
    2: {
        title: "Título de la noticia 2",
        subtitle: "Subtítulo de la noticia",
        content: `
            <p>Donec ullamcorper nulla non metus auctor fringilla.</p>
            <p>Cras justo odio, dapibus ac facilisis in.</p>
            <p>Morbi leo risus, porta ac consectetur ac.</p>
        `
    },
    3: {
        title: "Título de la noticia 3",
        subtitle: "Subtítulo de la noticia",
        content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Integer posuere erat a ante venenatis dapibus.</p>
        `
    },
    4: {
        title: "Título de la noticia 4",
        subtitle: "Subtítulo de la noticia",
        content: `
            <p>Donec ullamcorper nulla non metus auctor fringilla.</p>
            <p>Cras justo odio, dapibus ac facilisis in.</p>
            <p>Morbi leo risus, porta ac consectetur ac.</p>
        `
    }
};

/* CÓDIGO PARA AMBAS PÁGINAS*/
document.addEventListener("DOMContentLoaded", () => {

    /*PÁGINA LISTA DE NOTICIAS*/
    const newsItems = document.querySelectorAll(".news-item");

    if (newsItems.length > 0) {
        newsItems.forEach(item => {
            item.style.cursor = "pointer";

            item.addEventListener("click", () => {
                localStorage.setItem("selectedNews", item.dataset.id);
                window.location.href = "noticia.html";
            });
        });
    }


    /* PÁGINA DETALLE DE NOTICIA*/
    const detailContainer = document.getElementById("news-detail");

    if (detailContainer) {
        const id = localStorage.getItem("selectedNews");
        const news = newsData[id];

        if (!news) {
            detailContainer.innerHTML = "<p>Noticia no encontrada</p>";
            return;
        }

        detailContainer.innerHTML = `
            <article class="news-full">
                <h1>${news.title}</h1>
                <h2>${news.subtitle}</h2>
                <div class="news-content">
                    ${news.content}
                </div>
            </article>
        `;
    }
});
