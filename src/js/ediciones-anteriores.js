
const carruselVE = document.querySelector('.video-evento-carousel');
const trackVE = document.querySelector('.video-evento-track');
const slidesVE = document.querySelectorAll('.video-evento-slide');
const dotsContainerVE = document.getElementById('videoEventoIndicators');
const btnPrevVE = document.getElementById('videoEventoPrev');
const btnNextVE = document.getElementById('videoEventoNext');

const gapVE = 24;
const widthVE = slidesVE[0].offsetWidth + gapVE;
let indexVE = 0;

const maxIndexVE = Math.ceil((trackVE.scrollWidth - carruselVE.offsetWidth) / widthVE);

// Crear Puntos
for (let i = 0; i <= maxIndexVE; i++) {
    const dot = document.createElement('div');
    dot.classList.add('video-evento-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moverVE(i));
    dotsContainerVE.appendChild(dot);
}

const allDotsVE = document.querySelectorAll('.video-evento-dot');

function moverVE(indice) {
    indexVE = Math.max(0, Math.min(indice, maxIndexVE));
    // El desplazamiento ahora será proporcional al nuevo ancho del video
    trackVE.style.transform = `translateX(-${indexVE * widthVE}px)`;

    allDotsVE.forEach((dot, i) => {
        dot.classList.toggle('active', i === indexVE);
    });
}

// Eventos
btnNextVE.addEventListener('click', () => {
    indexVE < maxIndexVE ? moverVE(indexVE + 1) : moverVE(0);
});

btnPrevVE.addEventListener('click', () => {
    indexVE > 0 ? moverVE(indexVE - 1) : moverVE(maxIndexVE);
});

// Click en slide para avanzar
slidesVE.forEach(slide => {
    slide.addEventListener('click', () => {
        indexVE < maxIndexVE ? moverVE(indexVE + 1) : moverVE(0);
    });
});

cargarDatosGala();

async function cargarDatosGala() {
    const response = await obtenerDatosGala();
    renderizarDatosGala(response.data);
}

function renderizarDatosGala(data) {
    const contenidoPreEvento = document.getElementById('contenidoPreEvento');
    const contenidoPostEvento = document.getElementById('contenidoPostEvento');

    contenidoPreEvento.classList.add('d-none');
    contenidoPostEvento.classList.add('d-none');

    if (data.modo === 'pre-evento') {
        contenidoPreEvento.classList.remove('d-none');
        const preEventoTitulo = document.getElementById('preEventoTitulo');
        const preEventoDescripcion = document.getElementById('preEventoDescripcion');

        preEventoTitulo.textContent = data.titulo;
        preEventoDescripcion.textContent = data.descripcion;

    }
    if (data.modo === 'post-evento') {
        contenidoPostEvento.classList.remove('d-none');

    }
}