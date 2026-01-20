const btnCrearEdicionAnterior = document.getElementById("btnCrearEdicionAnterior");

const numEdiciones = document.getElementById("numEdiciones");

const editionCard = document.getElementById("editionCard");
const editarEdicion = document.getElementById("editarEdicion");
const eliminarEdicion = document.getElementById("eliminarEdicion");
const editionTitle = document.getElementById("editionTitle");
const statValueParticipantes = document.getElementById("statValueParticipantes");
const statValueGanadores = document.getElementById("statValueGanadores");
const statValueImagenes = document.getElementById("statValueImagenes");
const statValueTipo = document.getElementById("statValueTipo");

/*Modal*/
const label = document.getElementById("label");
const labelNum = document.getElementById("labelNum");
const labelResumen = document.getElementById("labelResumen");
const labelNom = document.getElementById("labelNom");
const labelCategoria = document.getElementById("labelCategoria");
const labelPuesto = document.getElementById("labelPuesto");
const icon =  document.getElementById("icon");
const modalCrearEdicionAnterior = document.getElementById("modalCrearEdicionAnterior");
const cerrarModalCrear = document.getElementById("cerrarModalCrear");
const inputYear = document.getElementById("inputYear");
const errorMessageYear = document.getElementById("errorMessageYear");
const inputNumParticipantes = document.getElementById("inputNumParticipantes");
const errorMessageNumParticipantes = document.getElementById("errorMessageNumParticipantes");
const iconNum = document.getElementById("iconNum");
const inputResumen = document.getElementById("inputResumen");
const iconResumen = document.getElementById("iconResumen");
const errorMessageResumen = document.getElementById("errorMessageResumen");

const dropZoneCrearEdicion = document.getElementById("dropZoneCrearEdicion");
const fileInputCrearEdicion = document.getElementById("fileInputCrearEdicion");
const numImagenesVideos = document.getElementById("numImagenesVideos");

const numGanadoresRegistrados = document.getElementById("numGanadoresRegistrados");
const btnAgregarGanador = document.getElementById("btnAgregarGanador");
const iconoEliminarGanador = document.getElementById("iconoEliminarGanador");
const nombreGanador = document.getElementById("nombreGanador");
const categoriaGanador = document.getElementById("categoriaGanador");
const puestoGanador = document.getElementById("puestoGanador");
const nombreVideoGanador = document.getElementById("nombreVideoGanador");
const inputNombre = document.getElementById("inputNombre");
const iconNom = document.getElementById("iconNom");
const errorMessageNombre = document.getElementById("errorMessageNombre");
const inputCategoria = document.getElementById("inputCategoria");
const iconCategoria = document.getElementById("iconCategoria");
const errorMessageCategoria = document.getElementById("errorMessageCategoria");
const inputPuesto = document.getElementById("inputPuesto");
const iconPuesto = document.getElementById("iconPuesto");
const errorMessagePuesto = document.getElementById("errorMessagePuesto");

const dropZoneVideoGanador = document.getElementById("dropZoneVideoGanador");
const fileInputVideoGanador = document.getElementById("fileInputVideoGanador");

const btnGuardarGanador = document.getElementById("btnGuardarGanador");

const btnCancelarModal = document.getElementById("btnCancelarModal");
const btnGuardarModal = document.getElementById("btnGuardarModal");


/*Eventos*/
btnCrearEdicionAnterior.addEventListener("click", () => {
    modalCrearEdicionAnterior.showModal();
})

//Accion para que salga el modal  de editar edicion anterior

//Accion para que se elimine la edicion anterior

cerrarModalCrear.addEventListener("click", () => {
    modalCrearEdicionAnterior.close();
});

btnCancelarModal.addEventListener("click", () => {
    modalCrearEdicionAnterior.close();
});

// Focus si está vacío el imput
inputYear.addEventListener("blur", () => {
    if (inputYear.value.trim() === "") {
        errorMessageYear.textContent = "El año de edición es obligatorio.";
        label.classList.add("incorrecto");
        icon.classList.add("cross");

    } else{
        errorMessageYear.textContent = "";
        label.classList.remove("incorrecto");
        icon.classList.remove("cross");
    }
});

inputNumParticipantes.addEventListener("blur", () => {
    if (inputNumParticipantes.value.trim() === "") {
        errorMessageNumParticipantes.textContent = "El número de participantes es obligatorio.";
        labelNum.classList.add("incorrecto");
        iconNum.classList.add("cross");
    } else {
        errorMessageNumParticipantes.textContent = "";
        labelNum.classList.remove("incorrecto");
        iconNum.classList.remove("cross");
    }
});

inputResumen.addEventListener("blur", () => {
    if (inputResumen.value.trim() === "") {
        errorMessageResumen.textContent= "El resumen es obligatorio.";
        labelResumen.classList.add("incorrecto");
        iconResumen.classList.add("cross");
    } else {
        errorMessageResumen.textContent = "";
        labelResumen.classList.remove("incorrecto");
        iconResumen.classList.remove("cross");
    }
});

inputNombre.addEventListener("blur", () => {
    if (inputNombre.value.trim() === "") {
        errorMessageNombre.textContent = "El nombre es obligatorio.";
        labelNom.classList.add("incorrecto");
        iconNom.classList.add("cross");
    } else {
        errorMessageNombre.textContent = "";
        labelNom.classList.remove("incorrecto");
        iconNom.classList.remove("cross");
    }
});

inputCategoria.addEventListener("blur", () => {
    if (inputCategoria.value.trim() === "") {
        errorMessageCategoria.textContent = "La categoría es obligatoria.";
        labelCategoria.classList.add("incorrecto");
        iconCategoria.classList.add("cross");
    } else {
        errorMessageCategoria.textContent = "";
        labelCategoria.classList.remove("incorrecto");
        iconCategoria.classList.remove("cross");
    }
});

inputPuesto.addEventListener("blur", () => {
    if (inputPuesto.value.trim() === "") {
        errorMessagePuesto.textContent = "El puesto es obligatorio.";
        labelPuesto.classList.add("incorrecto");
        iconPuesto.classList.add("cross");
    } else {
        errorMessagePuesto.textContent = "";
        labelPuesto.classList.remove("incorrecto");
        iconPuesto.classList.remove("cross");
    }
});


// Si hay algo escrito en el input, que el label se quede arriba
inputYear.addEventListener("input", () => {
    if (inputYear.value.trim() !== "") {
        label.classList.add("label-arriba");
        icon.classList.add("check");
    } else {
        label.classList.remove("label-arriba");
        icon.classList.remove("check");
    }
});

inputNumParticipantes.addEventListener("input", () => {
    if (inputNumParticipantes.value.trim() !== "") {
        labelNum.classList.add("label-arriba");
        iconNum.classList.add("check");
    } else {
        labelNum.classList.remove("label-arriba");
        iconNum.classList.remove("check");
    }
});

inputResumen.addEventListener("input", () => {
    if (inputResumen.value.trim() !== "") {
        labelResumen.classList.add("label-arriba");
        iconResumen.classList.add("check");
    } else {
        labelResumen.classList.remove("label-arriba");
        iconResumen.classList.remove("check");
    }
});

inputNombre.addEventListener("input", () => {
    if (inputNombre.value.trim() !== "") {
        labelNom.classList.add("label-arriba");
        iconNom.classList.add("check");
    }
    else {
        labelNom.classList.remove("label-arriba");
        iconNom.classList.remove("check");
    }
});

inputCategoria.addEventListener("input", () => {
    if (inputCategoria.value.trim() !== "") {
        labelCategoria.classList.add("label-arriba");
        iconCategoria.classList.add("check");
    } else {
        labelCategoria.classList.remove("label-arriba");
        iconCategoria.classList.remove("check");
    }
});

inputPuesto.addEventListener("input", () => {
    if (inputPuesto.value.trim() !== "") {
        labelPuesto.classList.add("label-arriba");
        iconPuesto.classList.add("check");
    } else {
        labelPuesto.classList.remove("label-arriba");
        iconPuesto.classList.remove("check");
    }
});
