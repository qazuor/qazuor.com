/**
 * PixelCanvas Custom Element
 * Animated pixel effect for cards and interactive elements.
 * Only loaded when pixel-canvas elements exist on the page.
 */

// Guard to prevent duplicate registration
if (!(window as unknown as { __pixelCanvasGlobalInit?: boolean }).__pixelCanvasGlobalInit) {
    (window as unknown as { __pixelCanvasGlobalInit: boolean }).__pixelCanvasGlobalInit = true;

    // Pixel class for animation
    class Pixel {
        width: number;
        height: number;
        ctx: CanvasRenderingContext2D;
        x: number;
        y: number;
        color: string;
        speed: number;
        size: number;
        sizeStep: number;
        minSize: number;
        maxSizeInteger: number;
        maxSize: number;
        delay: number;
        counter: number;
        counterStep: number;
        isIdle: boolean;
        isReverse: boolean;
        isShimmer: boolean;

        constructor(
            canvas: HTMLCanvasElement,
            context: CanvasRenderingContext2D,
            x: number,
            y: number,
            color: string,
            speed: number,
            delay: number
        ) {
            this.width = canvas.width;
            this.height = canvas.height;
            this.ctx = context;
            this.x = x;
            this.y = y;
            this.color = color;
            this.speed = this._getRandomValue(0.1, 0.9) * speed;
            this.size = 0;
            this.sizeStep = Math.random() * 0.6;
            this.minSize = 1;
            this.maxSizeInteger = 4;
            this.maxSize = this._getRandomValue(this.minSize, this.maxSizeInteger);
            this.delay = delay;
            this.counter = 0;
            this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
            this.isIdle = false;
            this.isReverse = false;
            this.isShimmer = false;
        }

        _getRandomValue(min: number, max: number): number {
            return Math.random() * (max - min) + min;
        }

        _draw(): void {
            const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
        }

        appear(): void {
            this.isIdle = false;
            if (this.counter <= this.delay) {
                this.counter += this.counterStep;
                return;
            }
            if (this.size >= this.maxSize) {
                this.isShimmer = true;
            }
            if (this.isShimmer) {
                this._shimmer();
            } else {
                this.size += this.sizeStep;
            }
            this._draw();
        }

        disappear(): void {
            this.isShimmer = false;
            this.counter = 0;
            if (this.size <= 0) {
                this.isIdle = true;
                return;
            }
            this.size -= 0.1;
            this._draw();
        }

        _shimmer(): void {
            if (this.size >= this.maxSize) {
                this.isReverse = true;
            } else if (this.size <= this.minSize) {
                this.isReverse = false;
            }
            if (this.isReverse) {
                this.size -= this.speed;
            } else {
                this.size += this.speed;
            }
        }
    }

    // PixelCanvas Custom Element
    class PixelCanvas extends HTMLElement {
        static css = ':host { display: grid; inline-size: 100%; block-size: 100%; overflow: hidden; }';

        _parent: HTMLElement | null = null;
        canvas: HTMLCanvasElement | null = null;
        ctx: CanvasRenderingContext2D | null = null;
        pixels: Pixel[] = [];
        animationFrame = 0;
        timeInterval = 1000 / 60;
        timePrevious = 0;
        reducedMotion = false;
        resizeObserver: ResizeObserver | null = null;
        themeObserver: MutationObserver | null = null;
        _debounceTimer: ReturnType<typeof setTimeout> | null = null;

        get colorsDark(): string[] {
            return this.dataset.colors
                ? this.dataset.colors.split(',').map((c) => c.trim())
                : ['#f8fafc', '#f1f5f9', '#cbd5e1'];
        }

        get colorsLight(): string[] {
            return this.dataset.colorsLight
                ? this.dataset.colorsLight.split(',').map((c) => c.trim())
                : ['#1e293b', '#334155', '#475569'];
        }

        get colors(): string[] {
            const isDark = document.documentElement.classList.contains('dark');
            return isDark ? this.colorsDark : this.colorsLight;
        }

        get gap(): number {
            const value = Number.parseInt(this.dataset.gap || '5');
            const min = 4;
            const max = 50;
            if (value <= min) return min;
            if (value >= max) return max;
            return value;
        }

        get speed(): number {
            const value = Number.parseInt(this.dataset.speed || '35');
            const min = 0;
            const max = 100;
            const throttle = 0.001;
            if (value <= min || this.reducedMotion) return min;
            if (value >= max) return max * throttle;
            return value * throttle;
        }

        get noFocus(): boolean {
            return this.hasAttribute('data-no-focus');
        }

        connectedCallback(): void {
            const canvas = document.createElement('canvas');
            const sheet = new CSSStyleSheet();

            this._parent = this.parentNode as HTMLElement;
            const shadowroot = this.attachShadow({ mode: 'open' });

            sheet.replaceSync(PixelCanvas.css);

            shadowroot.adoptedStyleSheets = [sheet];
            shadowroot.append(canvas);
            this.canvas = shadowroot.querySelector('canvas');
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.timeInterval = 1000 / 60;
            this.timePrevious = performance.now();
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.init();
            this.resizeObserver = new ResizeObserver(() => this.init());
            this.resizeObserver.observe(this);

            if (this._parent) {
                this._parent.addEventListener('mouseenter', this);
                this._parent.addEventListener('mouseleave', this);
            }

            if (!this.noFocus && this._parent) {
                this._parent.addEventListener('focusin', this);
                this._parent.addEventListener('focusout', this);
            }

            // Observe theme changes with debounce
            this.themeObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.attributeName === 'class') {
                        if (this._debounceTimer) clearTimeout(this._debounceTimer);
                        this._debounceTimer = setTimeout(() => this.init(), 50);
                    }
                }
            });
            this.themeObserver.observe(document.documentElement, { attributes: true });
        }

        disconnectedCallback(): void {
            if (this.resizeObserver) this.resizeObserver.disconnect();
            if (this.themeObserver) this.themeObserver.disconnect();
            if (this._parent) {
                this._parent.removeEventListener('mouseenter', this);
                this._parent.removeEventListener('mouseleave', this);
            }
            if (!this.noFocus && this._parent) {
                this._parent.removeEventListener('focusin', this);
                this._parent.removeEventListener('focusout', this);
            }
            this._parent = null;
        }

        handleEvent(event: Event): void {
            switch (event.type) {
                case 'mouseenter':
                    this._handleMouseEnter();
                    break;
                case 'mouseleave':
                    this._handleMouseLeave();
                    break;
                case 'focusin':
                    this._handleFocusIn(event as FocusEvent);
                    break;
                case 'focusout':
                    this._handleFocusOut(event as FocusEvent);
                    break;
            }
        }

        _handleMouseEnter(): void {
            this._runAnimation('appear');
        }
        _handleMouseLeave(): void {
            this._runAnimation('disappear');
        }

        _handleFocusIn(e: FocusEvent): void {
            const target = e.currentTarget as HTMLElement;
            if (target?.contains(e.relatedTarget as Node)) return;
            this._runAnimation('appear');
        }

        _handleFocusOut(e: FocusEvent): void {
            const target = e.currentTarget as HTMLElement;
            if (target?.contains(e.relatedTarget as Node)) return;
            this._runAnimation('disappear');
        }

        _runAnimation(name: 'appear' | 'disappear'): void {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = this._animatePixels(name);
        }

        init(): void {
            if (!this.canvas || !this.ctx) return;
            const rect = this.getBoundingClientRect();
            const width = Math.floor(rect.width);
            const height = Math.floor(rect.height);

            this.pixels = [];
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
            this._createPixels();
        }

        _getDistanceToCanvasCenter(x: number, y: number): number {
            if (!this.canvas) return 0;
            const dx = x - this.canvas.width / 2;
            const dy = y - this.canvas.height / 2;
            return Math.sqrt(dx * dx + dy * dy);
        }

        _createPixels(): void {
            if (!this.canvas || !this.ctx) return;
            const maxDistance = Math.sqrt((this.canvas.width / 2) ** 2 + (this.canvas.height / 2) ** 2);

            for (let x = 0; x < this.canvas.width; x += this.gap) {
                for (let y = 0; y < this.canvas.height; y += this.gap) {
                    const distance = this._getDistanceToCanvasCenter(x, y);
                    const normalizedDistance = distance / maxDistance;
                    const skipChance = (1 - normalizedDistance) ** 6 * 1.0;
                    if (Math.random() < skipChance) continue;

                    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                    const delay = this.reducedMotion ? 0 : distance;
                    this.pixels.push(new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay));
                }
            }
        }

        _animatePixels(fnName: 'appear' | 'disappear'): number {
            this.animationFrame = requestAnimationFrame(() => this._animatePixels(fnName));

            const timeNow = performance.now();
            const timePassed = timeNow - this.timePrevious;

            if (timePassed < this.timeInterval) return this.animationFrame;

            this.timePrevious = timeNow - (timePassed % this.timeInterval);

            if (!this.canvas || !this.ctx) return this.animationFrame;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const pixel of this.pixels) {
                pixel[fnName]();
            }

            const allIdle = this.pixels.every((pixel) => pixel.isIdle);
            if (allIdle) {
                cancelAnimationFrame(this.animationFrame);
            }

            return this.animationFrame;
        }
    }

    // Register the custom element globally
    if (!customElements.get('pixel-canvas')) {
        customElements.define('pixel-canvas', PixelCanvas);
    }

    // Initialize pixel-canvas elements (runs on page load and View Transitions)
    function initPixelCanvases(): void {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const pixelCanvases = document.querySelectorAll('pixel-canvas') as NodeListOf<
                    PixelCanvas & HTMLElement
                >;
                for (const el of pixelCanvases) {
                    if (el.canvas && el.ctx) {
                        el.init();
                    }
                }
            });
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPixelCanvases);
    } else {
        initPixelCanvases();
    }

    // Re-initialize after View Transitions navigation
    document.addEventListener('qazuor:content-ready', initPixelCanvases);
}

export {};
