/**
 * Taistelukenttä d20 -sivuston etusivun (index.html) interaktiivisuutta ja navigaatiota hallinnoiva skripti.
 *
 * Vastuualueet:
 * 1. Sivupalkin navigaation luonti (ilman automaattista numerointia, sillä se on etusivu).
 * 2. Vieritystoiminnot: Dynaamiset vierityspainikkeet ja niiden tilan hallinta.
 * 3. Käyttöliittymän parannukset: Mobiilinavigaation ja pudotusvalikon hallinta, aktiivisen linkin korostus.
 * 4. Automaattinen tekijänoikeusvuoden päivitys.
 *
 * @version 1.0
 * @author Akseli Larikka
 */
document.addEventListener('DOMContentLoaded', function () {

    // Noudetaan sivulta tarvittavat pääelementit myöhempää käyttöä varten.
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle'); // Sivupalkin toggle

    // Uudet elementit pudotusvalikon navigaatioon
    const currentPageNameElement = document.getElementById('current-page-name'); // "Nykyisen sivun nimi" painike
    const mainNavbarContent = document.getElementById('main-navbar-content'); // Varsinainen pudotusvalikon sisältö

    // Vianetsintä: Tarkista, että elementit löytyvät
    if (!currentPageNameElement) {
        console.error("currentPageNameElement (id='current-page-name') not found in DOM.");
    }
    if (!mainNavbarContent) {
        console.error("mainNavbarContent (id='main-navbar-content') not found in DOM.");
    }

    // Päivittää otsikoiden scrollMarginTop -arvon navbarin korkeuden mukaan.
    function updateScrollMargin() {
        const mainNavbar = document.getElementById('main-navbar');
        if (mainNavbar) {
            const navbarHeightPx = mainNavbar.offsetHeight;
            const navbarHeightRem = (navbarHeightPx / 16) + 0.5;
            const headers = mainContent.querySelectorAll('h1, h2, h3, h4');
            headers.forEach(header => {
                header.style.scrollMarginTop = `${navbarHeightRem}rem`;
            });
        }
    }

    updateScrollMargin();
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateScrollMargin, 150);
    });

    // ====================================================================
    // OSA 1: SISÄLLÖN ALUSTUS JA SIVUPALKKI & YLÄNAVIGAATION DROPDOWN
    // ====================================================================

    window.initializeContentAndSidebar = function () {
        Array.from(navMenu.children).forEach(child => {
            if (!child.classList.contains('sidebar-title')) {
                navMenu.removeChild(child);
            }
        });

        const headersForSidebar = mainContent.querySelectorAll('h2, h3, h4');

        const createSlug = (text) => {
            if (!text) return '';
            return 'header-' + text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        };

        headersForSidebar.forEach(header => {
            const originalText = header.textContent;
            let id = header.id;

            if (!id) {
                id = createSlug(originalText);
                header.id = id;
            }

            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = originalText;
            link.className = 'block py-1.5 px-4 rounded-md text-stone-700 hover:bg-purple-100 nav-link transition-all duration-200';

            if (header.tagName === 'H2') {
                link.classList.add('font-bold', 'text-purple-800', 'mt-1');
            } else if (header.tagName === 'H3') {
                link.classList.add('ml-4');
            } else if (header.tagName === 'H4') {
                link.classList.add('ml-8', 'text-sm');
            }

            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(id).scrollIntoView({
                    behavior: 'smooth'
                });
                // Sulje molemmat valikot linkkiä klikatessa mobiilissa
                if (window.innerWidth < 768) {
                    toggleMobileSidebar(true);
                    toggleNavbarDropdown(true);
                }
            });
            navMenu.appendChild(link);
        });
    };

    // --- Mobiilivalikoiden näkyvyyden hallinta ---

    const toggleMobileSidebar = (hide) => {
        if (hide) {
            sidebar.classList.add('sidebar-hidden');
        } else {
            sidebar.classList.remove('sidebar-hidden');
            toggleNavbarDropdown(true); // Sulje dropdown, jos sivupalkki avataan
        }
    };

    // Muutettu toggleNavbarDropdown -funktio
    const toggleNavbarDropdown = (forceHide = false) => { // Lisää oletusarvon ja nimeä selkeämmin
        const isCurrentlyOpen = mainNavbarContent.classList.contains('dropdown-open');

        if (forceHide) { // Jos halutaan pakottaa sulkeminen (esim. toisen valikon avaamisen yhteydessä)
            mainNavbarContent.classList.remove('dropdown-open');
            currentPageNameElement.classList.remove('dropdown-open');
        } else if (isCurrentlyOpen) { // Jos on auki ja ei pakoteta sulkemaan, sulje
            mainNavbarContent.classList.remove('dropdown-open');
            currentPageNameElement.classList.remove('dropdown-open');
        } else { // Jos on kiinni ja ei pakoteta sulkemaan, avaa
            mainNavbarContent.classList.add('dropdown-open');
            currentPageNameElement.classList.add('dropdown-open');
            toggleMobileSidebar(true); // Sulje sivupalkki, jos dropdown avataan
        }
    };

    // Tapahtumakuuntelija sivupalkin toggle-painikkeelle
    if (menuToggle) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = sidebar.classList.contains('sidebar-hidden');
            console.log("Menu toggle clicked. Sidebar hidden:", isHidden); // Vianetsintä
            toggleMobileSidebar(!isHidden);
        });
    }

    // Tapahtumakuuntelija "Nykyisen sivun nimi" -painikkeelle (dropdownin avaaja)
    if (currentPageNameElement && mainNavbarContent) {
        currentPageNameElement.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("Current page name clicked.");
            console.log("Window width:", window.innerWidth);
            console.log("Is dropdown open BEFORE toggle:", mainNavbarContent.classList.contains('dropdown-open'));

            // Kutsu toggleNavbarDropdown ilman parametria, jotta se vaihtaa tilaa
            if (window.innerWidth < 768) { // Vain mobiilissa
                toggleNavbarDropdown();
            }


            console.log("Is dropdown open AFTER toggle:", mainNavbarContent.classList.contains('dropdown-open'));
        });

        // Lisää klikkauskuuntelija pudotusvalikon linkeille, jotta valikko sulkeutuu linkkiä klikatessa
        mainNavbarContent.querySelectorAll('.nav-link-top').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    toggleNavbarDropdown(true); // Pakota sulkeminen linkkiä klikatessa
                }
            });
        });
    } else {
        console.error("currentPageNameElement or mainNavbarContent not found, dropdown click handler not attached.");
    }


    // Sulje valikot, jos klikataan niiden ulkopuolelle
    document.addEventListener('click', (event) => {
        if (window.innerWidth < 768) {
            // Sulje sivupalkki, jos klikattiin sen ulkopuolelle ja se on auki
            if (sidebar && menuToggle && !sidebar.contains(event.target) && !menuToggle.contains(event.target) && !sidebar.classList.contains('sidebar-hidden')) {
                toggleMobileSidebar(true);
            }

            // Sulje dropdown, jos klikattiin sen tai sen avaajan ulkopuolelle ja se on auki
            if (mainNavbarContent && currentPageNameElement && !mainNavbarContent.contains(event.target) && !currentPageNameElement.contains(event.target) && mainNavbarContent.classList.contains('dropdown-open')) {
                toggleNavbarDropdown(true);
            }
        }
    });

    // Sulje valikot, jos ikkunan kokoa muutetaan työpöytämoodiin
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            toggleMobileSidebar(true);
            toggleNavbarDropdown(true);
        }
    });

    // --- Sivupalkin aktiivisen linkin korostus vierittäessä ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const navLink = navMenu.querySelector(`a[href="#${id}"]`);

            if (navLink && entry.isIntersecting && entry.intersectionRatio > 0.5) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
                navLink.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
    }, {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0.6
    });

    const setupIntersectionObserver = () => {
        const headersForSidebar = mainContent.querySelectorAll('h2, h3, h4');
        headersForSidebar.forEach(header => observer.observe(header));
    };

    // ====================================================================
    // OSA 2: SIVUN VIERITYSPAINIKKEET
    // ====================================================================

    const scrollButtonsContainer = document.getElementById('scroll-buttons-container');
    const mainContentForScroll = document.getElementById('main-content');

    if (scrollButtonsContainer && mainContentForScroll) {
        const scrollTopButton = document.getElementById('scroll-top');
        const scrollH2UpButton = document.getElementById('scroll-h2-up');
        const scrollH3UpButton = document.getElementById('scroll-h3-up');
        const scrollBottomButton = document.getElementById('scroll-bottom');
        const scrollH2DownButton = document.getElementById('scroll-h2-down');
        const scrollH3DownButton = document.getElementById('scroll-h3-down');

        const findNextNavigableHeader = (direction) => {
            const allNavigableHeaders = Array.from(mainContentForScroll.querySelectorAll('h2, h3'));
            if (direction === 'up') {
                const headersAbove = allNavigableHeaders.filter(h => h.getBoundingClientRect().top < -1);
                return headersAbove.length > 0 ? headersAbove[headersAbove.length - 1] : null;
            } else {
                return allNavigableHeaders.find(h => h.getBoundingClientRect().top > 1) || null;
            }
        };

        const findNearestStrictHeader = (selector, direction) => {
            const allHeaders = Array.from(mainContentForScroll.querySelectorAll(selector));
            if (direction === 'up') {
                const headersAbove = allHeaders.filter(h => h.getBoundingClientRect().top < -1);
                return headersAbove.length > 0 ? headersAbove[headersAbove.length - 1] : null;
            } else {
                return allHeaders.find(h => h.getBoundingClientRect().top > 1) || null;
            }
        };

        const updateButtonStates = () => {
            const scrollY = window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;

            const atTop = scrollY < 20;
            const atBottom = (windowHeight + scrollY) >= pageHeight - 20;

            const nextH2Up = findNearestStrictHeader('h2', 'up');
            const nextH2Down = findNearestStrictHeader('h2', 'down');
            const nextNavigableUp = findNextNavigableHeader('up');
            const nextNavigableDown = findNextNavigableHeader('down');

            if (scrollTopButton) scrollTopButton.disabled = atTop;
            if (scrollBottomButton) scrollBottomButton.disabled = atBottom;
            if (scrollH2UpButton) scrollH2UpButton.disabled = atTop || !nextH2Up;
            if (scrollH2DownButton) scrollH2DownButton.disabled = atBottom || !nextH2Down;
            if (scrollH3UpButton) scrollH3UpButton.disabled = atTop || !nextNavigableUp;
            if (scrollH3DownButton) scrollH3DownButton.disabled = atBottom || !nextNavigableDown;
        };

        if (scrollTopButton) scrollTopButton.addEventListener('click', () => window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }));
        if (scrollBottomButton) scrollBottomButton.addEventListener('click', () => window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        }));
        if (scrollH2UpButton) scrollH2UpButton.addEventListener('click', () => findNearestStrictHeader('h2', 'up')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        }));
        if (scrollH2DownButton) scrollH2DownButton.addEventListener('click', () => findNearestStrictHeader('h2', 'down')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        }));
        if (scrollH3UpButton) scrollH3UpButton.addEventListener('click', () => findNextNavigableHeader('up')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        }));
        if (scrollH3DownButton) scrollH3DownButton.addEventListener('click', () => findNextNavigableHeader('down')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        }));

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateButtonStates, 50);
        });
        window.addEventListener('resize', updateButtonStates);

        setTimeout(updateButtonStates, 100);

    } else {
        console.error('VIERITYSNAPPIEN SKRIPTI EI KÄYNNISTYNYT! Varmista, että HTML-koodissa on elementit ID:llä "scroll-buttons-container" ja "main-content".');
    }

    // ====================================================================
    // OSA 4: VIERITYSNAPPIEN SELITTEEN NÄYTTÖ
    // ====================================================================

    const infoToggle = document.getElementById('scroll-info-toggle');
    const legendPanel = document.getElementById('scroll-legend');

    if (infoToggle && legendPanel) {
        infoToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            legendPanel.classList.toggle('is-visible');
        });

        document.addEventListener('click', () => {
            if (legendPanel.classList.contains('is-visible')) {
                legendPanel.classList.remove('is-visible');
            }
        });
    }
    // ====================================================================
    // OSA 5: JALKISANAT JA AUTOMAATTINEN VUOSILUVUN PÄIVITYS
    // ====================================================================

    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    window.initializeContentAndSidebar();
    setupIntersectionObserver();
});