class HomeHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
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
                    <a href="./subir-corto.html" class="header-button header-primary-action-button">Registrarse</a>
                    <a href="./login.html" class="header-button header-secondary-action-button">Iniciar sesión</a>
                </div>
            </div>
        `;
    }
}

customElements.define('home-header', HomeHeader);