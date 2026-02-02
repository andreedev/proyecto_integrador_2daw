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
    cardAgregarNuevoGanador.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

cerrarCardAgregarGanador.addEventListener('click', () => {
    cardAgregarNuevoGanador.classList.add('d-none');
});

btnConfirmarCrearEdicion.addEventListener('click', async () => {
    const anioEdicionValid =  inputYearCrearEdicion.validate().valid;
    const nroParticipantesValid = inputNumParticipantesCrearEdicion.validate().valid;
    const descripcionValid = descripcionInputCrearEdicion.validate().valid;
    const archivoValid = fileInputCrearEdicion.validate();

    if (!anioEdicionValid || !nroParticipantesValid || !descripcionValid || !archivoValid.valid) {
        return;
    }

    let areWinnersValid = true;
    ganadores.forEach(g => {
        if (!g.componentRef.validate()) areWinnersValid = false;
    });

    try {
        notificador.show("Subiendo archivos y guardando edición...", { type: 'info' });

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

        const payload = {
            anioEdicion: inputYearCrearEdicion.value,
            nroParticipantes: inputNumParticipantesCrearEdicion.value,
            descripcion: descripcionInputCrearEdicion.value,
            idsArchivosGaleria: galleryIds,
            ganadores: ganadoresFinalData
        };

        console.log("Payload Final:", payload);

        notificador.show("Edición creada exitosamente", { type: 'success' });
        modalCrearEdicionAnterior.close();
        listarEdicionesAnteriores();

    } catch (error) {
        console.error(error);
        notificador.show("Hubo un error al procesar la solicitud", { type: 'error' });
    }
});

btnAgregarGanador.addEventListener('click', () => {
    const validNombre = inputNombreGanador.validate().valid;
    const validCategoria = inputCategoriaGanador.validate().valid;
    const validPuesto = inputPuestoGanador.validate().valid;
    const validVideo = inputVideoGanador.validate();

    if (!validNombre || !validCategoria || !validPuesto || !validVideo) {
        return;
    }

    const nuevoGanador = {
        id: Date.now(), // Generar un ID único temporalmente
        nombre: inputNombreGanador.value.trim(),
        categoria: inputCategoriaGanador.value.trim(),
        premio: inputPuestoGanador.value.trim(),
        video: inputVideoGanador.getData()
        // getData(): Retorna { file, fileId, isChanged }.
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
});


/**
 * <!-- Example ganador card, replicate as needed -->
 *                 <div class="d-flex flex-column border border-neutral-06 position-relative p-16px gap-16px">
 *                     <div class="d-flex flex-row gap-16px">
 *                         <span class="icon-user-thick w-24px h-24px bg-neutral-01"></span>
 *                         <span class="fw-600">Nombre del ganador</span>
 *                     </div>
 *                     <div class="d-flex flex-row gap-16px">
 *                         <span class="icon-tag w-24px h-24px bg-neutral-01"></span>
 *                         <span class="fw-600">Nombre de la categoría</span>
 *                     </div>
 *                     <div class="d-flex flex-row gap-16px">
 *                         <span class="icon-trophy w-24px h-24px bg-neutral-01"></span>
 *                         <span class="fw-600">Nombre del premio</span>
 *                     </div>
 *
 *                     <!-- use setAttachedMode() here -->
 *                     <file-component
 *                             label="Cortometraje o traíler del ganador"
 *                             id="inputVideoGanadorCrearEdicion"
 *                             primary-text="Arrastra tu imagen o vídeo o haz clic para seleccionar"
 *                             accept=".mp4,.mov,.avi"
 *                             required
 *                             error-type="Formato no válido. Los formatos permitidos son MP4, MOV y AVI"
 *                             error-required="Debes subir un vídeo"
 *                     ></file-component>
 *
 *                     <span class="icon-trash bg-neutral-01 w-24px h-24px position-absolute right-16px top-16px cursor-pointer hover-scale-1-10"></span>
 *                 </div>
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

    // 1. Create the component cleanly without inline attributes first if necessary,
    // though setAttribute is generally safe.
    const fileComp = document.createElement('file-component');
    fileComp.setAttribute('label', 'Cortometraje o traíler del ganador');
    fileComp.setAttribute('id', `inputVideoGanadorCrearEdicion_${ganador.id}`);
    fileComp.setAttribute('accept', '.mp4,.mov,.avi');
    fileComp.setAttribute('required', '');

    // 2. Link the reference to the winners array for later validation/upload
    const index = ganadores.findIndex(g => g.id === ganador.id);
    if (index !== -1) {
        ganadores[index].componentRef = fileComp;
    }

    const btnDelete = document.createElement('span');
    btnDelete.classList.add('icon-trash', 'bg-neutral-01', 'w-24px', 'h-24px', 'position-absolute', 'right-16px', 'top-16px', 'cursor-pointer', 'hover-scale-1-10');
    btnDelete.addEventListener('click', () => {
        ganadorDiv.remove(); // Cleaner than removeChild
        ganadores = ganadores.filter(g => g.id !== ganador.id);
        actualizarIndicadorGanadores();
    });

    // 3. Append the rows and the CORRECT variable name (fileComp)
    ganadorDiv.append(
        createRow('icon-user-thick', ganador.nombre),
        createRow('icon-tag', ganador.categoria),
        createRow('icon-trophy', ganador.premio),
        fileComp, // Corrected variable name
        btnDelete
    );

    ganadoresContainer.appendChild(ganadorDiv);

    // 4. Critical: Wait for the Custom Element to be "Upgraded" before calling methods
    customElements.whenDefined('file-component').then(() => {
        console.log('file-component defined, setting attached mode for ganador ID:', ganador.id);
        if (ganador.video && (ganador.video.file || ganador.video.fileId)) {
            // Use the file name if it exists, otherwise a fallback
            const fileName = ganador.video.file ? ganador.video.file.name : "video.mp4";
            fileComp.setAttachedMode(fileName, ganador.video.fileId, true);
        }
    });

    actualizarIndicadorGanadores();
}

/**
 * Renderiza las ediciones anteriores utilizando DOM nativo
 */
function renderizarEdicionesAnteriores(ediciones) {
    edicionesContainer.replaceChildren();

    ediciones.forEach(edicion => {
        const edicionDiv = document.createElement('div');
        edicionDiv.classList.add('d-flex', 'flex-column', 'gap-8px', 'border', 'border-neutral-06', 'bg-neutral-09', 'p-16px');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('d-flex', 'justify-space-between', 'p-8px', 'align-items-center');

        const title = document.createElement('p');
        title.classList.add('fs-32px', 'fw-600');
        title.textContent = `Edición ${edicion.anioEdicion}`;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('d-flex', 'gap-8px');

        const btnEdit = document.createElement('span');
        btnEdit.classList.add('icon-pencil', 'w-24px', 'h-24px', 'bg-neutral-02', 'hover-scale-1-10', 'cursor-pointer');
        btnEdit.addEventListener('click', () => {
            edicionSeleccionada = edicion;
            modalEditarEdicionAnterior.open();
        });

        // Icono Eliminar
        const btnDelete = document.createElement('span');
        btnDelete.classList.add('icon-trash', 'w-24px', 'h-24px', 'bg-neutral-02', 'hover-scale-1-10', 'cursor-pointer');
        btnDelete.addEventListener('click', () => {
            edicionSeleccionada = edicion;
            notificador.show(`¿Estás seguro de eliminar la edición ${edicion.anioEdicion}? Esta acción no se puede deshacer`, {
                confirm: true,
                confirmText: "Eliminar",
                onConfirm: () => {
                    setTimeout(async () => {
                        const response = await eliminarEdicion(edicionSeleccionada.idEdicion);
                        if (response.success) {
                            notificador.show(`La edición ${edicionSeleccionada.anioEdicion} ha sido eliminada exitosamente.`, { type: 'success' });
                            await listarEdicionesAnteriores();
                        } else {
                            notificador.show(`Error al eliminar la edición: ${response.message}`, { type: 'error' });
                        }
                    }, 500);
                }
            });
        });

        actionsDiv.append(btnEdit, btnDelete);
        headerDiv.append(title, actionsDiv);

        const gridDiv = document.createElement('div');
        gridDiv.classList.add('d-grid', 'grid-template-columns-2', 'gap-16px');

        const cardPart = document.createElement('div');
        cardPart.classList.add('d-flex', 'flex-row', 'gap-16px', 'bg-neutral-08', 'p-24px', 'align-items-center');
        cardPart.innerHTML = `
            <span class="icon-users w-40px h-40px bg-neutral-02"></span>
            <div class="d-flex flex-column gap-4px">
                <p class="fs-14px fw-600 text-neutral-03">Participantes</p>
                <p class="fs-24px fw-600 text-neutral-02">${edicion.nroParticipantes}</p>
            </div>
        `;

        const cardGan = document.createElement('div');
        cardGan.classList.add('d-flex', 'flex-row', 'gap-16px', 'bg-neutral-08', 'p-24px', 'align-items-center');
        cardGan.innerHTML = `
            <span class="icon-trophy w-40px h-40px bg-neutral-02"></span>
            <div class="d-flex flex-column gap-4px">
                <p class="fs-14px fw-600 text-neutral-03">Ganadores</p>
                <p class="fs-24px fw-600 text-neutral-02">${edicion.nroGanadores}</p>
            </div>
        `;

        const cardGal = document.createElement('div');
        cardGal.classList.add('d-flex', 'flex-row', 'gap-16px', 'bg-neutral-08', 'p-24px', 'align-items-center');
        cardGal.innerHTML = `
            <span class="icon-video w-40px h-40px bg-neutral-02"></span>
            <div class="d-flex flex-column gap-4px">
                <p class="fs-14px fw-600 text-neutral-03">Galería fotográfica</p>
                <p class="fs-24px fw-600 text-neutral-02">${edicion.nroArchivos}</p>
            </div>
        `;

        const cardTipo = document.createElement('div');
        cardTipo.classList.add('d-flex', 'flex-row', 'gap-16px', 'bg-neutral-08', 'p-24px', 'align-items-center');
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

function actualizarIndicadorGanadores() {
    indicadorGanadores.textContent = `${ganadores.length} ganadores`;
}

function handleCrearEdicionAnterior() {

}

function handleEditarEdicionAnterior(edicionId) {

}

listarEdicionesAnteriores();