/**
 * @class FinalistCardComponent
 * @extends HTMLElement
 * Un Web Component para mostrar una tarjeta seleccionable de finalista
 *
 * @description
 * Muestra información de un finalista con capacidad de selección tipo radio button.
 * Incluye nombre, título del film, correo, sinopsis y fecha de presentación.
 * El componente es clickeable en toda su área y emite eventos personalizados.
 *
 * @property {object} _data - Estado interno con la información del finalista
 * @property {boolean} _selected - Estado de selección del componente
 *
 * Métodos públicos:
 * - setData(data: object): Inyecta los datos del finalista y renderiza
 * - getData(): Retorna el objeto de datos actual
 * - select(): Marca el componente como seleccionado
 * - unselect(): Desmarca el componente
 * - isSelected(): Retorna true si está seleccionado
 * - toggle(): Alterna el estado de selección
 *
 * Eventos:
 * - finalist-select: Disparado cuando se selecciona el componente
 * - finalist-unselect: Disparado cuando se deselecciona
 * - finalist-toggle: Disparado en cualquier cambio de selección
 *
 * @example
 * const finalist = document.createElement('finalist-card-component');
 * finalist.setData({
 *     idCandidatura: 123,
 *     nombreParticipante: "Juan Pérez",
 *     titulo: "Mi Cortometraje",
 *     correoParticipante: "juan@mail.com",
 *     sinopsis: "Una historia increíble...",
 *     fechaPresentacion: "2024-09-15"
 * });
 *
 * finalist.addEventListener('finalist-select', (e) => {
 *     console.log('Seleccionado:', e.detail.data);
 * });
 */
class FinalistCardComponent extends HTMLElement {
    constructor() {
        super();
        this._selected = false;
        this._data = {
            idCandidatura: null,
            nombreParticipante: '',
            titulo: '',
            correoParticipante: '',
            sinopsis: '',
            fechaPresentacion: ''
        };
    }

    connectedCallback() {
        this.render();
    }

    /**
     * Inyecta los datos en el componente y actualiza la vista
     * @param {object} data - Objeto con la estructura del finalista
     */
    setData(data) {
        if (!data) return;
        this._data = { ...this._data, ...data };
        this.render();
    }

    /**
     * Retorna el objeto de datos actual del componente
     * @returns {object}
     */
    getData() {
        return this._data;
    }

    /**
     * Marca el componente como seleccionado
     */
    select() {
        if (this._selected) return;
        this._selected = true;
        this._updateSelectionUI();

        this.dispatchEvent(new CustomEvent('finalist-select', {
            detail: { data: this._data, idCandidatura: this._data.idCandidatura },
            bubbles: true
        }));

        this.dispatchEvent(new CustomEvent('finalist-toggle', {
            detail: { selected: true, data: this._data },
            bubbles: true
        }));
    }

    /**
     * Desmarca el componente
     */
    unselect() {
        if (!this._selected) return;
        this._selected = false;
        this._updateSelectionUI();

        this.dispatchEvent(new CustomEvent('finalist-unselect', {
            detail: { data: this._data, idCandidatura: this._data.idCandidatura },
            bubbles: true
        }));

        this.dispatchEvent(new CustomEvent('finalist-toggle', {
            detail: { selected: false, data: this._data },
            bubbles: true
        }));
    }

    /**
     * Alterna el estado de selección
     */
    toggle() {
        if (this._selected) {
            this.unselect();
        } else {
            this.select();
        }
    }

    /**
     * Retorna el estado de selección actual
     * @returns {boolean}
     */
    isSelected() {
        return this._selected;
    }

    /**
     * Actualiza la UI según el estado de selección
     */
    _updateSelectionUI() {
        const container = this.querySelector('.finalist-card-container');
        const circle = this.querySelector('.finalist-selection-circle');
        const innerDot = this.querySelector('.finalist-selection-dot');

        if (!container || !circle || !innerDot) return;

        if (this._selected) {
            container.classList.add('is-selected');
            circle.classList.add('border-neutral-01');
            circle.classList.remove('border-neutral-02');
            innerDot.classList.remove('d-none');
        } else {
            container.classList.remove('is-selected');
            circle.classList.remove('border-neutral-01');
            circle.classList.add('border-neutral-02');
            innerDot.classList.add('d-none');
        }
    }

    _setupEventListeners() {
        const container = this.querySelector('.finalist-card-container');
        if (!container) return;

        container.addEventListener('click', () => {
            this.toggle();
        });

        container.addEventListener('mouseenter', () => {
            if (!this._selected) {
                container.classList.add('is-hover');
            }
        });

        container.addEventListener('mouseleave', () => {
            container.classList.remove('is-hover');
        });
    }

    _formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }

    render() {
        const displayName = this._data.titulo
            ? `${this._data.nombreParticipante} - ${this._data.titulo}`
            : this._data.nombreParticipante;

        this.innerHTML = `
            <div class="finalist-card-container d-flex flex-row p-16px align-items-start gap-24px box-shadow-02 bg-neutral-09 cursor-pointer transition-all-300ms">
                <div class="finalist-selection-wrapper d-flex justify-content-center align-items-center">
                    <div class="finalist-selection-circle d-flex justify-content-center align-items-center border border-neutral-02 w-24px h-24px min-w-24px border-radius-50">
                        <div class="finalist-selection-dot w-12px h-12px bg-neutral-01 border-radius-50 d-none"></div>
                    </div>
                </div>
                
                <div class="d-flex flex-column gap-4px min-w-1px flex-1">
                    <span class="fw-500 text-neutral-01 line-height-120">${displayName}</span>
                    <span class="fs-12px text-neutral-03">${this._data.correoParticipante}</span>
                    <span class="fs-12px text-neutral-03 text-truncate-multiline-3 line-height-140">${this._data.sinopsis}</span>
                </div>
                
                <div class="d-flex flex-column gap-4px align-items-end min-w-fit">
                    <span class="fs-12px text-neutral-03">Presentación</span>
                    <span class="fs-12px text-neutral-01 fw-500">${this._formatDate(this._data.fechaPresentacion)}</span>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            finalist-card-component .finalist-card-container.is-hover {
                background-color: var(--neutral-06);
            }
            finalist-card-component .finalist-card-container.is-selected {
                background-color: var(--neutral-06);
            }
        `;

        if (!document.querySelector('#finalist-card-styles')) {
            style.id = 'finalist-card-styles';
            document.head.appendChild(style);
        }

        this._setupEventListeners();
        this._updateSelectionUI();
    }
}

customElements.define('finalist-card-component', FinalistCardComponent);