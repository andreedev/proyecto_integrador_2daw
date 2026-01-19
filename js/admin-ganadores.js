const finalistasMenuLateral = document.getElementById('finalistasMenuLateral');

const bloqueCategoria = document.getElementById('bloqueCategoria');
const headerBloque = document.getElementById('headerBloque');
const nombreCategoria = document.getElementById('nombreCategoria');
const iconoDesplegable = document.getElementById('iconoDesplegable');

const puestoContainer = document.getElementById('puestoContainer');
const puestoPremio = document.getElementById('puestoPremio');
const puesto = document.querySelector('.puesto');
const premio = document.querySelector('.premio');

const ganador = document.querySelector('.ganador');

const btnAsignarDesasignarBackground = document.getElementById('btnAsignarDesasignarBackground');
const btnAsignarDesasignar = document.getElementById('btnAsignarDesasignar');
const modalDesasignar = document.getElementById('modalDesasignar');
const btnDesasignarGanador = document.getElementById('btnDesasignarGanador');
const btnCancelarModalDesasignar = document.getElementById('btnCancelModalDesasignar');

//Cuando el botón esté en asignar ganador
const modalAsignar = document.getElementById('modalAsignarGanador'); 
const cerrarModalAsignar = document.getElementById('cerrarModalAsignar');
const infoCardGanador = document.getElementById('infoCardGanador');
const btnGanadorElegido = document.getElementById('btnGanadorElegido');
const iconCheck = document.getElementById('iconCheck');
const nameGanador = document.querySelector('.name-ganador');
const gmailGanador = document.querySelector('.gmail-ganador');
const descripcionCortoGanador = document.querySelector('.descripcion-corto-ganador');
const fecha = document.querySelector('.fecha');
const btnAceptarGanador = document.getElementById('btnAceptarGanador');
const btnCerrarModalGanador = document.getElementById('btnCerrarModalGanador');

const categoriesContainer = document.getElementById('categoriesContainer');


//Cuando pinchamos en el menu lateral ganadores, nos traemos de la bd: las categorías
finalistasMenuLateral.addEventListener('click', () => {
    cargarCategorias();
});


function cargarCategorias(){
    listarCategorias()
        .then(data => {
            if (data.status === 'success'){
                renderizarCategorias(data.data);
            }
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
        });
}

/**
 * Renderiza las categorías
 */
function renderizarCategorias(categorias){
    bloqueCategoria.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas categorías

    categorias.forEach(categoria => {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('bloque-categoria');
        categoriaDiv.innerHTML = `                        
            <div class="header-bloque" id="headerBloque">
                <span class="categoria-title" id="nombreCategoria">${categoria.nombre}</span>
                <span class="icono-desplegable" id="iconoDesplegable"></span>
            </div>
        `;

        bloqueCategoria.appendChild(categoriaDiv);

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


            ganadorDiv.appendChild(iconoPersonaSpan);
            ganadorDiv.appendChild(ganadorSpan);

            puestoPremioDiv.appendChild(puestoSpan);
            puestoPremioDiv.appendChild(premioSpan);

            puestoContainerDiv.appendChild(puestoPremioDiv);
            puestoContainerDiv.appendChild(ganadorDiv);
            premioDiv.appendChild(puestoContainerDiv);

            premioDiv.appendChild(btnAsignarDiv);
            categoriaDiv.appendChild(premioDiv);
        });

        categoriesContainer.appendChild(categoriaDiv);
    });


}

cargarCategorias();

btnAsignarDesasignarBackground.addEventListener('click', () => {
    if (btnAsignarDesasignar.textContent === 'Asignar') {
        modalAsignar.showModal();
        btnAsignarDesasignar.textContent = 'Desasignar';
    } else {
        modalDesasignar.showModal();
    }
});

btnCerrarModalGanador.addEventListener('click', () => {
    modalAsignar.close();
    btnAsignarDesasignar.textContent = 'Asignar';
});


// Si pinchamos en la flecha, este cambia de sentido, y mostramos puestoContainer poco a poco
iconoDesplegable.addEventListener('click', () => {
    iconoDesplegable.classList.toggle('icono-desplegable-rotado');
});

//