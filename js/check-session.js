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

    const getNormalizedPage = () => {
        const p = window.location.pathname.split("/").pop().toLowerCase();
        if (p === "" || p === "index.html") return "home";
        return p.replace(".html", "").replace(".php", "");
    };

    const currentPage = getNormalizedPage();
    const referrerPath = document.referrer ? new URL(document.referrer).pathname : "";
    const previousPage = referrerPath.split("/").pop().toLowerCase() || "home";

    const formData = new FormData();
    formData.append('action', 'revisarSesion');
    formData.append('page', getNormalizedPage());

    const httpResponse = await fetch(URL_API, {
        method: 'POST',
        body: formData
    });

    const result = await httpResponse.json();
    await sleep(300);
    splash.style.display = 'none';

    if (result.status === 'active') {
        sessionStorage.setItem('sesionIniciada', 'true');
        const role = result.rol;

        if (currentPage === 'login' || previousPage.includes('login')) {
            if (role === 'participante' && currentPage === 'login') {
                window.location.href = 'index.html';
                return;
            }
            if (role === 'organizador' && currentPage === 'login') {
                window.location.href = 'admin-candidaturas.html';
                return;
            }
        }

        if (role === 'participante') {
            if (window.location.pathname.includes('admin-')) {
                window.location.href = 'index.html';
                return;
            }
        }

        if (role === 'organizador') {
            const isAdminPage = window.location.pathname.includes('admin-');
            const isLoginPage = currentPage === 'login';

            if (!isAdminPage && !isLoginPage) {
                window.location.href = 'admin-candidaturas.html';
                return;
            }
        }

    } else if (result.status === 'inactive') {
        sessionStorage.setItem('sesionIniciada', 'false');
        if (currentPage.startsWith('admin-')) {
            window.location.href = 'login.html';
            return;
        }
    }
})();