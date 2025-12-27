// Elementos del login

const formLogin = document.querySelector(".formLogin")
const inputExpediente = document.querySelector(".numExpediente");
const inputPassword = document.querySelector(".password");
const btnLogin = document.querySelector(".btnLogin");
const mensajeError = document.querySelector(".mensajeError");

// Comprobar si la sesion esta iniciada al cargar la pagina


// Validaciones de los campos del login

inputExpediente.addEventListener('blur', (event) => {
    if (inputExpediente.value.trim() === '') {
        mensajeError.textContent = 'El campo del expediente no puede estar vacío.';
        mensajeError.style.color = 'red';
    } else {
        mensajeError.textContent = '';
    }   
});

inputPassword.addEventListener('blur', (event) => {
    if (inputPassword.value.trim() === '') {
        mensajeError.textContent = 'El campo contraseña no puede estar vacío.';
        mensajeError.style.color = 'red';
    } else {
        mensajeError.textContent = '';
    }   
});


// Evento click del boton de login
formLogin.addEventListener('submit', (event) =>{
    event.preventDefault();
    login();
});

async function login(){

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


    // Procesar la respuesta de la API
    let result = await response.json();

    if(result.status === 'success'){
        mensajeError.textContent = result.message;
        mensajeError.style.color = 'green';
        // Redirigir a la pagina principal si el login es exitoso
        setTimeout(() => {
            window.location.href = "./index.html";
        }, 500);
    } else {
        // Mostrar mensaje de error si el login falla
        mensajeError.textContent = result.message;
        mensajeError.style.color = 'red';
    }

}