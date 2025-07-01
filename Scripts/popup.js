/**
 * Taistelukenttä d20 -sivuston sanastoponnahdusikkunoita hallinnoiva skripti.
 * @version 3.0 - Yksinkertaistettu sijaintilogiikka, joka vierittyy sivun mukana.
 * @author Akseli Larikka
 */
document.addEventListener("DOMContentLoaded", () => {
  // Estetään toiminnallisuuden käynnistyminen, jos sanastodataa ei löydy.
  if (typeof glossaryData === "undefined") {
    console.error(
      "Sanastodataa (glossaryData) ei löytynyt. Varmista, että Scripts/glossaryData.js on ladattu."
    );
    return;
  }

  // Luodaan yksi ainoa popup-elementti, jota uudelleenkäytetään.
  const popup = document.createElement("div");
  popup.className = "glossary-popup";
  document.body.appendChild(popup);

  let activeTermElement = null;

  // Funktio, joka näyttää ja asettelee ponnahdusikkunan
  function showPopup(event) {
    const termElement = event.target.closest(".glossary-term");
    if (!termElement) return;

    // Jos sama termi klikataan uudelleen, sulje popup
    if (popup.style.display === "block" && termElement === activeTermElement) {
      hidePopup();
      return;
    }

    const termKey = termElement.dataset.term.toLowerCase();
    const definition = glossaryData[termKey];

    if (definition) {
      popup.innerHTML = definition;
      popup.style.display = "block";
      positionPopup(event);
      activeTermElement = termElement;
    }
  }

  // Funktio, joka piilottaa ponnahdusikkunan
  function hidePopup() {
    popup.style.display = "none";
    activeTermElement = null;
  }

  // Funktio, joka asettaa popupin sijainnin sivulla
  function positionPopup(event) {
    // Laitetaan popup hieman kursorin alapuolelle ja oikealle puolelle
    // pageX ja pageY ottavat huomioon sivun vierityksen, joten popup ilmestyy oikeaan kohtaan dokumentissa
    let x = event.pageX + 15;
    let y = event.pageY + 15;

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    // Varmistetaan, ettei popup mene näytön reunojen ulkopuolelle
    const rect = popup.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    // Huom: Koska popup vierittyy sivun mukana, tarkistamme vain oikean reunan.
    // Jos popup menisi alareunan yli, käyttäjä voi vierittää sivua nähdäkseen sen.
    if (rect.right > screenWidth) {
      popup.style.left = `${x - rect.width - 30}px`; // Siirretään kursorin vasemmalle puolelle
    }
  }

  // Kuunnellaan klikkauksia koko dokumentissa
  document.body.addEventListener("click", (event) => {
    const termElement = event.target.closest(".glossary-term");

    if (termElement) {
      event.preventDefault();
      event.stopPropagation();
      showPopup(event);
    } else if (!popup.contains(event.target)) {
      hidePopup();
    }
  });
});
