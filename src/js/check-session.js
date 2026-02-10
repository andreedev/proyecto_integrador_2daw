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
        // Si el body aún no está disponible, usar un MutationObserver para esperar a que se cargue
        const observer = new MutationObserver((mutations, obs) => {
            if (document.body) {
                document.body.prepend(splashDiv);
                obs.disconnect();
            }
        });

        // Observar cambios en el DOM para detectar cuando el body esté disponible
        observer.observe(document.documentElement, { childList: true });
    }

    return splashDiv;
};

/*
    * Crea el modal de consentimiento de cookies
 */
const createCookieConsentModal = () => {
    if (document.getElementById('cookie-consent-modal')) return;
    customElements.whenDefined('modal-component').then(() => {
        const modal = document.createElement('modal-component');

        // Configurar el modal con el contenido y estilos específicos para el consentimiento de cookies
        modal.id = 'cookie-consent-modal';
        modal.setAttribute('static', '');
        modal.setAttribute('position', 'bottom-left');
        modal.setAttribute('container-class', 'cookie-modal');
        modal.innerHTML = `
            <div class="d-flex flex-column flex-md-row gap-20px p-24px">
                <div class="fs-14px">Esta Web utiliza cookies propias y de terceros necesarias para su funcionamiento, para analizar tus hábitos de navegación y para servir publicidad personalizada. Asimismo, algunas cookies guardan relación con funcionalidades ofrecidas en la Web. 
<!--                <a class="text-primary-03" href="#">Política de Cookies</a>-->
                </div>
                <div class="d-flex flex-column gap-16px w-auto">
                    <button class="primary-button-01 fs-14px text-nowrap" id="accept-cookies">Aceptar todas</button>
                    <button class="primary-button-02 fs-14px text-nowrap" id="decline-cookies">Rechazar todas</button>
                </div>
           
            </div>
        `;

        // Agregar estilos específicos para el modal de cookies
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.open());
        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            modal.close();
        });
        document.getElementById('decline-cookies').addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'false');
            modal.close();
        });
    });
}


/**
 * Promesa global que se resuelve cuando se determina el estado de la sesión
 * */
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

        // Obtener el nombre del archivo actual sin la extensión
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

        await new Promise(r => setTimeout(r, 300));

        // Si la sesión está activa, redirigir según el rol y la página actual
        if (result.status === 'active') {
            sessionStorage.setItem('sesionIniciada', 'true');
            const role = result.rol;

            if (currentPage === 'login' || previousPage.includes('login')) {

                // Si el usuario es un participante y está en la página de login, redirigir a la página principal
                if (role === 'participante' && currentPage === 'login') {
                    isRedirecting = true;
                    window.location.href = 'index.html';
                    return;
                }

                // Si el usuario es un organizador y está en la página de login, redirigir a la página de candidaturas
                if (role === 'organizador' && currentPage === 'login') {
                    isRedirecting = true;
                    window.location.href = 'admin-candidaturas.html';
                    return;
                }
            }

            // Si el usuario es un participante y está en una página de admin, redirigir a la página principal
            if (role === 'participante' && window.location.pathname.includes('admin-')) {
                window.location.href = 'index.html';
                isRedirecting = true;
                return;
            }

            // Si el usuario es un organizador y no está en una página de admin, redirigir a la página de candidaturas
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

            // Si la sesión está inactiva y el usuario intenta acceder a una página de admin, candidaturas o perfil, redirigir a la página de login
            if (currentPage.startsWith('admin-') || currentPage === 'candidaturas' || currentPage === 'perfil') {
                isRedirecting = true;
                window.location.href = 'login.html';
                return;
            }
        }
    } catch (error) {
        console.error("Error revisando sesión:", error);
    } finally {
        if (!isRedirecting) {
            // Si la página registró una promesa propia, esperarla antes de ocultar el splash
            if (window.pageReady) {
                await window.pageReady;
            }

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

/**
 * Revisar si el usuario ha dado su consentimiento para las cookies. Si no, mostrar el modal de consentimiento de cookies.
 */
const checkCookieConsent = () => {
    const consent = localStorage.getItem('cookiesAccepted');
    if (consent === null) {
        createCookieConsentModal();
    }
}

// Ejecutar las funciones al cargar la página
checkSessionStatus();
checkCookieConsent();

/**
 * Si el usuario navega usando el botón de atrás o adelante del navegador, revisar nuevamente el estado de la sesión para asegurarse de que la información esté actualizada.
 */
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.sessionReady = new Promise((resolve) => {
            window.sessionState.resolve = resolve;
        });
        checkSessionStatus();
    }
});