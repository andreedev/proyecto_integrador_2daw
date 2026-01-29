const contenido = document.querySelector('#contenido');

async function cargarContenido() {
    const response = await obtenerBasesLegales();
    contenido.innerHTML = response.data;
}

cargarContenido();