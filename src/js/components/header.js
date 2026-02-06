/**
 * Header para la página principal
 */
class HomeHeader extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.style.visibility = 'hidden';
        await Promise.all([
            window.sessionReady,
            injectExternalStyles('../css/header.css', 'home-header-styles')
        ]);
        this.render();
        this.style.visibility = 'visible';
    }

    render() {
        const sesionIniciada = sessionStorage.getItem('sesionIniciada') === 'true';

        let botonesDesktop = '';
        if (sesionIniciada) {
            botonesDesktop = `
                <a href="#" id="logout-btn" class="header-button-font-size secondary-button-01 w-auto h-auto  flex-shrink-0">Cerrar sesión</a>
                <a href="./candidaturas.html" class="header-button-font-size primary-button-01 w-auto h-auto  flex-shrink-0">Candidaturas</a>
            `;
        } else {
            botonesDesktop = `
                <a href="./login.html" class="header-button-font-size secondary-button-01 text-center w-auto h-auto  flex-shrink-0">Iniciar sesión</a>
                <a href="./subir-corto.html" class="header-button-font-size primary-button-01 w-auto h-auto  flex-shrink-0">Registrarse</a>
            `;
        }

        let botonesMobile = '';
        if (sesionIniciada) {
            botonesMobile = `
                <a href="#" id="logout-btn-mobile"   class="py-12px secondary-button-01 text-center w-100">Cerrar sesión</a>
                <a href="./candidaturas.html" class="py-12px primary-button-01 w-100">Candidaturas</a>
            `;
        } else {
            botonesMobile = `
                <a href="./login.html"        class="py-12px secondary-button-01 text-center w-100">Iniciar sesión</a>
                <a href="./subir-corto.html"  class="py-12px primary-button-01 w-100">Registrarse</a>
            `;
        }

        this.innerHTML = `
            <div class="header-container">
                <a href="./" class="header-logo-container">
                    <img src="../img/logo.svg" alt="Logo" class="header-logo-image">
                </a>
                <div class="icon-menu-bards-container" id="openMobileMenuBtn">
                    <span class="icon-bars w-32px h-32px bg-neutral-01"></span>
                </div>
                <div class="header-buttons-desktop-container">
                    <div class="d-flex gap-32px">
                        <a href="./noticias.html" class="header-base-button">Noticias</a>
                        <a href="./eventos.html" class="header-base-button">Eventos</a>
                        <a href="./preguntas-frecuentes.html" class="header-base-button">Preguntas frecuentes</a>
                        <a href="./gala.html" class="header-base-button">Gala</a>
                        <a href="./bases-legales.html" class="header-base-button">Bases legales</a>
                    </div>
                    <div class="d-flex gap-16px">
                        ${botonesDesktop}
                    </div>
                </div>
            </div>
            
            <modal-component
                    id="headerMobileMenu"
                    z-index="1500"
                    full-screen
                    duration="300">
                <div class="d-flex justify-space-between align-items-center w-100 px-32px py-8px border-solid border-neutral-06">
                    <a href="./" class="header-logo-container">
                        <img src="../img/logo.svg" alt="Logo" class="header-logo-image">
                    </a>
                    <div class="icon-close-container close-modal">
                        <span class="icon-close w-32px h-32px bg-neutral-01 d-block"></span>
                    </div>
                </div>
                
                <div class="d-flex flex-column bg-neutral-07">
                    <a href="./noticias.html" class="px-24px py-16px border-solid border-neutral-06 d-flex justify-space-between align-items-center">
                        <span>Noticias</span>
                        <span class="icon-right-chevron w-16px h-16px bg-primary-03 d-block"></span>
                    </a>
                    <a href="./eventos.html" class="px-24px py-16px border-solid border-neutral-06 d-flex justify-space-between align-items-center">
                        <span>Eventos</span>
                        <span class="icon-right-chevron w-16px h-16px bg-primary-03 d-block"></span>
                    </a>
                    <a href="./preguntas-frecuentes.html" class="px-24px py-16px border-solid border-neutral-06 d-flex justify-space-between align-items-center">
                        <span>Preguntas frecuentes</span>
                        <span class="icon-right-chevron w-16px h-16px bg-primary-03 d-block"></span>
                    </a>
                    <a href="./gala.html" class="px-24px py-16px border-solid border-neutral-06 d-flex justify-space-between align-items-center">
                        <span>Gala</span>
                        <span class="icon-right-chevron w-16px h-16px bg-primary-03 d-block"></span>
                    </a>
                    <a href="./bases-legales.html" class="px-24px py-16px border-solid border-neutral-06 d-flex justify-space-between align-items-center">
                        <span>Bases legales</span>
                        <span class="icon-right-chevron w-16px h-16px bg-primary-03 d-block"></span>
                    </a>
                </div>

                <div class="d-flex flex-column w-100 gap-12px mt-16px px-16px">
                    ${botonesMobile}
                </div>
            </modal-component>
        `;

        this._setupListeners();
    }

    _setupListeners() {
        this.addEventListener('click', (e) => {
            const btn = e.target.closest('#logout-btn, #logout-btn-mobile');
            if (btn) {
                e.preventDefault();
                this.logout();
            }
        });

        const openMobileMenuBtn = this.querySelector('#openMobileMenuBtn');
        const headerMobileMenu = this.querySelector('#headerMobileMenu');

        if (openMobileMenuBtn && headerMobileMenu) {
            openMobileMenuBtn.addEventListener('click', () => {
                headerMobileMenu.open();
            });
        }
    }

    async logout() {
        const formData = new FormData();
        formData.append('action', 'cerrarSesion');
        try {
            sessionStorage.setItem('sesionIniciada', 'false');
            await fetch(URL_API, { method: 'POST', body: formData });
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

customElements.define('home-header', HomeHeader);

