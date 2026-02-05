/**
 * @class PrizeManagerComponent
 * @extends HTMLElement
 * * Web Component orquestador para la gestión de premios.
 * * @description
 * Administra la creación de premios mediante tres campos de entrada, valida que el
 * nombre esté presente y permite la gestión de una lista dinámica de premios.
 * *
 * Métodos públicos:
 * - setData(prizes: Array): Carga una lista existente de premios en el contenedor.
 * - getData(): Retorna un Array con los objetos de datos de todos los premios actuales.
 *
 * @example
 * <prize-manager-component></prize-manager-component>
 */
class PrizeManagerComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this._setupEventListeners();
    }

    /**
     * Inyecta los datos en el componente y sincroniza con el DOM
     * @param {object} data - Objeto con la estructura del premio
     */
    setData(data) {
        if (!data) return;

        this._data = { ...this._data, ...data };

        if (data.idPremio !== undefined) this.setAttribute('id-premio', data.idPremio);
        if (data.nombre !== undefined) this.setAttribute('nombre', data.nombre);

        this.setAttribute('incluye-dinero', String(this._data.incluyeDinero));
        this.setAttribute('cantidad-dinero', String(this._data.cantidadDinero));
        this.setAttribute('incluye-objeto-adicional', String(this._data.incluyeObjetoAdicional));
        this.setAttribute('objeto-adicional', this._data.objetoAdicional || '');

        if (data.removable !== undefined) this.setAttribute('removable', String(data.removable));

        // 3. Renderizamos
        this.render();
    }

    /**
     * Recupera todos los premios actuales en un array de objetos
     * @returns {Array<Object>}
     */
    getData() {
        const prizeElements = this.querySelectorAll('prize-component');
        return Array.from(prizeElements).map(el => el.getData());
    }

    _setupEventListeners() {
        const btnAgregar = this.querySelector('#agregarCardPremio');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => this._handleAddPrize());
        }
    }

    async _handleAddPrize() {
        const nameInput = this.querySelector('#prizeNameInput');
        const rewardInput = this.querySelector('#prizeDescriptionInput');
        const extraInput = this.querySelector('#objetoAdicionalInput');

        if (nameInput.validate().valid) {
            const rewardVal = rewardInput.value.trim();
            const extraVal = extraInput.value.trim();

            const amount = parseFloat(rewardVal);
            const hasMoney = !isNaN(amount) && amount > 0;

            const prizeData = {
                idPremio: Date.now().toString(),
                nombre: nameInput.value,
                incluyeDinero: hasMoney,
                cantidadDinero: hasMoney ? amount : 0,
                incluyeObjetoAdicional: extraVal !== "",
                objetoAdicional: extraVal,
                removable: true
            };

            this._createNewPrizeElement(prizeData);

            if (nameInput.clear) nameInput.clear();
            if (rewardInput.clear) rewardInput.clear();
            if (extraInput.clear) extraInput.clear();
        }
    }

    /**
     * Instancia y añade un nuevo prize-component al contenedor
     */
    _createNewPrizeElement(data) {
        const container = this.querySelector('#premiosContainer');
        const prizeEl = document.createElement('prize-component');

        container.appendChild(prizeEl);
        prizeEl.setData(data);
    }

    _clearInputs(inputs) {
        inputs.forEach(input => {
            if (input.clear) input.clear();
            else input.value = '';
        });
    }

    render() {
        this.innerHTML = `
        <div class="d-flex flex-column gap-16px">
            <div class="d-flex align-items-center justify-space-between">
                <span class="fw-600 fs-18px premios-text text-neutral-01">Premios</span>
                <button class="primary-button-02 fs-14px cursor-pointer" id="agregarCardPremio">Agregar</button>
            </div>

            <div class="d-flex flex-row justify-space-between align-items-center gap-24px">
                <input-component
                        label="Nombre"
                        type="text"
                        id="prizeNameInput"
                        required
                        class="w-100"
                ></input-component>
                <input-component
                        label="Recompensa (dinero)"
                        type="text"
                        id="prizeDescriptionInput"
                        type="number"
                        class="w-100"
                ></input-component>
            </div>

            <input-component
                    label="Objeto adicional (opcional)"
                    type="text"
                    id="objetoAdicionalInput"
                    class="w-100"
            ></input-component>

            <div id="premiosContainer" class="d-flex flex-column gap-8px">
                </div>
        </div>
        `;
    }
}

customElements.define('prize-manager-component', PrizeManagerComponent);