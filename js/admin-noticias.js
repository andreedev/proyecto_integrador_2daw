const newsContainer = document.querySelector('.news-container');
const searchBar = document.getElementById('searchBar');
const btnAgregarNoticia = document.getElementById('addNews');
const noticiaContainer = document.querySelector('.one-news');
const imagenNoticia = document.querySelector('.news-image img');
const newsTitle = document.querySelector('.news-title');
const btnEditarNoticia = document.querySelector('.icon-edit-news');
const btnEliminarNoticia = document.querySelector('.icon-delete-news');
const newsDate = document.querySelector('.news-date');
const newsStatus = document.querySelector('.news-status');
const iconStatus = document.querySelector('.icon-status');
const status = document.querySelector('status');
const newsParagraph = document.querySelector('.news-paragraph');


/*  Modal Agregar Noticia  */
const modalAgregarNoticia = document.getElementById('addModal');
const cerrarModal = document.getElementById('closeAddModal');
const btnCancelModal = document.getElementById('btnCancelModalAdd');
const btnAddModal = document.getElementById('btnAddModalAdd');


/*  Eventos Modal Editar Noticia  */
const modalEditarNoticia = document.getElementById('editModal');
const cerrarModalEdit = document.getElementById('closeEditModal');
const btnCancelModalEdit = document.getElementById('btnCancelModalEdit');
const btnAddModalEdit = document.getElementById('btnAddModalEdit');




btnAgregarNoticia.addEventListener('click', () => {
    modalAgregarNoticia.classList.remove('hidden-force');
});


cerrarModal.addEventListener('click', () => {
    modalAgregarNoticia.classList.add('hidden-force');
});

btnCancelModal.addEventListener('click', () => {
    modalAgregarNoticia.classList.add('hidden-force');
});

btnEliminarNoticia.addEventListener('click', () => {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar esta noticia?');
    if (confirmar) {
        alert('Noticia eliminada.');
        newsContainer.remove();
        
    } else {
        alert('Operación cancelada.');
    }
});


btnEditarNoticia.addEventListener('click', () => {
    modalEditarNoticia.classList.remove('hidden-force');
});

cerrarModalEdit.addEventListener('click', () => {
    modalEditarNoticia.classList.add('hidden-force');
});

btnCancelModalEdit.addEventListener('click', () => {
    modalEditarNoticia.classList.add('hidden-force');
});







