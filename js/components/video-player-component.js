/**
 * Video Player Component
 * Reproductor de video reutilizable que encapsula la lógica de reproducción,
 * manejo de errores y estados de carga
 *
 * Soporta:
 *  - Rutas absolutas de servidor (.mp4, .webm)
 *  - URLs de YouTube (VOD y Live Streaming)
 * Ejemplo de uso:
 *  <video-player-component id="myPlayer" src="/videos/demo.mp4"></video-player-component>
 *  <video-player-component src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></video-player-component>
 *
 * Métodos públicos:
 * - setSource(url: string): Actualiza la ruta del video y resetea el estado.
 * - reload(): Recarga el video actual.
 */
class VideoPlayerComponent extends HTMLElement {
    constructor() {
        super();
        this._src = '';
        this._isPlaying = false;
        this._videoType = 'none';
    }

    static get observedAttributes() {
        return ['src', 'allow-download', 'width', 'height', 'hidden'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'src') {
                this._src = newValue || '';
                this._videoType = this._detectVideoType(this._src);
                this.render();
            } else {
                this.render();
            }
        }
    }

    connectedCallback() {
        this._src = this.getAttribute('src') || '';
        this._videoType = this._detectVideoType(this._src);
        this.render();
    }

    setVisible(isVisible) {
        if (isVisible) {
            this.removeAttribute('hidden');
        } else {
            this.setAttribute('hidden', '');
            this._pauseAll();
        }
    }

    _handleVisibility() {
        if (this.hasAttribute('hidden')) {
            this.style.display = 'none';
        } else {
            this.style.display = 'block';
        }
    }

    _pauseAll() {
        const video = this.querySelector('video');
        if (video) video.pause();
    }

    /**
     * Actualiza la ruta del video
     */
    setSource(url) {
        this.setAttribute('src', url || '');
    }

    /**
     * Recarga el video actual
     */
    reload() {
        if (this._videoType === 'native') {
            this._updateNativeSource();
        } else {
            this.render();
        }
    }

    _detectVideoType(url) {
        if (!url) return 'none';
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
        return 'native';
    }

    /**
     * Extrae el ID de un video de YouTube a partir de su URL
     */
    _getYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    _updateVideoSource() {
        const video = this.querySelector('video');
        if (!video) return;

        this._showPlayButton();
        video.pause();

        if (!this._src) {
            video.removeAttribute('src');
            video.load();
            return;
        }

        requestAnimationFrame(() => {
            if (this._src) {
                video.src = this._src;
            }
        });
    }

    _setupEventListeners() {
        const playBtn = this.querySelector('.play-video');

        if (this._videoType === 'native') {
            const video = this.querySelector('video');
            if (!video) return;

            if (playBtn) {
                playBtn.addEventListener('click', () => this._attemptPlayNative());
            }

            video.addEventListener('click', () => {
                video.paused ? this._attemptPlayNative() : video.pause();
            });

            video.addEventListener('play', () => this._hidePlayButton());
            video.addEventListener('pause', () => this._showPlayButton());
            video.addEventListener('ended', () => this._showPlayButton());
            video.addEventListener('error', () => {
                if (this._src) console.error("Video Error:", video.error);
                this._showPlayButton();
            });
        }

        else if (this._videoType === 'youtube') {
            if (playBtn) {
                playBtn.addEventListener('click', () => this._loadEmbedPlayer());
            }
        }
    }

    _attemptPlayNative() {
        const video = this.querySelector('video');
        if (!this._src || !video) return;

        if (!video.getAttribute('src')) {
            video.src = this._src;
        }

        this._hidePlayButton();

        video.play().catch(error => {
            if (error.name !== 'AbortError') console.warn("Playback error:", error);
            this._showPlayButton();
        });
    }

    _loadEmbedPlayer() {
        const container = this.querySelector('.video-container'); // Inner wrapper
        let embedSrc = '';

        if (this._videoType === 'youtube') {
            const id = this._getYouTubeId(this._src);
            // Autoplay=1 para que inicie al hacer clic en el botón personalizado
            embedSrc = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        }

        if (embedSrc && container) {
            this._hidePlayButton();
            // Inject Iframe
            container.innerHTML = `
                <iframe 
                    class="w-100 h-100" 
                    src="${embedSrc}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
            this._isPlaying = true;
        }
    }

    _updateNativeSource() {
        const video = this.querySelector('video');
        if (!video) return;

        this._showPlayButton();
        video.pause();
        video.removeAttribute('src');
        video.load();

        requestAnimationFrame(() => {
            if (this._src) {
                video.src = this._src;
            }
        });
    }

    _showPlayButton() {
        const playBtn = this.querySelector('.play-video');
        if (playBtn) playBtn.classList.remove('d-none');
        this._isPlaying = false;
    }

    _hidePlayButton() {
        const playBtn = this.querySelector('.play-video');
        if (playBtn) playBtn.classList.add('d-none');
        this._isPlaying = true;
    }

    render() {
        this._handleVisibility();

        // Si ya está reproduciendo un video nativo, no re-renderizamos para no cortar el flujo
        if (this._isPlaying && this._videoType === 'native') return;

        const width = this.getAttribute('width') || '100%';
        const allowDownload = this.hasAttribute('allow-download');

        // Estilos de contenedor base con fondo negro
        const wrapperClass = "d-flex flex-column position-relative bg-neutral-01";
        const playBtnClass = "position-absolute w-48px h-48px d-flex justify-content-center align-items-center cursor-pointer bg-primary-03 z-index-5 play-video left-50-percent top-50-percent transform-center";

        this.style.width = width;

        const playButtonHtml = `
            <div class="${playBtnClass}">
                <span class="icon-play w-24px h-24px bg-neutral-09"></span>
            </div>
        `;

        let contentHtml = '';

        if (this._videoType === 'native' || this._videoType === 'none') {
            const controlsList = allowDownload ? '' : 'nodownload';
            contentHtml = `
                <div class="video-container w-100 h-100">
                    <video 
                        class="w-100 h-100" 
                        controls 
                        preload="metadata" 
                        disablePictureInPicture 
                        controlsList="${controlsList}"
                        ${this._src ? `src="${this._src}"` : ''}
                    >
                    </video>
                </div>
            `;
        } else {
            contentHtml = `
                <div class="video-container w-100 h-100 bg-neutral-01"></div>
            `;
        }

        this.innerHTML = `
                <div class="${wrapperClass}" style="min-height: 300px; width: 100%; height: 100%;">
                ${playButtonHtml}
                ${contentHtml}
            </div>
        `;

        this._setupEventListeners();
    }
}

customElements.define('video-player-component', VideoPlayerComponent);