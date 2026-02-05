const btnAgregar = document.getElementById('btnAgregar');
const modalText = document.getElementById('modalText');
const mensajeErrorInput = document.getElementById('mensajeErrorInput');
const cerrarModalList = document.querySelectorAll('.close-modal');

const cardPatrocinador = document.getElementById('cardPatrocinador');

const nombrePatrocinador = document.querySelector('.nombrePatrocinador');

const modal = document.querySelector('.modal');
const botonCancelarEditar = document.querySelector('.botonCancelarEdicion');

// Para hacer el input bonito
const imageInput = document.getElementById('imageInput');
const archivoAceptado = document.getElementById('archivoAceptado');
const mensajeError = document.getElementById('mensajeError');

const btnConfimar = document.querySelector('#btnConfirmar');

const deleteConfirmationDialog = document.getElementById('deleteConfirmationDialog');

const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

let modoModal = null;
let patrocinadorActual = null;

cerrarModalList.forEach(cerrarModal => {
    cerrarModal.addEventListener('click', () => {
        modal.classList.add('hidden-force');
    });
});

btnAgregar.addEventListener('click', () => {
    modal.classList.remove('hidden-force');
    modalText.textContent = 'Agregar Patrocinador';
    nombrePatrocinador.value = '';
    mensajeErrorInput.textContent = '';
    imageInput.value = '';
    archivoAceptado.classList.add('hidden-force');
    document.getElementById('imageDropZone').classList.remove('hidden-force');
    modoModal = 'agregar';
});







// Mensaje error cuando se pierde el foco
nombrePatrocinador.addEventListener('blur', () => {
    const titleValue = nombrePatrocinador.value.trim();
    if (titleValue === '') {
        mensajeErrorInput.textContent = 'El nombre del patrocinador no puede estar vacío.';
    } else {
        mensajeErrorInput.textContent = '';
    }
});




botonCancelarEditar.addEventListener('click', () => {
    modal.classList.add('hidden-force');
    // Limpiar los campos del formulario
    nombrePatrocinador.value = '';
    mensajeErrorInput.textContent = '';
    imageInput.value = '';
    archivoAceptado.classList.add('hidden-force');
    document.getElementById('imageDropZone').classList.remove('hidden-force');
});

btnConfirmarEliminar.addEventListener('click', async () => {
    const response = await eliminarPatrocinador(patrocinadorActual.idPatrocinador);
    if (response.status === 'success') {
        cargarPatrocinadores();
        deleteConfirmationDialog.close();
    } else {
        console.error('Error al eliminar patrocinador:', response.message);
    }
});

btnConfimar.addEventListener('click', async () => {
    const isNombreValid = nombrePatrocinador.value.trim() !== '';
    const isImagenValid = validarImagenRegistrar(mensajeError);

    if (!isNombreValid) {
        mensajeErrorInput.textContent = 'El nombre del patrocinador no puede estar vacío.';
    } else {
        mensajeErrorInput.textContent = '';
    }

    if (isNombreValid && isImagenValid) {
        if (modoModal === 'agregar') {
            console.log('Agregar patrocinador:', nombrePatrocinador.value);

            // subir la imagen primero
            const responseSubir = await subirArchivo(imageInput.files[0])
            const idArchivoLogo = responseSubir.status === 'success' ? responseSubir.data.idArchivo : null;

            const response = await agregarPatrocinador(nombrePatrocinador.value, idArchivoLogo);
            if (response.status === 'success') {
                finalizarOperacionExitosa();
            } else {
                mensajeError.textContent = response.message;
            }

        } else if (modoModal === 'editar') {
            try {
                let idArchivoFinal = patrocinadorActual.idArchivoLogo;

                if (imageInput.files.length > 0) {
                    const respuestaSubida = await subirArchivo(imageInput.files[0]);

                    if (respuestaSubida.status === "success") {
                        idArchivoFinal = respuestaSubida.data.idArchivo;
                    } else {
                        mensajeError.textContent = "Error al subir la nueva imagen.";
                        return;
                    }
                }

                const actualizarResponse = await actualizarPatrocinador(
                    patrocinadorActual.idPatrocinador,
                    nombrePatrocinador.value,
                    idArchivoFinal
                );

                if (actualizarResponse.status === 'success') {
                    console.log('Actualización exitosa');
                    modal.classList.add('hidden-force');
                    cargarPatrocinadores();
                    resetearFormulario();
                } else {
                    mensajeError.textContent = actualizarResponse.message;
                    console.error('Error:', actualizarResponse.message);
                }
            } catch (error) {
                console.error("Error en el proceso de editar:", error);
                mensajeError.textContent = "Error de conexión al actualizar.";
            }
        }
    }
});

function finalizarOperacionExitosa() {
    cargarPatrocinadores();
    modal.classList.add('hidden-force');
    resetearFormulario();
}

function resetearFormulario() {
    nombrePatrocinador.value = '';
    mensajeErrorInput.textContent = '';
    mensajeError.textContent = '';
    imageInput.value = ''; //
    archivoAceptado.classList.add('hidden-force');
    document.getElementById('imageDropZone').classList.remove('hidden-force');
    patrocinadorActual = null;
    modoModal = null;
}


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
        errorSpan.textContent = '';
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

setupDropZone(
    'imageDropZone',
    'imageInput',
    'archivoAceptado',
    'nombreArchivo',
    'tamanioArchivo',
    'btnEliminarArchivo',
    'mensajeError',
    ['PNG', 'JPG', 'SVG'],
    5 * 1024 * 1024 // 5 MB en bytesf
);

function validarImagenRegistrar(elementoError){
    const tieneImagenVisible = !archivoAceptado.classList.contains('hidden-force');
    const tieneArchivoEnInput = imageInput.files.length > 0;

    if (tieneArchivoEnInput || tieneImagenVisible) {
        elementoError.textContent = "";
        return true;
    } else {
        elementoError.textContent = "Por favor, selecciona una imagen para el logo del patrocinador.";
        return false;
    }
}



function renderizarPatrocinadores(patrocinadores) {
    const contenedorPatrocinadores = document.getElementById('contenedorPatrocinadores');
    contenedorPatrocinadores.replaceChildren();

    patrocinadores.forEach(patrocinador => {
        const card = document.createElement('div');
        card.classList.add('cardPatrocinador');
        card.innerHTML = `
            <div class="bodyCardPatrocinador">
                <div class="imagenPatrocinador">
                    <img src="${patrocinador.rutaArchivoLogo}" class="img">
                </div>
                <div class="iconosPatrocinador">
                    <div class="iconoEditar">
                        <div class="iconoEditarPatrocinador cursor-pointer d-inline-block w-20px h-20px icon-pencil bg-neutral-01"></div>
                    </div>
                    <div class="iconoBorrar">
                        <span class="iconoBorrarPatrocinador cursor-pointer d-inline-block w-20px h-20px icon-trash bg-neutral-01"></span>
                    </div>
                </div>
            </div>
            <div class="footerCardPatrocinador">
                <span class="nombre">${patrocinador.nombrePatrocinador}</span>
            </div>
        `;

        const iconoEditar = card.querySelector('.iconoEditarPatrocinador');
        const iconoEliminar = card.querySelector('.iconoBorrarPatrocinador');

        iconoEliminar.addEventListener('click', () => {
            deleteConfirmationDialog.showModal();
            patrocinadorActual = patrocinador;
        });

        iconoEditar.addEventListener('click', () => {
            modal.classList.remove('hidden-force');
            if(modalText) modalText.textContent = 'Editar Patrocinador';
            nombrePatrocinador.value = patrocinador.nombrePatrocinador;
            // load file name in green card
            archivoAceptado.classList.remove('hidden-force');
            document.getElementById('imageDropZone').classList.add('hidden-force');

            const fullUrl = patrocinador.rutaArchivoLogo;
            const fileName = fullUrl.split('/').pop();
            document.getElementById('nombreArchivo').textContent = fileName;
            document.getElementById('tamanioArchivo').textContent = '';
            modoModal = 'editar';
            patrocinadorActual = patrocinador;
        });

        contenedorPatrocinadores.appendChild(card);
    });
}

function cargarPatrocinadores() {
    listarPatrocinadoresAdmin()
        .then(data => {
            if (data.status === 'success') {
                renderizarPatrocinadores(data.data);
            } else {
                console.error('Error al cargar patrocinadores:', data.message);
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}

cargarPatrocinadores();