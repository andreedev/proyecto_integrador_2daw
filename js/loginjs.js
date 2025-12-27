const API_URL = "http://localhost/DWES/proyecto_integrador_2daw/php/api.php";

// Elementos del login

const inputUsuario = document.querySelector(".usuario");
const inputPassword = document.querySelector(".password");
const btnLogin = document.querySelector(".btnLogin");
const mensajeError = document.querySelector(".mensajeError");

// Comprobar si la sesion esta iniciada al cargar la pagina


// Validaciones de los campos del login

username.addEventListener('blur', (event) => {
    if (inputUsuario.value.trim() === '') {
        mensajeError.textContent = 'El campo usuario no puede estar vacío.';
        mensajeError.style.color = 'red';
    } else {
        mensajeError.textContent = '';
    }   
});

password.addEventListener('blur', (event) => {
    if (inputPassword.value.trim() === '') {
        mensajeError.textContent = 'El campo contraseña no puede estar vacío.';
        mensajeError.style.color = 'red';
    } else {
        mensajeError.textContent = '';
    }   
});


// Evento click del boton de login
btnLogin.addEventListener('click', () =>{
    login();
});

async function login(){

    // Obtener los valores de los campos
    const usuario = inputUsuario.value;
    const password = inputPassword.value;

    // Crear el objeto de datos a enviar

    const datos = new FormData();
    datos.append('usuario', usuario);
    datos.append('password', password);

    // Enviar la solicitud a la API

    let response = await fetch(API_URL, {
        method: 'POST',
        body: datos
    });


    // Procesar la respuesta de la API
    let result = await response.json();

    if(result.success){
        // Redirigir a la pagina principal si el login es exitoso
        window.location.href = "http://localhost/DWES/proyecto_integrador_2daw/index.html";
    } else {
        // Mostrar mensaje de error si el login falla
        mensajeError.textContent = result.message;
        mensajeError.style.color = 'red';
    }

}