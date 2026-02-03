// Elementos del login
const formLogin = document.querySelector(".formLogin")
const numExpedienteInput = document.querySelector("#numExpediente");
const passwordInput = document.querySelector("#password");
const mensajeSpan = document.querySelector(".mensaje");

/**
 * Evento para el envio del formulario de login
 */
formLogin.addEventListener('submit', (event) =>{
    event.preventDefault();
    login();
});

/**
 * Función para iniciar sesión
 */
async function login(){
    const validarNumExpediente = numExpedienteInput.validate().valid;
    const validarPassword = passwordInput.validate().valid;

    if(!validarNumExpediente || !validarPassword){
        return;
    }

    // Obtener los valores de los campos
    const expediente = numExpedienteInput.value.trim();
    const password = passwordInput.value.trim();

    // Crear el objeto de datos a enviar
    const datos = new FormData();
    datos.append('numExpediente', expediente);
    datos.append('password', password);
    datos.append('action', 'login');

    btnContinuar.disabled = true;

    // Enviar la solicitud a la API
    let response = await fetch(URL_API, {
        method: 'POST',
        body: datos
    });

    mensajeSpan.textContent = '';

    // Procesar la respuesta de la API
    let result = await response.json();

    btnContinuar.disabled = false;
    // Si el login es exitoso, redirigir al usuario
    if(result.status === 'success'){
        mensajeSpan.textContent = result.message;
        mensajeSpan.classList.add('success');
        setTimeout(() => {
            window.location.href = result.redirect;
            sessionStorage.setItem('sesionIniciada', 'true');
        }, 2500);
    } else {
        // Si el login falla, mostrar el mensaje de error
        mensajeSpan.textContent = result.message;
        mensajeSpan.classList.add('error');
    }

}