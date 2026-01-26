const faqData = [
    {
        question: "¿Quiénes pueden participar exactamente?",
        answer: "Pueden participar estudiantes actuales de Ciclos Formativos, Grado o Máster de la UE.También antiguos alumnos(Alumni) que se hayan graduado en 2024/2025 (Categoría UE) o en los últimos cinco cursos académicos desde el 2019/2020 (Categoría Alumni)."
    },
    {
        question: "¿El concurso es individual o por equipos?",
        answer: "La inscipción es individual.Como participante, deberás aportar tu número de expediente y documento de identidad oficial"
    },
    {
        question: "Si soy Alumni de hace 3 años, ¿en qué categoría entro?",
        answer: "Entrarías en la categoría 'Mejor Cortometraje Alumni', destinada a graduados de los cursos 2019/20 hasta el 2023/24"
    },
    {
        question: "¿Qué duración debe tener mi corto?",
        answer: "La duración máxima  es de 20 minutos, incluyendo los títulos de crédito. ¡Asegúrate de no pasarte ni un segundo!."
    },
    {
        question: "¿Puedo presentarlo en un idioma que no sea castellano?",
        answer: "Sí, aceptamos cortos en cualquier idioma, pero es obligatorio que incluyan subtítulos en castellano."
    },
    {
        question: "¿Cuáles son las especificaciones técnicas del archivo?",
        answer: "Para que tu corto se vea perfecto en la gala, debe cumpplir estos requisitos:Formato: QuickTime MOV (H.264) o MP4. Resolución: 1920X1080p a 25 fps. Aspecto: 16:9 con audio estéreo."
    },
    {
        question: "¿Cómo se eligen a los ganadores?",
        answer: "El concurso tiene dos frases. primero, un comité de profesores realizará una Fase de Visionado para elegir 3 finalistas por categoría. Después, un jurado experto decidirá los ganadores definitivos."
    }
];

function renderFAQ() {
    const container = document.getElementById('faq-list');
    container.innerHTML = '';

    faqData.forEach(item => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
                    <div class="faq-question">${item.question}</div>
                    <div class="faq-answer">${item.answer}</div>
                `;
        faqItem.addEventListener('click', () => {
            faqItem.classList.toggle('active');
        });
        container.appendChild(faqItem);
    });
}

document.addEventListener('DOMContentLoaded', renderFAQ);