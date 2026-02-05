/**
 * @class InputComponent
 * @extends HTMLElement
 * * Un Web Component de entrada de texto versátil y reutilizable con validación robusta
 * * @description
 * Soporta múltiples estados visuales: Default, Hover, Focused, Error y Disabled.
 * Incluye lógica para campos de texto normales y áreas de texto (textarea),
 * con validación nativa, por conteo de palabras o lógica personalizada.
 * *
 * @attr {string}  label             - Texto de la etiqueta flotante
 * @attr {string}  type              - Tipo de input (text, email, password, etc.). Por defecto 'text'.
 * @attr {string}  width             - Ancho del componente (ej: "300px", "100%").
 * @attr {string}  value             - Valor inicial del campo.
 * @attr {boolean} disabled          - Si está presente, deshabilita el componente.
 * @attr {boolean} required          - Si está presente, marca el campo como obligatorio.
 * @attr {boolean} textarea          - Si está presente, renderiza un <textarea> en lugar de un <input>.
 * @attr {boolean} validate-on-load  - Si está presente, ejecuta la validación nada más renderizarse.
 * @attr {boolean} no-validation     - Desactiva por completo la lógica de validación visual.
 * @attr {number}  min-length        - Cantidad mínima de caracteres permitidos.
 * @attr {number}  max-length        - Cantidad máxima de caracteres permitidos.
 * @attr {number}  max-words         - Cantidad máxima de palabras permitidas (útil para textareas).
 * @attr {string}  required-message  - Mensaje mostrado cuando el campo obligatorio está vacío.
 * @attr {string}  error-message     - Mensaje mostrado para errores de longitud (min/max).
 * @attr {string}  invalid-message   - Mensaje mostrado cuando el formato (ej. email) es incorrecto.
 *
 * @example
 * // Uso básico (Email con validación)
 * <input-component
 *      label="Correo Electrónico"
 *      type="email"
 *      required
 *      invalid-message="El formato del correo no es válido"
 *      error-message="Mínimo 5 caracteres"
 *      min-length="5">
 * </input-component>
 * * @example
 * // Área de texto con límite de palabras
 * <input-component
 *      label="Biografía"
 *      textarea
 *      max-words="50">
 * </input-component>
 */
class InputComponent extends HTMLElement {
    constructor() {
        super();
        this._touched = false;
        this._customValidationFn = null;
    }

    static get observedAttributes() {
        return [
            'label', 'type', 'width', 'disabled', 'value',
            'error-message', 'required', 'min-length', 'max-length', 'required-message',
            'validate-on-load', 'textarea', 'max-words', 'invalid-message', 'no-validation'
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.querySelector('.solid-input-container')) {
            if (name === 'value') {
                this.value = newValue;
            } else if (name === 'disabled') {
                this._updateDisabledState(newValue !== null);
            } else {
                this.render();
                this._setupEventListeners();
            }
        }
    }

    _updateDisabledState(isDisabled) {
        const container = this.querySelector('.solid-input-container');
        const field = this.querySelector('.solid-input-field');

        if (container) container.classList.toggle('is-disabled', isDisabled);
        if (field) {
            isDisabled ? field.setAttribute('disabled', '') : field.removeAttribute('disabled');
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
        this.style.visibility = 'hidden';
        await window.injectExternalStyles('../css/input-component.css', 'solid-input-styles');

        const width = this.getAttribute('width') || '100%';
        this.style.width = width;

        this.render();
        this._setupEventListeners();

        if (this.hasAttribute('validate-on-load') && !this.hasAttribute('no-validation')) {
            this.validate(true);
        }

        this.style.visibility = 'visible';
    }

    show() {
        this.classList.remove('d-none');
        this.style.display = '';
    }

    hide() {
        this.classList.add('d-none');
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
            const safeValue = (val === null || val === undefined) ? '' : val;
            field.value = safeValue;
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

            if (successIcon) successIcon.classList.add('d-none');
            if (errorIcon) errorIcon.classList.add('d-none');

            if (errorMsgSpan) {
                errorMsgSpan.classList.remove('d-block');
                errorMsgSpan.classList.add('d-none');
                errorMsgSpan.textContent = '';
            }
        }
    }

    validate(showUI = true) {
        if (this.hasAttribute('no-validation')) {
            this._clearUIState();
            return { valid: true, message: '' };
        }

        const input = this.querySelector('.solid-input-field');
        if (!input) return { valid: true, message: '' };

        const value = String(input.value || "");
        const maxWords = parseInt(this.getAttribute('max-words'));

        let { valid, message } = this._getNativeValidity(input);

        if (valid && maxWords) {
            const wordCount = countWords(value);

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

    _updateUiState(valid, message = '') {
        this._clearUIState();

        const container = this.querySelector('.solid-input-container');
        const errorMsgSpan = this.querySelector('.solid-input-error-text');
        const successIcon = this.querySelector('.icon-success-wrapper');
        const errorIcon = this.querySelector('.icon-error-wrapper');

        if (!valid) {
            container.classList.add('state-error');
            errorIcon.classList.remove('d-none');
            errorMsgSpan.textContent = message;
            errorMsgSpan.classList.remove('d-none');
            errorMsgSpan.classList.add('d-block');
        } else if (this.value.length > 0 && !this.hasAttribute('no-validation')) {
            container.classList.add('state-success');
            successIcon.classList.remove('d-none');
        }
    }

    _handleFloatingLabel(value) {
        const container = this.querySelector('.solid-input-container');
        if (!container) return;

        const strValue = (value !== null && value !== undefined) ? String(value) : '';

        if (strValue.trim().length > 0) {
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

            this.dispatchEvent(new CustomEvent('solid-input-word-count', {
                detail: { count: countWords(val), value: val },
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
            
            <div class="solid-input-icon-container icon-success-wrapper d-none">
                    <span class="icon-check w-24px h-24px bg-success-02 d-block"></span>
                </div>
                <div class="solid-input-icon-container icon-error-wrapper d-none">
                    <span class="icon-close w-24px h-24px bg-error-02 d-block"></span>
                </div>
                <span class="solid-input-error-text text-error-02 d-none"></span>
        </div>
    `;

        this._handleFloatingLabel(currentValue);
    }

    clear() {
        this._touched = false;
        const defaultValue = this.getAttribute('value') || '';
        this.value = defaultValue;
        this._clearUIState();
        this._handleFloatingLabel(defaultValue);
    }
}

customElements.define('input-component', InputComponent);