const nav = document.querySelector(".navigation");
if (nav) {
    let ticking = false;
    let scrolled = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            if (!scrolled && y > 60) scrolled = true;
            else if (scrolled && y < 20) scrolled = false;
            nav.classList.toggle("scrolled", scrolled);
            ticking = false;
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}
