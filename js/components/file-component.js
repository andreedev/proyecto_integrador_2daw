/**
 * Componente Web para la carga de archivos con soporte para arrastrar y soltar.
 * Ahora soporta modo "multiple" con una cuadrícula de previsualización (galería).
 *
 * Ejemplo de uso Simple:
 * <file-component
 * label="Subir documento"
 * width="300px"
 * accept=".pdf,.docx"
 * max-size="10485760"
 * required
 * ></file-component>
 *
 * Ejemplo de uso Galería (Múltiple):
 * <file-component
 * id="galeria"
 * multiple
 * label="Galería del evento"
 * accept=".jpg,.png,.mp4"
 * primary-text="Añadir imágenes o vídeos"
 * ></file-component>
 *
 * Atributos:
 * - label: Texto de la etiqueta del campo.
 * - primary-text: Texto principal dentro de la zona de carga.
 * - secondary-text: Texto informativo (características) debajo del principal.
 * - width: Ancho del componente (ej. "300px", "100%").
 * - accept: Tipos de archivo permitidos (ej. ".pdf,.docx").
 * - max-size: Tamaño máximo permitido en bytes (ej. 10485760 para 10MB).
 * - required: Indica si el campo es obligatorio (en múltiple, requiere al menos 1 archivo).
 * - multiple: (Nuevo) Si está presente, permite seleccionar varios archivos y muestra la galería.
 * - error-type: Mensaje de error para tipo de archivo no permitido.
 * - error-size: Mensaje de error para archivo que excede tamaño máximo.
 * - error-required: Mensaje de error para campo obligatorio no completado.
 *
 * Eventos:
 * - 'file-change': Se dispara cuando se selecciona o elimina un archivo.
 * En modo simple retorna el File; en modo múltiple retorna un Array de Files.
 *
 * Métodos públicos:
 * - getFile(): Retorna el File seleccionado (modo simple) o Array de Files (modo múltiple).
 * - getData(): Retorna { file, fileId, isChanged }.
 * - validate(): Valida requisitos y formatos. Muestra error visual y retorna boolean.
 * - setAttachedMode(filePath, fileId, editable): Configura el componente con un archivo/id existente.
 * - uploadIfNeeded(): Sube archivo(s) al servidor si hubo cambios.
 * Retorna ID único (String) en modo simple o Array de IDs en modo múltiple.
 * - clear(): Limpia todos los archivos seleccionados y resetea la UI.
 */
class FileComponent extends HTMLElement {
    constructor() {
        super();
        this._file = null; // Para modo single
        this._files = [];  // Para modo multiple
        this._fileId = null;
        this._isChanged = false;
        this.style.visibility = 'hidden';
    }

    static get observedAttributes() {
        return [
            'label', 'width', 'accept', 'max-size', 'required',
            'error-type', 'error-size', 'error-required',
            'primary-text', 'secondary-text', 'multiple'
        ];
    }

    connectedCallback() {
        this.render();
        this._setupEventListeners();
        this.style.visibility = 'visible';
    }

    isMultiple() {
        return this.hasAttribute('multiple');
    }

    getFile() {
        return this.isMultiple() ? this._files : this._file;
    }

    getData() {
        return {
            file: this.getFile(),
            fileId: this._fileId, // En multiple, se actualiza tras upload
            isChanged: this._isChanged
        };
    }

    validate() {
        const errorSpan = this.querySelector('.mensajeError');
        const hasContent = this.isMultiple() ? this._files.length > 0 : (!!this._file || !!this._fileId);

        if (this.hasAttribute('required') && !hasContent) {
            errorSpan.textContent = this.getAttribute('error-required') || "Este campo es obligatorio";
            this._triggerShake();
            return false;
        }

        errorSpan.textContent = "";
        return true;
    }

    async uploadIfNeeded() {
        if (!this._isChanged) return this._fileId;

        try {
            if (this.isMultiple()) {
                // Sube todos los archivos nuevos y retorna array de IDs
                const uploadPromises = this._files.map(f => f.idArchivo ? Promise.resolve({data: {idArchivo: f.idArchivo}}) : subirArchivo(f));
                const results = await Promise.all(uploadPromises);
                const ids = results.map(r => r.data.idArchivo);
                this._fileId = ids;
                this._isChanged = false;
                return ids;
            } else {
                if (!this._file) return this._fileId;
                const result = await subirArchivo(this._file);
                this._fileId = result.data.idArchivo;
                this._isChanged = false;
                return this._fileId;
            }
        } catch (error) {
            this.querySelector('.mensajeError').textContent = "Error al subir archivos";
            throw error;
        }
    }

    clear() {
        this._file = null;
        this._files = [];
        this._fileId = null;
        this._isChanged = true;
        const input = this.querySelector('input[type="file"]');
        if (input) input.value = '';

        if (this.isMultiple()) {
            this._updateGalleryUI();
        } else {
            this.querySelector('.imageDropZone').classList.remove('hidden-force');
            this.querySelector('.archivo-aceptado').classList.add('hidden-force');
        }
        this.querySelector('.mensajeError').textContent = '';
    }

    _setupEventListeners() {
        const zone = this.querySelector('.imageDropZone');
        const input = this.querySelector('input[type="file"]');
        const removeBtn = this.querySelector('.btnEliminarArchivo');

        zone.addEventListener('click', () => input.click());

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clear();
                this._dispatchChangeEvent(null);
            });
        }

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
            const incoming = e.dataTransfer.files;
            if (incoming.length) this._processIncomingFiles(incoming);
        });

        input.addEventListener('change', () => {
            if (input.files.length) this._processIncomingFiles(input.files);
        });
    }

    _processIncomingFiles(fileList) {
        if (this.isMultiple()) {
            Array.from(fileList).forEach(file => {
                if (this._validateFile(file)) {
                    // Añadimos preview local
                    file.preview = URL.createObjectURL(file);
                    this._files.push(file);
                }
            });
            this._isChanged = true;
            this._updateGalleryUI();
            this._dispatchChangeEvent(this._files);
        } else {
            this._handleFileSelection(fileList[0]);
        }
        this.querySelector('input[type="file"]').value = '';
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
        // UI para modo SINGLE
        this.querySelector('.imageDropZone').classList.add('hidden-force');
        this.querySelector('.archivo-aceptado').classList.remove('hidden-force');
        this.querySelector('.archivo-nombre').textContent = file.name;
        const sizeDisplay = this.querySelector('.archivo-tamanio');
        if (file.size && !file.isExisting) {
            sizeDisplay.classList.remove('hidden-force');
            sizeDisplay.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        }
    }

    _updateGalleryUI() {
        const gallery = this.querySelector('.gallery-container');
        const countText = this.querySelector('.gallery-count-text');

        countText.textContent = `Archivos cargados (${this._files.length})`;
        gallery.replaceChildren();

        this._files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'position-relative aspect-ratio-1-1 bg-neutral-08 overflow-hidden';

            const isVideo = file.type?.includes('video') || file.name?.endsWith('.mp4');
            const media = document.createElement(isVideo ? 'video' : 'img');
            media.src = file.preview || file.url;
            media.className = 'w-100 h-100 object-fit-cover';
            if(isVideo) media.currentTime = 0.5;

            const overlay = document.createElement('div');
            overlay.className = 'position-absolute top-0 left-0 w-100 h-100 bg-black-alpha-40 d-flex align-items-center justify-content-center transition-all opacity-0 hover-opacity-100 z-index-2';

            const removeBtn = document.createElement('div');
            removeBtn.className = 'bg-neutral-05 p-8px border-radius-50 cursor-pointer hover-scale-1-10 transition-all';
            removeBtn.innerHTML = `<span class="icon-close d-block w-16px h-16px bg-neutral-01"></span>`;

            removeBtn.onclick = (e) => {
                e.stopPropagation();
                this._files.splice(index, 1);
                this._isChanged = true;
                this._updateGalleryUI();
                this._dispatchChangeEvent(this._files);
            };

            overlay.appendChild(removeBtn);
            item.append(media, overlay);
            gallery.appendChild(item);
        });
    }

    _triggerShake() {
        const zone = this.querySelector('.imageDropZone');
        zone.classList.add('shake-error');
        setTimeout(() => zone.classList.remove('shake-error'), 400);
    }

    _dispatchChangeEvent(data) {
        this.dispatchEvent(new CustomEvent('file-change', {
            detail: { file: data },
            bubbles: true
        }));
    }

    render() {
        const label = this.getAttribute('label') || 'Subir archivo';
        const width = this.getAttribute('width') || '100%';
        const accept = this.getAttribute('accept') || '';
        const primaryText = this.getAttribute('primary-text') || 'Haz clic o arrastra aquí';
        const secondaryText = this.getAttribute('secondary-text') || '';
        const isMultiple = this.isMultiple();

        this.innerHTML = `
            <div class="solid-file-container" style="width: ${width};">
                <label class="text-neutral-04 fs-14px d-block mb-8px">
                    ${label} ${this.hasAttribute('required') ? '*' : ''}
                </label>
                
                <div class="drop-zone-wrapper">
                    <div class="imageDropZone min-h-120px py-24px d-flex flex-column align-items-center justify-content-center cursor-pointer border border-dashed border-neutral-03 transition-all">
                        <input type="file" accept="${accept}" ${isMultiple ? 'multiple' : ''} hidden>
                        <div class="d-flex flex-column align-items-center text-center px-16px">
                            <span class="icon-upload d-block w-32px h-32px bg-neutral-01"></span>
                            <span class="d-block mt-12px text-neutral-01 font-weight-bold fs-16px">${primaryText}</span>
                            ${secondaryText ? `<span class="d-block mt-4px text-neutral-03 fs-14px">${secondaryText}</span>` : ''}
                        </div>
                    </div>

                    ${!isMultiple ? `
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
                    ` : `
                    <div class="gallery-wrapper mt-16px">
                        <p class="gallery-count-text fs-14px fw-600 text-neutral-02 mb-12px"></p>
                        <div class="gallery-container d-grid grid-template-columns-4 gap-12px"></div>
                    </div>
                    `}
                    
                    <div class="mensajeError text-error-02 fs-12px mt-8px"></div>
                </div>
            </div>
        `;
    }
}

customElements.define('file-component', FileComponent);