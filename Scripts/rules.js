/**
 * Taistelukenttä d20 - Sivuston navigaatio ja interaktiivisuus
 * @version 4.3 - Lopullinen korjaus aktiivisen linkin tunnistukseen.
 * @author Akseli Larikka
 */

// Globaali ajastin scroll-tapahtuman "kuristamiseen" (throttling)
let scrollTimeout;

/**
 * Rakentaa sisällysluettelon dynaamisesti sivun otsikoista.
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

  // Haetaan kaikki mahdolliset otsikot ja suodatetaan ne, jotka eivät kuulu sivupalkkiin.
  const allPossibleHeaders = mainContent.querySelectorAll(".prose h2, .prose h3, .prose h4");
  const staticHeaders = Array.from(allPossibleHeaders).filter(header => !header.closest(".rules-exclude") && !header.closest("#unit-display-container"));

  const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
  let counters = { h2: 0, h3: 0, h4: 0 };

  staticHeaders.forEach((header) => {
    const level = parseInt(header.tagName.substring(1));
    let headerText = header.textContent.trim();

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

/** Apufunktio, joka luo ja lisää linkin sivupalkkiin. **/
function createAndAppendLink(headerElement, text, level, menuElement, isUnitLink = false) {
  let slug = isUnitLink ? headerElement.closest(".unit-card")?.id : headerElement.id;
  if (!slug) {
    const originalText = text.replace(/^[\d\.]+\s/, "");
    
    // Luodaan siisti linkki, joka muuntaa ääkköset ja välilyönnit
    slug = originalText
        .toString()
        .toLowerCase()
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/å/g, 'oo')
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");

    // Lisätään header-etuliite varmuuden vuoksi
    slug = "header-" + slug;

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

        history.pushState(null, '', `#${slug}`);
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth < 768 && sidebar) sidebar.classList.add("sidebar-hidden");
  });
  menuElement.appendChild(link);
}

/** Päivittää aktiivisen linkin korostuksen ja vierittää sivupalkkia. **/
function updateActiveLinkOnScroll() {
  const navbarHeight = document.getElementById('main-navbar')?.offsetHeight || 70;
  const activationLine = navbarHeight + 50;

  // KORJATTU VALITSIN: Valitsee staattiset otsikot ja .unit-card-elementit,
  // mutta jättää huomiotta .unit-cardien sisällä olevat otsikot.
  const allTrackableElements = Array.from(document.querySelectorAll('#main-content h2, #main-content h3, #main-content h4, #main-content .unit-card'))
    .filter(el => !el.closest('.rules-exclude'));

  let bestCandidate = null;

  for (const element of allTrackableElements) {
    // Ohitetaan yksikkökorttien sisällä olevat H4-otsikot, koska seuraamme itse korttia.
    if (element.tagName === 'H4' && element.closest('.unit-card')) {
      continue;
    }

    const rect = element.getBoundingClientRect();
    if (rect.top <= activationLine) {
      bestCandidate = element;
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
    if (activeId) {
      const newActiveLink = document.querySelector(`#nav-menu a[href="#${activeId}"], #unit-nav-menu a[href="#${activeId}"]`);
      if (newActiveLink) {
        newActiveLink.classList.add('active');
        newActiveLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const newUrl = `${window.location.pathname}#${activeId}`;
      history.replaceState(null, '', newUrl);
    }
  } else {
    history.replaceState(null, '', window.location.pathname);
  }
}

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

  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLinkOnScroll, 100);
  });
});