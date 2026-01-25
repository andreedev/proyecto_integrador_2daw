injectExternalStyles('../css/footer.css', 'footer-home-styles');
/**
 * Componente de footer para la página principal
 */
class HomeFooter extends HTMLElement {
    constructor() {
        super();
        this.style.visibility = 'hidden';
    }

    async connectedCallback() {
        await Promise.all([
            window.sessionReady,
            injectExternalStyles('../css/footer.css', 'footer-home-styles')
        ]);

        this.render();

        this.style.visibility = 'visible';
    }

    render() {
        this.innerHTML = `
            <div class="footer-container">
                <div class="footer-content">
                    <div class="footer-container-1">
                        <img src="../img/canon-logo.png" alt="Logo" class="footer-image">
                        <img src="../img/Vector-ue.svg" alt="Logo" class="footer-image ue-logo">
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
                            <span class="social-media-icon icon-facebook"></span>
                            <span class="social-media-icon icon-instagram"></span>
                            <span class="social-media-icon icon-youtube"></span>
                            <span class="social-media-icon icon-linkedin"></span>
                            <span class="social-media-icon icon-twitter"></span>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom-bar">
                    <p class="footer-bottom-bar-text">© 2024 Canon. Todos los derechos reservados.</p>
                </div>
            </div>
        `;
    }
}

customElements.define('home-footer', HomeFooter);