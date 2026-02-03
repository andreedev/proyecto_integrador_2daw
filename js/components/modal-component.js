/**
 * Componente de modal personalizado
 *
 * Ejemplo de uso:
 * <modal-component z-index="2000" full-screen duration="500" auto-open size="auto">
 *     <h2>Título del Modal</h2>
 *     <p>Contenido del modal aquí.</p>
 *     <button class="close-modal">Cerrar</button>
 * </modal-component>
 *
 * Ejemplo con ancho responsive custom:
 * <modal-component container-class="w-90 w-md-70 w-lg-50">
 *     ...
 * </modal-component>
 *
 * Atributos:
 * - z-index: Define el z-index del modal (por defecto 1000).
 * - full-screen: Si está presente, el modal ocupará toda la pantalla.
 * - duration: Duración de la animación en milisegundos (por defecto 300).
 * - auto-open: Si está presente, el modal se abrirá automáticamente al cargar.
 * - static: Si está presente, el modal no se cerrará al hacer clic fuera de él o al presionar Esc.
 * - size: Define el tamaño del modal. Valores posibles:
 *      "full" (ocupa todo el espacio disponible)
 *      "auto" (ajusta su tamaño al contenido)
 *      (ningún valor, tamaño predeterminado max-width 600px)
 * - container-class: Clases CSS adicionales aplicadas al contenedor del modal.
 *      Se aplican DESPUÉS de las clases de tamaño, por lo que tienen prioridad.
 *      Ejemplo: "w-90 w-md-70" para ancho responsive.
 *
 * Eventos:
 * - modal-opened: Se dispara cuando el modal se abre
 * - modal-closed: Se dispara cuando el modal se cierra
 */
class ModalComponent extends HTMLElement {
    constructor() {
        super();
        this._isOpen = false;
        this._handleEsc = this._handleEsc.bind(this);
    }

    static get observedAttributes() {
        return ['z-index', 'full-screen', 'duration', 'auto-open', 'size'];
    }

    async connectedCallback() {
        if (this._initialized) return;

        this.style.visibility = 'hidden';
        this.render();
        this._setupEventListeners();

        await window.injectExternalStyles('../css/modal-component.css', 'solid-modal-styles');

        this.style.visibility = 'visible';
        this._initialized = true;

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
        const containerClass = this.getAttribute('container-class') || '';

        let sizeClass = '';
        if (sizeAttr === 'full') sizeClass = 'is-size-full';
        if (sizeAttr === 'auto') sizeClass = 'is-size-auto';

        const overlay = document.createElement('div');
        overlay.className = 'solid-modal-overlay';
        overlay.style.zIndex = zIndex;
        overlay.style.setProperty('--modal-duration', `${duration}ms`);

        const container = document.createElement('div');
        // container-class se añade al final para que tenga prioridad sobre size
        container.className = `solid-modal-container ${isFullScreen} ${sizeClass} ${containerClass ? 'has-custom-width' : ''} ${containerClass}`.trim();


        const content = document.createElement('div');
        content.className = 'solid-modal-content';

        while (this.firstChild) {
            content.appendChild(this.firstChild);
        }

        container.appendChild(content);
        overlay.appendChild(container);
        this.appendChild(overlay);
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
        document.body.style.overflow = '';

        const duration = parseInt(this.getAttribute('duration')) || 300;
        setTimeout(() => {
            this._isOpen = false;
            const videos = this.querySelectorAll('video');
            videos.forEach(v => v.pause());

            document.removeEventListener('keydown', this._handleEsc);
            this.dispatchEvent(new CustomEvent('modal-closed'));
        }, duration);
    }

    toggle() {
        this._isOpen ? this.close() : this.open();
    }
}

customElements.define('modal-component', ModalComponent);