/**
 * Funcion para pausar la ejecucion por un tiempo determinado
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Revisar si la sesión del usuario está activa o inactiva al cargar la página.
 * Redirigir al usuario a la página correspondiente según el estado de la sesión
 */
(async () => {
    const splash = document.getElementById('splash');

    const formData = new FormData();
    formData.append('action', 'revisarSesion');

    const httpResponse = await fetch(URL_API, {
        method: 'POST',
        body: formData
    });

    const result = await httpResponse.json();

    await sleep(400);

    splash.style.display = 'none';

    if (result.status == 'active') {
        sessionStorage.setItem('sesionIniciada', 'true');
        if (window.location.pathname.endsWith('login.html')) {
            window.location.href = 'index.html';
        }
    } else if (result.status == 'inactive') {
        sessionStorage.setItem('sesionIniciada', 'false');
    }
})();