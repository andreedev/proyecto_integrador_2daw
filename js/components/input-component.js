/**
 * Input Component
 * Input reutilizable con estados: Default, Hover, Focused, Error, Disabled
 * Soporta validación estándar y validación personalizada vía callback
 *
 * Ejemplo de uso:
 * <input-component
 *     label="Correo Electrónico"
 *     type="email"
 *     width="300px"
 *     required
 *     min-length="5"
 *     max-length="50"
 *     error-message="El correo debe tener entre 5 y 50 caracteres"
 *     required-message="El correo es obligatorio"
 *     invalid-message="Por favor ingresa un correo válido"
 *     validate-on-load
 *     ></input-component>
 *
 * <input-component
 *    label="Descripción"
 *    textarea
 *    width="400px"
 *    max-words="100"
 *    ></input-component>
 *
 * <input-component
 *   label="Nombre"
 *   type="text"
 *   width="250px"
 *   disabled
 *   value="Juan Pérez"
 *   ></input-component>
 *
 *
 * Métodos públicos:
 * - setCustomValidation(callback: function): Establece una función de validación personalizada
 * - validate(showUI: boolean): Valida el input y opcionalmente actualiza la UI
 * - setValue(value: string, validate: boolean): Establece el valor del input y opcionalmente valida
 *
 * Eventos:
 * - solid-input-change: Disparado cuando el valor del input cambia
 */
class InputComponent extends HTMLElement {
    constructor() {
        super();
        this._touched = false;
        this._customValidationFn = null;
        this.style.visibility = 'hidden';
    }

    static get observedAttributes() {
        return [
            'label', 'type', 'width', 'disabled', 'value',
            'error-message', 'required', 'min-length', 'max-length', 'required-message',
            'validate-on-load', 'textarea', 'max-words', 'invalid-message', 'no-validation',
            'required'
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.querySelector('.solid-input-container')) {
            if (name === 'value') {
                this.value = newValue;
            } else {
                this.render();
                this._setupEventListeners();
            }
        }
    }

    set required(val) {
        if (val) {
            this.setAttribute('required', '');
        } else {
            this.removeAttribute('required');
        }
    }

    get required() {
        return this.hasAttribute('required');
    }


    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    async connectedCallback() {
        await window.injectExternalStyles('../css/input-component.css', 'solid-input-styles');

        const width = this.getAttribute('width') || '100%';
        this.style.display = 'block';
        this.style.width = width;

        this.render();
        this._setupEventListeners();

        if (this.hasAttribute('validate-on-load')) {
            this.validate(true);
        }

        this.style.visibility = 'visible';
    }

    setCustomValidation(callback) {
        this._customValidationFn = callback;
    }

    get value() {
        const field = this.querySelector('.solid-input-field');
        return field ? field.value : '';
    }

    set value(val) {
        const field = this.querySelector('.solid-input-field');
        if (field) {
            field.value = val;
            this._handleFloatingLabel(val);
        }
    }

    setValue(val, validate = false) {
        this.value = val

        if (validate) {
            this.validate(true);
        } else {
            const container = this.querySelector('.solid-input-container');
            const errorMsgSpan = this.querySelector('.solid-input-error-text');
            container.classList.remove('state-error', 'state-success');
            errorMsgSpan.classList.add('d-none');
        }
    }

    _clearUIState() {
        const container = this.querySelector('.solid-input-container');
        const errorMsgSpan = this.querySelector('.solid-input-error-text');
        const successIcon = this.querySelector('.icon-success-wrapper');
        const errorIcon = this.querySelector('.icon-error-wrapper');

        if (container) {
            container.classList.remove('state-error', 'state-success');

            if (successIcon) successIcon.classList.add('d-none-force');
            if (errorIcon) errorIcon.classList.add('d-none-force');

            if (errorMsgSpan) {
                errorMsgSpan.classList.replace('d-block', 'd-none-force');
            }
        }
    }

    validate(showUI = true) {
        const input = this.querySelector('input');
        const value = input.value;
        const validity = input.validity;

        let valid = true;
        let message = '';

        if (!validity.valid) {
            valid = false;
            if (validity.valueMissing) {
                message = this.getAttribute('required-message') || "Este campo es obligatorio";
            } else if (validity.tooShort) {
                message = this.getAttribute('error-message') || `Mínimo ${this.getAttribute('min-length')} caracteres`;
            } else {
                message = input.validationMessage;
            }
        }

        if (valid && this._customValidationFn) {
            const customResult = this._customValidationFn(value);
            if (!customResult.valid) {
                valid = false;
                message = customResult.message;
            }
        }

        if (showUI) {
            this._updateUiState(valid, message);
        }

        return { valid, message };
    }

    _updateUiState(valid, message = '') {
        this._clearUIState();

        const container = this.querySelector('.solid-input-container');
        const errorMsgSpan = this.querySelector('.solid-input-error-text');
        const successIcon = this.querySelector('.icon-success-wrapper');
        const errorIcon = this.querySelector('.icon-error-wrapper');

        if (!valid) {
            container.classList.add('state-error');
            errorIcon.classList.remove('d-none-force');
            errorMsgSpan.textContent = message;
            errorMsgSpan.classList.replace('d-none-force', 'd-block');
        } else if (this.value.length > 0 && !this.hasAttribute('no-validation')) {
            container.classList.add('state-success');
            successIcon.classList.remove('d-none-force');
        }
    }

    _handleFloatingLabel(value) {
        const container = this.querySelector('.solid-input-container');
        if (!container) return;

        if (value && value.trim() !== '') {
            container.classList.add('has-value');
        } else {
            container.classList.remove('has-value');
        }
    }

    _setupEventListeners() {
        const input = this.querySelector('.solid-input-field');
        const container = this.querySelector('.solid-input-container');
        if(!input) return;

        input.addEventListener('focus', () => container.classList.add('is-focused'));
        input.addEventListener('blur', () => {
            container.classList.remove('is-focused');
            this._touched = true;
            this.validate(true);
        });

        input.addEventListener('input', (e) => {
            const val = e.target.value;
            this._handleFloatingLabel(val);

            const wordCount = val.trim() ? val.trim().split(/\s+/).length : 0;

            this.dispatchEvent(new CustomEvent('solid-input-word-count', {
                detail: { count: wordCount, value: val },
                bubbles: true
            }));

            if (container.classList.contains('state-error')) {
                this.validate(true);
            }

            this.dispatchEvent(new CustomEvent('solid-input-change', {
                detail: { value: val },
                bubbles: true
            }));
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const validation = this.validate(true);

                this.dispatchEvent(new CustomEvent('solid-input-enter', {
                    detail: {
                        value: this.value,
                        valid: validation.valid
                    },
                    bubbles: true
                }));
            }
        });
    }

    validate(showUI = true) {
        const input = this.querySelector('.solid-input-field');
        const value = input.value;
        const maxWords = parseInt(this.getAttribute('max-words'));

        let { valid, message } = this._getNativeValidity(input);

        if (valid && maxWords) {
            const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
            if (wordCount > maxWords) {
                valid = false;
                message = `Máximo ${maxWords} palabras permitidas`;
            }
        }

        if (valid && this._customValidationFn) {
            const customResult = this._customValidationFn(value);
            if (!customResult.valid) {
                valid = false;
                message = customResult.message;
            }
        }

        if (showUI) this._updateUiState(valid, message);
        return { valid, message };
    }

    _getNativeValidity(input) {
        const validity = input.validity;
        const type = this.getAttribute('type');
        const value = input.value;
        const minL = parseInt(this.getAttribute('min-length'));
        const maxL = parseInt(this.getAttribute('max-length'));

        if (validity.valueMissing) {
            return {
                valid: false,
                message: this.getAttribute('required-message') || "Este campo es obligatorio"
            };
        }

        if (value.length > 0) {
            const tooShort = minL && value.length < minL;
            const tooLong = maxL && value.length > maxL;

            if (tooShort || tooLong) {
                return {
                    valid: false,
                    message: this.getAttribute('error-message') || `Debe tener entre ${minL} y ${maxL} caracteres`
                };
            }
        }

        if (type === 'email' && value.length > 0) {
            if (validity.typeMismatch || !isValidEmail(value)) {
                return {
                    valid: false,
                    message: this.getAttribute('invalid-message') || "Correo electrónico no válido"
                };
            }
        }

        return { valid: true, message: '' };
    }

    render() {
        const isTextarea = this.hasAttribute('textarea');
        const labelText = this.getAttribute('label') || '';
        const type = this.getAttribute('type') || 'text';
        const width = this.getAttribute('width') || '100%';
        const currentValue = (this.getAttribute('value') || '').replace(/"/g, '&quot;');

        // Esta variable contiene el string "disabled" o vacío
        const disabled = this.hasAttribute('disabled') ? 'disabled' : '';

        const isRequired = this.hasAttribute('required') ? 'required' : '';
        const minLengthAttr = this.getAttribute('min-length') ? `minlength="${this.getAttribute('min-length')}"` : '';
        const maxLengthAttr = this.getAttribute('max-length') ? `maxlength="${this.getAttribute('max-length')}"` : '';

        const inputTag = isTextarea ?
            `<textarea class="solid-input-field is-textarea" ${isRequired} ${minLengthAttr} ${maxLengthAttr} ${disabled}>${currentValue}</textarea>` :
            `<input class="solid-input-field" type="${type}" value="${currentValue}" ${isRequired} ${minLengthAttr} ${maxLengthAttr} ${disabled}/>`;

        this.innerHTML = `
        <div class="solid-input-container ${isTextarea ? 'variant-textarea' : ''} ${this.hasAttribute('disabled') ? 'is-disabled' : ''}" style="width: ${width};">
            <label class="solid-input-label text-neutral-04">
                ${labelText} ${this.hasAttribute('required') ? '*' : ''}
            </label>
            
            ${inputTag}
            
            <div class="solid-input-icon-container icon-success-wrapper d-none-force">
                    <span class="icon-check w-24px h-24px bg-success-02 d-block"></span>
                </div>
                <div class="solid-input-icon-container icon-error-wrapper d-none-force">
                    <span class="icon-close w-24px h-24px bg-error-02 d-block"></span>
                </div>
                <span class="solid-input-error-text text-error-02 d-none-force"></span>
        </div>
    `;

        this._handleFloatingLabel(currentValue);
    }

    clear() {
        this._touched = false;
        const defaultOption = this._options.find(opt => opt.default === true);
        const defaultValue = defaultOption ? defaultOption.value : '';

        this.value = defaultValue;

        this._clearUIState();
        this._handleFloatingLabel(defaultValue);
    }
}

customElements.define('input-component', InputComponent);