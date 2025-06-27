/**
 * Taistelukenttä d20 -sivuston etusivun (index.html) interaktiivisuutta ja navigaatiota hallinnoiva skripti.
 *
 * Vastuualueet:
 * 1. Sivupalkin navigaation dynaaminen luonti sivun otsikoista.
 * 2. Vieritystoiminnot: Dynaamiset vierityspainikkeet ja niiden tilan hallinta.
 * 3. Käyttöliittymän parannukset: Mobiilinavigaation ja pudotusvalikon hallinta, aktiivisen linkin korostus.
 *
 * @version 1.2
 * @author Akseli Larikka
 */
document.addEventListener('DOMContentLoaded', function () {

    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNavbar = document.getElementById('main-navbar');
    const currentPageNameElement = document.getElementById('current-page-name');
    const mainNavbarContent = document.getElementById('main-navbar-content');

    // Tarkistetaan, että kaikki kriittiset elementit löytyvät
    if (!mainContent || !navMenu || !sidebar || !menuToggle || !mainNavbar || !currentPageNameElement || !mainNavbarContent) {
        console.error("Yksi tai useampi navigaation pääelementti puuttuu DOM:sta. Skriptin suoritus keskeytetty.");
        return;
    }

    // ====================================================================
    // OSA 1: NAVIGAATION JA SISÄLLÖN ALUSTUS
    // ====================================================================

    /**
     * Päivittää otsikoiden scroll-margin-top -arvon yläpalkin korkeuden mukaan,
     * jotta ankkurilinkit kohdistuvat oikein.
     */
    function updateScrollMargin() {
        const navbarHeightPx = mainNavbar.offsetHeight;
        // Muunnetaan pikselit rem-yksiköiksi ja lisätään pieni marginaali
        const navbarHeightRem = (navbarHeightPx / parseFloat(getComputedStyle(document.documentElement).fontSize)) + 1;
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeightRem}rem`);
    }

    // Asetetaan scroll-margin-top heti latauksen jälkeen ja ikkunan koon muuttuessa
    updateScrollMargin();
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateScrollMargin, 150);
    });

    // Lisätään CSS-muuttujaa hyödyntävä tyylisääntö dynaamisesti
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `h1, h2, h3, h4, h5, h6 { scroll-margin-top: var(--navbar-height, 5rem); }`;
    document.head.appendChild(styleSheet);


    /**
     * Generoi sivupalkin navigaation dynaamisesti sivun H2, H3 ja H4-otsikoista.
     */
    function initializeSidebar() {
        navMenu.innerHTML = ''; // Tyhjennetään vanhat linkit
        const headersForSidebar = mainContent.querySelectorAll('h2, h3, h4');

        const createSlug = (text) => 'header-' + text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

        headersForSidebar.forEach(header => {
            const id = header.id || createSlug(header.textContent);
            header.id = id;

            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = header.textContent;
            link.className = 'nav-link'; // Yksinkertaistettu luokkanimi

            if (header.tagName === 'H2') link.classList.add('font-bold');
            if (header.tagName === 'H3') link.classList.add('ml-4');
            if (header.tagName === 'H4') link.classList.add('ml-8');

            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
                if (window.innerWidth < 768) {
                    toggleMobileSidebar(true); // Sulje valikko
                }
            });
            navMenu.appendChild(link);
        });
    };

    /**
     * Hallinnoi sivupalkin näkyvyyttä mobiililaitteilla.
     * @param {boolean} hide - Pakotetaanko valikko piiloon.
     */
    const toggleMobileSidebar = (hide) => {
        if (hide) {
            sidebar.classList.add('sidebar-hidden');
        } else {
            sidebar.classList.remove('sidebar-hidden');
            toggleNavbarDropdown(true); // Sulje toinen valikko, jos tämä avataan
        }
    };

    /**
     * Hallinnoi yläpalkin pudotusvalikon näkyvyyttä mobiililaitteilla.
     * @param {boolean} forceHide - Pakotetaanko valikko piiloon.
     */
    const toggleNavbarDropdown = (forceHide = false) => {
        const isCurrentlyOpen = mainNavbarContent.classList.contains('dropdown-open');
        if (forceHide || isCurrentlyOpen) {
            mainNavbarContent.classList.remove('dropdown-open');
            currentPageNameElement.classList.remove('dropdown-open');
        } else {
            mainNavbarContent.classList.add('dropdown-open');
            currentPageNameElement.classList.add('dropdown-open');
            toggleMobileSidebar(true); // Sulje toinen valikko, jos tämä avataan
        }
    };

    // --- Tapahtumankuuntelijat navigaatiolle ---
    menuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleMobileSidebar(sidebar.classList.contains('sidebar-hidden') ? false : true); });
    currentPageNameElement.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (window.innerWidth < 768) toggleNavbarDropdown(); });
    mainNavbarContent.querySelectorAll('.nav-link-top').forEach(link => link.addEventListener('click', () => { if (window.innerWidth < 768) toggleNavbarDropdown(true); }));

    // Sulje valikot klikattaessa niiden ulkopuolelle
    document.addEventListener('click', (event) => {
        if (window.innerWidth < 768) {
            if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) toggleMobileSidebar(true);
            if (!mainNavbarContent.contains(event.target) && !currentPageNameElement.contains(event.target)) toggleNavbarDropdown(true);
        }
    });

    // Sulje valikot, kun ikkunaa levennetään työpöytänäkymään
    window.addEventListener('resize', () => { if (window.innerWidth >= 768) { toggleMobileSidebar(true); toggleNavbarDropdown(true); } });

    // --- Sivupalkin aktiivisen linkin korostus vierittäessä ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('#nav-menu .nav-link').forEach(link => link.classList.remove('active'));
                const navLink = navMenu.querySelector(`a[href="#${entry.target.id}"]`);
                if (navLink) {
                    navLink.classList.add('active');
                    // LISÄTTY KOHTA: Vieritä aktiivinen linkki näkyviin sivupalkissa
                    navLink.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }
        });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0.5 });

    const setupIntersectionObserver = () => mainContent.querySelectorAll('h2, h3, h4').forEach(h => observer.observe(h));

    // ====================================================================
    // OSA 2: SIVUN VIERITYSPAINIKKEET
    // ====================================================================

    const scrollButtonsContainer = document.getElementById('scroll-buttons-container');
    if (scrollButtonsContainer) {
        const scrollTopButton = document.getElementById('scroll-top');
        const scrollH2UpButton = document.getElementById('scroll-h2-up');
        const scrollH3UpButton = document.getElementById('scroll-h3-up');
        const scrollBottomButton = document.getElementById('scroll-bottom');
        const scrollH2DownButton = document.getElementById('scroll-h2-down');
        const scrollH3DownButton = document.getElementById('scroll-h3-down');
        const infoToggle = document.getElementById('scroll-info-toggle');
        const legendPanel = document.getElementById('scroll-legend');

        const findNearestHeader = (selector, direction) => {
            const headers = Array.from(mainContent.querySelectorAll(selector));
            const margin = mainNavbar.offsetHeight + 15; // Pieni puskuri
            if (direction === 'up') {
                return headers.filter(h => h.getBoundingClientRect().top < -1).pop();
            } else { // down
                return headers.find(h => h.getBoundingClientRect().top > margin);
            }
        };

        const updateButtonStates = () => {
            const atTop = window.scrollY < 20;
            const atBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 20;
            if (scrollTopButton) scrollTopButton.disabled = atTop;
            if (scrollBottomButton) scrollBottomButton.disabled = atBottom;
            if (scrollH2UpButton) scrollH2UpButton.disabled = atTop || !findNearestHeader('h2', 'up');
            if (scrollH2DownButton) scrollH2DownButton.disabled = atBottom || !findNearestHeader('h2', 'down');
            // MUOKATTU KOHTA ALLA: Lisätty 'h4' valitsimeen
            if (scrollH3UpButton) scrollH3UpButton.disabled = atTop || !findNearestHeader('h2, h3, h4', 'up');
            if (scrollH3DownButton) scrollH3DownButton.disabled = atBottom || !findNearestHeader('h2, h3, h4', 'down');
        };

        scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        scrollBottomButton?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
        scrollH2UpButton?.addEventListener('click', () => findNearestHeader('h2', 'up')?.scrollIntoView({ behavior: 'smooth' }));
        scrollH2DownButton?.addEventListener('click', () => findNearestHeader('h2', 'down')?.scrollIntoView({ behavior: 'smooth' }));
        scrollH3UpButton?.addEventListener('click', () => findNearestHeader('h2, h3, h4', 'up')?.scrollIntoView({ behavior: 'smooth' }));
        scrollH3DownButton?.addEventListener('click', () => findNearestHeader('h2, h3, h4', 'down')?.scrollIntoView({ behavior: 'smooth' }));

        infoToggle?.addEventListener('click', (e) => { e.stopPropagation(); legendPanel.classList.toggle('is-visible'); });
        document.addEventListener('click', () => legendPanel?.classList.remove('is-visible'));

        let scrollTimeout;
        window.addEventListener('scroll', () => { clearTimeout(scrollTimeout); scrollTimeout = setTimeout(updateButtonStates, 100); });
        window.addEventListener('resize', updateButtonStates);
        updateButtonStates(); // Aseta tila heti latauksen jälkeen
    }

    // Alustetaan kaikki toiminnot
    initializeSidebar();
    setupIntersectionObserver();
});