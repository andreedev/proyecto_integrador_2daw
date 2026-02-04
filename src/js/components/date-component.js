/**
 * Componente de fecha con soporte para fecha, hora y ambos
 * Nombre de etiqueta: <date-component>
 *
 * Ejemplo de uso:
 * <date-component
 *     label="Fecha de Nacimiento"
 *     width="250px"
 *     type="date"
 *     format="dd/MM/yyyy"
 *     value="2026-01-01">
 * </date-component>
 *
 * Atributos:
 * - label: Etiqueta del campo (por defecto "Fecha")
 * - width: Ancho del componente (por defecto "100%")
 * - type: Tipo de selector ("date", "time", "datetime"; por defecto "date")
 * - format: Formato de visualización de la fecha/hora (por defecto "dd/MM/yyyy" o "HH:mm" para tiempo)
 * - value: Valor inicial en formato ISO (YYYY-MM-DD para fecha, HH:mm para hora)
 * - container: Selector CSS del contenedor donde se montará el datepicker (opcional)
 *
 * Eventos:
 * - date-change: Se dispara cuando cambia la fecha/hora seleccionada. El detalle del evento incluye:
 *   - date: Objeto Date seleccionado
 *   - iso: Valor en formato ISO
 *
 * Métodos públicos:
 * - setDate(val): Establece la fecha/hora seleccionada. `val` puede ser un objeto Date o una cadena en formato ISO.
 * - getISOValue(): Devuelve la fecha/hora seleccionada en formato ISO.
 * - onSelect: Propiedad para asignar una función callback que se ejecuta al seleccionar una fecha/hora.
 */
class DateComponent extends HTMLElement {
    constructor() {
        super();
        this._datepicker = null;
        this._onSelectCallback = null;
        this._eventDates = new Set();
    }

    static get observedAttributes() {
        return ['label', 'width', 'value', 'type', 'format', 'container', 'disabled', 'inline'];
    }

    async connectedCallback() {
        this.style.visibility = 'hidden';
        await window.injectExternalStyles('../css/date-component.css', 'date-component-styles');
        this.render();
        this._initPicker();
        this.style.visibility = 'visible';
    }

    _initPicker() {
        const input = this.querySelector('input');
        const type = this.getAttribute('type') || 'date';
        const displayFormat = this.getAttribute('format') || (type === 'time' ? 'HH:mm' : 'dd/MM/yyyy');
        const isDisabled = this.hasAttribute('disabled');
        const isInline = this.hasAttribute('inline');

        const containerSelector = this.getAttribute('container');
        const containerElement = containerSelector ? document.querySelector(containerSelector) : undefined;

        const anchorElement = isInline
            ? this.querySelector('.solid-date-inline-container')
            : this.querySelector('input');

        if (!anchorElement) return;

        const config = {
            container: containerElement,
            inline: isInline,
            autoClose: !isInline,
            dateFormat: displayFormat,
            timepicker: type === 'time' || type === 'datetime',
            onlyTimepicker: type === 'time',
            timeFormat: 'HH:mm',
            minutesStep: 15,
            locale: this._getSpanishLocale(),
            buttons: this._getButtons(type),
            onShow: (isFinished) => {
                if (isDisabled && isFinished) {
                    this._datepicker.hide();
                }
            },
            onRenderCell: ({date, cellType}) => {
                if (cellType === 'day') {
                    const dateKey = this._formatDateToKey(date);
                    if (this._eventDates.has(dateKey)) {
                        return {
                            html: `${date.getDate()}<span class="datepicker-event-dot"></span>`,
                            classes: '-has-event-'
                        };
                    }
                }
            },
            onSelect: ({date}) => {
                const input = this.querySelector('input');
                if (input) {
                    this._handleFloatingLabel(input.value);
                }
                if (this._onSelectCallback) this._onSelectCallback(date);

                this.dispatchEvent(new CustomEvent('date-change', {
                    detail: { date, iso: this.getISOValue() },
                    bubbles: true
                }));
            },
            onChangeViewDate: ({month, year}) => {
                this.dispatchEvent(new CustomEvent('view-change', {
                    detail: { month: month + 1, year: year },
                    bubbles: true
                }));
            },
        };

        this._datepicker = new AirDatepicker(anchorElement, config);

        const initialValue = this.getAttribute('value');
        if (initialValue) {
            this.setDate(initialValue);
        } else {
            this.setDate(new Date());
        }
    }

    setEvents(dates) {
        this._eventDates = new Set(dates);

        if (this._datepicker) {
            this._datepicker.update();
        }
    }

    _formatDateToKey(date) {
        const d = new Date(date);
        const month = '' + (d.getMonth() + 1);
        const day = '' + d.getDate();
        const year = d.getFullYear();
        return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    }

    /**
     * Metodo publico para establecer la fecha/hora seleccionada
     * @param {Date|string} val - Objeto Date o cadena en formato ISO
     */
    setDate(val) {
        if (!val) {
            if (this._datepicker) this._datepicker.clear();
            this._handleFloatingLabel('');
            return;
        }

        if (!this._datepicker) return;

        let date;
        if (typeof val === 'string' && val.includes(':') && !val.includes('-')) {
            date = new Date();
            const [hours, minutes] = val.split(':');
            date.setHours(hours, minutes, 0);
        } else {
            date = val instanceof Date ? val : new Date(val);
        }

        if (isNaN(date.getTime())) return;

        this._datepicker.selectDate(date);
        this._datepicker.setViewDate(date);

        const input = this.querySelector('input');
        if (input) this._handleFloatingLabel(input.value);
    }

    getSelectedData() {
        if (!this._datepicker || this._datepicker.selectedDates.length === 0) return null;
        const selectedDate = this._datepicker.selectedDates[0];
        return {
            month: selectedDate.getMonth(),
            year: selectedDate.getFullYear()
        };
    }

    getISOValue() {
        if (!this._datepicker) return '';
        const selected = this._datepicker.selectedDates[0];
        if (!selected) return '';

        const type = this.getAttribute('type');
        if (type === 'time') {
            const h = String(selected.getHours()).padStart(2, '0');
            const m = String(selected.getMinutes()).padStart(2, '0');
            return `${h}:${m}`;
        }

        const year = selected.getFullYear();
        const month = String(selected.getMonth() + 1).padStart(2, '0');
        const day = String(selected.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    set onSelect(callback) {
        this._onSelectCallback = callback;
    }

    _handleFloatingLabel(value) {
        const container = this.querySelector('.solid-date-container');
        container.classList.toggle('has-value', !!(value && value.trim() !== ''));
    }

    render() {
        const label = this.getAttribute('label');
        const width = this.getAttribute('width') || '100%';
        const type = this.getAttribute('type') || 'date';
        const isInline = this.hasAttribute('inline');
        const iconClass = type === 'time' ? 'icon-clock' : 'icon-calendar';

        const isDisabled = this.hasAttribute('disabled');
        const disabledAttr = isDisabled ? 'disabled' : '';
        const disabledClass = isDisabled ? 'is-disabled' : '';

        const labelHtml = label ? `<label class="solid-date-label text-neutral-04">${label}</label>` : '';

        if (isInline) {
            this.innerHTML = `
                <div class="solid-date-inline-wrapper ${disabledClass}" style="width: ${width};">
                    ${labelHtml}
                    <div class="solid-date-inline-container"></div>
                </div>
            `;
        } else {
            this.innerHTML = `
                <div class="solid-date-container ${disabledClass}" style="width: ${width};">
                    ${labelHtml}
                    <div class="solid-date-input-wrapper">
                        <div class="solid-date-icon-left">
                            <span class="${iconClass} w-20px h-20px bg-neutral-03 d-block"></span>
                        </div>
                        <input type="text" class="solid-date-field" readonly ${disabledAttr}>
                    </div>
                </div>
            `;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'disabled' && oldValue !== newValue) {
            this.render();
            this._initPicker();
        }
    }

    _getButtons(type) {
        const isTime = type === 'time';
        const isInline = this.hasAttribute('inline');
        return [
            {
                content: isTime ? 'Ahora' : 'Hoy',
                className: 'custom-today-button',
                onClick: (dp) => {
                    dp.selectDate(new Date());
                    dp.setViewDate(new Date());
                    if (!isInline) dp.hide();
                }
            }
        ];
    }

    _getSpanishLocale() {
        return {
            days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            daysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            today: 'Hoy', clear: 'Limpiar', firstDay: 1
        };
    }

    clear() {
        if (!this._datepicker) return;

        this._datepicker.clear();

        const hoy = new Date();
        this.setDate(hoy);

        const input = this.querySelector('input');
        if (input) this._handleFloatingLabel(input.value);
    }
}

customElements.define('date-component', DateComponent);