const newsContainer = document.querySelector('.news-container');
const searchInput = document.getElementById('searchInput');
const btnAgregarNoticia = document.getElementById('addNews');
const noticiaContainer = document.querySelector('.one-news');
const imagenNoticia = document.querySelector('.news-image img');
const newsTitle = document.querySelector('.news-title')
const newsDate = document.querySelector('.news-date');
const newsStatus = document.querySelector('.news-status');
const iconStatus = document.querySelector('.icon-status');
const status = document.querySelector('status');
const newsParagraph = document.querySelector('.news-paragraph');


/*  Modal Agregar Noticia  */
const modalAgregarNoticia = document.getElementById('addModal');
const cerrarModal = document.getElementById('closeAddModal');
const btnCancelModal = document.getElementById('btnCancelModalAdd');
const iconoDeleteImg = document.getElementById('deleteImg');

const posterInput= document.getElementById('newsImageInput');
const imagenAceptadaCard= document.getElementById('imgAccepted');
const mensajeError = document.getElementById('errorMessage');

const errorNewsTitleInput = document.getElementById('errorNewsTitleInput');
const errorNewsDescriptionInput = document.getElementById('errorNewsDescriptionInput');
const errorNewsDateInput = document.getElementById('errorNewsDateInput');

const newsTitleInput = document.getElementById('newsTitleInput');
const newsDescriptionInput = document.getElementById('newsDescriptionInput');
const newsDateInput = document.getElementById('newsDateInput');

const newsListContainer = document.getElementById('newsListContainer');


//Validaciones para Agregar
newsTitleInput.addEventListener('blur', () => {
    const titleValue = newsTitleInput.value.trim();
    if (titleValue === '') {
        errorNewsTitleInput.textContent = 'El título de la noticia no puede estar vacío.';
    } else {
        errorNewsTitleInput.textContent = '';
    }
});

newsDescriptionInput.addEventListener('blur', () => {
    const descriptionValue = newsDescriptionInput.value.trim();
    if (descriptionValue === '') {
        errorNewsDescriptionInput.textContent = 'La descripción de la noticia no puede estar vacía.';
    } else {
        errorNewsDescriptionInput.textContent = '';
    }
});

newsDateInput.addEventListener('blur', () => {
    const dateValue = newsDateInput.value.trim();
    if (dateValue === '') {
        errorNewsDateInput.textContent = 'La fecha de la noticia no puede estar vacía.';
    } else {
        errorNewsDateInput.textContent = '';
    }
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        cargarNoticias();
    }
});



// Lógica para abrir y cerrar modales

btnAgregarNoticia.addEventListener('click', () => {
    modalAgregarNoticia.showModal()
});


cerrarModal.addEventListener('click', () => {
    modalAgregarNoticia.close()
    // Limpiar campos y errores al cerrar el modal
    newsTitleInput.value = '';
    newsDescriptionInput.value = '';
    newsDateInput.value = '';
    document.getElementById('errorNewsTitleInput').textContent = '';
    document.getElementById('errorNewsDescriptionInput').textContent = '';
    document.getElementById('errorNewsDateInput').textContent = '';
});

btnCancelModal.addEventListener('click', () => {
    modalAgregarNoticia.showModal()
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