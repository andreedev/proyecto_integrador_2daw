/**
 * Componente de barra de progreso fija en la parte superior de la pantalla
 *
 * @attr mode      - Modo de la barra: 'indeterminate' (animación infinita) | 'determinate' (porcentaje). Default: 'indeterminate'
 * @attr value     - Porcentaje de progreso de 0 a 100 (solo en modo determinate). Default: 0
 * @attr height    - Altura de la barra. Default: 3px
 * @attr color     - Color de la barra. Default: var(--primary-03, #e74c3c)
 *
 * @method show()            - Muestra la barra
 * @method hide()            - Oculta la barra
 * @method setProgress(n)    - Actualiza el porcentaje (activa modo determinate automáticamente)
 * @method reset()           - Vuelve a modo indeterminate y oculta la barra
 *
 * Ejemplo de uso:
 * <loading-bar-component id="loadingBar"></loading-bar-component>
 * <loading-bar-component mode="determinate" value="40"></loading-bar-component>
 *
 * Desde JS:
 * loadingBar.show();
 * loadingBar.setProgress(75);
 * loadingBar.reset();
 */
class LoadingBarComponent extends HTMLElement {

    static #stylesInjected = false;

    static get observedAttributes() {
        return ['mode', 'value', 'height', 'color'];
    }

    static #injectStyles() {
        if (LoadingBarComponent.#stylesInjected) return;
        LoadingBarComponent.#stylesInjected = true;

        const style = document.createElement('style');
        style.id = 'loading-bar-component-styles';
        style.textContent = `
            @keyframes loading-bar-indeterminate {
                0%   { left: -40%; width: 40%; }
                50%  { left: 30%;  width: 60%; }
                100% { left: 110%; width: 40%; }
            }

            loading-bar-component {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 9999;
                overflow: hidden;
            }

            .loading-bar-track {
                position: relative;
                width: 100%;
                height: 100%;
                background: transparent;
            }

            .loading-bar-fill {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                border-radius: 0 2px 2px 0;
                transition: width 0.25s ease;
            }

            .loading-bar-fill.indeterminate {
                width: 40% !important;
                animation: loading-bar-indeterminate 1.4s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    connectedCallback() {
        LoadingBarComponent.#injectStyles();
        this.render();
        this.style.display = this.hasAttribute('visible') ? 'block' : 'none';
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'value' || name === 'mode') this.#updateFill();
        if (name === 'height')  this.style.height = newValue || '3px';
        if (name === 'color')   this.#fill && (this.#fill.style.background = newValue);
    }

    get mode()   { return this.getAttribute('mode')   || 'indeterminate'; }
    get value()  { return Math.min(100, Math.max(0, parseFloat(this.getAttribute('value') || '0'))); }
    get height() { return this.getAttribute('height') || '3px'; }
    get color()  { return this.getAttribute('color')  || 'var(--primary-03, #e74c3c)'; }

    #fill = null;

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }

    /**
     * Actualiza el progreso (activa modo determinate automáticamente)
     * @param {number} value - Valor entre 0 y 100
     */
    setProgress(value) {
        this.setAttribute('mode', 'determinate');
        this.setAttribute('value', String(Math.min(100, Math.max(0, value))));
    }

    /** Vuelve a indeterminate y oculta */
    reset() {
        this.setAttribute('mode', 'indeterminate');
        this.setAttribute('value', '0');
        this.hide();
    }

    #updateFill() {
        if (!this.#fill) return;
        const isDeterminate = this.mode === 'determinate';
        this.#fill.classList.toggle('indeterminate', !isDeterminate);
        this.#fill.style.width = isDeterminate ? `${this.value}%` : '';
    }

    render() {
        this.style.height = this.height;

        this.innerHTML = `
            <div class="loading-bar-track">
                <div class="loading-bar-fill ${this.mode === 'indeterminate' ? 'indeterminate' : ''}"
                     style="
                         background: ${this.color};
                         width: ${this.mode === 'determinate' ? this.value + '%' : ''};
                     ">
                </div>
            </div>
        `;

        this.#fill = this.querySelector('.loading-bar-fill');
    }
}

customElements.define('loading-bar-component', LoadingBarComponent);