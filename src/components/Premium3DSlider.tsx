import React, { useEffect, useRef, useState } from 'react';
import './Premium3DSlider.css';
import api from "@/lib/api";

// Default slides as fallback
const DEFAULT_SLIDES = [
    {
        id: 1,
        img: "/numerologist_portrait_1772371205774.png",
        title: "Master Numerologist",
        desc: "Unlock the mysteries of your life path with expert numerology readings."
    },
    {
        id: 2,
        img: "/numerology_products_gemstones_1772371227250.png",
        title: "Healing Gemstones",
        desc: "Discover our premium collection of mystical crystals and vibrational stones."
    },
    {
        id: 3,
        img: "/numerology_products_bracelets_1772371244109.png",
        title: "Spiritual Bracelets",
        desc: "Wear the energy of the cosmos with our handcrafted numerology bracelets."
    },
    {
        id: 4,
        img: "/numerology_chart_mystic_1772369558989.png",
        title: "Mystic Numbers",
        desc: "Uncover the hidden patterns of the universe through ancient numerology charts."
    },
    {
        id: 5,
        img: "/sacred_lotus_mandala_1772369604643.png",
        title: "Sacred Mandala",
        desc: "Radiating divine spiritual healing energy from the center of consciousness."
    }
];

function lerp({ x, y }: { x: number, y: number }, { x: targetX, y: targetY }: { x: number, y: number }) {
    const fraction = 0.1;
    x += (targetX - x) * fraction;
    y += (targetY - y) * fraction;
    return { x, y };
}

const Premium3DSlider = () => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const sliderInstanceRef = useRef<any>(null); // To store the custom class instance
    const [sliderData, setSliderData] = useState<any[]>(DEFAULT_SLIDES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                const { data } = await api.get('/content/slider');
                if (data && data.length > 0) {
                    // Map backend schema to slider component needs if necessary
                    setSliderData(data.map((item: any, idx: number) => ({
                        _id: item._id,
                        id: idx + 1,
                        img: item.image,
                        title: item.title,
                        desc: item.description
                    })));
                } else {
                    setSliderData(DEFAULT_SLIDES);
                }
            } catch (error) {
                console.error("Failed to fetch slider content:", error);
                setSliderData(DEFAULT_SLIDES);
            } finally {
                setLoading(false);
            }
        };

        fetchSliderData();
    }, []);

    const slides = sliderData;

    useEffect(() => {
        if (loading || !sliderRef.current || !contentRef.current || slides.length === 0) return;

        // Adapted the Vanilla JS class into this effect
        class Slider {
            IMG_CLASS: string;
            TEXT_CLASS: string;
            ACTIVE_IMG_CLASS: string;
            ACTIVE_TEXT_CLASS: string;

            el: HTMLElement;
            contentEl: HTMLElement;
            images: HTMLCollectionOf<HTMLImageElement>;
            activeImg: HTMLCollectionOf<Element>;
            activeText: HTMLCollectionOf<Element>;

            length: number;
            lastX: number;
            lastY: number;
            targetX: number;
            targetY: number;

            mouseWatched: boolean;
            isMobile: boolean;
            inTransit: boolean;
            animationRunning: boolean;
            animationStopped: boolean;

            halfWidth: number;
            halfHeight: number;
            zDistance: string;

            constructor(el: HTMLElement, contentEl: HTMLElement) {
                this.IMG_CLASS = 'slider__images-item';
                this.TEXT_CLASS = 'slider__text-item';
                this.ACTIVE_IMG_CLASS = `${this.IMG_CLASS}--active`;
                this.ACTIVE_TEXT_CLASS = `${this.TEXT_CLASS}--active`;

                this.el = el;
                this.contentEl = contentEl;
                this.onMouseMove = this.onMouseMove.bind(this);
                this.onResize = this.onResize.bind(this);
                this.onDotClick = this.onDotClick.bind(this);
                this.prev = this.prev.bind(this);
                this.next = this.next.bind(this);

                this.activeImg = el.getElementsByClassName(this.ACTIVE_IMG_CLASS);
                this.activeText = el.getElementsByClassName(this.ACTIVE_TEXT_CLASS);
                this.images = el.getElementsByTagName('img');

                // Setup listeners
                const dots = document.getElementById('slider-dots');
                const leftBtn = document.getElementById('left');
                const rightBtn = document.getElementById('right');

                if (dots) dots.addEventListener('click', this.onDotClick);
                if (leftBtn) leftBtn.addEventListener('click', this.prev);
                if (rightBtn) rightBtn.addEventListener('click', this.next);

                window.addEventListener('resize', this.onResize);

                this.mouseWatched = false;
                this.isMobile = false;
                this.inTransit = false;
                this.animationRunning = false;
                this.animationStopped = false;

                this.halfWidth = window.innerWidth / 2;
                this.halfHeight = window.innerHeight / 2;
                this.zDistance = '';

                this.onResize();

                this.length = this.images.length;
                this.lastX = this.lastY = this.targetX = this.targetY = 0;
            }

            destroy() {
                window.removeEventListener('resize', this.onResize);
                if (this.mouseWatched) {
                    this.el.removeEventListener('mousemove', this.onMouseMove);
                }
                const dots = document.getElementById('slider-dots');
                const leftBtn = document.getElementById('left');
                const rightBtn = document.getElementById('right');

                if (dots) dots.removeEventListener('click', this.onDotClick);
                if (leftBtn) leftBtn.removeEventListener('click', this.prev);
                if (rightBtn) rightBtn.removeEventListener('click', this.next);
            }

            onResize() {
                const htmlStyles = getComputedStyle(document.documentElement);
                // Fallback for custom props since scoped css root approach might vary
                let mobileBreakpoint = htmlStyles.getPropertyValue('--mobile-bkp').trim();
                if (!mobileBreakpoint) mobileBreakpoint = '650px';

                this.isMobile = matchMedia(`only screen and (max-width: ${mobileBreakpoint})`).matches;

                this.halfWidth = window.innerWidth / 2;
                this.halfHeight = window.innerHeight / 2;

                // Read zDistance from the class applied component, fallback if not found globals
                let zDist = getComputedStyle(this.el).getPropertyValue('--z-distance').trim();
                if (!zDist) zDist = '8.519vw';
                this.zDistance = zDist;

                if (!this.isMobile && !this.mouseWatched) {
                    this.mouseWatched = true;
                    this.el.addEventListener('mousemove', this.onMouseMove);
                    if (this.activeImg.length > 0 && this.images.length > 0) {
                        const activeId = (this.activeImg[0] as HTMLElement).dataset.id;
                        if (activeId) {
                            const index = Number(activeId) - 1;
                            if (this.images[index]) {
                                this.el.style.setProperty('--img-prev', `url(${this.images[index].src})`);
                            }
                        }
                    }
                    this.contentEl.style.setProperty('transform', `translateZ(${this.zDistance})`);
                } else if (this.isMobile && this.mouseWatched) {
                    this.mouseWatched = false;
                    this.el.removeEventListener('mousemove', this.onMouseMove);
                    this.contentEl.style.setProperty('transform', 'none');
                }
            }

            getMouseCoefficients({ pageX, pageY }: any = {}) {
                const halfWidth = this.halfWidth;
                const halfHeight = this.halfHeight;
                const xCoeff = ((pageX || this.targetX) - halfWidth) / halfWidth;
                const yCoeff = (halfHeight - (pageY || this.targetY)) / halfHeight;
                return { xCoeff, yCoeff };
            }

            onMouseMove({ pageX, pageY }: any) {
                this.targetX = pageX;
                this.targetY = pageY;

                if (!this.animationRunning) {
                    this.animationRunning = true;
                    this.runAnimation();
                }
            }

            runAnimation() {
                if (this.animationStopped) {
                    this.animationRunning = false;
                    return;
                }

                const maxX = 10;
                const maxY = 10;

                const newPos = lerp(
                    { x: this.lastX, y: this.lastY },
                    { x: this.targetX, y: this.targetY }
                );

                const { xCoeff, yCoeff } = this.getMouseCoefficients({ pageX: newPos.x, pageY: newPos.y });

                this.lastX = newPos.x;
                this.lastY = newPos.y;

                this.positionImage({ xCoeff, yCoeff });

                this.contentEl.style.setProperty('transform', `
          translateZ(${this.zDistance})
          rotateX(${maxY * yCoeff}deg)
          rotateY(${maxX * xCoeff}deg)
        `);

                if (this.reachedFinalPoint) {
                    this.animationRunning = false;
                } else {
                    requestAnimationFrame(this.runAnimation.bind(this));
                }
            }

            get reachedFinalPoint() {
                const lastX = ~~(this.lastX);
                const lastY = ~~(this.lastY);
                const targetX = this.targetX;
                const targetY = this.targetY;
                return (lastX == targetX || lastX - 1 == targetX || lastX + 1 == targetX) &&
                    (lastY == targetY || lastY - 1 == targetY || lastY + 1 == targetY);
            }

            positionImage({ xCoeff, yCoeff }: any) {
                if (this.activeImg.length === 0) return;
                const maxImgOffset = 1;
                const currentImage = this.activeImg[0].children[0] as HTMLElement;
                if (currentImage) {
                    currentImage.style.setProperty('transform', `
              translateX(${maxImgOffset * -xCoeff}em)
              translateY(${maxImgOffset * yCoeff}em)
            `);
                }
            }

            onDotClick(e: any) {
                if (this.inTransit) return;
                const target = e.target;
                const dot = target.closest('.slider__nav-dot');
                if (!dot) return;

                const nextId = dot.dataset.id;
                const currentId = (this.activeImg[0] as HTMLElement).dataset.id;

                if (currentId == nextId) return;
                this.startTransition(nextId);
            }

            transitionItem(nextId: string) {
                const self = this;
                const el = this.el;
                if (this.activeImg.length === 0) return;
                const currentImg = this.activeImg[0] as HTMLElement;
                const currentId = Number(currentImg.dataset.id);
                const numNextId = Number(nextId);

                const imgClass = this.IMG_CLASS;
                const textClass = this.TEXT_CLASS;
                const activeImgClass = this.ACTIVE_IMG_CLASS;
                const activeTextClass = this.ACTIVE_TEXT_CLASS;
                const subActiveClass = `${imgClass}--subactive`;
                const transitClass = `${imgClass}--transit`;
                const nextImg = el.querySelector(`.${imgClass}[data-id='${nextId}']`) as HTMLElement;
                const nextText = el.querySelector(`.${textClass}[data-id='${nextId}']`) as HTMLElement;

                if (!nextImg || !nextText) return;

                let outClass = '';
                let inClass = '';

                this.animationStopped = true;

                nextText.classList.add(activeTextClass);
                el.style.setProperty('--from-left', nextId);

                currentImg.classList.remove(activeImgClass);
                currentImg.classList.add(subActiveClass);

                if (currentId < numNextId) {
                    outClass = `${imgClass}--next`;
                    inClass = `${imgClass}--prev`;
                } else {
                    outClass = `${imgClass}--prev`;
                    inClass = `${imgClass}--next`;
                }

                nextImg.classList.add(outClass);

                function onImageTransitionEnd(this: HTMLElement, e: Event) {
                    e.stopPropagation();
                    nextImg.classList.remove(transitClass);
                    self.inTransit = false;
                    this.className = imgClass; // Reset old active
                    this.removeEventListener('transitionend', onImageTransitionEnd);
                }

                requestAnimationFrame(() => {
                    nextImg.classList.add(transitClass, activeImgClass);
                    nextImg.classList.remove(outClass);

                    this.animationStopped = false;
                    this.positionImage(this.getMouseCoefficients());

                    currentImg.classList.add(transitClass, inClass);
                    currentImg.addEventListener('transitionend', onImageTransitionEnd);
                });

                if (!this.isMobile) {
                    this.switchBackgroundImage(nextId);
                }
            }

            startTransition(nextId: string) {
                const self = this;
                function onTextTransitionEnd(this: HTMLElement, e: any) {
                    if (!e.pseudoElement) {
                        e.stopPropagation();
                        requestAnimationFrame(() => {
                            self.transitionItem(nextId);
                        });
                        this.removeEventListener('transitionend', onTextTransitionEnd);
                    }
                }

                if (this.inTransit) return;
                if (this.activeText.length === 0) return;

                const activeText = this.activeText[0] as HTMLElement;
                const backwardsClass = `${this.TEXT_CLASS}--backwards`;

                this.inTransit = true;

                activeText.classList.add(backwardsClass);
                activeText.classList.remove(this.ACTIVE_TEXT_CLASS);
                activeText.addEventListener('transitionend', onTextTransitionEnd);

                requestAnimationFrame(() => {
                    activeText.classList.remove(backwardsClass);
                });
            }

            next() {
                if (this.inTransit) return;
                if (this.activeImg.length === 0) return;

                let nextId = Number((this.activeImg[0] as HTMLElement).dataset.id) + 1;
                if (nextId > this.length) nextId = 1;
                this.startTransition(nextId.toString());
            }

            prev() {
                if (this.inTransit) return;
                if (this.activeImg.length === 0) return;

                let nextId = Number((this.activeImg[0] as HTMLElement).dataset.id) - 1;
                if (nextId < 1) nextId = this.length;
                this.startTransition(nextId.toString());
            }

            switchBackgroundImage(nextId: string) {
                const bgClass = 'slider--bg-next';
                const el = this.el;
                const imageUrl = `url(${this.images[Number(nextId) - 1].src})`;

                function onBackgroundTransitionEnd(this: HTMLElement, e: any) {
                    if (e.target === this) {
                        this.style.setProperty('--img-prev', imageUrl);
                        this.classList.remove(bgClass);
                        this.removeEventListener('transitionend', onBackgroundTransitionEnd);
                    }
                }

                el.style.setProperty('--img-next', imageUrl);
                el.addEventListener('transitionend', onBackgroundTransitionEnd);
                el.classList.add(bgClass);
            }
        }

        // Initialize the slider wrapper
        const slider = new Slider(sliderRef.current, contentRef.current);
        sliderInstanceRef.current = slider;

        // Auto sliding logic
        let timer: any = 0;

        const autoSlide = () => {
            requestAnimationFrame(() => {
                if (sliderInstanceRef.current) sliderInstanceRef.current.next();
            });
            timer = setTimeout(autoSlide, 5000);
        };

        const stopAutoSlide = () => {
            clearTimeout(timer);
            if (sliderRef.current) {
                sliderRef.current.removeEventListener('touchstart', stopAutoSlide);
                sliderRef.current.removeEventListener('mousemove', stopAutoSlide);
            }
        };

        sliderRef.current.addEventListener('mousemove', stopAutoSlide);
        sliderRef.current.addEventListener('touchstart', stopAutoSlide);

        timer = setTimeout(autoSlide, 2000);

        return () => {
            stopAutoSlide();
            if (sliderInstanceRef.current) sliderInstanceRef.current.destroy();
        };
    }, [loading, slides]);

    return (
        <div className="slider-container">
            <div
                ref={sliderRef}
                className="slider"
                id="slider"
                style={{ '--img-prev': `url(${slides.length > 0 ? slides[0].img : ''})` } as React.CSSProperties}
            >
                <div className="slider__content" id="slider-content" ref={contentRef}>

                    <div className="slider__images">
                        {slides.map((s, idx) => (
                            <div
                                key={s._id || s.id}
                                className={`slider__images-item ${idx === 0 ? 'slider__images-item--active' : ''}`}
                                data-id={s.id}
                            >
                                <img src={s.img} alt={s.title} />
                            </div>
                        ))}
                    </div>

                    <div className="slider__text">
                        {slides.map((s, idx) => (
                            <div
                                key={s._id || s.id}
                                className={`slider__text-item ${idx === 0 ? 'slider__text-item--active' : ''}`}
                                data-id={s.id}
                            >
                                <div className="slider__text-item-head">
                                    <h3>{s.title}</h3>
                                </div>
                                <div className="slider__text-item-info">
                                    <p>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="slider__nav">
                    <div className="slider__nav-arrows">
                        <div className="slider__nav-arrow slider__nav-arrow--left" id="left">to left</div>
                        <div className="slider__nav-arrow slider__nav-arrow--right" id="right">to right</div>
                    </div>
                    <div className="slider__nav-dots" id="slider-dots">
                        {slides.map((s, idx) => (
                            <div
                                key={s._id || s.id}
                                className={`slider__nav-dot ${idx === 0 ? 'slider__nav-dot--active' : ''}`}
                                data-id={s.id}
                            ></div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Premium3DSlider;
