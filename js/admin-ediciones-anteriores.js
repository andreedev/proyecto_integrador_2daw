const btnCrearEdición = document.querySelector(".admin-header-main-action-button");

const modalCrearEdicionesAnteriores = document.getElementById("modalCrearEdicionAnterior");

btnCrearEdición.addEventListener("click", () => {
    modalCrearEdicionesAnteriores.showModal();
})