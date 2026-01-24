document.addEventListener('DOMContentLoaded', async function () {
    const faqListContainer = document.getElementById('faq-list');
    if (!faqListContainer) return;

    try {
        // Llama a tu función de api-service.js
        const response = await obtenerPreguntasFrecuentes();

        if (response.status === 'success' && Array.isArray(response.data)) {
            faqListContainer.innerHTML = '';

            response.data.forEach(item => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';

                // Escapar HTML para evitar XSS
                const pregunta = item.pregunta.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const respuesta = item.respuesta
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n/g, '<br>');

                faqItem.innerHTML = `
                    <div class="faq-question">
                        ${pregunta}
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">${respuesta}</div>
                `;

                // Click para expandir/plegar
                faqItem.querySelector('.faq-question').addEventListener('click', () => {
                    document.querySelectorAll('.faq-item').forEach(other => {
                        if (other !== faqItem) {
                            other.classList.remove('active');
                        }
                    });
                    faqItem.classList.toggle('active');
                });

                faqListContainer.appendChild(faqItem);
            });
        } else {
            faqListContainer.innerHTML = '<p>No se encontraron preguntas frecuentes.</p>';
        }
    } catch (error) {
        console.error('Error al cargar las preguntas frecuentes:', error);
        faqListContainer.innerHTML = '<p>Error al cargar las preguntas. Por favor, inténtalo más tarde.</p>';
    }
});
