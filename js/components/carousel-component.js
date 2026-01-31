/**
 * Carousel Component
 * Configurable via:
 * - responsive: JSON string { "0": 1, "768": 2, "1200": 3 }
 * - show-arrows: boolean
 * - click-to-nav: boolean
 * - gap: number
 */
class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this._slidesData = [];
        this._currentIndex = 0;
        this._touchStartX = 0;
        this.resizeObserver = null;

        this._config = {
            0: 1, 480: 1, 576: 1, 768: 2, 992: 2, 1200: 3, 1400: 4
        };
    }

    static get observedAttributes() {
        return ['show-arrows', 'click-to-nav', 'gap', 'responsive'];
    }

    async connectedCallback() {
        if (window.injectExternalStyles) {
            await window.injectExternalStyles('../css/carousel-component.css', 'carousel-styles');
        }
        this._parseResponsiveConfig();
        this.render();
        this._setupResizeObserver();
    }

    _parseResponsiveConfig() {
        const respAttr = this.getAttribute('responsive');
        if (respAttr) {
            try {
                this._config = JSON.parse(respAttr.replace(/'/g, '"'));
            } catch (e) {
                console.error("Carousel: Invalid responsive JSON", e);
            }
        }
    }

    setSlides(htmlItems) {
        this._slidesData = htmlItems;
        this._currentIndex = 0;
        this.render();
    }

    _getItemsInViewport() {
        const width = window.innerWidth;
        const breakpoints = Object.keys(this._config).map(Number).sort((a, b) => b - a);
        const activeBreakpoint = breakpoints.find(b => width >= b) || 0;
        return this._config[activeBreakpoint];
    }

    render() {
        const gap = this.getAttribute('gap') || '24';

        this.innerHTML = `
            <div class="carousel-container position-relative w-100 d-flex flex-column align-items-center">
                <div class="carousel-wrapper position-relative w-100 d-flex align-items-center">
                    
                    <button class="carousel-arrow prev d-none" aria-label="Anterior">
                        <span class="icon-left-chevron w-20px h-20px bg-primary-03 d-block"></span>
                    </button>

                    <div class="carousel-viewport touch-action-pan-y overflow-hidden w-100">
                        <div class="carousel-track" style="gap: ${gap}px;">
                            ${this._renderSlides()}
                        </div>
                    </div>

                    <button class="carousel-arrow next d-none" aria-label="Siguiente">
                        <span class="icon-right-chevron w-20px h-20px bg-primary-03 d-block"></span>
                    </button>
                </div>

                <div class="carousel-indicators d-flex justify-content-center gap-8px mt-24px"></div>
            </div>
        `;

        this._postRenderSetup();
    }

    _renderSlides() {
        const itemsInView = this._getItemsInViewport();
        const gap = parseInt(this.getAttribute('gap') || 24);

        const slideWidth = `calc((100% - ${(itemsInView - 1) * gap}px) / ${itemsInView})`;

        return this._slidesData.map((html, index) => `
            <div class="carousel-slide" style="width: ${slideWidth};">
                ${html}
            </div>
        `).join('');
    }

    _postRenderSetup() {
        this._track = this.querySelector('.carousel-track');
        this._viewport = this.querySelector('.carousel-viewport');
        this._dotsContainer = this.querySelector('.carousel-indicators');
        this._btnPrev = this.querySelector('.carousel-arrow.prev');
        this._btnNext = this.querySelector('.carousel-arrow.next');

        if (this._slidesData.length > 0) {
            this._setupTouchEvents();
            this._setupNavigation();
            this._checkOverflow();
            this.goTo(this._currentIndex);
        }
    }

    _setupTouchEvents() {
        this._viewport.addEventListener('touchstart', (e) => {
            this._touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this._viewport.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - this._touchStartX;

            if (Math.abs(diff) > 50) {
                diff > 0 ? this.move(-1) : this.move(1);
            }
        }, { passive: true });
    }

    _setupNavigation() {
        if (this._btnPrev) this._btnPrev.onclick = () => this.move(-1);
        if (this._btnNext) this._btnNext.onclick = () => this.move(1);

        if (this.hasAttribute('click-to-nav')) {
            this.querySelectorAll('.carousel-slide').forEach(s => {
                s.style.cursor = 'pointer';
                s.onclick = () => this.move(1);
            });
        }
    }

    _checkOverflow() {
        const itemsVisible = this._getItemsInViewport();
        const totalItems = this._slidesData.length;
        const hasOverflow = totalItems > itemsVisible;

        const arrowsEnabled = this.getAttribute('show-arrows') !== 'false' && hasOverflow;
        this._btnPrev.classList.toggle('d-none', !arrowsEnabled);
        this._btnNext.classList.toggle('d-none', !arrowsEnabled);

        this._dotsContainer.innerHTML = '';
        if (hasOverflow) {
            const steps = totalItems - itemsVisible + 1;
            for (let i = 0; i < steps; i++) {
                const dot = document.createElement('div');
                dot.className = `carousel-dot cursor-pointer w-8px h-8px ${i === this._currentIndex ? 'bg-primary-03' : 'bg-neutral-05'}`;
                dot.onclick = () => this.goTo(i);
                this._dotsContainer.appendChild(dot);
            }
        }
        this._maxIndex = Math.max(0, totalItems - itemsVisible);
    }

    move(dir) {
        let next = this._currentIndex + dir;
        if (next < 0) next = this._maxIndex;
        if (next > this._maxIndex) next = 0;
        this.goTo(next);
    }

    goTo(index) {
        if (!this._track) return;
        this._currentIndex = index;

        const firstSlide = this.querySelector('.carousel-slide');
        if (firstSlide) {
            const gap = parseInt(this.getAttribute('gap') || 24);
            const slideWidth = firstSlide.offsetWidth + gap;
            this._track.style.transform = `translateX(-${index * slideWidth}px)`;
        }

        this.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('bg-primary-03', i === index);
            d.classList.toggle('bg-neutral-05', i !== index);
        });
    }

    _setupResizeObserver() {
        let resizeTimer;
        this.resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                this._parseResponsiveConfig();
                this.render();
            }, 100);
        });
        this.resizeObserver.observe(this);
    }
}

customElements.define('carousel-component', CarouselComponent);