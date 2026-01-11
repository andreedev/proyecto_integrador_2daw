/**
 * Menú lateral para el panel de admin
 */

const textoIcono = document.querySelectorAll('.textoIcono');
class MenuAdmin extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <input type="checkbox" id="checkMenu">
            <div class="responsiveMenuAdmin">
                <label for="checkMenu" class="iconoMenu">
                    <div class="iconoMenuEscondido">
                        <span class="iconoMenuHamburguesa"></span>
                    </div>
                </label>
            </div>
            <div class="menuLateralCompleto">
                <div class="cabeceraMenuLateral">
                    <div class="cabeceraIcono">
                        <span class="iconoAdminPanel"></span>
                    </div>
                    <h1>Panel de Admin</h1>
                </div>

                <div class="menuLateral">
                    <ul>
                        <li class="textoIcono active" id="candidaturasMenuLateral">
                            <div class="iconoCandidaturasMenuLateral">
                                <span class="iconoCandidaturas"></span>
                            </div>
                            <span>Candidaturas</span>
                        </li>
                        <li class="textoIcono" id="finalistasMenuLateral">
                            <div class="iconoFinalistasMenuLateral">
                                <span class="iconoFinalistas"></span>
                            </div>
                            <span>Finalistas</span>
                        </li>
                        <li class="textoIcono" id="noticiasMenuLateral">
                            <div class="iconoNoticiasMenuLateral">
                                <span class="iconoNoticias"></span>
                            </div>
                            <span>Noticias</span>
                        </li>
                        <li class="textoIcono" id="categoriasMenuLateral">
                            <div class="iconoCategoriasMenuLateral">
                                <span class="iconoCategorias"></span>
                            </div>
                            <span>Categorías y Premios</span>
                        </li>
                        <li class="textoIcono" id="patrocinadoresMenuLateral">
                            <div class="iconoPatrocinadoresMenuLateral">
                                <span class="iconoPatrocinadores"></span>
                            </div>
                            <span>Patrocinadores</span>
                        </li>
                        <li>
                            <div class="gala">
                                <div class="iconoGalaMenuLateral">
                                    <span class="iconoGala"></span>
                                </div>
                                <span>Gala</span>
                            </div>
                        </li>
                        <li class="menuGala">
                            <ul>
                                <li class="textoIcono" id="eventoMenuLateral">
                                    <div class="iconoEventoMenuLateral">
                                        <span class="iconoEvento"></span>
                                    </div>
                                    <span>Eventos</span>
                                </li>
                                <li class="textoIcono" id="edicionesAnterioresMenuLateral">
                                    <div class="iconoEdicionesAnterioresMenuLateral">
                                        <span class="iconoEdicionesAnteriores"></span>
                                    </div>
                                    <span>Ediciones Anteriores</span>
                                </li>
                                <li class="textoIcono" id="configuracionWebMenuLateral">
                                    <div class="iconoConfiguracionWebMenuLateral">
                                        <span class="iconoConfiguracionWeb"></span>
                                    </div>
                                    <span>Configuración Web</span>
                                </li>
                            </ul>
                        </li>
                        <li class="textoIcono cerrarSesionAdmin" id="botonCerrarSesionAdmin">
                            <span class="iconoCerrarSesion"></span>
                            <span>Cerrar Sesión</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;

        document.querySelector('#configuracionWebMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-configuracionWeb.html';
        });

        document.querySelector('#finalistasMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-finalistas.html';
        });

        document.querySelector('#candidaturasMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-candidaturas.html';
        });
        document.querySelector('#noticiasMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-noticias.html';

        });

        document.querySelector('#categoriasMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-categoria_premio.html';
        }); 
        document.querySelector('#patrocinadoresMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-patrocinadores.html';
        });

        document.querySelector('#eventoMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-eventos.html';
        });

        document.querySelector('#edicionesAnterioresMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-edicionesAnteriores.html';
        });

        const botonCerrarSesionAdmin = this.querySelector('#botonCerrarSesionAdmin');

        botonCerrarSesionAdmin.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });

        async function cerrarSesion() {
            const formData = new FormData();
            formData.append('action', 'cerrarSesion');

            try {
                const response = await fetch(URL_API, {
                    method: 'POST',
                    body: formData
                });
            }catch (error) {
                console.error('Error al cerrar sesión:', error);
            } finally {
                window.location.href = 'index.html';
            }
        }

        
    }
}

customElements.define('menu-admin', MenuAdmin);