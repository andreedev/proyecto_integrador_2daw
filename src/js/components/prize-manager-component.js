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
        this._prizeList = [];
    }

    connectedCallback() {
        this.render();
        this._setupEventListeners();
    }

    /**
     * Carga una lista de premios en el componente, renderizando cada uno como un prize-component
     * @param {Array<Object>} _prizeList - Array de objetos con la estructura de cada premio
     */
    setData(_prizeList) {
        if (!_prizeList) return;
        this._prizeList = _prizeList;
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
        this.addEventListener('prize-remove', (e) => {
            const id = e.detail.idPremio;
            this._prizeList = this._prizeList.filter(p => p.idPremio !== id);
        });
    }

    _handleAddPrize() {
        const nameInput = this.querySelector('#prizeNameInput');
        const rewardInput = this.querySelector('#prizeDescriptionInput');
        const extraInput = this.querySelector('#objetoAdicionalInput');

        if (nameInput.validate(false).valid) {
            const rewardVal = rewardInput.value.trim();
            const extraVal = extraInput.value.trim();
            const hasMoney = rewardVal.length > 0;
            const amount = parseFloat(rewardVal);

            const prizeData = {
                idPremio: Date.now().toString(),
                nombre: nameInput.value,
                incluyeDinero: hasMoney,
                cantidadDinero: hasMoney ? amount : 0,
                incluyeObjetoAdicional: extraVal !== "",
                objetoAdicional: extraVal,
                removable: true
            };

            this._prizeList.push(prizeData);

            this._createNewPrizeElement(prizeData);

            nameInput.clear();
            rewardInput.clear();
            extraInput.clear();
        }
    }

    /**
     * Instancia y añade un nuevo prize-component al contenedor
     */
    _createNewPrizeElement(data) {
        const container = this.querySelector('#premiosContainer');
        const prizeEl = document.createElement('prize-component');
        prizeEl.setData(data);
        container.appendChild(prizeEl);
    }

    /**
     * Elimina todos los premios del contenedor y limpia la lista interna de premios, también limpia los campos de entrada.
     */
    clear() {
        const container = this.querySelector('#premiosContainer');
        container.replaceChildren();
        this._prizeList = [];
        const nameInput = this.querySelector('#prizeNameInput');
        const rewardInput = this.querySelector('#prizeDescriptionInput');
        const extraInput = this.querySelector('#objetoAdicionalInput');
        nameInput.clear();
        rewardInput.clear();
        extraInput.clear();
    }

    render() {
        this.innerHTML = `
            <div class="d-flex flex-column gap-16px">
                <div class="d-flex align-items-center justify-space-between">
                    <span class="fw-600 fs-18px premios-text text-neutral-01">Premios</span>
                    <button class="primary-button-02 fs-14px cursor-pointer" id="agregarCardPremio">Agregar</button>
                </div>
    
                <div class="d-flex flex-column flex-md-row justify-space-between align-items-center gap-24px">
                    <input-component
                            label="Nombre"
                            id="prizeNameInput"
                            required
                            class="w-100"
                    ></input-component>
                    <input-component
                            label="Recompensa (dinero)"
                            type="number"
                            id="prizeDescriptionInput"
                            type="number"
                            class="w-100"
                    ></input-component>
                </div>
    
                <input-component
                        label="Objeto adicional (opcional)"
                        id="objetoAdicionalInput"
                        class="w-100"
                ></input-component>
    
                <div id="premiosContainer" class="d-flex flex-column gap-8px"></div>
            </div>
        `;

        this._setupEventListeners();

        this._prizeList.forEach(prize => this._createNewPrizeElement(prize));
    }
}

customElements.define('prize-manager-component', PrizeManagerComponent);