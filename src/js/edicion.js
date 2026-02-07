const year = document.getElementById('year');
const resumen = document.getElementById('resumen');
const nroParticipantes = document.getElementById('nroParticipantes');
const ganadoresCortosCarousel = document.getElementById('ganadoresCortosCarousel');
const galeriaFotograficaCarousel = document.getElementById('galeriaFotograficaCarousel');

(function checkPathParams(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) {
        window.location.href = 'index.html';
        return;
    }
    handleObtenerDatosEdicionAnterior(id);
})()

async function handleObtenerDatosEdicionAnterior(id) {
    const response = await obtenerEdicionAnteriorById(id);
    if(response.status === 'success') {
        renderizarDatosEdicionAnterior(response.data);
    }
}

function renderizarDatosEdicionAnterior(data) {
    year.textContent = data.anioEdicion;
    resumen.textContent = data.resumenEvento;
    nroParticipantes.textContent = data.nroParticipantes;
    renderizarCarruselGaleria(data.archivos);
    renderizarCarruselGanadores(data.ganadores, data.anioEdicion);
}

function renderizarCarruselGaleria(galeria) {
    const slides = [];
    galeria.forEach(archivo => {
        let html = '';
        if (archivo.tipoArchivo === 'video') {
            html = `<video-player-component src="${archivo.rutaArchivo}"></video-player-component>`;
        } else if (archivo.tipoArchivo === 'imagen') {
            html = `<div class="w-100"><img src="${archivo.rutaArchivo}" class="w-100"/></div>`;
        }
        slides.push(html);
    });
    galeriaFotograficaCarousel.setSlides(slides);
}


function renderizarCarruselGanadores(ganadores, editionYear) {
    const slides = [];
    ganadores.forEach((ganador) => {
        let html = `
            <div class="w-100 d-flex flex-column align-items-center border border-neutral-06">
                <video-player-component src="${ganador.rutaArchivoVideo}"></video-player-component>
                <div class="w-100 d-flex flex-column p-16px align-items-center gap-4px">
<!--                    <p class="fs-20px fw-600">${ganador.titulo}</p>-->
                    <p class="fs-20px fw-600">${ganador.nombre}</p>
                    <span class="fw-14px fw-500">${ganador.categoria} - ${ganador.premio}</span>
                    <span class="fs-12px fw-500">Edicion ${editionYear}</span>
                </div>
            </div>
        `;
        slides.push(html);
    });

    ganadoresCortosCarousel.setSlides(slides);
}