//Carousel info corto

const carousel = document.querySelector('.carousel-info-corto');
const track = document.querySelector('.carousel-track-info-corto');
const slides = document.querySelectorAll('.slide-info-corto');
const indicatorsContainer = document.querySelector('.indicators-info-corto');

const gap = 24;
const slideWidth = slides[0].offsetWidth + gap;

let currentIndex = 0;

const maxIndex = Math.ceil(
    (track.scrollWidth - carousel.offsetWidth) / slideWidth
);

/* ===== CREAR INDICADORES ===== */
for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.classList.add('indicator-info-corto');
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
        goToIndex(i);
    });

    indicatorsContainer.appendChild(dot);
}

const indicators = document.querySelectorAll('.indicator-info-corto');

function goToIndex(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    indicators.forEach(i => i.classList.remove('active'));
    indicators[currentIndex].classList.add('active');
}

/* Click en slide → siguiente */
slides.forEach(slide => {
    slide.addEventListener('click', () => {
        goToIndex(currentIndex + 1);
    });
});


//Carousel galeria fotos

const carruselGaleria = document.querySelector('.galeria-foto-carousel');
const trackGaleria = document.querySelector('.galeria-foto-track');
const slidesGaleria = document.querySelectorAll('.galeria-foto-slide');
const contenedorDots = document.getElementById('galeriaFotoIndicators');
const btnPrev = document.getElementById('galeriaFotoPrev');
const btnNext = document.getElementById('galeriaFotoNext');

const gapGaleria = 24;
const widthGaleria = slidesGaleria[0].offsetWidth + gapGaleria;
let indiceActual = 0;

// Máximo de scroll permitido
const maxIndiceGaleria = Math.ceil((trackGaleria.scrollWidth - carruselGaleria.offsetWidth) / widthGaleria);

/* Crear Puntos */
for (let i = 0; i <= maxIndiceGaleria; i++) {
    const dot = document.createElement('div');
    dot.classList.add('galeria-foto-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moverA(i));
    contenedorDots.appendChild(dot);
}

const todosLosDots = document.querySelectorAll('.galeria-foto-dot');

function moverA(indice) {
    indiceActual = Math.max(0, Math.min(indice, maxIndiceGaleria));
    trackGaleria.style.transform = `translateX(-${indiceActual * widthGaleria}px)`;

    todosLosDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === indiceActual);
    });
}

/* Eventos Flechas */
btnNext.addEventListener('click', () => {
    indiceActual < maxIndiceGaleria ? moverA(indiceActual + 1) : moverA(0);
});

btnPrev.addEventListener('click', () => {
    indiceActual > 0 ? moverA(indiceActual - 1) : moverA(maxIndiceGaleria);
});

/* REINCORPORADO: Click en Slide para avanzar */
slidesGaleria.forEach((slide) => {
    slide.addEventListener('click', () => {
        if (indiceActual < maxIndiceGaleria) {
            moverA(indiceActual + 1);
        } else {
            moverA(0); // Vuelve al inicio si hace clic en el último
        }
    });
});


/* Zona de videos del evento */

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

    if (data.modo === 'pre-evento') {
        const preEventoTitulo = document.getElementById('preEventoTitulo');
        const preEventoDescripcion = document.getElementById('preEventoDescripcion');

        preEventoTitulo.textContent = data.titulo;
        preEventoDescripcion.textContent = data.descripcion;

    }
    if (data.modo === 'post-evento') {

    }
}