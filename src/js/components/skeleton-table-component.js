/**
 * Componente animado de esqueleto para representar tablas o listas de datos en carga
 *
 * @attr rows - Número de filas (default: 2)
 * @attr columns - Número de columnas (default: 2)
 * @attr height - Altura de cada bloque (default: 200px)
 * @attr width - Ancho de cada bloque (default: 100%)
 * @attr gap - Espacio entre bloques (default: 16px)
 *
 * @method show(targetEl) - Muestra el esqueleto y oculta el elemento objetivo
 * @method hide(targetEl) - Oculta el esqueleto y muestra el elemento objetivo
 *
 * Ejemplo de uso:
 * <skeleton-table-component rows="3" columns="4" height="150px" width="100%" gap="12px"></skeleton-table-component>
 *
 */
class SkeletonGridComponent extends HTMLElement {

    static #stylesInjected = false;

    static get observedAttributes() {
        return ['rows', 'columns', 'height', 'width', 'gap', 'visible'];
    }

    static #injectStyles() {
        if (SkeletonGridComponent.#stylesInjected) return;
        SkeletonGridComponent.#stylesInjected = true;

        const style = document.createElement('style');
        style.id = 'skeleton-grid-component-styles';
        style.textContent = `
            @keyframes skeleton-shimmer {
                0%   { background-position: -800px 0; }
                100% { background-position:  800px 0; }
            }
            .skeleton-grid-wrapper {
                display: grid;
                width: 100%;
            }
            .skeleton-block {
                display: block;
                border-radius: 4px;
                background: linear-gradient(
                    90deg,
                    var(--neutral-06, #e0e0e0) 25%,
                    var(--neutral-05, #f0f0f0) 50%,
                    var(--neutral-06, #e0e0e0) 75%
                );
                background-size: 800px 100%;
                animation: skeleton-shimmer 1.5s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    connectedCallback() {
        SkeletonGridComponent.#injectStyles();
        this.render();
        this.style.display = this.visible ? 'block' : 'none';
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'visible') {
            this.style.display = newValue !== null ? 'block' : 'none';
            return;
        }
        if (oldValue !== null && oldValue !== newValue) this.render();
    }

    get rows()    { return parseInt(this.getAttribute('rows')    || '2'); }
    get columns() { return parseInt(this.getAttribute('columns') || '2'); }
    get height()  { return this.getAttribute('height') || '200px'; } clarity
    get width()   { return this.getAttribute('width')  || '100%'; }
    get gap()     { return this.getAttribute('gap')    || '16px'; }
    get visible() { return this.hasAttribute('visible'); }

    show(targetEl=null) {
        this.style.display = 'block';
        if(targetEl) targetEl.style.display = 'none';
    }

    hide(targetEl=null) {
        this.style.display = 'none';
        if(targetEl) targetEl.style.display = '';
    }

    render() {
        const totalItems = this.rows * this.columns;

        const gridStyle = `
            grid-template-columns: repeat(${this.columns}, 1fr); 
            gap: ${this.gap};
        `;

        const items = Array.from({ length: totalItems }, (_, i) => {
            const delay = `${(i * 0.05).toFixed(2)}s`;

            return `
                <div 
                    class="skeleton-block" 
                    style="
                        height: ${this.height}; 
                        width: ${this.width}; 
                        animation-delay: ${delay};
                    "
                ></div>
            `;
        }).join('');

        this.innerHTML = `
            <div class="skeleton-grid-wrapper" style="${gridStyle}">
                ${items}
            </div>
        `;
    }
}

customElements.define('skeleton-table-component', SkeletonGridComponent);