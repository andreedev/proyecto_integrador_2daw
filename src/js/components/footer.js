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
                <img src="../img/Vector-ue.svg" alt="logo universidad europea" class="super-placed-logo ue-logo position-absolute">
                
                <div class="footer-container d-flex flex-column flex-md-row justify-content-center justify-space-between align-items-center w-100 gap-16px m-auto flex-wrap container-lg-to-xl">
                    <div class="sponsor-container d-flex justify-content-center align-items-center gap-16px order-2 order-md-1 gap-32px">
                        <img src="../img/canon-logo.png" alt="logo canon" class="w-160px">
                    </div>
                    <div class="d-flex flex-column justify-content-center align-items-center gap-16px order-3 order-md-2">
                        <span class="fw-500 text-neutral-09">C/Tajo, s/n, 28670</span>
                        <span class="fw-500 text-neutral-09">festivalcortosuen@universidadeuropea.es</span>
                    </div>
                    <div class="d-flex flex-column justify-content-center align-items-center gap-16px order-4 order-md-3">
                        <a class="fw-500 text-neutral-09" href="#">Política de privacidad</a>
                        <a class="fw-500 text-neutral-09" href="./bases-legales.html">Bases legales</a>
                    </div>
                    <div class="d-flex flex-column gap-16px order-1 order-md-4">
                        <div class="social-media-container">
                            <a href="https://www.facebook.com/UnivEuropea" target="_blank" class="w-24px h-24px bg-neutral-09 hover-bg-primary-01 transition-all cursor-pointer icon-facebook"></a>
                            <a href="https://www.instagram.com/ueuropea" target="_blank" class="w-24px h-24px bg-neutral-09 hover-bg-primary-01 transition-all cursor-pointer icon-instagram"></a>
                            <a href="http://youtube.com/univeuropea" target="_blank" class="w-27px h-24px bg-neutral-09 hover-bg-primary-01 transition-all cursor-pointer icon-youtube"></a>
                            <a href="https://www.linkedin.com/school/universidad-europea-de-madrid" target="_blank" class="w-24px h-24px bg-neutral-09 hover-bg-primary-01 transition-all cursor-pointer icon-linkedin"></a>
                            <a href="https://x.com/ueuropea" target="_blank" class="w-24px h-24px bg-neutral-09 hover-bg-primary-01 transition-all cursor-pointer icon-twitter"></a>
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