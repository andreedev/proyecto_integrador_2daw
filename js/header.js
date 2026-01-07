/**
 * Header para la página principal
 */
class HomeHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const sesionIniciada = sessionStorage.getItem('sesionIniciada') === 'true';
        let botonesAccion = '';

        if (sesionIniciada) {
            botonesAccion = `
                <a href="./mis-candidaturas.html" class="header-button header-primary-action-button">Candidaturas</a>
                <a href="#" id="logout-btn" class="header-button header-secondary-action-button">Cerrar sesión</a>
            `;
        } else {
            botonesAccion = `
                <a href="./subir-corto.html" class="header-button header-primary-action-button">Registrarse</a>
                <a href="./login.html" class="header-button header-secondary-action-button">Iniciar sesión</a>
            `;
        }

        this.innerHTML = `
            <div class="header-container">
                <a href="./" class="header-logo-container">
                    <img src="./img/logo1.png" alt="Logo" class="header-logo-image">
                </a>
                <div class="icon-menu-bards-container">
                    <span class="icon-menu-bars"></span>
                </div>
                <div class="header-buttons-desktop-container">
                    <a href="./noticias.html" class="header-button">Noticias</a>
                    <a href="./preguntas-frecuentes.html" class="header-button">Preguntas frecuentes</a>
                    <a href="./gala.html" class="header-button">Gala</a>
                    <a href="./bases-legales.html" class="header-button">Bases legales</a>
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