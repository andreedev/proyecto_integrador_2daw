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

const newsTitleInput = document.getElementById('newsTitleInput');
const newsDescriptionInput = document.getElementById('newsDescriptionInput');
const newsDateInput = document.getElementById('newsDateInput');

/*  Modal Agregar Noticia  */
const modalAgregarNoticia = document.getElementById('addModal');
const cerrarModal = document.getElementById('closeAddModal');
const btnCancelModal = document.getElementById('btnCancelModalAdd');
const btnAddModal = document.getElementById('btnAddModalAdd');
const iconoDeleteImg = document.getElementById('deleteImg');

const posterInput= document.getElementById('newsImageInput');
const imagenAceptadaCard= document.getElementById('imgAccepted');
const mensajeError = document.getElementById('errorMessage');


/*  Eventos Modal Editar Noticia  */
const modalEditarNoticia = document.getElementById('editModal');
const cerrarModalEdit = document.getElementById('closeEditModal');
const btnCancelModalEdit = document.getElementById('btnCancelModalEdit');
const btnAddModalEdit = document.getElementById('btnAddModalEdit');
const iconoDeleteImgEdit = document.getElementById('deleteImgEdit');

const poesterInputEdit= document.getElementById('newsImageInputEdit');
const imagenAceptadaCardEdit= document.getElementById('imgAcceptedEdit');
const mensajeErrorEdit = document.getElementById('errorMessageEdit');


//Validaciones

newsTitleInput.addEventListener('blur', () => {
    const titleValue = newsTitleInput.value.trim();
    const errorSpan = document.getElementById('errorNewsTitleInput');
    if (titleValue === '') {
        errorSpan.textContent = 'El título de la noticia no puede estar vacío.';
    } else {
        errorSpan.textContent = '';
    }
});

newsDescriptionInput.addEventListener('blur', () => {
    const descriptionValue = newsDescriptionInput.value.trim();
    const errorSpan = document.getElementById('errorNewsDescriptionInput');
    if (descriptionValue === '') {
        errorSpan.textContent = 'La descripción de la noticia no puede estar vacía.';
    } else {
        errorSpan.textContent = '';
    }
});

newsDateInput.addEventListener('blur', () => {
    const dateValue = newsDateInput.value.trim();
    const errorSpan = document.getElementById('errorNewsDateInput');    
    if (dateValue === '') {
        errorSpan.textContent = 'La fecha de la noticia no puede estar vacía.';
    } else {
        errorSpan.textContent = '';
    }
});

posterInput.addEventListener('change', () => {
    if (posterInput.files.length === 0) {
        mensajeError.textContent = 'Debes seleccionar una imagen para la noticia.';
    } else {
        mensajeError.textContent = '';
    }
});

poesterInputEdit.addEventListener('change', () => {
    if (poesterInputEdit.files.length === 0) {
        mensajeErrorEdit.textContent = 'Debes seleccionar una imagen para la noticia.';
    } else {
        mensajeErrorEdit.textContent = '';
    }
});





// Lógica para abrir y cerrar modales

btnAgregarNoticia.addEventListener('click', () => {
    modalAgregarNoticia.classList.remove('hidden-force');
});


cerrarModal.addEventListener('click', () => {
    modalAgregarNoticia.classList.add('hidden-force');
    // Limpiar campos y errores al cerrar el modal
    newsTitleInput.value = '';
    newsDescriptionInput.value = '';
    newsDateInput.value = '';
    document.getElementById('errorNewsTitleInput').textContent = '';
    document.getElementById('errorNewsDescriptionInput').textContent = '';
    document.getElementById('errorNewsDateInput').textContent = '';
});

btnCancelModal.addEventListener('click', () => {
    modalAgregarNoticia.classList.add('hidden-force');
    // Limpiar campos y errores al cancelar el modal
    newsTitleInput.value = '';
    newsDescriptionInput.value = '';
    newsDateInput.value = '';
    document.getElementById('errorNewsTitleInput').textContent = '';
    document.getElementById('errorNewsDescriptionInput').textContent = '';
    document.getElementById('errorNewsDateInput').textContent = '';
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
    // Limpiar campos y errores al cerrar el modal
    newsTitleInput.value = '';
    newsDescriptionInput.value = '';
    newsDateInput.value = '';
    document.getElementById('errorNewsTitleInput').textContent = '';
    document.getElementById('errorNewsDescriptionInput').textContent = '';
    document.getElementById('errorNewsDateInput').textContent = '';
});

btnCancelModalEdit.addEventListener('click', () => {
    modalEditarNoticia.classList.add('hidden-force');
    // Limpiar campos y errores al cancelar el modal
    newsTitleInput.value = '';
    newsDescriptionInput.value = '';
    newsDateInput.value = '';
    document.getElementById('errorNewsTitleInput').textContent = '';
    document.getElementById('errorNewsDescriptionInput').textContent = '';
    document.getElementById('errorNewsDateInput').textContent = '';
});

iconoDeleteImg.addEventListener('click', () => {
    imagenAceptadaCard.src = '';
    imagenAceptadaCard.classList.add('hidden-force');
    posterInput.value = '';
});

iconoDeleteImgEdit.addEventListener('click', () => {
    imagenAceptadaCardEdit.src = '';
    imagenAceptadaCardEdit.classList.add('hidden-force');
    poesterInputEdit.value = '';
});

// Lógica para el input personalizado del logo del patrocinador

function setupDropZone(zoneId, inputId,cardId, nameSpanId, sizeSpanId, removeBtnId, errorSpanID, acceptedFormats, maxSizeMB) {
    const dropZone = document.getElementById(zoneId);
    const fileInput = document.getElementById(inputId);
    const fileCard = document.getElementById(cardId);
    const nameSpan = document.getElementById(nameSpanId);
    const sizeSpan = document.getElementById(sizeSpanId);
    const removeBtn = document.getElementById(removeBtnId);
    const errorSpan = document.getElementById(errorSpanID);

    const triggerShake = () => {
        dropZone.classList.add('shake-error');
        setTimeout(() => {
            dropZone.classList.remove('shake-error');
        }, 400);
    };

    const validateFile = (file) => {
        const fileName = file.name.toLowerCase();
        const isInvalidType = !acceptedFormats.some(format => fileName.endsWith(format.toLowerCase()));

        if (isInvalidType) {
            errorSpan.textContent = `Formato no válido. Formatos aceptados: ${acceptedFormats.join(', ')}`;
            triggerShake();
            return false;
        }

        if (file.size > maxSizeMB) {
            errorSpan.textContent = `El archivo excede el tamaño máximo de ${maxSizeMB} MB.`;
            triggerShake();
            return false;
        }

        return true;

    };

    const updateUI = (file) => {
        if(!file)return;

        dropZone.classList.add('hidden-force');
        fileCard.classList.remove('hidden-force');
        nameSpan.textContent = file.name;
        sizeSpan.textContent = formatBytes(file.size);


    };

    const clearFile = () => {
        fileInput.value = '';
        fileCard.classList.add('hidden-force');
        dropZone.classList.remove('hidden-force');
        errorSpan.textContent = '';
    };

    dropZone.addEventListener('click', () => fileInput.click());

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearFile();
    });

    ['dragenter', 'dragover'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
            e.preventDefault();
        });
    });

    ['dragleave', 'drop'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
            e.preventDefault();
        });
    });

    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length && validateFile(files[0])) {
            fileInput.files = files;
            updateUI(files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            if (validateFile(fileInput.files[0])) {
                updateUI(fileInput.files[0]);
            } else {
                fileInput.value = "";
            }
        }
    });

}

function formatBytes(bytes,decimals = 2 ) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/*Para el modal de agregar noticia*/
setupDropZone(
    'posterDropZoneAdd',
    'newsImageInput',
    'imgAccepted',
    'imgName',
    'imgSize',
    'deleteImg',
    'errorMessage',
    ['png', '.jpg', '.jpeg'],
    5 * 1024 * 1024 
);

/*Para el modal de editar noticia*/
setupDropZone(
    'posterDropZoneEdit',   
    'newsImageInputEdit',
    'imgAcceptedEdit',
    'imgNameEdit',
    'imgSizeEdit',  
    'deleteImgEdit',
    'errorMessageEdit',
    ['png', '.jpg', '.jpeg'],
    5 * 1024 * 1024 
);  