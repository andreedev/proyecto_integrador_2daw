/**
 * Componente de notificación rápida (Feedback)
 * Basado en modal-component para consistencia visual
 * * Ejemplo de uso:
 * <notification-component id="myNotifier"></notification-component>
 * JS:
 * document.getElementById('myNotifier').show("Operación exitosa");
 */
class NotificationComponent extends HTMLElement {
    constructor() {
        super();
        this._modal = null;
        this._messageElement = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <modal-component id="internal-modal-${this.id}" size="auto" static>
                <div class="d-flex flex-column w-auto p-24px gap-32px align-items-center text-center">
                    <p class="notification-message max-w-260px text-neutral-01 font-medium"></p>
                    <div class="primary-button-02 close-modal w-100 cursor-pointer">
                        Cerrar
                    </div>
                </div>
            </modal-component>
        `;

        this._modal = this.querySelector('modal-component');
        this._messageElement = this.querySelector('.notification-message');
    }

    show(message) {
        if (!this._modal || !this._messageElement) return;

        this._messageElement.textContent = message;
        this._modal.open();
    }

    hide() {
        if (this._modal) this._modal.close();
    }
}

customElements.define('notification-component', NotificationComponent);