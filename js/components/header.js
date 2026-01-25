/**
 * Header para la página principal
 */
class HomeHeader extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        await window.sessionReady;
        this.render();
    }

    render() {
        const sesionIniciada = sessionStorage.getItem('sesionIniciada') === 'true';
        let botonesAccion = '';

        if (sesionIniciada) {
            botonesAccion = `
                <a href="./candidaturas.html" class="header-base-button-responsive-font-size primary-button-01">Candidaturas</a>
                <a href="#" id="logout-btn" class="header-base-button-responsive-font-size secondary-button-02">Cerrar sesión</a>
            `;
        } else {
            botonesAccion = `
                <a href="./subir-corto.html" class="header-base-button-responsive-font-size primary-button-01">Registrarse</a>
                <a href="./login.html" class="header-base-button-responsive-font-size secondary-button-01 w-auto">Iniciar sesión</a>
            `;
        }

        this.innerHTML = `
            <div class="header-container">
                <a href="./" class="header-logo-container">
                    <img src="../img/logo.svg" alt="Logo" class="header-logo-image">
                </a>
                <div class="icon-menu-bards-container">
                    <span class="icon-bars w-32px h-32px bg-neutral-01"></span>
                </div>
                <div class="header-buttons-desktop-container">
                    <a href="./noticias.html" class="header-base-button header-base-button-responsive-font-size header-button">Noticias</a>
                    <a href="./eventos.html" class="header-base-button header-base-button-responsive-font-size header-button">Eventos</a>
                    <a href="./preguntas-frecuentes.html" class="header-base-button header-base-button-responsive-font-size header-button">Preguntas frecuentes</a>
                    <a href="./gala.html" class="header-base-button header-base-button-responsive-font-size header-button">Gala</a>
                    <a href="./bases-legales.html" class="header-base-button header-base-button-responsive-font-size header-button">Bases legales</a>
                    ${botonesAccion}
                </div>
            </div>
        `;

        const logoutBtn = this.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    async logout() {
        const formData = new FormData();
        formData.append('action', 'cerrarSesion');

        try {
            const response = await fetch(URL_API, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            sessionStorage.setItem('sesionIniciada', 'false');
            this.render();
        }
    }
}

customElements.define('home-header', HomeHeader);

