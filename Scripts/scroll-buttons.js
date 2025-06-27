/**
 * Taistelukenttä d20 - Kelluvien vierityspainikkeiden toiminnallisuus
 *
 * Tämä skripti hallinnoi kaikkia sivun oikeassa alakulmassa olevia
 * vierityspainikkeita, mukaan lukien niiden näkyvyyden, toiminnallisuuden
 * ja selitepaneelin.
 *
 * @version 2.0
 * @author Akseli Larikka
 */
document.addEventListener('DOMContentLoaded', function () {
    // Haetaan kaikki tarvittavat elementit DOM:sta
    const scrollButtonsContainer = document.getElementById('scroll-buttons-container');
    const mainContent = document.getElementById('main-content');
    const mainNavbar = document.getElementById('main-navbar');

    // Jos nappeja ei ole tällä sivulla, lopetetaan suoritus
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
     * Etsii lähimmän otsikon annetusta valitsimesta ja suunnasta.
     * @param {string} selector - CSS-valitsin otsikoille (esim. 'h2, h3').
     * @param {string} direction - 'up' tai 'down'.
     * @returns {Element|null} Löydetty otsikkoelementti tai null.
     */
    const findNearestHeader = (selector, direction) => {
        const headers = Array.from(mainContent.querySelectorAll(selector));
        const margin = mainNavbar.offsetHeight + 15; // Pieni puskuri yläpalkille

        if (direction === 'up') {
            // Etsi kaikki otsikot, jotka ovat näkymän yläpuolella, ja ota niistä viimeinen.
            return headers.filter(h => h.getBoundingClientRect().top < -1).pop();
        } else { // 'down'
            // Etsi ensimmäinen otsikko, joka on näkymän alapuolella.
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

    // --- TAPAHTUMANKUUNTELIJAT ---

    // Vieritysnapit
    scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollBottomButton?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    scrollH2UpButton?.addEventListener('click', () => findNearestHeader('h2', 'up')?.scrollIntoView({ behavior: 'smooth' }));
    scrollH2DownButton?.addEventListener('click', () => findNearestHeader('h2', 'down')?.scrollIntoView({ behavior: 'smooth' }));
    scrollH3UpButton?.addEventListener('click', () => findNearestHeader('h2, h3, h4', 'up')?.scrollIntoView({ behavior: 'smooth' }));
    scrollH3DownButton?.addEventListener('click', () => findNearestHeader('h2, h3, h4', 'down')?.scrollIntoView({ behavior: 'smooth' }));

    // Selitepaneeli
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