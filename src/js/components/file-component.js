/**
 * Componente Web para la carga de archivos con soporte para arrastrar y soltar
 * Soporta mensajes de error personalizados y validación de obligatoriedad
 *
 * Ejemplo de uso:
 * <file-component
 *     label="Subir documento"
 *     width="300px"
 *     accept=".pdf,.docx"
 *     max-size="10485760"
 *     required
 *     error-type="Tipo de archivo no permitido"
 *     error-size="El archivo excede el tamaño máximo"
 *     error-required="Este campo es obligatorio">
 * </file-component>
 *
 * Atributos:
 * - label: Texto de la etiqueta del campo
 * - primary-text: Texto principal dentro de la zona de carga
 * - secondary-text: Texto informativo (características) debajo del principal
 * - width: Ancho del componente (ej. "300px", "50%")
 * - accept: Tipos de archivo permitidos (ej. ".pdf,.docx")
 * - max-size: Tamaño máximo permitido en bytes (ej. 10485760 para 10MB)
 * - required: Indica si el campo es obligatorio
 * - error-type: Mensaje de error para tipo de archivo no permitido
 * - error-size: Mensaje de error para archivo que excede tamaño máximo
 * - error-required: Mensaje de error para campo obligatorio no completado
 *
 * Eventos:
 * - 'file-change': Se dispara cuando se selecciona o elimina un archivo.
 *  El detalle del evento contiene el archivo seleccionado o null si se eliminó.
 *
 *  Métodos públicos:
 * - getFile(): Retorna el archivo actualmente seleccionado (File) o null
 * - getData(): Retorna un objeto con { file, fileId, isChanged }
 * - validate(): Valida el campo y muestra mensajes de error si es necesario. Retorna true/false
 * - setAttachedMode(fileName, fileId): Configura el componente en modo adjuntado con un archivo existente
 * - uploadIfNeeded(): Sube el archivo al servidor si ha cambiado. Retorna el ID del archivo subido.
 * - clear(): Limpia el archivo seleccionado y resetea el componente
 *
 */
class FileComponent extends HTMLElement {
    constructor() {
        super();
        this._file = null;
        this._fileId = null;
        this._isChanged = false;
        this.style.visibility = 'hidden';
    }

    static get observedAttributes() {
        return [
            'label', 'width', 'accept', 'max-size', 'required',
            'error-type', 'error-size', 'error-required',
            'primary-text', 'secondary-text'
        ];
    }

    connectedCallback() {
        this.render();
        this._setupEventListeners();
        this.style.visibility = 'visible';
    }

    getFile() {
        return this._file;
    }

    getData() {
        return {
            file: this._file,
            fileId: this._fileId,
            isChanged: this._isChanged
        };
    }

    validate() {
        const errorSpan = this.querySelector('.mensajeError');

        // Un campo es válido si:
        // No es obligatorio
        // Es obligatorio y tiene un archivo seleccionado (_file)
        // Es obligatorio y tiene un archivo adjuntado (_fileId)
        const hasFile = !!this._file || !!this._fileId;

        if (this.hasAttribute('required') && !hasFile) {
            errorSpan.textContent = this.getAttribute('error-required') || "Este archivo es obligatorio";
            this._triggerShake();
            return false;
        }

        errorSpan.textContent = "";
        return true;
    }

    setAttachedMode(filePath, fileId) {
        const fileName = getFileNameFromPath(filePath);

        this._file = null;
        this._fileId = fileId;
        this._isChanged = false;

        this._updateUI({ name: fileName, isExisting: true });

        const errorSpan = this.querySelector('.mensajeError');
        if (errorSpan) errorSpan.textContent = "";
    }

    async uploadIfNeeded() {
        if (!this._isChanged || !this._file) {
            return this._fileId;
        }

        try {
            const result = await subirArchivo(this._file);
            this._fileId = result.data.idArchivo;
            this._isChanged = false;
            return this._fileId;
        } catch (error) {
            this.querySelector('.mensajeError').textContent = "Error al subir archivo al servidor";
            throw error;
        }
    }

    clear() {
        this._file = null;
        this._fileId = null;
        this._isChanged = true;
        const input = this.querySelector('input[type="file"]');
        if (input) input.value = '';
        this.querySelector('.imageDropZone').classList.remove('hidden-force');
        this.querySelector('.archivo-aceptado').classList.add('hidden-force');
        this.querySelector('.mensajeError').textContent = '';
    }


    _setupEventListeners() {
        const zone = this.querySelector('.imageDropZone');
        const input = this.querySelector('input[type="file"]');
        const removeBtn = this.querySelector('.btnEliminarArchivo');

        zone.addEventListener('click', () => input.click());

        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clear();
            this._dispatchChangeEvent(null);
        });

        ['dragenter', 'dragover'].forEach(name => {
            zone.addEventListener(name, (e) => {
                e.preventDefault();
                zone.classList.add('bg-neutral-08');
            });
        });

        ['dragleave', 'drop'].forEach(name => {
            zone.addEventListener(name, (e) => {
                e.preventDefault();
                zone.classList.remove('bg-neutral-08');
            });
        });

        zone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length) this._handleFileSelection(files[0]);
        });

        input.addEventListener('change', () => {
            if (input.files.length) this._handleFileSelection(input.files[0]);
        });
    }

    _handleFileSelection(file) {
        if (this._validateFile(file)) {
            this._file = file;
            this._fileId = null;
            this._isChanged = true;
            this._updateUI(file);
            this._dispatchChangeEvent(file);
        }
    }

    _validateFile(file) {
        const errorSpan = this.querySelector('.mensajeError');
        const acceptAttr = this.getAttribute('accept');
        const allowedExtensions = acceptAttr ? acceptAttr.toLowerCase().split(',') : [];
        const maxSize = parseInt(this.getAttribute('max-size')) || 5 * 1024 * 1024;
        errorSpan.textContent = "";

        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (acceptAttr && !allowedExtensions.includes(ext)) {
            errorSpan.textContent = this.getAttribute('error-type') || `Formato no válido.`;
            this._triggerShake();
            return false;
        }

        if (file.size > maxSize) {
            errorSpan.textContent = this.getAttribute('error-size') || `El archivo es demasiado grande.`;
            this._triggerShake();
            return false;
        }
        return true;
    }

    _updateUI(file) {
        this.querySelector('.imageDropZone').classList.add('hidden-force');
        this.querySelector('.archivo-aceptado').classList.remove('hidden-force');
        this.querySelector('.archivo-nombre').textContent = file.name;
        this.querySelector('.mensajeError').textContent = "";
        const sizeDisplay = this.querySelector('.archivo-tamanio');
        if (file.size && !file.isExisting) {
            sizeDisplay.classList.remove('hidden-force');
            sizeDisplay.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
            sizeDisplay.classList.add('hidden-force');
        }
    }

    _triggerShake() {
        const zone = this.querySelector('.imageDropZone');
        zone.classList.add('shake-error');
        setTimeout(() => zone.classList.remove('shake-error'), 400);
    }

    _dispatchChangeEvent(file) {
        this.dispatchEvent(new CustomEvent('file-change', {
            detail: { file },
            bubbles: true
        }));
    }

    render() {
        const label = this.getAttribute('label') || 'Subir archivo';
        const width = this.getAttribute('width') || '100%';
        const accept = this.getAttribute('accept') || '';
        const primaryText = this.getAttribute('primary-text') || 'Haz clic o arrastra aquí';
        const secondaryText = this.getAttribute('secondary-text') || '';

        this.innerHTML = `
            <div class="solid-file-container" style="width: ${width};">
                <label class="text-neutral-04 fs-14px d-block mb-8px">
                    ${label} ${this.hasAttribute('required') ? '*' : ''}
                </label>
                
                <div class="drop-zone-wrapper">
                    <div class="imageDropZone min-h-120px py-24px d-flex flex-column align-items-center justify-content-center cursor-pointer border-dashed border-neutral-04 transition-all">
                        <input type="file" accept="${accept}" hidden>
                        <div class="d-flex flex-column align-items-center text-center px-16px">
                            <span class="icon-upload d-block w-32px h-32px bg-neutral-01"></span>
                            <span class="d-block mt-12px text-neutral-01 font-weight-bold fs-16px">${primaryText}</span>
                            ${secondaryText ? `<span class="d-block mt-4px text-neutral-03 fs-14px">${secondaryText}</span>` : ''}
                        </div>
                    </div>

                    <div class="archivo-aceptado hidden-force">
                        <div class="d-flex align-items-center px-16px py-16px bg-success-04 gap-12px border-radius-4">
                            <div class="bg-success-03 p-8px d-flex justify-center align-items-center border-radius-50 d-inline-block">
                                <span class="icon-small-check w-20px h-20px bg-neutral-02 d-block"></span>
                            </div>
                            <div class="d-flex flex-column flex-grow-1 min-w-0">
                                <div class="archivo-nombre fs-14px text-truncate font-weight-bold"></div>
                                <div class="archivo-tamanio fs-12px text-neutral-02"></div>
                            </div>
                            <span class="icon-close d-block w-24px h-24px bg-neutral-01 cursor-pointer btnEliminarArchivo"></span>
                        </div>
                    </div>
                    
                    <div class="mensajeError text-error-02 fs-12px mt-8px"></div>
                </div>
            </div>
        `;
    }
}

customElements.define('file-component', FileComponent);