const carousel = document.querySelector('.carousel-ediciones-anteriores');
const track = document.querySelector('.carousel-track-edicion-anterior');
const slides = document.querySelectorAll('.slide-edicion-anterior');
const indicatorsContainer = document.querySelector('.indicators-edicion-anterior-container');

const gap = 24;
// Calculamos el ancho real de un slide para el desplazamiento
const slideWidth = slides[0].offsetWidth + gap;

let currentIndex = 0;

// El maxIndex debe ser el número de slides menos los que caben en pantalla
// para no dejar huecos vacíos al final.
const slidesVisibles = Math.round(carousel.offsetWidth / slideWidth);
const maxIndex = slides.length - slidesVisibles;

/* ===== CREAR INDICADORES (Uno por cada slide real) ===== */
indicatorsContainer.innerHTML = ''; // Limpiamos contenido previo

slides.forEach((_, i) => {
    const dot = document.createElement('div');
    // Usamos la clase de edición anterior que definiste
    dot.classList.add('indicator-edicion-anterior');
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
        goToIndex(i);
    });

    indicatorsContainer.appendChild(dot);
});

const indicators = document.querySelectorAll('.indicator-edicion-anterior');

function goToIndex(index) {
    // Evitamos que el índice se salga de los límites reales de la lista
    currentIndex = Math.max(0, Math.min(index, maxIndex));

    // Movemos el track
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Actualizamos la clase activa en los puntos
    indicators.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

/* Click en slide → siguiente */
slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        // Al hacer clic, saltamos al siguiente punto
        if (index < slides.length - 1) {
            goToIndex(index + 1);
        } else {
            goToIndex(0); // Volver al inicio si es el último
        }
    });
});


/* Carousel noticias*/
const carruselNoticias = document.querySelector('.noticias-carousel');
const trackNoticias = document.querySelector('.noticias-track');
const slidesNoticias = document.querySelectorAll('.noticia-slide');
const contenedorDotsNoticias = document.getElementById('noticiasIndicators');
const btnPrevNoticias = document.getElementById('noticiaPrev');
const btnNextNoticias = document.getElementById('noticiaNext');

const gapNoticias = 24;
const widthNoticias = slidesNoticias[0].offsetWidth + gapNoticias;
let indiceActualNoticias = 0;

// Máximo de scroll permitido
const maxIndiceGaleria = Math.ceil((trackNoticias.scrollWidth - carruselNoticias.offsetWidth) / widthNoticias);

/* Crear Puntos */
for (let i = 0; i <= maxIndiceGaleria; i++) {
    const dot = document.createElement('div');
    dot.classList.add('galeria-foto-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moverA(i));
    contenedorDotsNoticias.appendChild(dot);
}

const todosLosDotsNoticias = document.querySelectorAll('.galeria-foto-dot');

function moverA(indice) {
    indiceActualNoticias = Math.max(0, Math.min(indice, maxIndiceGaleria));
    trackNoticias.style.transform = `translateX(-${indiceActualNoticias * widthNoticias}px)`;

    todosLosDotsNoticias.forEach((dot, i) => {
        dot.classList.toggle('active', i === indiceActualNoticias);
    });
}

/* Eventos Flechas */
btnNextNoticias.addEventListener('click', () => {
    indiceActualNoticias < maxIndiceGaleria ? moverA(indiceActualNoticias + 1) : moverA(0);
});

btnPrevNoticias.addEventListener('click', () => {
    indiceActualNoticias > 0 ? moverA(indiceActualNoticias - 1) : moverA(maxIndiceGaleria);
});

/* REINCORPORADO: Click en Slide para avanzar */
slidesNoticias.forEach((slide) => {
    slide.addEventListener('click', () => {
        if (indiceActualNoticias < maxIndiceGaleria) {
            moverA(indiceActualNoticias + 1);
        } else {
            moverA(0); // Vuelve al inicio si hace clic en el último
        }
    });
});


//Premios

const carruselPremios = document.querySelector('.premios-carousel');
const trackPremios = document.querySelector('.premios-track');
const slidesPremios = document.querySelectorAll('.premio-slide');
const contenedorDotsPremios = document.getElementById('premiosIndicators');
const btnPrevPremios = document.getElementById('premioPrev');
const btnNextPremios = document.getElementById('premioNext');

const gapPremios = 24;

const widthPremios = slidesPremios.length > 0 ? slidesPremios[0].offsetWidth + gapPremios : 0;
let indiceActualPremios = 0;

const maxIndicePremios = Math.ceil((trackPremios.scrollWidth - carruselPremios.offsetWidth) / widthPremios);

/* ===== CREAR PUNTOS ===== */
for (let i = 0; i <= maxIndicePremios; i++) {
    const dot = document.createElement('div');
    dot.classList.add('galeria-foto-dot');
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => moverAPremios(i));
    contenedorDotsPremios.appendChild(dot);
}

/* ===== FUNCIÓN PRINCIPAL DE MOVIMIENTO ===== */
function moverAPremios(indice) {
    indiceActualPremios = Math.max(0, Math.min(indice, maxIndicePremios));
    trackPremios.style.transform = `translateX(-${indiceActualPremios * widthPremios}px)`;

    const dotsDePremios = contenedorDotsPremios.querySelectorAll('.galeria-foto-dot');

    dotsDePremios.forEach((dot, i) => {
        dot.classList.toggle('active', i === indiceActualPremios);
    });
}


btnNextPremios.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita interferencias
    indiceActualPremios < maxIndicePremios ? moverAPremios(indiceActualPremios + 1) : moverAPremios(0);
});

btnPrevPremios.addEventListener('click', (e) => {
    e.stopPropagation();
    indiceActualPremios > 0 ? moverAPremios(indiceActualPremios - 1) : moverAPremios(maxIndicePremios);
});

/* Click en Slide para avanzar */
slidesPremios.forEach((slide) => {
    slide.addEventListener('click', () => {
        moverAPremios(indiceActualPremios < maxIndicePremios ? indiceActualPremios + 1 : 0);
    });
});


