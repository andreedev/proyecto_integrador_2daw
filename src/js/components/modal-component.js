/**
 * Componente de modal personalizado
 *
 * Ejemplo de uso básico:
 * <modal-component z-index="2000" duration="500" size="auto">
 *      <h2>Título del Modal</h2>
 *      <p>Contenido del modal aquí.</p>
 *      <button class="close-modal">Cerrar</button>
 * </modal-component>
 *
 *   Ejemplo con Header/Footer fijos y contenido scrollable:
 *  <modal-component scrollable mobile-full-screen container-class="w-80">
 *      <div class="header">Título Fijo</div>
 *      <div class="flex-grow-1 overflow-y-auto">Contenido que hace scroll...</div>
 *      <div class="footer">Botones Fijos</div>
 *  </modal-component>
 *
 * Atributos:
 * - z-index: Define el z-index del modal (por defecto 1000).
 * - full-screen: Si está presente, el modal ocupará toda la pantalla en todos los dispositivos.
 * - mobile-full-screen: Si está presente, el modal será pantalla completa solo en dispositivos móviles (<= 768px).
 * - scrollable: Si está presente, permite inyectar contenido directamente al contenedor sin el wrapper 'solid-modal-content'.
 *   Ideal para estructuras con Header/Footer fijos usando 'd-flex flex-column'
 * - duration: Duración de la animación en milisegundos (por defecto 300)
 * - auto-open: Si está presente, el modal se abrirá automáticamente al cargar.
 * - static: Si está presente, el modal no se cerrará al hacer clic fuera o presionar Esc (hace efecto rebote).
 * - size: Define el tamaño del modal. Valores posibles:
 *   "full" (ocupa todo el espacio disponible)
 *   "auto" (ajusta su tamaño al contenido)
 *   (ningún valor: tamaño predeterminado max-width 600px)
 * - container-class: Clases CSS adicionales (ej. utilidades de ancho como "w-90 w-md-70").
 *   Tienen prioridad sobre el atributo 'size'.
 *
 * Eventos:
 * - modal-opened: Se dispara cuando el modal termina de abrirse
 * - modal-closed: Se dispara cuando el modal termina de cerrarse
 */
class ModalComponent extends HTMLElement {
    constructor() {
        super();
        this._isOpen = false;
        this._handleEsc = this._handleEsc.bind(this);
    }

    static get observedAttributes() {
        return ['z-index', 'full-screen', 'duration', 'auto-open', 'size', 'mobile-full-screen', 'position'];
    }

    async connectedCallback() {
        if (this._initialized) return;

        this.style.visibility = 'hidden';
        this.render();
        this._setupEventListeners();

        await window.injectExternalStyles('../css/modal-component.css', 'solid-modal-styles');

        this.style.removeProperty('visibility');
        this._initialized = true;

        if (this.hasAttribute('auto-open')) {
            setTimeout(() => {
                this.open();
            }, 100);
        }
    }

    /**
     * Renderiza la estructura del modal y aplica las clases según los atributos
     */
    render() {
        const zIndex = this.getAttribute('z-index') || '1000';
        const duration = this.getAttribute('duration') || '300';
        const isFullScreen = this.hasAttribute('full-screen') ? 'is-full-screen' : '';
        const sizeAttr = this.getAttribute('size');
        const containerClass = this.getAttribute('container-class') || '';
        const isScrollable = this.hasAttribute('scrollable');
        const isMobileFullScreen = this.hasAttribute('mobile-full-screen') ? 'is-mobile-full-screen' : '';
        const position = this.getAttribute('position') || 'center';

        let sizeClass = '';
        if (sizeAttr === 'full') sizeClass = 'is-size-full';
        if (sizeAttr === 'auto') sizeClass = 'is-size-auto';

        const overlay = document.createElement('div');
        overlay.className = 'solid-modal-overlay';
        overlay.classList.add(`is-position-${position}`);
        overlay.style.zIndex = zIndex;
        overlay.style.setProperty('--modal-duration', `${duration}ms`);

        const container = document.createElement('div');
        // container-class se añade al final para que tenga prioridad sobre size
        container.className = `solid-modal-container ${isFullScreen} ${isMobileFullScreen} ${sizeClass} ${containerClass ? 'has-custom-width' : ''} ${containerClass}`.trim();


        if (isScrollable) {
            // Esta opción permite que el contenido del modal sea scrollable
            // Permite tener un header y footer fijo, y contenido scrollable
            while (this.firstChild) {
                container.appendChild(this.firstChild);
            }
        } else {
            const content = document.createElement('div');
            content.className = 'solid-modal-content';
            while (this.firstChild) {
                content.appendChild(this.firstChild);
            }
            container.appendChild(content);
        }

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

        this.resetScroll();

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

    resetScroll() {
        const container = this.querySelector('.solid-modal-container');
        if (container) {
            container.scrollTop = 0;
        }
    }
}

customElements.define('modal-component', ModalComponent);