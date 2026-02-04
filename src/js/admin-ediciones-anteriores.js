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
const ganadoresContainerCrearEdicion = document.getElementById('ganadoresContainerCrearEdicion');
const inputNombreGanador = document.getElementById('inputNombreGanador');
const inputCategoriaGanador = document.getElementById('inputCategoriaGanador');
const inputPuestoGanador = document.getElementById('inputPuestoGanador');
const inputVideoGanador = document.getElementById('inputVideoGanador');
const indicadorGanadoresCrearEdicion = document.getElementById('indicadorGanadoresCrearEdicion');
const inputYearVerEdicion = document.getElementById('inputYearVerEdicion');
const inputNumParticipantesVerEdicion = document.getElementById('inputNumParticipantesVerEdicion');
const descripcionInputVerEdicion = document.getElementById('descripcionInputVerEdicion');
const galeriaEdicionCarousel = document.getElementById('galeriaEdicionCarousel');
const galeriaGanadoresCarousel = document.getElementById('galeriaGanadoresCarousel');
const indicadorGanadoresVerEdicion = document.getElementById('indicadorGanadoresVerEdicion');

const inputYearActualizarEdicion = document.getElementById('inputYearActualizarEdicion');
const inputNumParticipantesActualizarEdicion = document.getElementById('inputNumParticipantesActualizarEdicion');
const descripcionInputActualizarEdicion = document.getElementById('descripcionInputActualizarEdicion');
const fileInputActualizarEdicion = document.getElementById('fileInputActualizarEdicion');
const indicadorGanadoresActualizarEdicion = document.getElementById('indicadorGanadoresActualizarEdicion');
const btnAbrirCardAgregarGanadorActualizarEdicion = document.getElementById('btnAbrirCardAgregarGanadorActualizarEdicion');
const ganadoresContainerActualizarEdicion = document.getElementById('ganadoresContainerActualizarEdicion');
const cardAgregarNuevoGanadorActualizarEdicion = document.getElementById('cardAgregarNuevoGanadorActualizarEdicion');
const cerrarCardAgregarGanadorActualizarEdicion = document.getElementById('cerrarCardAgregarGanadorActualizarEdicion');
const inputNombreGanadorActualizarEdicion = document.getElementById('inputNombreGanadorActualizarEdicion');
const inputCategoriaGanadorActualizarEdicion = document.getElementById('inputCategoriaGanadorActualizarEdicion');
const btnAgregarGanadorActualizarEdicion = document.getElementById('btnAgregarGanadorActualizarEdicion');
const inputPuestoGanadorActualizarEdicion = document.getElementById('inputPuestoGanadorActualizarEdicion');
const inputVideoGanadorActualizarEdicion = document.getElementById('inputVideoGanadorActualizarEdicion');
const btnConfirmarActualizarEdicion = document.getElementById('btnConfirmarActualizarEdicion');

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
    resetFormularioCrearEdicionAnterior();
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
    handleAgregarNuevoGanador(inputNombreGanador, inputCategoriaGanador, inputPuestoGanador, inputVideoGanador, ganadoresContainerCrearEdicion, indicadorGanadoresCrearEdicion, cardAgregarNuevoGanador);
});

btnAbrirCardAgregarGanadorActualizarEdicion.addEventListener('click', () => {
    cardAgregarNuevoGanadorActualizarEdicion.classList.remove('d-none');
    scrollToElement(cardAgregarNuevoGanadorActualizarEdicion);
});

cerrarCardAgregarGanadorActualizarEdicion.addEventListener('click', () => {
    cardAgregarNuevoGanadorActualizarEdicion.classList.add('d-none');
});

btnAgregarGanadorActualizarEdicion.addEventListener('click', () => {
    handleAgregarNuevoGanador(inputNombreGanadorActualizarEdicion, inputCategoriaGanadorActualizarEdicion, inputPuestoGanadorActualizarEdicion, inputVideoGanadorActualizarEdicion, ganadoresContainerActualizarEdicion, indicadorGanadoresActualizarEdicion, cardAgregarNuevoGanadorActualizarEdicion);
});

btnConfirmarActualizarEdicion.addEventListener('click', async () => {
    handleActualizarEdicionAnterior();
});

/**
 * Maneja la adición de un nuevo ganador a la lista
 * @param {InputComponent} inputNombreGanadorElement - Elemento del input del nombre del ganador
 * @param {InputComponent} inputCategoriaGanadorElement - Elemento del input de la categoría del ganador
 * @param {InputComponent} inputPuestoGanadorElement - Elemento del input del puesto del ganador
 * @param {FileComponent} inputVideoGanadorElement - Elemento del file-component del video del ganador
 * @param {HTMLElement} ganadoresContainer - Contenedor donde se renderizará el nuevo card de ganador
 * @param {HTMLElement} indicadorGanadores - Elemento para actualizar el indicador de número de ganadores
 * @param {HTMLElement} cardAgregarGanadorElement - Elemento del card de agregar nuevo ganador para ocultarlo después de agregar
 */
function handleAgregarNuevoGanador(inputNombreGanadorElement, inputCategoriaGanadorElement, inputPuestoGanadorElement, inputVideoGanadorElement, ganadoresContainer, indicadorGanadores, cardAgregarGanadorElement) {
    const validNombre = inputNombreGanadorElement.validate().valid;
    const validCategoria = inputCategoriaGanadorElement.validate().valid;
    const validPuesto = inputPuestoGanadorElement.validate().valid;
    const validVideo = inputVideoGanadorElement.validate();

    if (!validNombre || !validCategoria || !validPuesto || !validVideo) {
        return;
    }

    const nuevoGanador = {
        // Genera un ID único
        idGanadorEdicion: Date.now(),
        nombre: inputNombreGanadorElement.value.trim(),
        categoria: inputCategoriaGanadorElement.value.trim(),
        premio: inputPuestoGanadorElement.value.trim(),
        video: inputVideoGanadorElement.getData()
    };
    ganadores.push(nuevoGanador);

    renderizarNuevoCardGanador(nuevoGanador, ganadoresContainer, indicadorGanadores);

    // Limpiar los campos del formulario
    inputNombreGanadorElement.clear()
    inputCategoriaGanadorElement.clear();
    inputPuestoGanadorElement.clear();
    inputVideoGanadorElement.clear();

    cardAgregarGanadorElement.classList.add('d-none');
}

/**
 * Renderiza un nuevo card de ganador en el contenedor de ganadores
 * @param {Object} ganador - Objeto con los datos del ganador
 * @param {Array} ganadoresList - Lista de ganadores actual
 * @param {HTMLElement} contenedor - Contenedor donde se agregará el card
 * @param {HTMLElement} indicadorGanadores - Elemento para actualizar el indicador de ganadores
 */
function renderizarNuevoCardGanador(ganador, contenedor , indicadorGanadores ) {
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
    fileComp.setAttribute('id', `inputVideoGanadorCrearEdicion_${ganador.idGanadorEdicion}`);
    fileComp.setAttribute('accept', '.mp4,.mov,.avi');
    fileComp.setAttribute('required', '');

    const index = ganadores.findIndex(g => g.idGanadorEdicion === ganador.idGanadorEdicion);
    if (index !== -1) {
        ganadores[index].componentRef = fileComp;
    }

    const btnDelete = document.createElement('span');
    btnDelete.classList.add('icon-trash', 'bg-neutral-01', 'w-24px', 'h-24px', 'position-absolute', 'right-16px', 'top-16px', 'cursor-pointer', 'hover-scale-1-10');
    btnDelete.addEventListener('click', () => {
        ganadorDiv.remove();
        ganadores = ganadores.filter(g => g.idGanadorEdicion !== ganador.idGanadorEdicion);
        renderizarIndicadorGanadores(indicadorGanadores, ganadores.length);
    });

    ganadorDiv.append(
        createRow('icon-user-thick', ganador.nombre),
        createRow('icon-tag', ganador.categoria),
        createRow('icon-trophy', ganador.premio),
        fileComp,
        btnDelete
    );

    contenedor.appendChild(ganadorDiv);

    customElements.whenDefined('file-component').then(() => {
        if (ganador.video.file instanceof File) {
            fileComp.setRawFile(ganador.video.file, false);
        } else if (ganador.rutaArchivoVideo) {
            fileComp.setAttachedMode(ganador.rutaArchivoVideo, ganador.idArchivoVideo, false);
        }
    });

    renderizarIndicadorGanadores(indicadorGanadores, ganadores.length);
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
            resetFormularioActualizarEdicionAnterior();
            renderizarEdicionExistenteEnFormularioActualizarEdicion();
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
    ganadoresContainerCrearEdicion.replaceChildren();
    renderizarIndicadorGanadores(indicadorGanadoresCrearEdicion, ganadores.length);
}

function resetFormularioActualizarEdicionAnterior() {
    ganadores = [];
    ganadoresContainerActualizarEdicion.replaceChildren();
}

/**
 * Renderiza el indicador de número de ganadores
 */
function renderizarIndicadorGanadores(indicatorElement, total) {
    indicatorElement.textContent = `${total} ganadores`;
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
    renderizarIndicadorGanadores(indicadorGanadoresVerEdicion, ganadores.length);
}

function renderizarEdicionExistenteEnFormularioActualizarEdicion() {
    inputYearActualizarEdicion.setValue(edicionSeleccionada.anioEdicion, true);
    inputNumParticipantesActualizarEdicion.setValue(edicionSeleccionada.nroParticipantes, true);
    descripcionInputActualizarEdicion.setValue(edicionSeleccionada.resumenEvento, true);

    ganadoresContainerActualizarEdicion.replaceChildren();

    edicionSeleccionada.ganadores.forEach(ganador => {
        const ganadorData = {
            idGanadorEdicion: ganador.idGanadorEdicion,
            nombre: ganador.nombre,
            categoria: ganador.categoria,
            premio: ganador.premio,
            video: { file: null },
            rutaArchivoVideo: ganador.rutaArchivoVideo,
            idArchivoVideo: ganador.idArchivoVideo
        };
        ganadores.push(ganadorData);
        renderizarNuevoCardGanador(ganadorData, ganadoresContainerActualizarEdicion, indicadorGanadoresActualizarEdicion);
    });

    fileInputActualizarEdicion.setAttachedMode(edicionSeleccionada.archivos.map(a => a.rutaArchivo), edicionSeleccionada.archivos.map(a => a.idArchivo), true);
}

/**
 * Maneja la creación de una nueva edición anterior
 */
async function handleCrearEdicionAnterior() {
    const anioEdicionValid = inputYearCrearEdicion.validate().valid;
    const nroParticipantesValid = inputNumParticipantesCrearEdicion.validate().valid;
    const descripcionValid = descripcionInputCrearEdicion.validate().valid;
    const archivoValid = fileInputCrearEdicion.validate();

    if (!anioEdicionValid){
        scrollToElement(inputYearCrearEdicion);
    } else if (!nroParticipantesValid){
        scrollToElement(inputNumParticipantesCrearEdicion);
    } else if (!descripcionValid){
        scrollToElement(descripcionInputCrearEdicion);
    } else if (!archivoValid){
        scrollToElement(fileInputCrearEdicion);
    }

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

        btnConfirmarCrearEdicion.disabled = true;

        const response = await crearEdicion(anioEdicion, nroParticipantes, descripcion, idsArchivosGaleria, listaGanadores, tipo);

        btnConfirmarCrearEdicion.disabled = false;

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

async function handleActualizarEdicionAnterior() {
    const validYear = inputYearActualizarEdicion.validate().valid;
    const validParticipantes = inputNumParticipantesActualizarEdicion.validate().valid;
    const validDescripcion = descripcionInputActualizarEdicion.validate().valid;
    const validArchivos = fileInputActualizarEdicion.validate();

    if (!validYear) {
        scrollToElement(inputYearActualizarEdicion);
    } else if (!validParticipantes) {
        scrollToElement(inputNumParticipantesActualizarEdicion);
    } else if (!validDescripcion) {
        scrollToElement(descripcionInputActualizarEdicion);
    } else if (!validArchivos) {
        scrollToElement(fileInputActualizarEdicion);
    }

    if (!validYear || !validParticipantes || !validDescripcion || !validArchivos) {
        return;
    }

    if (ganadores.length === 0) {
        notificador.show("Debes agregar al menos un ganador");
        return;
    }

    try {

        btnConfirmarActualizarEdicion.disabled = true;

        // Subir archivos de galería
        const galleryIds = await fileInputActualizarEdicion.uploadIfNeeded();

        // Subir videos de ganadores
        const ganadoresFinalData = await Promise.all(ganadores.map(async (g) => {
            let videoId = g.idArchivoVideo;
            if (g.componentRef) {
                videoId = await g.componentRef.uploadIfNeeded();
            }
            return {
                idGanadorEdicion: g.idGanadorEdicion,
                nombre: g.nombre,
                categoria: g.categoria,
                puesto: g.premio,
                idArchivoVideo: videoId
            };
        }));

        const anioEdicion = inputYearActualizarEdicion.value
        const nroParticipantes = inputNumParticipantesActualizarEdicion.value
        const descripcion = descripcionInputActualizarEdicion.value
        const idsArchivosGaleria = galleryIds
        const listaGanadores = ganadoresFinalData
        const idEdicion = edicionSeleccionada.idEdicion;

        console.log(ganadoresFinalData)

        const response = await actualizarEdicion(idEdicion, anioEdicion, nroParticipantes, descripcion, idsArchivosGaleria, listaGanadores);
        btnConfirmarActualizarEdicion.disabled = false;
        if (response.status === "success") {
            notificador.show("Edición actualizada exitosamente");
            await listarEdicionesAnteriores();
            modalEditarEdicionAnterior.close();
        } else {
            notificador.show(`Error al actualizar la edición: ${response.message}`);
        }
    } catch (error) {
        console.error(error);
        notificador.show("Hubo un error al procesar la solicitud");
    }
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