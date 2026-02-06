class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this._slidesData = [];
        this._currentIndex = 0;
        this._config = { 0: 1 };
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

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal !== newVal && this._track) {
            if (name === 'responsive') this._parseResponsiveConfig();
            this._updateLayout();
        }
    }

    _parseResponsiveConfig() {
        const respAttr = this.getAttribute('responsive');
        if (respAttr) {
            try {
                this._config = JSON.parse(respAttr.replace(/'/g, '"'));
            } catch (e) {
                console.error("Carousel: Invalid JSON", e);
            }
        }
    }

    render() {
        const gap = this.getAttribute('gap') || '24';
        this.style.setProperty('--gap', `${gap}px`);

        this._updateItemsInView();

        this.innerHTML = `
            <div class="carousel-container">
                <button class="carousel-arrow prev d-none" aria-label="Anterior">
                    <span class="icon-left-chevron w-20px h-20px bg-primary-03 d-block"></span>
                </button>
                <div class="carousel-viewport">
                    <div class="carousel-track p-2px">
                        ${this._slidesData.map(html => `<div class="carousel-slide">${html}</div>`).join('')}
                    </div>
                </div>
                <button class="carousel-arrow next d-none" aria-label="Siguiente">
                    <span class="icon-right-chevron w-20px h-20px bg-primary-03 d-block"></span>
                </button>
                <div class="carousel-indicators d-flex justify-content-center gap-8px mt-24px"></div>
            </div>
        `;
        this._postRenderSetup();
    }

    _updateItemsInView() {
        const width = window.innerWidth;
        const breakpoints = Object.keys(this._config).map(Number).sort((a, b) => b - a);
        const activeBreakpoint = breakpoints.find(b => width >= b) || 0;
        const count = this._config[activeBreakpoint];
        this.style.setProperty('--items-in-view', count);
        return count;
    }

    _updateLayout() {
        const itemsInView = this._updateItemsInView();
        const totalItems = this._slidesData.length;
        this._maxIndex = Math.max(0, totalItems - itemsInView);

        this._checkArrows(totalItems, itemsInView);
        this._renderDots(totalItems, itemsInView);
        this.goTo(this._currentIndex);
    }

    _postRenderSetup() {
        this._track = this.querySelector('.carousel-track');
        this._viewport = this.querySelector('.carousel-viewport');
        this._dotsContainer = this.querySelector('.carousel-indicators');
        this._btnPrev = this.querySelector('.carousel-arrow.prev');
        this._btnNext = this.querySelector('.carousel-arrow.next');

        if (this._slidesData.length > 0) {
            this._setupNavigation();
            this._updateLayout();
        }
    }

    setSlides(items, useDOMElements = false) {
        this._slidesData = items.map(item => (useDOMElements && item instanceof HTMLElement) ? item.outerHTML : item);
        this._currentIndex = 0;
        this.render();
    }

    _checkArrows(total, visible) {
        const hasOverflow = total > visible;
        const arrowsEnabled = this.getAttribute('show-arrows') !== 'false' && hasOverflow;

        this._btnPrev?.classList.toggle('d-none', !arrowsEnabled);
        this._btnNext?.classList.toggle('d-none', !arrowsEnabled);

        const space = arrowsEnabled ? '48px' : '0px';
        this.style.setProperty('--arrow-space', space);
    }

    _renderDots(total, visible) {
        if (!this._dotsContainer) return;
        this._dotsContainer.innerHTML = '';
        if (total <= visible) return;

        const steps = total - visible + 1;
        for (let i = 0; i < steps; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot cursor-pointer w-8px h-8px ${i === this._currentIndex ? 'bg-primary-03' : 'bg-neutral-05'}`;
            dot.onclick = () => this.goTo(i);
            this._dotsContainer.appendChild(dot);
        }
    }

    goTo(index) {
        if (!this._track || this._slidesData.length === 0) return;

        // Clamp index
        this._currentIndex = Math.min(Math.max(0, index), this._maxIndex);

        const gap = parseInt(this.getAttribute('gap') || 24);
        const slideWidth = this._viewport.offsetWidth / this._updateItemsInView();

        const moveAmount = this._currentIndex * (this.querySelector('.carousel-slide').offsetWidth + gap);
        this._track.style.transform = `translateX(-${moveAmount}px)`;

        if (this._dotsContainer) {
            Array.from(this._dotsContainer.children).forEach((d, i) => {
                d.classList.toggle('bg-primary-03', i === this._currentIndex);
                d.classList.toggle('bg-neutral-05', i !== this._currentIndex);
            });
        }
    }

    move(dir) {
        let next = this._currentIndex + dir;
        if (next < 0) next = this._maxIndex;
        else if (next > this._maxIndex) next = 0;
        this.goTo(next);
    }

    _setupNavigation() {
        if (this._btnPrev) this._btnPrev.onclick = () => this.move(-1);
        if (this._btnNext) this._btnNext.onclick = () => this.move(1);
    }

    _setupResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => this._updateLayout());
        this.resizeObserver.observe(this);
    }
}

customElements.define('carousel-component', CarouselComponent);