const faqData = [
    {
        question: "¿Quiénes pueden participar exactamente?",
        answer: "Pueden participar estudiantes actuales de cualquier universidad, así como egresados de los últimos 3 años."
    },
    {
        question: "¿El concurso es individual o por equipos?",
        answer: "El concurso puede ser tanto individual como por equipos de hasta 3 personas."
    },
    {
        question: "Si soy Alumni de hace 3 años, ¿en qué categoría entro?",
        answer: "Los alumni de hasta 3 años pueden participar en la categoría 'Egresados' o 'Profesionales Emergentes'."
    },
    {
        question: "¿Qué duración debe tener mi corto?",
        answer: "La duración máxima permitida es de 10 minutos, incluyendo créditos."
    },
    {
        question: "¿Puedo presentarlo en un idioma que no sea castellano?",
        answer: "Sí, puedes presentar tu corto en cualquier idioma, pero debe incluir subtítulos en castellano."
    },
    {
        question: "¿Cuáles son las especificaciones técnicas del archivo?",
        answer: "Formato MP4, resolución mínima 1080p, codec H.264, audio AAC estéreo."
    },
    {
        question: "¿Cómo se eligen a los ganadores?",
        answer: "Un jurado compuesto por profesionales del cine y académicos evalúa los trabajos según creatividad, técnica y narrativa."
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