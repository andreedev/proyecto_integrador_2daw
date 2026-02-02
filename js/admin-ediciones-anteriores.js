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

let tipo = 'anterior';
let edicionSeleccionada = null;

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

btnConfirmarCrearEdicion.addEventListener('click', async () => {
   const anioEdicionValid =  inputYearCrearEdicion.validate().valid;
    const nroParticipantesValid = inputNumParticipantesCrearEdicion.validate().valid;
    const descripcionValid = descripcionInputCrearEdicion.validate().valid;

    if (!anioEdicionValid || !nroParticipantesValid || !descripcionValid) {
        return;
    }


});

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

function handleCrearEdicionAnterior() {

}

function handleEditarEdicionAnterior(edicionId) {

}

listarEdicionesAnteriores();