/**
 * Taistelukenttä d20 - Kelluvien vierityspainikkeiden toiminnallisuus
 *
 * Tämä skripti hallinnoi kaikkia sivun oikeassa alakulmassa olevia
 * vierityspainikkeita, mukaan lukien niiden näkyvyyden, toiminnallisuuden
 * ja selitepaneelin.
 *
 * @version 2.2 - Korjattu toistuvan vierityksen bugi.
 * @author Akseli Larikka
 */
document.addEventListener('DOMContentLoaded', function () {
    // Haetaan kaikki tarvittavat elementit DOM:sta
    const scrollButtonsContainer = document.getElementById('scroll-buttons-container');
    const mainContent = document.getElementById('main-content');
    const mainNavbar = document.getElementById('main-navbar');

    // Jos nappeja tai tarvittavia elementtejä ei ole tällä sivulla, lopetetaan suoritus
    if (!scrollButtonsContainer || !mainContent || !mainNavbar) {
        return;
    }

    // Nappien viittaukset
    const scrollTopButton = document.getElementById('scroll-top');
    const scrollBottomButton = document.getElementById('scroll-bottom');
    const scrollH2UpButton = document.getElementById('scroll-h2-up');
    const scrollH2DownButton = document.getElementById('scroll-h2-down');
    const scrollH3UpButton = document.getElementById('scroll-h3-up');
    const scrollH3DownButton = document.getElementById('scroll-h3-down');

    // Selitepaneelin viittaukset
    const infoToggleButton = document.getElementById('scroll-info-toggle');
    const legendPanel = document.getElementById('scroll-legend');

    /**
     * UUSI APUFUNKTIO: Vierittää sivun tiettyyn elementtiin ottaen huomioon
     * navigaatiopalkin korkeuden.
     * @param {Element} header - HTML-elementti, johon halutaan vierittää.
     */
    const scrollToHeader = (header) => {
        if (!header) return; // Varmistus, ettei yritetä vierittää olemattomaan kohteeseen

        const navbarHeight = mainNavbar.offsetHeight;
        const elementPosition = header.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight - 16; // 16px (1rem) puskuri

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    /**
     * Etsii lähimmän otsikon annetusta valitsimesta ja suunnasta.
     * @param {string} selector - CSS-valitsin otsikoille (esim. 'h2, h3').
     * @param {string} direction - 'up' tai 'down'.
     * @returns {Element|null} Löydetty otsikkoelementti tai null.
     */
    const findNearestHeader = (selector, direction) => {
        const headers = Array.from(mainContent.querySelectorAll(selector));
        // KORJAUS: Kasvatetaan marginaalia hieman, jotta funktio hyppää nykyisen otsikon yli.
        const margin = mainNavbar.offsetHeight + 30; // Kasvatettu puskuria 15px -> 30px

        if (direction === 'up') {
            // Tämä logiikka on jo kunnossa
            return headers.filter(h => h.getBoundingClientRect().top < -1).pop();
        } else { // 'down'
            // Etsi ensimmäinen otsikko, joka on riittävän kaukana näkymän yläreunasta
            return headers.find(h => h.getBoundingClientRect().top > margin);
        }
    };

    /**
     * Päivittää nappien 'disabled'-tilan sen mukaan, onko vieritys mahdollista.
     */
    const updateButtonStates = () => {
        const atTop = window.scrollY < 20;
        const atBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 20;

        if (scrollTopButton) scrollTopButton.disabled = atTop;
        if (scrollBottomButton) scrollBottomButton.disabled = atBottom;

        // "Alikersantti"-napit (pääotsikot)
        if (scrollH2UpButton) scrollH2UpButton.disabled = atTop || !findNearestHeader('h2', 'up');
        if (scrollH2DownButton) scrollH2DownButton.disabled = atBottom || !findNearestHeader('h2', 'down');

        // "Korpraali"-napit (mikä tahansa otsikko)
        if (scrollH3UpButton) scrollH3UpButton.disabled = atTop || !findNearestHeader('h2, h3, h4', 'up');
        if (scrollH3DownButton) scrollH3DownButton.disabled = atBottom || !findNearestHeader('h2, h3, h4', 'down');
    };

    // --- TAPAHTUMANKUUNTELIJAT (PÄIVITETTY) ---

    // Vieritysnapit
    scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollBottomButton?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

    // MUOKATTU: Käytetään uutta scrollToHeader-funktiota scrollIntoView:n sijaan
    scrollH2UpButton?.addEventListener('click', () => scrollToHeader(findNearestHeader('h2', 'up')));
    scrollH2DownButton?.addEventListener('click', () => scrollToHeader(findNearestHeader('h2', 'down')));
    scrollH3UpButton?.addEventListener('click', () => scrollToHeader(findNearestHeader('h2, h3, h4', 'up')));
    scrollH3DownButton?.addEventListener('click', () => scrollToHeader(findNearestHeader('h2, h3, h4', 'down')));


    // Selitepaneeli (tämä osa säilyy ennallaan)
    if (infoToggleButton && legendPanel) {
        infoToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            legendPanel.classList.toggle('is-visible');
        });

        // Sulje paneeli, jos klikataan sen ulkopuolelle
        document.addEventListener('click', (e) => {
            if (!legendPanel.contains(e.target) && !infoToggleButton.contains(e.target)) {
                legendPanel.classList.remove('is-visible');
            }
        });
    }

    // Kuunnellaan vieritystä ja ikkunan koon muutosta nappien tilan päivittämiseksi
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateButtonStates, 100);
    });
    window.addEventListener('resize', updateButtonStates);

    // Asetetaan nappien tila heti sivun latauduttua
    updateButtonStates();
});