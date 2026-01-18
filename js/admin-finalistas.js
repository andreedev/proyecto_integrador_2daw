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


//Cuando pinchamos en el menu lateral ganadores, nos traemos de la bd: las categorías
finalistasMenuLateral.addEventListener('click', () => {
    cargarCategorias();
});


function cargarCategorias(){
    listarCategorias()
        .then(data => {
            if (data.status === 'success'){
                // renderizarCategorias(data.categorias);
            }
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
        });
}

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
                        <div class="puesto-container" id="puestoContainer">
                            <div class="puesto-premio" id="puestoPremio">
                                <span class="puesto">${categoria.nombrePremio}</span>
                                <span class="premio">${categoria.cantidad_dinero}€</span>
                            </div>
                            <div class="ganador-asignado">
                                <span class="icono-persona"></span>
                                <span class="ganador">Sin ganador asignado</span>
                            </div>
                            <div class="boton-asignar-desasignar-background" id="btnAsignarDesasignarBackground">
                                <span class="boton-asignar-desasignar" id="btnAsignarDesasignar">Asignar</span>
                            </div>
                        </div>`;

        bloqueCategoria.appendChild(categoriaDiv);

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