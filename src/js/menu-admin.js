/**
 * Menú lateral para el panel de admin
 */

class MenuAdmin extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <input type="checkbox" id="checkMenu">
            <div class="responsiveMenuAdmin">
                <label for="checkMenu" class="iconoMenu">
                    <div class="d-flex d-lg-none bg-neutral-01 w-40px h-40px justify-content-center align-items-center cursor-pointer">
                        <span class="w-24px h-24px icon-bars bg-neutral-09"></span>
                    </div>
                </label>
            </div>
            <div class="menuLateralCompleto">
                <div class="cabeceraMenuLateral">
                    <div class="cabeceraIcono">
                        <a href="admin-candidaturas.html">
                            <img src="../img/logo.svg" alt="logo">
                        </a>
                    </div>
                    <h1>Panel de Admin</h1>
                </div>

                <div class="d-flex flex-column gap-16px">
                    <div class="textoIcono secondary-button-03 py-16px" id="candidaturasMenuLateral">
                        <span>Candidaturas</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="finalistasMenuLateral">
                        <span>Ganadores</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="noticiasMenuLateral">
                        <span>Noticias</span>
                    </div>
                     <div class="textoIcono secondary-button-03 py-16px" id="eventoMenuLateral">
                        <span>Eventos</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="categoriasMenuLateral">
                        <span>Categorías y Premios</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="patrocinadoresMenuLateral">
                        <span>Patrocinadores</span>
                    </div>
                     <div class="textoIcono secondary-button-03 py-16px" id="edicionesAnterioresMenuLateral">
                        <span>Ediciones Anteriores</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="configuracionWebMenuLateral">
                        <span>Modo pre/post evento</span>
                    </div>
                    <div class="primary-button-02 py-16px" id="botonCerrarSesionAdmin">
                        <span>Cerrar sesión</span>
                    </div>
                </div>
            </div>
        `;

        document.querySelector('#configuracionWebMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-modo.html';
        });

        document.querySelector('#finalistasMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-ganadores.html';
        });

        document.querySelector('#candidaturasMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-candidaturas.html';
        });
        document.querySelector('#noticiasMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-noticias.html';
        });

        document.querySelector('#categoriasMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-categoria-premio.html';
        }); 
        document.querySelector('#patrocinadoresMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-patrocinadores.html';
        });

        document.querySelector('#eventoMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-eventos.html';
        });

        document.querySelector('#edicionesAnterioresMenuLateral').addEventListener('click', () => {
            window.location.href = 'admin-ediciones-anteriores.html';
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

        const currentPage = window.location.pathname.split('/').pop();
        const buttons = this.querySelectorAll('.textoIcono');
        buttons.forEach((element) => {
            element.classList.remove('active');
        });

        switch (currentPage) {
            case 'admin-candidaturas.html':
                document.querySelector('#candidaturasMenuLateral').classList.add('active');
                break;
            case 'admin-ganadores.html':
                document.querySelector('#finalistasMenuLateral').classList.add('active');
                break;
            case 'admin-noticias.html':
                document.querySelector('#noticiasMenuLateral').classList.add('active');
                break;
            case 'admin-categoria-premio.html':
                document.querySelector('#categoriasMenuLateral').classList.add('active');
                break;
            case 'admin-patrocinadores.html':
                document.querySelector('#patrocinadoresMenuLateral').classList.add('active');
                break;
            case 'admin-eventos.html':
                document.querySelector('#eventoMenuLateral').classList.add('active');
                break;
            case 'admin-ediciones-anteriores.html':
                document.querySelector('#edicionesAnterioresMenuLateral').classList.add('active');
                break;
            case 'admin-modo.html':
                document.querySelector('#configuracionWebMenuLateral').classList.add('active');
                break;
            default:
                break;
        }
        
    }
}

customElements.define('menu-admin', MenuAdmin);