/**
 * Componente de footer para la página principal
 */
class HomeFooter extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.style.visibility = 'hidden';
        await Promise.all([
            window.sessionReady,
            injectExternalStyles('../css/footer.css', 'footer-home-styles')
        ]);
        this.render();
        this.style.visibility = 'visible';
    }

    render() {
        this.innerHTML = `
            <div class="w-100 bg-neutral-01 position-relative">
                <img src="../img/Vector-ue.svg" alt="Logo" class="footer-image ue-logo position-absolute bottom-68px right-24px">
                
                <div class="d-flex flex-column flex-md-row justify-space-between align-items-center p-24px w-100 gap-32px m-auto flex-wrap container-md-to-lg pb-80px pt-24px">
                    <div class="footer-container-1">
                        <img src="../img/canon-logo.png" alt="Logo" class="footer-image">
                    </div>
                    <div class="footer-container-2">
                        <p class="footer-text">C/Tajo, s/n, 28670</p>
                        <p class="footer-text">dpo@universidadeuropea.es</p>
                    </div>
                    <div class="footer-container-3">
                        <a class="footer-secondary-text" href="#">Política de privacidad</a>
                        <a class="footer-secondary-text" href="./bases-legales.html">Bases legales</a>
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
                <div class="w-100 bg-primary-03 p-24px d-flex justify-content-center align-items-center">
                    <p class="fw-600">Universidad Europea © 2026. Todos Los Derechos Reservados</p>
                </div>
            </div>
        `;
    }
}

customElements.define('home-footer', HomeFooter);