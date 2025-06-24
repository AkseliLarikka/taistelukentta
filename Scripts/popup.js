/**
 * Taistelukenttä d20 -sivuston popup-ikkunoita hallinnoiva skripti.
 *
 * @version 1.0
 * @author Akseli Larikka
 */
document.addEventListener('DOMContentLoaded', () => {
    // Estetään toiminnallisuuden käynnistyminen, jos sanastodataa ei löydy.
    if (typeof glossaryData === 'undefined') {
        console.error('Sanastodataa (glossaryData) ei löytynyt. Varmista, että Scripts/glossaryData.js on ladattu.');
        return;
    }

    // Luodaan yksi ainoa popup-elementti, jota uudelleenkäytetään.
    const popup = document.createElement('div');
    popup.className = 'glossary-popup';
    popup.style.display = 'none'; // Piilotetaan oletuksena
    document.body.appendChild(popup);

    // --- LISÄTTY MUUTTUJA ---
    // Tämä muuttuja pitää kirjaa siitä, mikä termi-elementti on avannut näkyvissä olevan popupin.
    let activeTermElement = null;

    // Kuunnellaan klikkauksia koko dokumentissa (event delegation)
    document.body.addEventListener('click', (event) => {
        const termElement = event.target.closest('.glossary-term');

        // Jos klikattiin sanastotermiä
        if (termElement) {
            event.preventDefault();
            event.stopPropagation();

            // --- UUSI LOGIIKKA ---
            // Tarkistetaan, onko popup jo näkyvissä JA onko klikattu elementti sama, joka avasi sen.
            // Jos on, suljetaan popup ja nollataan tila.
            if (popup.style.display === 'block' && termElement === activeTermElement) {
                popup.style.display = 'none';
                activeTermElement = null; // Nollataan aktiivinen termi
                return; // Lopetetaan funktion suoritus tähän
            }

            // Jos yllä oleva ehto ei täyty, jatketaan normaalisti popupin avaamiseen.
            const termKey = termElement.dataset.term.toLowerCase();
            const definition = glossaryData[termKey];

            if (definition) {
                popup.innerHTML = definition;
                popup.style.display = 'block';
                positionPopup(event);
                // Asetetaan juuri klikattu elementti uudeksi aktiiviseksi termiksi.
                activeTermElement = termElement;
            }
        }
        // Jos klikattiin jotain muuta kuin popupia itseään
        else if (!popup.contains(event.target)) {
            popup.style.display = 'none';
            activeTermElement = null; // Nollataan aktiivinen termi myös tässä
        }
    });

    // Funktio, joka asettaa popupin sijainnin
    function positionPopup(event) {
        // Laitetaan popup hieman kursorin alapuolelle ja oikealle puolelle
        let x = event.pageX + 15;
        let y = event.pageY + 15;

        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;

        // Varmistetaan, ettei popup mene näytön reunojen ulkopuolelle
        const rect = popup.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (rect.right > screenWidth) {
            popup.style.left = `${screenWidth - rect.width - 20}px`;
        }
        if (rect.bottom > screenHeight) {
            popup.style.top = `${y - rect.height - 30}px`; // Siirretään kursorin yläpuolelle
        }
    }
});