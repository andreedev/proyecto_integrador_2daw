/**
 * Select Component
 * Dropdown reutilizable que sigue la estética del InputComponent
 *
 * Ejemplo de uso:
 * <select-component label="Selecciona una opción" width="250px" required required-message="Este campo es obligatorio"></select-component>
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
        const width = this.getAttribute('width') || '100%';
        this.style.display = 'block';
        this.style.width = width;
        this.render();
        this._setupEventListeners();
        this.style.visibility = 'visible';
    }

    setOptions(options) {
        this._options = options;

        const defaultOption = options.find(opt => opt.default === true);

        if (defaultOption) {
            this.setAttribute('value', defaultOption.value);
        }

        this.render();
        this._setupEventListeners();
    }

    get value() {
        const field = this.querySelector('.solid-select-field');
        return field ? field.value : '';
    }

    set value(val) {
        const select = this.querySelector('.solid-select-field');
        if (select) {
            select.value = val;
            this._handleFloatingLabel(val);
        }
        if (this.getAttribute('value') !== val) {
            this.setAttribute('value', val);
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
        const select = this.querySelector('select');
        if (!container || !select) return;
        if ((value !== "" && value !== null && value !== undefined) || select.selectedIndex !== -1) {
            container.classList.add('has-value');
        } else {
            container.classList.remove('has-value');
        }
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
        const currentValue = this.getAttribute('value') || '';

        const optionsHtml = this._options.map(opt => {
            const isSelected = String(opt.value) === String(currentValue) ? 'selected' : '';
            return `<option value="${opt.value}" ${isSelected}>${opt.label}</option>`;
        }).join('');

        this.innerHTML = `
        <div class="solid-input-container" style="width: ${width};">
            <label class="solid-input-label text-neutral-04">
                ${labelText} ${isRequired ? '*' : ''}
            </label>
            
            <select class="solid-input-field solid-select-field" ${isRequired} ${disabled}>
                ${optionsHtml}
            </select>

            <div class="solid-input-icon-container">
                <span class="icon-down-arrow w-24px h-24px bg-neutral-03 d-block"></span>
            </div>
            
            <span class="solid-input-error-text d-none"></span>
        </div>
    `;

        this._handleFloatingLabel(currentValue);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && oldValue !== newValue) {
            const select = this.querySelector('.solid-select-field');
            if (select) {
                select.value = newValue;
                this._handleFloatingLabel(newValue);
            }
        }
    }

    reset() {
        this._touched = false;
        const defaultOption = this._options.find(opt => opt.default === true);
        const defaultValue = defaultOption ? defaultOption.value : '';

        this.value = defaultValue;
        this._clearUIState();
    }
}

customElements.define('select-component', SelectComponent);