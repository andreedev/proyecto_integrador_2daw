const iconHome = document.getElementById('iconHome');
const newsPost = document.getElementById('newsPost');
const imgNoticia = document.getElementById('imgNoticia');
const newsDate = document.getElementById('newsDate');
const newsTitle = document.getElementById('newsTitle');
const newsDescription = document.getElementById('newsDescription');

iconHome.addEventListener('click', () => {
    window.location.href = 'index.html';
});

newsPost.addEventListener('click', () => {
    window.location.href = 'detalle_noticia.html';

});