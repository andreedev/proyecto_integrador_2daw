// Elementos del login
const formLogin = document.querySelector(".formLogin")
const inputExpediente = document.querySelector(".numExpediente");
const inputPassword = document.querySelector(".password");
const mensajeSpan = document.querySelector(".mensaje");


/**
 * Validaciones del campo del expediente
 */
inputExpediente.addEventListener('blur', (event) => {
    if (inputExpediente.value.trim() === '') {
        mensajeSpan.textContent = 'Ingresa tu número de expediente';
        mensajeSpan.classList.add('error');
    } else {
        mensajeSpan.textContent = '';
    }   
});

/**
 * Validaciones del campo de la contraseña
 */
inputPassword.addEventListener('blur', (event) => {
    if (inputPassword.value.trim() === '') {
        mensajeSpan.textContent = 'Ingresa tu contraseña';
        mensajeSpan.classList.add('error');
    } else {
        mensajeSpan.textContent = '';
    }   
});


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
    if (!validarCampos()) return;

    // Obtener los valores de los campos
    const expediente = inputExpediente.value;
    const password = inputPassword.value;

    // Crear el objeto de datos a enviar
    const datos = new FormData();
    datos.append('numExpediente', expediente);
    datos.append('password', password);
    datos.append('action', 'login');

    // Enviar la solicitud a la API
    let response = await fetch(URL_API, {
        method: 'POST',
        body: datos
    });

    // Limpiar el mensaje de error
    mensajeSpan.textContent = '';

    // Procesar la respuesta de la API
    let result = await response.json();

    // Si el login es exitoso, redirigir al usuario
    if(result.status === 'success'){
        mensajeSpan.textContent = result.message;
        mensajeSpan.classList.add('success');
        setTimeout(() => {
            window.location.href = result.redirect;
            sessionStorage.setItem('sesionIniciada', 'true');
        }, 1000);
    } else {
        // Si el login falla, mostrar el mensaje de error
        mensajeSpan.textContent = result.message;
        mensajeSpan.classList.add('error');
    }

}

/**
 * Función para validar los campos del formulario
 */
function validarCampos() {
    if (inputExpediente.value.trim() === '') {
        mensajeSpan.textContent = 'Ingresa tu número de expediente';
        mensajeSpan.classList.add('error');
        return false;
    }

    if (inputPassword.value.trim() === '') {
        mensajeSpan.textContent = 'Ingresa tu contraseña';
        mensajeSpan.classList.add('error');
        return false;
    }

    return true;
}