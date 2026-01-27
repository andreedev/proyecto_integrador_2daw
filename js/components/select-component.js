/**
 * Select Component
 * Dropdown reutilizable que sigue la estética del InputComponent.
 * * Ejemplo de uso:
 * <select-component
 * id="miSelect"
 * label="Categoría"
 * required
 * required-message="Debes seleccionar una opción">
 * </select-component>
 */
class SelectComponent extends HTMLElement {
    constructor() {
        super();
        this._touched = false;
        this._options = [];
        this.style.visibility = 'hidden';
    }

    static get observedAttributes() {
        return ['label', 'width', 'disabled', 'value', 'required', 'required-message'];
    }

    async connectedCallback() {
        await window.injectExternalStyles('../css/input-component.css', 'solid-input-styles');
        this.render();
        this._setupEventListeners();
        this.style.visibility = 'visible';
    }

    /**
     * Establece las opciones del dropdown vía JS
     * @param {Array} options - [{ value: '1', label: 'Opción A' }, ...]
     */
    setOptions(options) {
        this._options = options;
        this.render();
        this._setupEventListeners();
    }

    get value() {
        const field = this.querySelector('.solid-select-field');
        return field ? field.value : '';
    }

    set value(val) {
        const field = this.querySelector('.solid-select-field');
        if (field) {
            field.value = val;
            this._handleFloatingLabel(val);
        }
    }

    validate(showUI = true) {
        const select = this.querySelector('select');
        const value = select.value;
        const isRequired = this.hasAttribute('required');

        let valid = true;
        let message = '';

        if (isRequired && (!value || value === "")) {
            valid = false;
            message = this.getAttribute('required-message') || "Este campo es obligatorio";
        }

        if (showUI) this._updateUiState(valid, message);
        return { valid, message };
    }

    _updateUiState(valid, message = '') {
        const container = this.querySelector('.solid-input-container');
        const errorMsgSpan = this.querySelector('.solid-input-error-text');

        container.classList.remove('state-error', 'state-success');

        if (errorMsgSpan) {
            errorMsgSpan.classList.replace('d-block', 'd-none');
        }

        if (!valid) {
            errorMsgSpan.textContent = message;
            errorMsgSpan.classList.replace('d-none', 'd-block');
        }
    }

    _handleFloatingLabel(value) {
        const container = this.querySelector('.solid-input-container');
        if (!container) return;
        (value && value !== "") ? container.classList.add('has-value') : container.classList.remove('has-value');
    }

    _setupEventListeners() {
        const select = this.querySelector('.solid-select-field');
        const container = this.querySelector('.solid-input-container');
        if (!select) return;

        select.addEventListener('focus', () => container.classList.add('is-focused'));
        select.addEventListener('blur', () => {
            container.classList.remove('is-focused');
            this._touched = true;
            this.validate(true);
        });

        select.addEventListener('change', (e) => {
            this._handleFloatingLabel(e.target.value);
            this.validate(true);
            this.dispatchEvent(new CustomEvent('solid-select-change', {
                detail: { value: e.target.value },
                bubbles: true
            }));
        });
    }

    render() {
        const labelText = this.getAttribute('label') || '';
        const width = this.getAttribute('width') || '100%';
        const disabled = this.hasAttribute('disabled') ? 'disabled' : '';
        const isRequired = this.hasAttribute('required') ? 'required' : '';

        const optionsHtml = this._options.map(opt =>
            `<option value="${opt.value}">${opt.label}</option>`
        ).join('');

        this.innerHTML = `
            <div class="solid-input-container" style="width: ${width};">
                <label class="solid-input-label text-neutral-04">
                    ${labelText} ${this.hasAttribute('required') ? '*' : ''}
                </label>
                
                <select class="solid-input-field solid-select-field" ${isRequired} ${disabled} 
                        style="outline: none !important; box-shadow: none !important; border: none !important; border-bottom: 1px solid var(--neutral-04) !important; padding-right: 40px; background: transparent;">
                    <option value="" disabled selected hidden></option>
                    ${optionsHtml}
                </select>

                <div class="solid-input-icon-container" style="pointer-events: none; right: 0;">
                    <span class="icon-down-arrow w-24px h-24px bg-neutral-03 d-block"></span>
                </div>
                
                <span class="solid-input-error-text d-none" style="color: var(--neutral-01); margin-top: 4px; font-size: 12px;"></span>
            </div>
        `;
    }
}

customElements.define('select-component', SelectComponent);