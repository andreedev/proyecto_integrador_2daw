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
 * En modo simple retorna el File, en modo múltiple retorna un Array de Files.
 *
 * Métodos públicos:
 * - getFile(): Retorna el File seleccionado (modo simple) o Array de Files (modo múltiple).
 * - getData(): Retorna { file, fileId, isChanged }.
 * - validate(): Valida requisitos y formatos. Muestra error visual y retorna boolean.
 * - setAttachedMode(filePath, fileId, editable): Configura el componente con un archivo/id existente.
 *   En modo simple: filePath es String, fileId es String
 *   En modo múltiple: filePath es Array de Strings, fileId es Array de Strings
 * - uploadIfNeeded(): Sube archivo(s) al servidor si hubo cambios.
 * - setRawFile(file, editable): Configura el componente con un File local.
 * - isMultiple(): Retorna true si el componente está en modo múltiple.
 *   Retorna ID único (String) en modo simple o Array de IDs en modo múltiple.
 * - setPreviewMode(path): Activa modo "Solo Preview" con la imagen dada.
 * - resetPreviewMode(): Restaura el componente a modo Input desde Preview.
 * - clear(): Limpia todos los archivos seleccionados y resetea la UI.
 */
class FileComponent extends HTMLElement {
    constructor() {
        super();
        this._file = null; // Para modo single
        this._files = [];  // Para modo multiple
        this._fileId = null;
        this._isChanged = false;
        this._isEditable = true;
        this._initialized = false;
    }

    static get observedAttributes() {
        return [
            'label', 'width', 'accept', 'max-size', 'required',
            'error-type', 'error-size', 'error-required',
            'primary-text', 'secondary-text', 'multiple'
        ];
    }

    connectedCallback() {
        if (this._initialized) return;
        this.style.visibility = 'hidden';
        this.render();
        this._setupEventListeners();
        this.style.visibility = 'visible';
        this._initialized = true;
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
            this._isEditable = false;
        } else {
            this.removeAttribute('disabled');
            this._isEditable = true;
        }
        this._updateEditableState(!val);
    }

    get disabled() {
        return this.hasAttribute('disabled');
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

    /**
     * Activa el modo "Solo Preview"
     * Oculta el dropzone, labels y controles, y muestra solo la imagen
     * @param {string} path - URL completa de la imagen
     */
    setPreviewMode(path) {
        const inputContainer = this.querySelector('.input-mode-container');
        const previewContainer = this.querySelector('.preview-mode-container');
        const previewImage = this.querySelector('.preview-mode-image');

        if (!path) {
            this.clear();
            return;
        }

        // Ocultamos toda la interfaz de carga (labels, dropzone, galería)
        if(inputContainer) inputContainer.classList.add('hidden-force');

        // Configuramos la imagen
        if(previewImage) {
            previewImage.src = path;
            previewImage.onerror = () => {
                // Fallback simple si la imagen no carga
                previewImage.style.display = 'none';
                this.querySelector('.preview-error-text').classList.remove('hidden-force');
            };
        }

        // el contenedor de preview
        if(previewContainer) previewContainer.classList.remove('hidden-force');

        // Deshabilitamos edición lógica
        this._isEditable = false;
    }

    /**
     * Método para restaurar el componente a modo Input (salir de preview)
     */
    resetPreviewMode() {
        const inputContainer = this.querySelector('.input-mode-container');
        const previewContainer = this.querySelector('.preview-mode-container');

        if(inputContainer) inputContainer.classList.remove('hidden-force');
        if(previewContainer) previewContainer.classList.add('hidden-force');

        this.clear();
    }

    setAttachedMode(filePath, fileId, editable = true) {
        this._isChanged = false;
        this._isEditable = editable;

        if (this.isMultiple()) {
            // Modo múltiple: filePath y fileId deben ser arrays
            const paths = Array.isArray(filePath) ? filePath : [filePath];
            const ids = Array.isArray(fileId) ? fileId : [fileId];

            this._files = paths.map((path, index) => {
                const fileName = this._getFileNameFromPath(path);
                return {
                    name: fileName,
                    url: path,
                    idArchivo: ids[index],
                    isExisting: true
                };
            });

            this._fileId = ids;
            this._updateGalleryUI();
        } else {
            // Modo simple: filePath y fileId son strings
            const fileName = this._getFileNameFromPath(filePath);
            this._file = null;
            this._fileId = fileId;

            this._updateUI({ name: fileName, isExisting: true });

            const removeBtn = this.querySelector('.btnEliminarArchivo');
            if (removeBtn) {
                if (!editable) {
                    removeBtn.classList.add('hidden-force');
                } else {
                    removeBtn.classList.remove('hidden-force');
                }
            }
        }

        this._updateEditableState(editable);

        const errorSpan = this.querySelector('.mensajeError');
        if (errorSpan) errorSpan.textContent = "";
    }

    setRawFile(file, editable = true) {
        if (!file) return;

        if (!this._validateFile(file)) return;

        this._file = file;
        this._fileId = null;
        this._isChanged = true;
        this._isEditable = editable;

        if (this.isMultiple()) {
            file.preview = URL.createObjectURL(file);
            this._files = [file];
            this._updateGalleryUI();
        } else {
            this._updateUI(file);
        }

        this._updateEditableState(editable);
    }

    async uploadIfNeeded() {
        if (!this._isChanged && this._fileId) {
            return this._fileId;
        }

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
        if (this.isMultiple()) {
            this._files.forEach(f => {
                if (f.preview) URL.revokeObjectURL(f.preview);
            });
        } else if (this._file && this._file.preview) {
            URL.revokeObjectURL(this._file.preview);
        }

        this._file = null;
        this._files = [];
        this._fileId = null;
        this._isChanged = true;
        this._isEditable = true;

        const input = this.querySelector('input[type="file"]');
        if (input) input.value = '';

        const zone = this.querySelector('.imageDropZone');
        if (zone) zone.style.pointerEvents = 'auto';

        if (this.isMultiple()) {
            this._updateGalleryUI();
        } else {
            this.querySelector('.imageDropZone').classList.remove('hidden-force');
            this.querySelector('.archivo-aceptado').classList.add('hidden-force');
        }
        const err = this.querySelector('.mensajeError');
        if(err) err.textContent = '';

        const inputContainer = this.querySelector('.input-mode-container');
        const previewContainer = this.querySelector('.preview-mode-container');
        if(inputContainer) inputContainer.classList.remove('hidden-force');
        if(previewContainer) previewContainer.classList.add('hidden-force');
    }

    _updateEditableState(editable) {
        this._isEditable = editable;
        const removeBtn = this.querySelector('.btnEliminarArchivo');
        const zone = this.querySelector('.imageDropZone');

        if (removeBtn) {
            removeBtn.classList.toggle('hidden-force', !editable);
        }

        if (zone) {
            zone.style.pointerEvents = editable ? 'auto' : 'none';
        }

        if (this.isMultiple() && !editable) {
            this._disableGalleryEditing();
        }
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
            this._isEditable = true;
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
        this.querySelector('.mensajeError').textContent = "";

        const sizeDisplay = this.querySelector('.archivo-tamanio');
        if (file.size && !file.isExisting) {
            sizeDisplay.classList.remove('hidden-force');
            sizeDisplay.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
            sizeDisplay.classList.add('hidden-force');
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

            if (this._isEditable) {
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    this._files.splice(index, 1);
                    this._isChanged = true;
                    this._updateGalleryUI();
                    this._dispatchChangeEvent(this._files);
                };
            } else {
                removeBtn.style.display = 'none';
            }

            overlay.appendChild(removeBtn);
            item.append(media, overlay);
            gallery.appendChild(item);
        });
    }

    _disableGalleryEditing() {
        const removeButtons = this.querySelectorAll('.gallery-container .bg-neutral-05');
        removeButtons.forEach(btn => btn.style.display = 'none');
    }

    _getFileNameFromPath(path) {
        if (!path) return '';
        return path.split('/').pop().split('\\').pop();
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
                
                <div class="input-mode-container">
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

                <div class="preview-mode-container hidden-force position-relative w-100 overflow-hidden border-radius-4 bg-neutral-08">
                    <img src="" class="preview-mode-image w-100 h-100 object-fit-contain d-block" style="max-height: 300px;" alt="Vista previa">
                    <div class="preview-error-text hidden-force p-24px text-center text-neutral-03">
                        No se pudo cargar la imagen
                    </div>
                </div>

            </div>
        `;
    }
}

customElements.define('file-component', FileComponent);