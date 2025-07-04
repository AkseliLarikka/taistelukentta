/**
 * Taistelukenttä d20 - Sivuston navigaatio ja interaktiivisuus
 * @version 3.1 - Korjattu ja yksinkertaistettu mobiilin sivupalkin logiikka.
 * @author Akseli Larikka
 */

// ====================================================================
// GLOBAALIT FUNKTIOT
// ====================================================================

/**
 * Rakentaa KOKO sisällysluettelon uudelleen.
 * Käsittelee sekä staattiset että dynaamiset yksikköotsikot.
 */
window.buildSidebar = function () {
  const mainContent = document.getElementById("main-content");
  const navMenu = document.getElementById("nav-menu");
  const unitNavMenu = document.getElementById("unit-nav-menu");

  if (!mainContent || !navMenu) return;

  // Tyhjennetään vanhat linkit
  Array.from(navMenu.children).forEach((child) => {
    if (!child.classList.contains("sidebar-title")) {
      navMenu.removeChild(child);
    }
  });
  if (unitNavMenu) {
    unitNavMenu.innerHTML = "";
  }

  // Käsitellään staattiset otsikot
  const staticHeaders = mainContent.querySelectorAll(
    ".prose > h2, section:not(.rules-exclude) h2, section:not(.rules-exclude) h3, section:not(.rules-exclude) h4"
  );
  const isIndexPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname.endsWith("/");
  let counters = { h2: 0, h3: 0, h4: 0 };

  staticHeaders.forEach((header) => {
    // Varmistetaan, että emme numeroi dynaamisesti luotuja yksikkökortteja
    if (header.closest("#unit-display-container")) return;

    const level = parseInt(header.tagName.substring(1));
    let headerText = header.textContent.trim();

    // Lisätään numerointi, jos sitä ei ole ja sivu ei ole etusivu
    if (!isIndexPage && !/^\d+\./.test(headerText)) {
      if (level === 2) {
        counters.h2++;
        counters.h3 = 0;
        counters.h4 = 0;
        headerText = `${counters.h2}. ${headerText}`;
      } else if (level === 3) {
        counters.h3++;
        counters.h4 = 0;
        headerText = `${counters.h2}.${counters.h3}. ${headerText}`;
      } else if (level === 4) {
        counters.h4++;
        headerText = `${counters.h2}.${counters.h3}.${counters.h4}. ${headerText}`;
      }
      header.textContent = headerText;
    }
    createAndAppendLink(header, headerText, level, navMenu);
  });

  // Käsitellään dynaamiset yksikköotsikot erikseen
  if (unitNavMenu) {
    const unitHeaders = mainContent.querySelectorAll(
      "#unit-display-container .unit-card h4"
    );
    unitHeaders.forEach((header) => {
      const headerText = header.textContent.trim();
      createAndAppendLink(header, headerText, 4, unitNavMenu, true);
    });
  }
};

/**
 * Apufunktio, joka luo ja lisää linkin sivupalkkiin.
 * Käyttää manuaalista vieritystä, jotta se toimii luotettavammin eri selaimissa.
 * @param {HTMLElement} headerElement - Otsikkoelementti, johon linkki viittaa.
 * @param {string} text - Linkin teksti.
 * @param {number} level - Otsikon taso (esim. 2 for H2).
 * @param {HTMLElement} menuElement - Sivupalkin nav-elementti, johon linkki lisätään.
 * @param {boolean} isUnitLink - Onko kyseessä dynaaminen yksikkölinkki.
 */
function createAndAppendLink(
  headerElement,
  text,
  level,
  menuElement,
  isUnitLink = false
) {
  // Haetaan yksilöllinen tunniste (slug) elementiltä.
  // Yksikkökorteilla on kortin ID, muilla otsikon oma ID.
  let slug = isUnitLink
    ? headerElement.closest(".unit-card")?.id
    : headerElement.id;
  if (!slug) {
    // Jos ID:tä ei ole, luodaan se tekstin perusteella.
    const originalText = text.replace(/^[\d\.]+\s/, "");
    slug =
      "header-" +
      originalText
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
    headerElement.id = slug;
  }
  if (!slug) return; // Jos slugia ei voida luoda, lopetetaan.

  const link = document.createElement("a");
  link.href = `#${slug}`;
  link.textContent = text;
  link.className = "nav-link";

  // Muotoillaan linkin sisennystä otsikkotason mukaan.
  if (isUnitLink) {
    link.classList.add("ml-4");
  } else {
    if (level === 2) link.classList.add("font-bold");
    if (level === 3) link.classList.add("ml-4");
    if (level === 4) link.classList.add("ml-8");
  }

  // Lisätään klikkauskuuntelija, joka hoitaa pehmeän vierityksen.
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetElement = document.getElementById(slug);

    if (targetElement) {
      // Lasketaan oikea vierityskohta ottaen huomioon yläpalkin korkeuden.
      const navbarHeight =
        document.getElementById("main-navbar")?.offsetHeight || 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.scrollY - navbarHeight - 48; // 48px lisäpuskuri

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Piilotetaan sivupalkki mobiilissa klikkauksen jälkeen.
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth < 768 && sidebar) {
      sidebar.classList.add("sidebar-hidden");
    }
  });
  menuElement.appendChild(link);
}

// ====================================================================
// SIVUN LATAUTUESSA SUORITETTAVAT TOIMENPITEET
// ====================================================================
document.addEventListener("DOMContentLoaded", function () {
  // Rakennetaan sisällysluettelo heti kun sivu on latautunut.
  window.buildSidebar();

  // Haetaan tarvittavat elementit mobiilinavigaatiota varten.
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const mainNavbarContent = document.getElementById("main-navbar-content");
  const currentPageNameElement = document.getElementById("current-page-name");

  /**
   * Yksinkertaistettu funktio päänavigaation (yläpalkin dropdown) tilan vaihtamiseen.
   * @param {boolean} forceHide - Jos totta, piilottaa valikon varmasti.
   */
  const toggleNavbarDropdown = (forceHide = false) => {
    if (!mainNavbarContent || !currentPageNameElement) return;
    const isCurrentlyOpen = mainNavbarContent.classList.contains("dropdown-open");
    if (forceHide || isCurrentlyOpen) {
      mainNavbarContent.classList.remove("dropdown-open");
      currentPageNameElement.classList.remove("dropdown-open");
    } else {
      mainNavbarContent.classList.add("dropdown-open");
      currentPageNameElement.classList.add("dropdown-open");
      // Varmistetaan, että sivupalkki menee piiloon, kun päävalikko avataan.
      if (sidebar) sidebar.classList.add("sidebar-hidden");
    }
  };

  // --- KORJATTU OSA: Sivupalkin hampurilaisvalikon toiminta ---
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Estää klikkauksen propagoitumisen, esim. dokumentin sulkemiskuuntelijaan.

      // Vaihdetaan 'sidebar-hidden'-luokan tilaa. Tämä on luotettavampi tapa.
      // Jos luokka on olemassa, se poistetaan (palkki näkyviin).
      // Jos luokkaa ei ole, se lisätään (palkki piiloon).
      sidebar.classList.toggle('sidebar-hidden');

      // Varmistetaan, että päänavigaation dropdown-valikko sulkeutuu, kun sivupalkki avataan.
      if (!sidebar.classList.contains('sidebar-hidden')) {
        toggleNavbarDropdown(true); // Pakota päänavigaatio kiinni.
      }
    });
  }

  // Päänavigaation (yläpalkki) dropdown-toiminnallisuus mobiilissa.
  if (currentPageNameElement) {
    currentPageNameElement.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth < 768) toggleNavbarDropdown();
    });
  }

  // Suljetaan mobiilivalikot, jos klikataan niiden ulkopuolelle.
  document.addEventListener("click", (e) => {
    if (window.innerWidth < 768) {
      if (sidebar && !sidebar.contains(e.target) && !menuToggle?.contains(e.target)) {
        sidebar.classList.add("sidebar-hidden");
      }
      if (mainNavbarContent && !mainNavbarContent.contains(e.target) && !currentPageNameElement?.contains(e.target)) {
        toggleNavbarDropdown(true);
      }
    }
  });

  // Hoidetaan näkymän muutos, jos ikkunan kokoa muutetaan mobiilista työpöydälle.
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      if (sidebar) sidebar.classList.add("sidebar-hidden"); // Piilota mobiili-sidebar
      toggleNavbarDropdown(true); // Sulje dropdown
    }
  });

  // IntersectionObserver sivupalkin aktiivisen linkin korostamiseen.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const navLink = document.querySelector(
          `#nav-menu a[href="#${id}"], #unit-nav-menu a[href="#${id}"]`
        );
        if (navLink && entry.isIntersecting && entry.intersectionRatio > 0.5) {
          document
            .querySelectorAll(".nav-link")
            .forEach((link) => link.classList.remove("active"));
          navLink.classList.add("active");
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0.6 }
  );

  document.querySelectorAll("h2, h3, h4, .unit-card").forEach((header) => {
    if (header) observer.observe(header)
  });
});