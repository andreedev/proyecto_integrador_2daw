/**
 * Componente de notificación rápida (Feedback)
 * Configurable para mostrar un botón de confirmación opcional.
 * * Ejemplo de uso (Notificación simple):
 * notifier.show("Operación exitosa");
 * * Ejemplo de uso (Confirmación):
 * notifier.show("¿Estás seguro de eliminar?", {
 * confirm: true,
 * confirmText: "Eliminar",
 * onConfirm: () => deleteItem()
 * });
 */
class NotificationComponent extends HTMLElement {
    constructor() {
        super();
        this._modal = null;
        this._messageElement = null;
        this._buttonContainer = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Generamos un ID único para evitar conflictos si hay varios componentes
        const uniqueId = this.id || Math.random().toString(36).substr(2, 9);

        this.innerHTML = `
            <modal-component id="internal-modal-${uniqueId}" size="auto" static>
                <div class="d-flex flex-column w-auto p-24px gap-32px align-items-center text-center">
                    <p class="notification-message max-w-260px text-neutral-01 font-medium"></p>
                    <div class="notification-buttons d-flex gap-12px w-100">
                        </div>
                </div>
            </modal-component>
        `;

        this._modal = this.querySelector('modal-component');
        this._messageElement = this.querySelector('.notification-message');
        this._buttonContainer = this.querySelector('.notification-buttons');
    }

    /**
     * @param {string} message - El texto a mostrar
     * @param {Object} options - Configuración opcional
     * @param {boolean} options.confirm - Si debe mostrar botón de confirmación
     * @param {string} options.confirmText - Texto del botón de acción
     * @param {string} options.cancelText - Texto del botón de cierre
     * @param {Function} options.onConfirm - Callback al presionar confirmar
     */
    show(message, options = {}) {
        if (!this._modal || !this._messageElement) return;

        const {
            confirm = false,
            confirmText = "Aceptar",
            cancelText = "Cerrar",
            onConfirm = null
        } = options;

        this._messageElement.textContent = message;
        this._buttonContainer.replaceChildren();

        const btnCancel = document.createElement('div');
        btnCancel.classList.add('w-100', 'cursor-pointer', 'close-modal');
        btnCancel.classList.add('secondary-button-01');
        btnCancel.textContent = cancelText;

        if (confirm) {
            const btnConfirm = document.createElement('div');
            btnConfirm.classList.add('primary-button-01', 'w-100', 'cursor-pointer');
            btnConfirm.textContent = confirmText;

            btnConfirm.addEventListener('click', () => {
                if (onConfirm) onConfirm();
                this.hide();
            });

            this._buttonContainer.append(btnCancel, btnConfirm);
        } else {
            this._buttonContainer.append(btnCancel);
        }

        this._modal.open();
    }

    hide() {
        if (this._modal) this._modal.close();
    }
}

customElements.define('notification-component', NotificationComponent);