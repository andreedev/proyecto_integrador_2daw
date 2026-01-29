/**
 * Pagination Component
 * Renderiza controles de navegación con lógica de elipsis (...)
 * * Ejemplo de uso:
 * <pagination-component
 * total-pages="16"
 * current-page="2">
 * </pagination-component>
 * * Eventos:
 * - page-change: Disparado al hacer clic en una página o flecha.
 * detail: { page: number }
 */
class PaginationComponent extends HTMLElement {
    constructor() {
        super();
        this._currentPage = 1;
        this._totalPages = 1;
        this.style.visibility = 'hidden';
    }

    static get observedAttributes() {
        return ['total-pages', 'current-page'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'total-pages') this._totalPages = parseInt(newValue) || 1;
            if (name === 'current-page') this._currentPage = parseInt(newValue) || 1;
            this.render();
            this._setupEventListeners();
        }
    }

    async connectedCallback() {
        // Asumiendo que guardas los estilos en este archivo
        await window.injectExternalStyles('../css/pagination-component.css', 'pagination-styles');
        this.render();
        this._setupEventListeners();
        this.style.visibility = 'visible';
    }

    set currentPage(val) {
        this.setAttribute('current-page', val);
    }

    get currentPage() {
        return this._currentPage;
    }

    _setupEventListeners() {
        const buttons = this.querySelectorAll('.solid-pagination-item:not(.is-disabled):not(.is-ellipsis)');

        buttons.forEach(btn => {
            btn.onclick = () => {
                const page = parseInt(btn.dataset.page);
                if (page !== this._currentPage) {
                    this.currentPage = page;

                    this.dispatchEvent(new CustomEvent('page-change', {
                        detail: { page: page },
                        bubbles: true
                    }));
                }
            };
        });
    }

    /**
     * Lógica para calcular qué números mostrar (máximo 7 items)
     * Estilo: < 1 2 (3) ... 16 >
     */
    _getPages() {
        const total = this._totalPages;
        const current = this._currentPage;
        const pages = [];

        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            // Siempre mostrar la primera
            pages.push(1);

            if (current > 4) {
                pages.push('...');
            }

            // Páginas centrales
            let start = Math.max(2, current - 1);
            let end = Math.min(total - 1, current + 1);

            // Ajuste para mantener consistencia visual cerca de los extremos
            if (current <= 4) end = 5;
            if (current > total - 4) start = total - 4;

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (current < total - 3) {
                pages.push('...');
            }

            // Siempre mostrar la última
            if (!pages.includes(total)) pages.push(total);
        }
        return pages;
    }

    render() {
        const pages = this._getPages();
        const isFirst = this._currentPage === 1;
        const isLast = this._currentPage === this._totalPages;

        let html = `
            <div class="solid-pagination-container">
                <div class="solid-pagination-item flecha ${isFirst ? 'is-disabled' : ''}" 
                     data-page="${this._currentPage - 1}">
                    &lt;&lt;
                </div>
        `;

        pages.forEach(p => {
            if (p === '...') {
                html += `<div class="solid-pagination-item is-ellipsis">...</div>`;
            } else {
                const isActive = p === this._currentPage;
                html += `
                    <div class="solid-pagination-item ${isActive ? 'is-active' : ''}" 
                         data-page="${p}">
                        ${p}
                    </div>`;
            }
        });

        html += `
                <div class="solid-pagination-item flecha ${isLast ? 'is-disabled' : ''}" 
                     data-page="${this._currentPage + 1}">
                    &gt;&gt;
                </div>
            </div>
        `;

        this.innerHTML = html;
    }
}

customElements.define('pagination-component', PaginationComponent);