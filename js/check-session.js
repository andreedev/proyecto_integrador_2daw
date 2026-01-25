/**
 * Crea el splash de carga
 */
const createSplash = () => {
    if (document.getElementById('splash')) return document.getElementById('splash');

    const splashDiv = document.createElement('div');
    splashDiv.id = 'splash';
    splashDiv.innerHTML = `<img src="../img/logo-loading.gif" alt="Cargando...">`;

    if (document.body) {
        document.body.prepend(splashDiv);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.body) {
                document.body.prepend(splashDiv);
                obs.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }

    return splashDiv;
};


/** Promesa global que se resuelve cuando se determina el estado de la sesión */
window.sessionState = {};
window.sessionReady = new Promise((resolve) => {
    window.sessionState.resolve = resolve;
});

/**
 * Revisar si la sesión del usuario está activa o inactiva al cargar la página.
 * Redirigir al usuario a la página correspondiente según el estado de la sesión
 */
const checkSessionStatus = async () => {
    const splash = createSplash();
    let isRedirecting = false;

    const getNormalizedPage = () => {
        const p = window.location.pathname.split("/").pop().toLowerCase();
        if (p === "" || p === "index.html") return "home";
        return p.replace(".html", "").replace(".php", "");
    };

    const currentPage = getNormalizedPage();
    const referrerPath = document.referrer ? new URL(document.referrer).pathname : "";
    const previousPage = referrerPath.split("/").pop().toLowerCase() || "home";

    try {
        const formData = new FormData();
        formData.append('action', 'revisarSesion');

        const httpResponse = await fetch(URL_API, {
            method: 'POST',
            body: formData
        });

        const result = await httpResponse.json();

        await new Promise(r => setTimeout(r, 400));

        if (result.status === 'active') {
            sessionStorage.setItem('sesionIniciada', 'true');
            const role = result.rol;

            if (currentPage === 'login' || previousPage.includes('login')) {
                if (role === 'participante' && currentPage === 'login') {
                    isRedirecting = true;
                    window.location.href = 'index.html';
                    return;
                }
                if (role === 'organizador' && currentPage === 'login') {
                    isRedirecting = true;
                    window.location.href = 'admin-candidaturas.html';
                    return;
                }
            }

            if (role === 'participante' && window.location.pathname.includes('admin-')) {
                window.location.href = 'index.html';
                isRedirecting = true;
                return;
            }

            if (role === 'organizador') {
                const isAdminPage = window.location.pathname.includes('admin-');
                const isLoginPage = currentPage === 'login';
                if (!isAdminPage && !isLoginPage) {
                    isRedirecting = true;
                    window.location.href = 'admin-candidaturas.html';
                    return;
                }
            }

        } else if (result.status === 'inactive') {
            sessionStorage.setItem('sesionIniciada', 'false');
            if (currentPage.startsWith('admin-')) {
                isRedirecting = true;
                window.location.href = 'login.html';
                return;
            }
        }
    } catch (error) {
        console.error("Error revisando sesión:", error);
    } finally {
        if (!isRedirecting) {
            if (splash) {
                splash.classList.add('hidden');
                setTimeout(() => splash.remove(), 300);
            }
            window.sessionState.resolve();
        } else {
            console.log("Redirecting... keeping splash visible.");
        }
    }
};

checkSessionStatus();

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.sessionReady = new Promise((resolve) => {
            window.sessionState.resolve = resolve;
        });
        checkSessionStatus();
    }
});