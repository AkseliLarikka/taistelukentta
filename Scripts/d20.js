document.addEventListener('DOMContentLoaded', function () {

    // Noudetaan sivulta tarvittavat pääelementit
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');

    // ====================================================================
    // OSA 1: SISÄLLÖN ALUSTUS JA SIVUPALKKI
    // ====================================================================

    // --- Otsikoiden automaattinen numerointi ---
    // Käy läpi kaikki H1-H4-otsikot ja lisää niihin numerointi (esim. 1.1, 1.1.2).
    const headersToNumber = mainContent.querySelectorAll('h1, h2, h3, h4');
    const counters = [0, 0, 0]; // Laskurit H2, H3 ja H4 tasoille

    headersToNumber.forEach(header => {
        const level = parseInt(header.tagName.substring(1));
        if (level === 1) {
            counters.fill(0); // Nollaa laskurit H1-otsikon kohdalla
        } else if (level >= 2 && level <= 4) {
            const counterIndex = level - 2;
            counters[counterIndex]++;
            // Nollaa kaikki alemman tason laskurit
            for (let i = counterIndex + 1; i < counters.length; i++) {
                counters[i] = 0;
            }
            const numberString = counters.slice(0, counterIndex + 1).join('.');
            header.textContent = `${numberString} ${header.textContent}`;
        }
    });

    // --- Sivupalkin navigaatiolinkkien luonti ---
    const headersForSidebar = mainContent.querySelectorAll('h2, h3, h4');

    // Apufunktio, joka luo otsikosta URL-ystävällisen "slugin" ankkurilinkkiä varten.
    const createSlug = (text) => {
        if (!text) return '';
        const cleanText = text.replace(/^[\d\.]+\s/, ''); // Poistaa numerot alusta
        return 'header-' + cleanText.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    // Luodaan jokaisesta otsikosta linkki sivupalkkiin.
    headersForSidebar.forEach(header => {
        const numberedTitle = header.textContent;
        let id = header.id;
        if (!id) {
            id = createSlug(numberedTitle);
            header.id = id;
        }

        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = numberedTitle;
        link.className = 'block py-1.5 px-4 rounded-md text-stone-700 hover:bg-purple-100 nav-link transition-all duration-200';

        // Lisätään tyylit otsikkotason mukaan
        if (header.tagName === 'H2') {
            link.classList.add('font-bold', 'text-purple-800', 'mt-1');
        } else if (header.tagName === 'H3') {
            link.classList.add('ml-4');
        } else if (header.tagName === 'H4') {
            link.classList.add('ml-8', 'text-sm');
        }

        // Lisätään klikkauskuuntelija, joka vierittää pehmeästi ja sulkee mobiilisivupalkin.
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
            if (window.innerWidth < 768) {
                sidebar.classList.add('sidebar-hidden');
            }
        });
        navMenu.appendChild(link);
    });

    // --- Mobiilisivupalkin hallinta ---
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-hidden');
    });

    mainContent.addEventListener('click', () => {
        if (window.innerWidth < 768 && !sidebar.classList.contains('sidebar-hidden')) {
            sidebar.classList.add('sidebar-hidden');
        }
    });

    // --- Sivupalkin aktiivisen linkin korostus vierittäessä ---
    // IntersectionObserver tarkkailee, mikä otsikko on näkyvissä.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const navLink = navMenu.querySelector(`a[href="#${id}"]`);
            if (navLink) {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                    navLink.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }
        });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0.6 });
    headersForSidebar.forEach(header => observer.observe(header));


    // ====================================================================
    // OSA 2: SIVUN VIERITYSPAINIKKEET
    // ====================================================================

    const scrollButtonsContainer = document.getElementById('scroll-buttons-container');
    const mainContentForScroll = document.getElementById('main-content');

    if (scrollButtonsContainer && mainContentForScroll) {

        // Noudetaan kaikki painike-elementit
        const scrollTopButton = document.getElementById('scroll-top');
        const scrollH2UpButton = document.getElementById('scroll-h2-up');
        const scrollH3UpButton = document.getElementById('scroll-h3-up');
        const scrollBottomButton = document.getElementById('scroll-bottom');
        const scrollH2DownButton = document.getElementById('scroll-h2-down');
        const scrollH3DownButton = document.getElementById('scroll-h3-down');

        // --- Etsintäfunktiot ---
        // Käytetään getBoundingClientRect()-metodia, joka on luotettava tapa mitata sijainti suhteessa näyttöön.

        /**
         * "Älykäs" haku: Etsii lähimmän H2- tai H3-otsikon. Käytetään yhden nuolen painikkeille.
         */
        const findNextNavigableHeader = (direction) => {
            const allNavigableHeaders = Array.from(mainContentForScroll.querySelectorAll('h2, h3'));
            if (direction === 'up') {
                const headersAbove = allNavigableHeaders.filter(h => h.getBoundingClientRect().top < -1);
                return headersAbove.length > 0 ? headersAbove[headersAbove.length - 1] : null;
            } else {
                return allNavigableHeaders.find(h => h.getBoundingClientRect().top > 1) || null;
            }
        };

        /**
         * "Tiukka" haku: Etsii vain määritellyn tyyppistä otsikkoa (H2). Käytetään kahden nuolen painikkeille.
         */
        const findNearestStrictHeader = (selector, direction) => {
            const allHeaders = Array.from(mainContentForScroll.querySelectorAll(selector));
            if (direction === 'up') {
                const headersAbove = allHeaders.filter(h => h.getBoundingClientRect().top < -1);
                return headersAbove.length > 0 ? headersAbove[headersAbove.length - 1] : null;
            } else {
                return allHeaders.find(h => h.getBoundingClientRect().top > 1) || null;
            }
        };

        // --- Painikkeiden tilan päivitys ---
        // Tarkistaa, mitkä painikkeet tulee näyttää aktiivisina tai pois päältä.
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

        // --- Tapahtumankuuntelijat ---
        // Äärirajoihin vieritys
        if (scrollTopButton) scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        if (scrollBottomButton) scrollBottomButton.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

        // H2-otsikoihin vieritys (tiukka haku)
        if (scrollH2UpButton) scrollH2UpButton.addEventListener('click', () => findNearestStrictHeader('h2', 'up')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        if (scrollH2DownButton) scrollH2DownButton.addEventListener('click', () => findNearestStrictHeader('h2', 'down')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

        // Seuraavaan otsikkoon vieritys (älykäs haku)
        if (scrollH3UpButton) scrollH3UpButton.addEventListener('click', () => findNextNavigableHeader('up')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        if (scrollH3DownButton) scrollH3DownButton.addEventListener('click', () => findNextNavigableHeader('down')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

        // Tilanpäivityksen käynnistys ja optimointi
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            // Optimointi: Suoritetaan päivitys vasta, kun vieritys on hetkeksi pysähtynyt.
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateButtonStates, 50);
        });
        window.addEventListener('resize', updateButtonStates);

        // Varmistetaan tilanpäivitys heti latauksen jälkeen
        setTimeout(updateButtonStates, 100);

    } else {
        console.error('VIERITYSNAPPIEN SKRIPTI EI KÄYNNISTYNYT! Varmista, että HTML-koodissa on elementit ID:llä "scroll-buttons-container" ja "main-content".');
    }
    // ====================================================================
    // OSA 3: VIERITYSNAPPIEN TELAKOINTI FOOTERIN KOHDALLA
    // ====================================================================
    const pageFooter = document.getElementById('page-footer');
    const scrollButtons = document.getElementById('scroll-buttons-container');

    if (pageFooter && scrollButtons) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Jos footer on näkyvissä, lisätään telakoitu luokka napeille.
                if (entry.isIntersecting) {
                    scrollButtons.classList.add('is-docked');
                } else {
                    scrollButtons.classList.remove('is-docked');
                }
            });
        }, {
            // Määritellään "viewport" 100 pikseliä todellista näkymää alemmaksi.
            // Tämä saa telakoinnin tapahtumaan hieman ennen kuin footer osuu näytön alareunaan.
            rootMargin: '0px 0px -100px 0px'
        });

        // Asetetaan tarkkailija päälle.
        footerObserver.observe(pageFooter);
    }
    // ====================================================================
    // OSA 4: VIERITYSNAPPIEN SELITTEEN NÄYTTÖ
    // ====================================================================
    const infoToggle = document.getElementById('scroll-info-toggle');
    const legendPanel = document.getElementById('scroll-legend');

    if (infoToggle && legendPanel) {
        infoToggle.addEventListener('click', (event) => {
            // Estää klikkauksen "propagoitumisen" ylemmäs, mikä voisi sulkea paneelin heti.
            event.stopPropagation();
            legendPanel.classList.toggle('is-visible');
        });

        // Vapaaehtoinen: Sulkee paneelin, jos klikataan sen ulkopuolella.
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
});