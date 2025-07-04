/**
 * Taistelukenttä d20 - Sivuston navigaatio ja interaktiivisuus
 * @version 4.1 - Yleistetty otsikoiden valitsin sivupalkin rakentamisessa.
 * @author Akseli Larikka
 */

// ====================================================================
// GLOBAALIT MUUTTUJAT
// ====================================================================

// Ajastin scroll-tapahtuman "kuristamiseen" (throttling)
let scrollTimeout;

// ====================================================================
// PÄÄFUNKTIOT
// ====================================================================

/**
 * Rakentaa sisällysluettelon dynaamisesti sivun otsikoista.
 */
window.buildSidebar = function () {
  const mainContent = document.getElementById("main-content");
  const navMenu = document.getElementById("nav-menu");
  const unitNavMenu = document.getElementById("unit-nav-menu");

  if (!mainContent || !navMenu) return;

  // Tyhjennetään vanhat linkit, jotta vältetään duplikaatit
  Array.from(navMenu.children).forEach((child) => {
    if (!child.classList.contains("sidebar-title")) {
      navMenu.removeChild(child);
    }
  });
  if (unitNavMenu) {
    unitNavMenu.innerHTML = "";
  }

  // --- KORJATTU OSA: YLEISPÄTEVÄMPI OTSIKOIDEN VALINTA ---
  // Haetaan kaikki mahdolliset otsikot ".prose"-säiliön sisältä.
  const allHeaders = mainContent.querySelectorAll(
    ".prose h2, .prose h3, .prose h4"
  );
  
  const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
  let counters = { h2: 0, h3: 0, h4: 0 };

  allHeaders.forEach((header) => {
    // Varmistetaan, että emme ota mukaan dynaamisten työkalujen tai yksiköiden otsikoita.
    if (header.closest(".rules-exclude") || header.closest("#unit-display-container")) return;

    const level = parseInt(header.tagName.substring(1));
    let headerText = header.textContent.trim();

    // Lisätään numerointi muille sivuille paitsi etusivulle.
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

  if (unitNavMenu) {
    const unitHeaders = mainContent.querySelectorAll("#unit-display-container .unit-card h4");
    unitHeaders.forEach((header) => {
      const headerText = header.textContent.trim();
      createAndAppendLink(header, headerText, 4, unitNavMenu, true);
    });
  }
};

/**
 * Apufunktio, joka luo ja lisää linkin sivupalkkiin.
 */
function createAndAppendLink(headerElement, text, level, menuElement, isUnitLink = false) {
  let slug = isUnitLink ? headerElement.closest(".unit-card")?.id : headerElement.id;
  if (!slug) {
    const originalText = text.replace(/^[\d\.]+\s/, "");
    slug = "header-" + originalText.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
    headerElement.id = slug;
  }
  if (!slug) return;

  const link = document.createElement("a");
  link.href = `#${slug}`;
  link.textContent = text;
  link.className = "nav-link";

  if (isUnitLink) link.classList.add("ml-4");
  else if (level === 2) link.classList.add("font-bold");
  else if (level === 3) link.classList.add("ml-4");
  else if (level === 4) link.classList.add("ml-8");

  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetElement = document.getElementById(slug);
    if (targetElement) {
      const navbarHeight = document.getElementById("main-navbar")?.offsetHeight || 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarHeight - 48;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth < 768 && sidebar) sidebar.classList.add("sidebar-hidden");
  });
  menuElement.appendChild(link);
}

/**
 * Päivittää aktiivisen linkin korostuksen ja vierittää sivupalkkia.
 */
function updateActiveLinkOnScroll() {
  const navbarHeight = document.getElementById('main-navbar')?.offsetHeight || 70;
  const activationLine = navbarHeight + 50; 

  const allHeadings = Array.from(document.querySelectorAll('#main-content h2, #main-content h3, #main-content h4, #main-content .unit-card'));
  
  let bestCandidate = null;

  for (const heading of allHeadings) {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= activationLine) {
          bestCandidate = heading;
      } else {
          break; 
      }
  }

  const currentActiveLink = document.querySelector('.nav-link.active');
  if (currentActiveLink) {
    currentActiveLink.classList.remove('active');
  }

  if (bestCandidate) {
      const activeId = bestCandidate.id;
      const newActiveLink = document.querySelector(`#nav-menu a[href="#${activeId}"], #unit-nav-menu a[href="#${activeId}"]`);
      
      if (newActiveLink) {
          newActiveLink.classList.add('active');
          newActiveLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
  }
}

// ====================================================================
// SIVUN LATAUTUESSA SUORITETTAVAT TOIMENPITEET
// ====================================================================
document.addEventListener("DOMContentLoaded", function () {
  window.buildSidebar();

  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const mainNavbarContent = document.getElementById("main-navbar-content");
  const currentPageNameElement = document.getElementById("current-page-name");

  const toggleNavbarDropdown = (forceHide = false) => {
    if (!mainNavbarContent || !currentPageNameElement) return;
    const isCurrentlyOpen = mainNavbarContent.classList.contains("dropdown-open");
    if (forceHide || isCurrentlyOpen) {
      mainNavbarContent.classList.remove("dropdown-open");
      currentPageNameElement.classList.remove("dropdown-open");
    } else {
      mainNavbarContent.classList.add("dropdown-open");
      currentPageNameElement.classList.add("dropdown-open");
      if (sidebar) sidebar.classList.add("sidebar-hidden");
    }
  };

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('sidebar-hidden');
        if (!sidebar.classList.contains('sidebar-hidden')) {
            toggleNavbarDropdown(true);
        }
    });
  }
  
  if (currentPageNameElement) {
    currentPageNameElement.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth < 768) toggleNavbarDropdown();
    });
  }
  
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

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      if (sidebar) sidebar.classList.add("sidebar-hidden");
      toggleNavbarDropdown(true);
    }
  });

  // Kiinnitetään "kuristettu" (throttled) kuuntelija vieritystapahtumaan.
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLinkOnScroll, 100);
  });
});