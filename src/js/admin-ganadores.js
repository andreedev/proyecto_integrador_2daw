const categoriesContainer = document.getElementById('categoriesContainer');
const puesto = document.querySelector('.puesto');
const premio = document.querySelector('.premio');
const ganador = document.querySelector('.ganador');

//Cuando el botón esté en asignar ganador
const modalAsignarGanador = document.getElementById('modalAsignarGanador');
const btnAceptarGanador = document.getElementById('btnAceptarGanador');
const notification = document.getElementById('notification');

let idPremioSeleccionado;
let idCandidaturaSeleccionada;

btnAceptarGanador.addEventListener('click', async () => {
    if (!idCandidaturaSeleccionada) {
        notification.show('Por favor, selecciona un finalista para asignar como ganador.');
        return;
    }
    await handleAsignarGanador(idCandidaturaSeleccionada);
});

/**
 * Renderiza las categorías
 */
function renderizarCategorias(categorias){
    categoriesContainer.replaceChildren();

    categorias.forEach(categoria => {
        const categoriaSuperContainer = document.createElement('div');
        categoriaSuperContainer.classList.add('categoriaSuperContainer');


        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('bloque-categoria');

        const headerBloque = document.createElement('div');
        headerBloque.classList.add('header-bloque');
        headerBloque.id = 'headerBloque';

        const nombreCategoria = document.createElement('span');
        nombreCategoria.classList.add('categoria-title');
        nombreCategoria.id = 'nombreCategoria';
        nombreCategoria.textContent = categoria.nombre;

        const checkBoxInput = document.createElement('input');
        checkBoxInput.type = 'checkbox';
        checkBoxInput.checked = true;
        checkBoxInput.classList.add('checkboxAccordeon')
        checkBoxInput.hidden = true;

        const iconoDesplegable = document.createElement('span');
        iconoDesplegable.classList.add('icono-desplegable');
        iconoDesplegable.id = 'iconoDesplegable';
        iconoDesplegable.addEventListener('click', () => {
            iconoDesplegable.classList.toggle('icono-desplegable-rotado');
            checkBoxInput.checked = !checkBoxInput.checked;
            if (checkBoxInput.checked) {
                premiosContainerDiv.classList.remove('hidden-force');
            }else{
                premiosContainerDiv.classList.add('hidden-force');
            }

        });

        headerBloque.appendChild(nombreCategoria);
        headerBloque.appendChild(checkBoxInput);
        headerBloque.appendChild(iconoDesplegable);
        categoriaDiv.appendChild(headerBloque);

        const premiosContainerDiv = document.createElement("div");
        premiosContainerDiv.classList.add('premiosContainer');

        const premios = categoria.premios;

        premios.forEach(premio => {
            const cantidadDinero = premio.cantidadDinero ? `${premio.cantidadDinero}€` : '';

            const premioDiv = document.createElement('div');
            premioDiv.classList.add('puesto-container', 'd-flex', 'align-items-center');

            const puestoContainerDiv = document.createElement('div');
            puestoContainerDiv.classList.add('puesto-container', 'w-100');

            const puestoPremioDiv = document.createElement('div');
            puestoPremioDiv.classList.add('puesto-premio');

            const puestoSpan = document.createElement('span');
            puestoSpan.classList.add('puesto');
            puestoSpan.textContent = premio.nombrePremio;

            const premioSpan = document.createElement('span');
            premioSpan.classList.add('premio');
            premioSpan.textContent = cantidadDinero;

            const ganadorDiv = document.createElement('div');
            ganadorDiv.classList.add('ganador-asignado', 'cursor-pointer');

            const iconoPersonaSpan = document.createElement('span');
            iconoPersonaSpan.classList.add('icono-persona');

            const ganadorSpan = document.createElement('span');
            ganadorSpan.classList.add('ganador');
            ganadorSpan.textContent = premio.nombreGanador ? premio.nombreGanador : 'Sin ganador asignado';

            const btnAsignarDiv = document.createElement('div');
            btnAsignarDiv.classList.add('primary-button-02', 'btnAsignar', 'btn-action');
            btnAsignarDiv.textContent = premio.tieneGanador ? 'Desasignar' : 'Asignar';
            btnAsignarDiv.addEventListener('click', async () => {
                if (btnAsignarDiv.textContent === 'Asignar') {
                    const listarFinalistasNoGanadoresResponse = await listarFinalistasNoGanadores();
                    if (listarFinalistasNoGanadoresResponse.status === 'success') {
                        const finalistas = listarFinalistasNoGanadoresResponse.data;
                        renderizarFinalistasEnModal(finalistas);
                        idPremioSeleccionado = premio.idPremio;
                    }
                    modalAsignarGanador.open();
                } else {
                    notification.show('¿Estás seguro de que deseas desasignar al ganador?', {
                        confirm: true,
                        confirmText: "Desasignar",
                        onConfirm: async () => {
                            const response = await desasignarGanador(premio.idPremio, premio.idCandidaturaGanador);
                            if (response.status === 'success') {
                                await cargarCategorias();
                                notification.show('Ganador desasignado correctamente');
                            } else {
                                console.error('Error al desasignar el ganador:', response.message);
                            }
                        }
                    });
                }
                if (btnAsignarDiv.textContent === 'Desasignar') {
                    idPremioSeleccionado = premio.idPremio;
                    idCandidaturaSeleccionada = premio.idCandidaturaGanador;
                }
            });


            ganadorDiv.appendChild(iconoPersonaSpan);
            ganadorDiv.appendChild(ganadorSpan);

            puestoPremioDiv.appendChild(puestoSpan);
            puestoPremioDiv.appendChild(premioSpan);

            puestoContainerDiv.appendChild(puestoPremioDiv);
            puestoContainerDiv.appendChild(ganadorDiv);
            premioDiv.appendChild(puestoContainerDiv);

            premioDiv.appendChild(btnAsignarDiv);
            premiosContainerDiv.appendChild(premioDiv);
        });

        categoriaSuperContainer.appendChild(categoriaDiv);
        categoriaSuperContainer.appendChild(premiosContainerDiv);

        categoriesContainer.appendChild(categoriaSuperContainer)

    });

}

async function cargarCategorias() {
    const response = await listarCategoriasAdmin();
    renderizarCategorias(response.data);
}


/**
 * Renderiza los finalistas en el modal de asignar ganador
 */
function renderizarFinalistasEnModal(finalistas) {
    const finalistasContainer = document.getElementById('finalistasContainer');
    finalistasContainer.replaceChildren();

    btnAceptarGanador.disabled = false;

    if (finalistas.length === 0) {
        finalistasContainer.innerHTML = '<p>No hay finalistas disponibles para asignar como ganador.</p>';
        btnAceptarGanador.disabled = true;
        return;
    }

    finalistas.forEach(finalista => {
        const finalist = document.createElement('finalist-card-component');
        finalist.setData({
            idCandidatura: finalista.idCandidatura,
            nombreParticipante: finalista.nombreParticipante,
            titulo: finalista.titulo,
            correoParticipante: finalista.correoParticipante,
            sinopsis: finalista.sinopsis,
            fechaPresentacion: finalista.fechaPresentacion
        });
        finalist.addEventListener('finalist-select', (e) => {
            idCandidaturaSeleccionada = e.detail.data.idCandidatura;
            document.querySelectorAll('finalist-card-component').forEach(card => {
                if (card !== finalist) {
                    card.unselect();
                }
            });
        });
        finalist.addEventListener('finalist-unselect', (e) => {
            if (idCandidaturaSeleccionada === e.detail.data.idCandidatura) {
                idCandidaturaSeleccionada = null;
            }
        });
        finalistasContainer.appendChild(finalist);
    });
}

async function handleAsignarGanador(idCandidatura) {
    const response = await asignarGanador(idPremioSeleccionado, idCandidatura);
    if (response.status === 'success') {
        modalAsignarGanador.close();
        notification.show(response.message);
        await cargarCategorias();
    } else {
        notification.show('Error al asignar el ganador: ' + response.message);
    }
}


cargarCategorias();