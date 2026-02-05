/**
 * @class PrizeComponent
 * @extends HTMLElement
 * Un Web Component para visualizar una tarjeta de premio configurable
 *
 * @description
 * Muestra información de un premio, incluyendo nombre, dotación económica opcional
 * y objeto adicional opcional. Se autogestiona para ocultar secciones sin datos
 * usando clases de utilidad.
 * *
 * @property {object} _data - El estado interno del componente con la información del premio.
 * @attr {string}  id-premio                - ID único del premio (DB).
 * @attr {string}  nombre                   - Título del premio.
 * @attr {boolean} incluye-dinero           - Si el premio tiene dotación económica.
 * @attr {number}  cantidad-dinero          - Monto del premio.
 * @attr {boolean} incluye-objeto-adicional - Si tiene un objeto físico/adicional.
 * @attr {string}  objeto-adicional         - Descripción del objeto adicional.
 *
 * Métodos públicos:
 * - setData(data: object): Inyecta el objeto de datos y renderiza el componente.
 * - getData(): Retorna el objeto de datos actual.
 * - removeElement(): Elimina el componente del DOM y dispara el evento de borrado.
 *
 * Eventos:
 * - prize-remove: Disparado cuando el usuario hace clic en el icono de eliminar.
 * El componente se autodestruye del DOM inmediatamente después.
 *
 * @example
 * // Uso vía JavaScript
 * const el = document.createElement('prize-component');
 * el.setData({
 *      idPremio: 123,
 *      nombre: "Primer Premio",
 *      incluyeDinero: true,
 *      cantidadDinero: 600,
 *      incluyeObjetoAdicional: false,
 *      objetoAdicional: ""
 * });
 *
 * @example
 * Uso mediante HTML
 * <prize-component
 *      id-premio="10"
 *      nombre="Premio Especial"
 *      cantidad-dinero="500">
 * </prize-component>
 *
 */
class PrizeComponent extends HTMLElement {
    constructor() {
        super();
        this._data = {
            idPremio: null,
            nombre: '',
            incluyeDinero: false,
            cantidadDinero: 0,
            incluyeObjetoAdicional: false,
            objetoAdicional: '',
            removable: true
        };
    }

    /**
     * Llamado cuando uno de los atributos observados cambia
     */
    attributeChangedCallback(name, oldValue, newValue) {
    }

    /**
     * Evento llamado cuando el componente es añadido al DOM
     */
    connectedCallback() {
        this.render();
    }

    /**
     * Inyecta los datos en el componente y actualiza la vista
     * @param {object} data - Objeto con la estructura del premio
     */
    setData(data) {
        if (!data) return;
        this._data = data;
    }

    /**
     * Retorna el objeto de datos actual del componente.
     * @returns {object}
     */
    getData() {
        return this._data;
    }

    /**
     * Elimina el componente del DOM y dispara el evento de borrado.
     */
    _setupEventListeners() {
        const deleteBtn = this.querySelector('.js-delete-btn');
        if (deleteBtn && this._data.removable) {
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent('prize-remove', {
                    detail: { idPremio: this._data.idPremio, data: this._data },
                    bubbles: true
                }));
                this.remove();
            };
        }
    }

    render() {
        const hasMoney = this._data.incluyeDinero && this._data.cantidadDinero > 0;
        const moneyClass = hasMoney ? 'd-flex' : 'd-none-force';

        const hasExtra = this._data.incluyeObjetoAdicional && this._data.objetoAdicional;
        const extraClass = hasExtra ? 'd-flex' : 'd-none-force';

        const deleteClass = this._data.removable ? 'd-block' : 'd-none-force';

        this.innerHTML = `
        <div class="d-flex w-100 justify-space-between align-items-start border p-12px gap-8px border-neutral-05 bg-white mb-8px">
            <div class="d-flex flex-column gap-8px">
                <div class="d-flex align-items-center gap-12px">
                    <span class="icon-trophy w-24px h-24px bg-neutral-01"></span>
                    <span class="fw-500 line-height-120 text-neutral-01">${this._data.nombre}</span>
                </div>
                
                <div class="${extraClass} align-items-center gap-12px fs-12px text-neutral-03">
                    <span class="icon-plus w-24px h-24px bg-neutral-01"></span>
                    <span class="fw-500">${this._data.objetoAdicional}</span>
                </div>
            </div>

            <div class="d-flex flex-row align-items-end gap-12px">
                <div class="${moneyClass} fs-14px fw-500 align-items-center gap-12px text-neutral-01">
                    <span class="icon-money w-24px h-24px bg-neutral-01"></span>
                    ${this._data.cantidadDinero}€
                </div>
                
                <span class="js-delete-btn icon-trash w-20px h-20px bg-neutral-01 cursor-pointer hover-scale-1-10 ${deleteClass}"></span>
            </div>
        </div>
        `;

        this._setupEventListeners();
    }
}

customElements.define('prize-component', PrizeComponent);