(function() {
    const AUTOPLAY_MS = 5000;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initSlider(slider) {
        const track = slider.querySelector('.track');
        const slides = slider.querySelectorAll('.slide');
        if (!track || slides.length === 0) return;
        if (slides.length === 1) {
            slides[0].classList.add('show');
            return;
        }

        const enableArrows = slider.dataset.arrows !== 'false';
        const enableDots = slider.dataset.dots !== 'false';
        const enableSwipe = slider.dataset.swipe !== 'false';

        let index = 0;
        const last = slides.length - 1;
        let dots = [];

        function go(i) {
            slides[index].classList.remove('show');
            index = (i + slides.length) % slides.length;   // wraps both ways
            track.style.transform = `translateX(-${index * 100}%)`;
            slides[index].classList.add('show');
            dots.forEach((d, di) => d.setAttribute('aria-current', di === index ? 'true' : 'false'));
        }

        if (enableArrows) {
            const prev = document.createElement('button');
            const next = document.createElement('button');
            prev.className = 'control prev';
            next.className = 'control next';
            prev.type = next.type = 'button';
            prev.setAttribute('aria-label', 'Previous slide');
            next.setAttribute('aria-label', 'Next slide');
            prev.innerHTML = '&#10094;';
            next.innerHTML = '&#10095;';
            prev.addEventListener('click', () => go(index - 1));
            next.addEventListener('click', () => go(index + 1));
            slider.append(prev, next);

            slider.tabIndex = 0;
            slider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') { go(index - 1); e.preventDefault(); }
                if (e.key === 'ArrowRight') { go(index + 1); e.preventDefault(); }
            });
        }

        if (enableDots) {
            const nav = document.createElement('div');
            nav.className = 'dots';
            dots = Array.from(slides).map((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'dot';
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => go(i));
                nav.appendChild(dot);
                return dot;
            });
            slider.appendChild(nav);
        }

        if (enableSwipe) {
            let startX = null;
            slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; pause(); }, { passive: true });
            slider.addEventListener('touchend', (e) => {
                if (startX === null) return;
                const dx = e.changedTouches[0].clientX - startX;
                if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
                startX = null;
                play();
            });
        }

        // --- autoplay ---
        let timer = null;
        function play() {
            if (reduceMotion || timer) return;
            timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
        }
        function pause() {
            clearInterval(timer);
            timer = null;
        }

        slider.addEventListener('mouseleave', play);
        slider.addEventListener('focusin', pause);
        slider.addEventListener('focusout', play);
        document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));

        go(0);
        play();
    }

    function initAll() {
        document.querySelectorAll('.slider').forEach(initSlider);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
