const cardPatrocinador = document.getElementById('cardPatrocinador');
const modal = document.querySelector('.modal');
const notification = document.getElementById('notification');
const modalCrear = document.getElementById('modalCrear');
const contenedorPatrocinadores = document.getElementById('contenedorPatrocinadores');
const btnOpenCreateSponsor = document.getElementById('btnOpenCreateSponsor');
const modalActualizar = document.getElementById('modalActualizar');
const nombreCreate = document.getElementById('nombreCreate');
const imagenCreate = document.getElementById('imagenCreate');
const nombreUpdate = document.getElementById('nombreUpdate');
const imagenUpdate = document.getElementById('imagenUpdate');
const btnCrear = document.getElementById('btnCrear');
const btnActualizar = document.getElementById('btnActualizar');

let patrocinadorActual = null;

btnOpenCreateSponsor.addEventListener('click', () => {
    modalCrear.open();
});

btnCrear.addEventListener('click', async () => {
    handleCrearPatrocinador();
});

btnActualizar.addEventListener('click', async () => {
    handleActualizarPatrocinador();
});

function renderSponsorDataUpdateModal(sponsor) {
    nombreUpdate.value = sponsor.nombrePatrocinador;
    imagenUpdate.setAttachedMode(sponsor.rutaArchivoLogo, sponsor.idArchivoLogo, true);
}

/**
 * Renderiza la lista de patrocinadores
 * @param {Array} patrocinadores - Lista de patrocinadores a renderizar
 */
function renderizarPatrocinadores(patrocinadores) {
    contenedorPatrocinadores.replaceChildren();

    patrocinadores.forEach(patrocinador => {
        const card = document.createElement('div');
        card.classList.add('cardPatrocinador');

        const bodyCard = document.createElement('div');
        bodyCard.classList.add('bodyCardPatrocinador');

        const imagenCont = document.createElement('div');
        imagenCont.classList.add('imagenPatrocinador');

        const img = document.createElement('img');
        img.src = patrocinador.rutaArchivoLogo;
        img.classList.add('img');
        img.alt = patrocinador.nombrePatrocinador;

        imagenCont.appendChild(img);

        const iconosCont = document.createElement('div');
        iconosCont.classList.add('iconosPatrocinador');

        const divEditar = document.createElement('div');
        divEditar.classList.add('iconoEditar');

        const iconoEditar = document.createElement('div');
        iconoEditar.className = 'iconoEditarPatrocinador cursor-pointer d-inline-block w-20px h-20px icon-pencil bg-neutral-01';
        iconoEditar.addEventListener('click', () => {
            patrocinadorActual = patrocinador;
            renderSponsorDataUpdateModal(patrocinador);
            modalActualizar.open();
        });

        divEditar.appendChild(iconoEditar);

        const divBorrar = document.createElement('div');
        divBorrar.classList.add('iconoBorrar');

        const iconoBorrar = document.createElement('span');
        iconoBorrar.className = 'iconoBorrarPatrocinador cursor-pointer d-inline-block w-20px h-20px icon-trash bg-neutral-01';
        iconoBorrar.addEventListener('click', async () => {
            patrocinadorActual = patrocinador;
            notification.show("¿Estás seguro de eliminar este patrocinador?", {
                confirm: true,
                confirmText: "Eliminar",
                onConfirm: async () => {
                    const response = await eliminarPatrocinador(patrocinadorActual.idPatrocinador);
                    if (response.status === 'success') {
                        notification.show("Patrocinador eliminado exitosamente");
                        await cargarPatrocinadores();
                    } else {
                        notification.show("Error al eliminar patrocinador: " + response.message);
                    }
                }
            });
        });

        divBorrar.appendChild(iconoBorrar);

        iconosCont.append(divEditar, divBorrar);
        bodyCard.append(imagenCont, iconosCont);

        const footerCard = document.createElement('div');
        footerCard.classList.add('footerCardPatrocinador');

        const nombreSpan = document.createElement('span');
        nombreSpan.classList.add('nombre');
        nombreSpan.textContent = patrocinador.nombrePatrocinador;

        footerCard.appendChild(nombreSpan);

        card.append(bodyCard, footerCard);

        contenedorPatrocinadores.appendChild(card);
    });
}

async function cargarPatrocinadores() {
    const response = await listarPatrocinadoresAdmin();
    if (response.status !== 'success') {
        notification.show("Error al cargar patrocinadores: " + response.message);
    }
    renderizarPatrocinadores(response.data);
}

async function handleCrearPatrocinador() {
    const validNombre = nombreCreate.validate().valid;
    const validImagen = imagenCreate.validate()

    if (!validNombre || !validImagen) {
        return;
    }

    const idArchivoLogo = await imagenCreate.uploadIfNeeded();

    const response = await agregarPatrocinador(nombreCreate.value, idArchivoLogo);

    if (response.status === 'success') {
        notification.show("Patrocinador creado exitosamente");
        modalCrear.close();
        await cargarPatrocinadores();
    } else {
        notification.show("Error al crear patrocinador: " + response.message);
    }
}

async function handleActualizarPatrocinador() {
    const validNombre = nombreUpdate.validate().valid;
    const validImagen = imagenUpdate.validate();

    if (!validNombre || !validImagen) {
        return;
    }

    const idArchivoLogo = await imagenUpdate.uploadIfNeeded();

    const response = await actualizarPatrocinador(patrocinadorActual.idPatrocinador, nombreUpdate.value, idArchivoLogo);

    if (response.status === 'success') {
        notification.show("Patrocinador actualizado exitosamente");
        modalActualizar.close();
        await cargarPatrocinadores();
    } else {
        notification.show("Error al actualizar patrocinador: " + response.message);
    }
}

cargarPatrocinadores();