class HomeFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="footer-container">
                <div class="footer-content">
                    <div class="footer-container-1">
                        <img src="./../img/canon-logo.png" alt="Logo" class="footer-image">
                        <img src="./../img/logo1.png" alt="Logo" class="footer-image">
                    </div>
                    <div class="footer-container-2">
                        <p class="footer-text">C/Tajo, s/n, 28670</p>
                        <p class="footer-text">dpo@universidadeuropea.es</p>
                    </div>
                    <div class="footer-container-3">
                        <p>
                            <a class="footer-secondary-text" href="#" alt="Politica de privacidad">Política de privacidad</a>
                        </p>
                        <p>
                            <a class="footer-secondary-text" href="./bases-legales.html" alt="Bases legales">Bases legales</a>
                        </p>
                    </div>
                    <div class="footer-container-4">
                        <p class="footer-secondary-text">Redes sociales</p>
                        <div class="social-media-container">
                            <a href="#">
                                <img src="./../img/icon/YoutubeIcon.svg" class="social-media-icon" alt="YouTube">
                            </a>
                            <a href="#">
                                <img src="./../img/icon/InstagramIcon.svg" class="social-media-icon" alt="Instagram">
                            </a>
                            <a href="#">
                                <img src="./../img/icon/TiktokIcon.svg" class="social-media-icon" alt="TikTok">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('home-footer', HomeFooter);