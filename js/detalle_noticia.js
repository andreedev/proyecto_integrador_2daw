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