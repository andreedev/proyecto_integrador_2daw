const btnCrearEdicionAnterior = document.getElementById('btnCrearEdicionAnterior');
const modalCrearEdicionAnterior = document.getElementById('modalCrearEdicionAnterior');
const modalVerEdicionAnterior = document.getElementById('modalVerEdicionAnterior');
const modalEditarEdicionAnterior = document.getElementById('modalEditarEdicionAnterior');
const notificador = document.getElementById('notificador');
const edicionesContainer = document.getElementById('edicionesContainer');
const paginacion = document.getElementById('paginacion');
const btnConfirmarCrearEdicion = document.getElementById('btnConfirmarCrearEdicion');
const inputYearCrearEdicion = document.getElementById('inputYearCrearEdicion');
const inputNumParticipantesCrearEdicion = document.getElementById('inputNumParticipantesCrearEdicion');
const descripcionInputCrearEdicion = document.getElementById('descripcionInputCrearEdicion');
const fileInputCrearEdicion = document.getElementById('fileInputCrearEdicion');
const btnAbrirCardAgregarGanador = document.getElementById('btnAbrirCardAgregarGanador');
const cardAgregarNuevoGanador = document.getElementById('cardAgregarNuevoGanador');
const cerrarCardAgregarGanador = document.getElementById('cerrarCardAgregarGanador');
const btnAgregarGanador = document.getElementById('btnAgregarGanador');
const ganadoresContainer = document.getElementById('ganadoresContainer');
const inputNombreGanador = document.getElementById('inputNombreGanador');
const inputCategoriaGanador = document.getElementById('inputCategoriaGanador');
const inputPuestoGanador = document.getElementById('inputPuestoGanador');
const inputVideoGanador = document.getElementById('inputVideoGanador');
const indicadorGanadores = document.getElementById('indicadorGanadores');
const inputYearVerEdicion = document.getElementById('inputYearVerEdicion');
const inputNumParticipantesVerEdicion = document.getElementById('inputNumParticipantesVerEdicion');
const descripcionInputVerEdicion = document.getElementById('descripcionInputVerEdicion');
const galeriaEdicionCarousel = document.getElementById('galeriaEdicionCarousel');
const galeriaGanadoresCarousel = document.getElementById('galeriaGanadoresCarousel');

let tipo = 'anterior';
let edicionSeleccionada = null;
let ganadores = [];

async function listarEdicionesAnteriores() {
    const response = await listarEdiciones(tipo, paginacion.currentPage);
    renderizarEdicionesAnteriores(response.data.list);
    paginacion.setAttribute('current-page', response.data.currentPage);
    paginacion.setAttribute('total-pages', response.data.totalPages);
}

paginacion.addEventListener('page-change', async (e) => {
    await listarEdicionesAnteriores();
});

btnCrearEdicionAnterior.addEventListener('click', () => {
    modalCrearEdicionAnterior.open();
});

btnAbrirCardAgregarGanador.addEventListener('click', () => {
    cardAgregarNuevoGanador.classList.remove('d-none');
    scrollToElement(cardAgregarNuevoGanador);
});

cerrarCardAgregarGanador.addEventListener('click', () => {
    cardAgregarNuevoGanador.classList.add('d-none');
});

btnConfirmarCrearEdicion.addEventListener('click', async () => {
    handleCrearEdicionAnterior();
});

btnAgregarGanador.addEventListener('click', () => {
    handleAgregarNuevoGanador();
});

/**
 * Maneja la adición de un nuevo ganador a la lista
 */
function handleAgregarNuevoGanador() {
    const validNombre = inputNombreGanador.validate().valid;
    const validCategoria = inputCategoriaGanador.validate().valid;
    const validPuesto = inputPuestoGanador.validate().valid;
    const validVideo = inputVideoGanador.validate();

    if (!validNombre || !validCategoria || !validPuesto || !validVideo) {
        return;
    }

    const nuevoGanador = {
        // Genera un ID único
        id: Date.now(),
        nombre: inputNombreGanador.value.trim(),
        categoria: inputCategoriaGanador.value.trim(),
        premio: inputPuestoGanador.value.trim(),
        video: inputVideoGanador.getData()
    };
    ganadores.push(nuevoGanador);

    renderizarNuevoCardGanador(nuevoGanador);

    // Limpiar los campos del formulario
    inputNombreGanador.clear()
    inputCategoriaGanador.clear();
    inputPuestoGanador.clear();
    inputVideoGanador.clear();

    cardAgregarNuevoGanador.classList.add('d-none');
    actualizarIndicadorGanadores();
}

/**
 * Renderiza un nuevo card de ganador en el contenedor de ganadores
 * @param {Object} ganador - Objeto con los datos del ganador
 */
function renderizarNuevoCardGanador(ganador) {
    const ganadorDiv = document.createElement('div');
    ganadorDiv.classList.add('d-flex', 'flex-column', 'border', 'border-neutral-06', 'position-relative', 'p-16px', 'gap-16px', 'mb-16px');
    ganadorDiv.dataset.ganadorId = ganador.id;

    const createRow = (icon, text) => {
        const div = document.createElement('div');
        div.classList.add('d-flex', 'flex-row', 'gap-16px');
        div.innerHTML = `<span class="${icon} w-24px h-24px bg-neutral-01"></span><span class="fw-600">${text}</span>`;
        return div;
    };

    const fileComp = document.createElement('file-component');
    fileComp.setAttribute('label', 'Cortometraje o traíler del ganador');
    fileComp.setAttribute('id', `inputVideoGanadorCrearEdicion_${ganador.id}`);
    fileComp.setAttribute('accept', '.mp4,.mov,.avi');
    fileComp.setAttribute('required', '');

    const index = ganadores.findIndex(g => g.id === ganador.id);
    if (index !== -1) {
        ganadores[index].componentRef = fileComp;
    }

    const btnDelete = document.createElement('span');
    btnDelete.classList.add('icon-trash', 'bg-neutral-01', 'w-24px', 'h-24px', 'position-absolute', 'right-16px', 'top-16px', 'cursor-pointer', 'hover-scale-1-10');
    btnDelete.addEventListener('click', () => {
        ganadorDiv.remove();
        ganadores = ganadores.filter(g => g.id !== ganador.id);
        actualizarIndicadorGanadores();
    });

    ganadorDiv.append(
        createRow('icon-user-thick', ganador.nombre),
        createRow('icon-tag', ganador.categoria),
        createRow('icon-trophy', ganador.premio),
        fileComp,
        btnDelete
    );

    ganadoresContainer.appendChild(ganadorDiv);

    customElements.whenDefined('file-component').then(() => {
        const videoData = ganador.video;
        if (videoData.file instanceof File) {
            fileComp.setRawFile(videoData.file, false);
        }
    });

    actualizarIndicadorGanadores();
}

/**
 * Maneja la creación de una nueva edición anterior
 */
async function handleCrearEdicionAnterior() {
    const anioEdicionValid = inputYearCrearEdicion.validate().valid;
    const nroParticipantesValid = inputNumParticipantesCrearEdicion.validate().valid;
    const descripcionValid = descripcionInputCrearEdicion.validate().valid;
    const archivoValid = fileInputCrearEdicion.validate();

    if (!anioEdicionValid || !nroParticipantesValid || !descripcionValid || !archivoValid) {
        return;
    }

    if (ganadores.length === 0) {
        notificador.show("Debes agregar al menos un ganador");
        return;
    }

    try {
        // Subir archivos de galería
        const galleryIds = await fileInputCrearEdicion.uploadIfNeeded();

        // Subir videos de ganadores
        const ganadoresFinalData = await Promise.all(ganadores.map(async (g) => {
            const videoId = await g.componentRef.uploadIfNeeded();
            return {
                nombre: g.nombre,
                categoria: g.categoria,
                puesto: g.premio,
                idArchivoVideo: videoId
            };
        }));

        const anioEdicion= inputYearCrearEdicion.value
        const nroParticipantes= inputNumParticipantesCrearEdicion.value
        const descripcion= descripcionInputCrearEdicion.value
        const idsArchivosGaleria= galleryIds
        const listaGanadores= ganadoresFinalData
        const tipo= 'anterior'

        const response = await crearEdicion(anioEdicion, nroParticipantes, descripcion, idsArchivosGaleria, listaGanadores, tipo);
        if (response.status === "success"){
            notificador.show("Edición creada exitosamente");
            modalCrearEdicionAnterior.close();
            await listarEdicionesAnteriores();
            resetFormularioCrearEdicionAnterior();
        } else {
            notificador.show(`Error al crear la edición: ${response.message}`);
        }

    } catch (error) {
        console.error(error);
        notificador.show("Hubo un error al procesar la solicitud");
    }
}

/**
 * Renderiza las ediciones anteriores utilizando DOM nativo
 */
function renderizarEdicionesAnteriores(ediciones) {
    edicionesContainer.replaceChildren();

    ediciones.forEach(edicion => {
        const edicionDiv = document.createElement('div');
        edicionDiv.classList.add('d-flex', 'flex-column', 'gap-8px', 'border', 'border-neutral-06', 'bg-neutral-09', 'p-16px');
        edicionDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            edicionSeleccionada = edicion;
            handleVerEdicionAnterior();
            modalVerEdicionAnterior.open();
        });

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('d-flex', 'justify-space-between', 'p-8px', 'align-items-center');

        const title = document.createElement('p');
        title.classList.add('fs-32px', 'fw-600');
        title.textContent = `Edición ${edicion.anioEdicion}`;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('d-flex', 'gap-8px');

        const btnEdit = document.createElement('span');
        btnEdit.classList.add('icon-pencil', 'w-24px', 'h-24px', 'bg-neutral-02', 'hover-scale-1-10', 'cursor-pointer');
        btnEdit.addEventListener('click', (e) => {
            e.stopPropagation();
            edicionSeleccionada = edicion;
            handleEditarEdicionAnterior();
            modalEditarEdicionAnterior.open();
        });

        // Icono Eliminar
        const btnDelete = document.createElement('span');
        btnDelete.classList.add('icon-trash', 'w-24px', 'h-24px', 'bg-neutral-02', 'hover-scale-1-10', 'cursor-pointer');
        btnDelete.addEventListener('click', (e) => {
            e.stopPropagation();
            edicionSeleccionada = edicion;
            notificador.show(`¿Estás seguro de eliminar la edición ${edicion.anioEdicion}? Esta acción no se puede deshacer`, {
                confirm: true,
                confirmText: "Eliminar",
                onConfirm: () => {
                    handleEliminarEdicion();
                }
            });
        });

        actionsDiv.append(btnEdit, btnDelete);
        headerDiv.append(title, actionsDiv);

        const gridDiv = document.createElement('div');
        gridDiv.classList.add('d-grid', 'grid-template-columns-1', 'grid-md-template-columns-2', 'gap-16px', 'p-8px');

        const cardPart = document.createElement('div');
        cardPart.classList.add('d-flex', 'flex-row', 'gap-16px', 'bg-neutral-08', 'p-16px','p-md-24px', 'align-items-center');
        cardPart.innerHTML = `
            <span class="icon-users w-40px h-40px bg-neutral-02"></span>
            <div class="d-flex flex-column gap-4px">
                <p class="fs-14px fw-600 text-neutral-03">Participantes</p>
                <p class="fs-24px fw-600 text-neutral-02">${edicion.nroParticipantes}</p>
            </div>
        `;

        const cardGan = document.createElement('div');
        cardGan.classList.add('d-flex', 'flex-row', 'gap-16px', 'bg-neutral-08', 'p-16px','p-md-24px', 'align-items-center');
        cardGan.innerHTML = `
            <span class="icon-trophy w-40px h-40px bg-neutral-02"></span>
            <div class="d-flex flex-column gap-4px">
                <p class="fs-14px fw-600 text-neutral-03">Ganadores</p>
                <p class="fs-24px fw-600 text-neutral-02">${edicion.nroGanadores}</p>
            </div>
        `;

        const cardGal = document.createElement('div');
        cardGal.classList.add('d-flex', 'flex-row', 'gap-16px', 'bg-neutral-08', 'p-16px','p-md-24px', 'align-items-center');
        cardGal.innerHTML = `
            <span class="icon-video w-40px h-40px bg-neutral-02"></span>
            <div class="d-flex flex-column gap-4px">
                <p class="fs-14px fw-600 text-neutral-03">Galería fotográfica</p>
                <p class="fs-24px fw-600 text-neutral-02">${edicion.nroArchivos}</p>
            </div>
        `;

        const cardTipo = document.createElement('div');
        cardTipo.classList.add('d-flex', 'flex-row', 'gap-16px', 'bg-neutral-08', 'p-16px','p-md-24px', 'align-items-center');
        cardTipo.innerHTML = `
            <span class="icon-graduation-cap w-40px h-40px bg-neutral-02"></span>
            <div class="d-flex flex-column gap-4px">
                <p class="fs-14px fw-600 text-neutral-03">Tipo</p>
                <p class="fs-20px fw-600 text-neutral-02">Anterior</p>
            </div>
        `;

        gridDiv.append(cardPart, cardGan, cardGal, cardTipo);
        edicionDiv.append(headerDiv, gridDiv);
        edicionesContainer.appendChild(edicionDiv);
    });
}

function resetFormularioCrearEdicionAnterior() {
    inputYearCrearEdicion.clear();
    inputNumParticipantesCrearEdicion.clear();
    descripcionInputCrearEdicion.clear();
    fileInputCrearEdicion.clear();
    ganadores = [];
    ganadoresContainer.replaceChildren();
    actualizarIndicadorGanadores();
}

/**
 * Actualiza el indicador de número de ganadores
 */
function actualizarIndicadorGanadores() {
    indicadorGanadores.textContent = `${ganadores.length} ganadores`;
}


function handleVerEdicionAnterior() {
    inputYearVerEdicion.setValue(edicionSeleccionada.anioEdicion);
    inputNumParticipantesVerEdicion.setValue(edicionSeleccionada.nroParticipantes);
    descripcionInputVerEdicion.setValue(edicionSeleccionada.resumenEvento);

    renderizarCarouselGaleriaEdicion(edicionSeleccionada.archivos);
    renderizarCarouselGanadoresEdicion(edicionSeleccionada.ganadores);
}

function renderizarCarouselGaleriaEdicion(archivos) {
    const slides = archivos.map(archivo => {
        if (archivo.tipoArchivo === 'imagen') {
            return `<img src="${archivo.rutaArchivo}" alt="Imagen de la galería" class="w-100 h-auto object-cover">`;
        } else if (archivo.tipoArchivo === 'video') {
            return `
                <video-player-component
                    src="${archivo.rutaArchivo}"
                    class="w-100 h-auto object-cover"
                    ></video-player-component>
            `;
        }
    });
    galeriaEdicionCarousel.setSlides(slides);
}

function renderizarCarouselGanadoresEdicion(ganadores) {
    console.log(ganadores);
    const slides = ganadores.map(ganador => {
        return `
            <div class="d-flex flex-column gap-8px p-16px border border-neutral-06">
                <video-player-component
                    src="${ganador.rutaArchivoVideo}"
                    class="w-100 aspect-ratio-16-9 d-block"
                ></video-player-component>
                <div class="d-flex flex-column text-center">
                    <p class="fs-14px fw-600">${ganador.nombre}</p>
                    <p class="fs-12px fw-500 text-neutral-03">${ganador.categoria} - ${ganador.premio}</p>
                </div>
            </div>
        `;
    });
    galeriaGanadoresCarousel.setSlides(slides);
}


function handleEditarEdicionAnterior() {

}

function handleEliminarEdicion() {
    setTimeout(async () => {
        const response = await eliminarEdicion(edicionSeleccionada.idEdicion);
        if (response.status === 'success') {
            notificador.show(`La edición ${edicionSeleccionada.anioEdicion} ha sido eliminada exitosamente.`);
            await listarEdicionesAnteriores();
        } else {
            notificador.show(`Error al eliminar la edición: ${response.message}`);
        }
    }, 500);
}

listarEdicionesAnteriores();