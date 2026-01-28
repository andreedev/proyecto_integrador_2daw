/**
 * Componente de modal personalizado
 *
 * Ejemplo de uso:
 * <modal-component z-index="2000" full-screen duration="500" auto-open>
 *     <h2>Título del Modal</h2>
 *     <p>Contenido del modal aquí.</p>
 *     <button class="close-modal">Cerrar</button>
 * </modal-component>
 *
 * Atributos:
 * - z-index: Define el z-index del modal (por defecto 1000).
 * - full-screen: Si está presente, el modal ocupará toda la pantalla.
 * - duration: Duración de la animación en milisegundos (por defecto 300).
 * - auto-open: Si está presente, el modal se abrirá automáticamente al cargar.
 * - static: Si está presente, el modal no se cerrará al hacer clic fuera de él o al presionar Esc.
 * - size: Define el tamaño del modal. Valores posibles:
 *  "full" (ocupa todo el espacio disponible)
 *  "auto" (ajusta su tamaño al contenido)
 *  (ningún valor, tamaño predeterminado 400px)
 *
 * Eventos:
 * - modal-opened: Se dispara cuando el modal se abre.
 * - modal-closed: Se dispara cuando el modal se cierra.
 */
class ModalComponent extends HTMLElement {
    constructor() {
        super();
        this._isOpen = false;
        this.style.visibility = 'hidden';
        this._handleEsc = this._handleEsc.bind(this);
    }

    static get observedAttributes() {
        return ['z-index', 'full-screen', 'duration', 'auto-open', 'size'];
    }

    async connectedCallback() {
        this.render();
        this._setupEventListeners();

        await window.injectExternalStyles('../css/modal-component.css', 'solid-modal-styles');

        this.style.visibility = 'visible';

        if (this.hasAttribute('auto-open')) {
            setTimeout(() => {
                this.open();
            }, 100);
        }
    }

    render() {
        const zIndex = this.getAttribute('z-index') || '1000';
        const duration = this.getAttribute('duration') || '300';

        const isFullScreen = this.hasAttribute('full-screen') ? 'is-full-screen' : '';

        const sizeAttr = this.getAttribute('size');
        let sizeClass = '';
        if (sizeAttr === 'full') sizeClass = 'is-size-full';
        if (sizeAttr === 'auto') sizeClass = 'is-size-auto';

        const originalContent = this.innerHTML;
        this.innerHTML = '';

        this.innerHTML = `
        <div class="solid-modal-overlay" 
             style="z-index: ${zIndex}; --modal-duration: ${duration}ms;">
            <div class="solid-modal-container ${isFullScreen} ${sizeClass}">
                <div class="solid-modal-content">
                    ${originalContent}
                </div>
            </div>
        </div>
    `;
    }

    _setupEventListeners() {
        const overlay = this.querySelector('.solid-modal-overlay');
        const container = this.querySelector('.solid-modal-container');

        this.addEventListener('click', (e) => {
            if (e.target.closest('.close-modal')) {
                this.close();
                return;
            }

            if (e.target === overlay) {
                if (!this.hasAttribute('static')) {
                    this.close();
                } else {
                    container.classList.add('modal-static-bounce');
                    setTimeout(() => container.classList.remove('modal-static-bounce'), 300);
                }
            }
        });
    }

    _handleEsc(e) {
        if (e.key === 'Escape' && this._isOpen && !this.hasAttribute('static')) {
            this.close();
        }
    }

    open() {
        if (this._isOpen) return;

        const overlay = this.querySelector('.solid-modal-overlay');
        if (!overlay) {
            console.warn("Modal: Attempted to open before render was complete");
            return;
        }

        this._isOpen = true;
        overlay.classList.add('is-active');
        document.body.style.overflow = 'hidden';

        document.addEventListener('keydown', this._handleEsc);
        this.dispatchEvent(new CustomEvent('modal-opened'));
    }

    close() {
        if (!this._isOpen) return;
        const overlay = this.querySelector('.solid-modal-overlay');
        overlay.classList.remove('is-active');

        overlay.addEventListener('transitionend', () => {
            if (!overlay.classList.contains('is-active')) {
                this._isOpen = false;
                document.body.style.overflow = '';
                document.removeEventListener('keydown', this._handleEsc);
                this.dispatchEvent(new CustomEvent('modal-closed'));
            }
        }, { once: true });
    }

    toggle() {
        this._isOpen ? this.close() : this.open();
    }
}

customElements.define('modal-component', ModalComponent);