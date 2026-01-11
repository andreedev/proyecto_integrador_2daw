const botonAgregarPatrocinador = document.getElementById('botonAgregarPatrocinador');
const mensajeErrorInput = document.getElementById('mensajeErrorInput');

const cardPatrocinador = document.getElementById('cardPatrocinador');
const imagenPatrocinador = document.querySelector('.img');
const iconoEditar = document.querySelector('.iconoEditarPatrocinador');
const iconoEliminar = document.querySelector('.iconoBorrarPatrocinador');
const nombrePatrocinador = document.querySelector('.nombrePatrocinador');
const nombrePatrocinadorAgregar = document.querySelector('.nombrePatrocinadorAgregar');
const mensajeErrorInputPatrocinador = document.getElementById('mensajeErrorInputAgregar');

const modalEditar = document.querySelector('.modalEditar');
const cerrarModal = document.querySelector('.iconoCerrarModal');
const botonCancelarEditar = document.querySelector('.botonCancelarEdicion');

// Para hacer el input bonito
const posterInput = document.getElementById('posterInput');
const archivoAceptado = document.getElementById('archivoAceptado');
const mensajeError = document.getElementById('mensajeError');


const modalAgregarPatrocinador = document.querySelector('.modalAgregarPatrocinador');
const cerrarModalAgregar = document.querySelector('.iconoCerrarAgregarModal');
const cancelarModalAgregar = document.querySelector('.botonCancelarAgregarPatrocinador');

// Mensaje error cuando se pierde el foco
nombrePatrocinador.addEventListener('blur', () => {
    const titleValue = nombrePatrocinador.value.trim();
    if (titleValue === '') {
        mensajeErrorInput.textContent = 'El nombre del patrocinador no puede estar vacío.';
    } else {
        mensajeErrorInput.textContent = '';
    }
    
});

nombrePatrocinadorAgregar.addEventListener('blur', () => {
    const titleValue = nombrePatrocinadorAgregar.value.trim();
    if (titleValue === '') {
        mensajeErrorInputAgregar.textContent = 'El nombre del patrocinador no puede estar vacío.';
    } else {
        mensajeErrorInputAgregar.textContent = '';
    }
});


// Eventos para abrir y cerrar modales
botonAgregarPatrocinador.addEventListener('click', () => {
    modalAgregarPatrocinador.classList.remove('hidden-force');
});


iconoEditar.addEventListener('click', () => {
    modalEditar.classList.remove('hidden-force');
});

iconoEliminar.addEventListener('click', () => {

});

cerrarModal.addEventListener('click', () => {
    modalEditar.classList.add('hidden-force');
    // Limpiar los campos del formulario
    nombrePatrocinador.value = '';
    mensajeErrorInput.textContent = '';
    posterInput.value = '';
    archivoAceptado.classList.add('hidden-force');
    document.getElementById('posterDropZoneEdit').classList.remove('hidden-force');
    
});

botonCancelarEditar.addEventListener('click', () => {
    modalEditar.classList.add('hidden-force');
    // Limpiar los campos del formulario
    nombrePatrocinador.value = '';
    mensajeErrorInput.textContent = '';
    posterInput.value = '';
    archivoAceptado.classList.add('hidden-force');
    document.getElementById('posterDropZoneEdit').classList.remove('hidden-force');
});

cerrarModalAgregar.addEventListener('click', () => {
    modalAgregarPatrocinador.classList.add('hidden-force');
    mensajeErrorInputAgregar.textContent = '';
    // Limpiar los campos del formulario
    nombrePatrocinador.value = '';
    posterInput.value = '';
    archivoAceptado.classList.add('hidden-force');
    document.getElementById('posterDropZone').classList.remove('hidden-force');
});

cancelarModalAgregar.addEventListener('click', () => {
    modalAgregarPatrocinador.classList.add('hidden-force');
    // Limpiar los campos del formulario
    nombrePatrocinador.value = '';
    mensajeErrorInputAgregar.textContent = '';
    posterInput.value = '';
    archivoAceptado.classList.add('hidden-force');
    document.getElementById('posterDropZone').classList.remove('hidden-force');
});


// Lógica para el input personalizado del logo del patrocinador
function setupDropZone(zoneId, inputId,cardId, nameSpanId, sizeSpanId, removeBtnId, errorSpanID, acceptedFormats, maxSizeMB) {
    const dropZone = document.getElementById(zoneId);
    const fileInput = document.getElementById(inputId);
    const fileCard = document.getElementById(cardId);
    const nameSpan = document.getElementById(nameSpanId);
    const sizeSpan = document.getElementById(sizeSpanId);
    const removeBtn = document.getElementById(removeBtnId);
    const errorSpan = document.getElementById(errorSpanID);

    const triggerShake = () => {
        dropZone.classList.add('shake-error');
        setTimeout(() => {
            dropZone.classList.remove('shake-error');
        }, 500);
    };

    const validateFile = (file) => {

        const fileName = file.name.toLowerCase();
        const isInvalidType = !acceptedFormats.some(format => fileName.endsWith(format.toLowerCase()));

        if (isInvalidType) {
            errorSpan.textContent = `Formato no válido. Formatos aceptados: ${acceptedFormats.join(', ')}`;
            triggerShake();
            return false;
        }

        if (file.size > maxSizeMB) {
            errorSpan.textContent = `El archivo excede el tamaño máximo de ${maxSizeMB} MB.`;
            triggerShake();
            return false;
        }
    
        return true;
    };

    const updateUI = (file) => {
        if(!file) return;
        dropZone.classList.add('hidden-force');
        fileCard.classList.remove('hidden-force');
        nameSpan.textContent = file.name;
        sizeSpan.textContent = formatBytes(file.size);
    };


    const clearFile = () => {
        fileInput.value = '';
        fileCard.classList.add('hidden-force');
        dropZone.classList.remove('hidden-force');
        errorSpan.textContent = '';
    };

    dropZone.addEventListener('click', () => fileInput.click());

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearFile();
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length && validateFile(files[0])) {
            fileInput.files = files;
            updateUI(files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            if (validateFile(fileInput.files[0])) {
                updateUI(fileInput.files[0]);
            } else {
                fileInput.value = "";
            }
        }
    });
 
}

function formatBytes(bytes,decimals = 2 ) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Configurar la zona de arrastre para el logo del patrocinador para el modal de agregar
setupDropZone(
    'posterDropZone',
    'posterInput',
    'archivoAceptado',
    'nombreArchivo',
    'tamanioArchivo',   
    'iconoEliminarArchivo',
    'mensajeErrorAgregar',
    ['PNG', 'JPG', 'SVG'],
    5 * 1024 * 1024 // 5 MB en bytes
);

// Función de validación antes de enviar el formulario de agregar patrocinador
setupDropZone(
    'posterDropZoneEdit',
    'posterInputEdit',
    'archivoAceptadoEdit',
    'nombreArchivoEdit',
    'tamanioArchivoEdit',
    'iconoEliminarArchivoEdit',
    'mensajeErrorEdit',
    ['PNG', 'JPG', 'SVG'],
    5 * 1024 * 1024 // 5 MB en bytes
);

function validarImagenRegistrar(mensajeError){
    if(posterInput.files.length === 0){
        mensajeError.textContent = 'Por favor, selecciona una imagen para el logo del patrocinador.';
        return false;
    }else{
        mensajeError.textContent = '';
        return true;
    }   
}