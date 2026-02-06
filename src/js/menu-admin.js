/**
 * Menú lateral para el panel de admin
 */
class MenuAdmin extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        this.style.visibility = 'hidden';
        await Promise.all([
            injectExternalStyles('../css/menu-admin.css', 'menu-admin-styles')
        ]);
        this.render();
        this._setActivePage();
        this._setupListeners();
        this.style.visibility = 'visible';
    }

    render() {
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
                    <div class="textoIcono secondary-button-03 py-16px" id="candidaturasMenuLateral" data-url="admin-candidaturas.html">
                        <span>Candidaturas</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="finalistasMenuLateral" data-url="admin-ganadores.html">
                        <span>Ganadores</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="noticiasMenuLateral" data-url="admin-noticias.html">
                        <span>Noticias</span>
                    </div>
                     <div class="textoIcono secondary-button-03 py-16px" id="eventoMenuLateral" data-url="admin-eventos.html">
                        <span>Eventos</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="categoriasMenuLateral" data-url="admin-categoria-premio.html">
                        <span>Categorías y Premios</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="patrocinadoresMenuLateral" data-url="admin-patrocinadores.html">
                        <span>Patrocinadores</span>
                    </div>
                     <div class="textoIcono secondary-button-03 py-16px" id="edicionesAnterioresMenuLateral" data-url="admin-ediciones-anteriores.html">
                        <span>Ediciones Anteriores</span>
                    </div>
                    <div class="textoIcono secondary-button-03 py-16px" id="configuracionWebMenuLateral" data-url="admin-modo.html">
                        <span>Modo pre/post evento</span>
                    </div>
                    <div class="primary-button-02 py-16px" id="botonCerrarSesionAdmin">
                        <span>Cerrar sesión</span>
                    </div>
                </div>
            </div>
        `;
    }

    async _cerrarSesion() {
        const formData = new FormData();
        formData.append('action', 'cerrarSesion');

        try {
            await fetch(URL_API, {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            window.location.href = 'index.html';
        }
    }


    _setActivePage() {
        const currentPage = window.location.pathname.split('/').pop();
        const buttons = this.querySelectorAll('.textoIcono');

        buttons.forEach((btn) => {
            btn.classList.remove('active');
            // Si el data-url coincide con la página actual, añadimos 'active'
            if (btn.getAttribute('data-url') === currentPage) {
                btn.classList.add('active');
            }
        });
    }

    _setupListeners() {
        const navButtons = this.querySelectorAll('.textoIcono');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.getAttribute('data-url');
                if (url) window.location.href = url;
            });
        });

        // Botón cerrar sesión
        const btnLogout = this.querySelector('#botonCerrarSesionAdmin');
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.preventDefault();
                this._cerrarSesion();
            });
        }
    }
}

customElements.define('menu-admin', MenuAdmin);