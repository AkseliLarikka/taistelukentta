/**
 * Taistelukenttä d20 - Sivuston navigaatio ja interaktiivisuus
 * @version 4.7 - Korjattu GM-varoitusdialogin laukaisu sivun latautuessa.
 * @author Akseli Larikka
 */

/**
 * Vaihtaa .main-banner elementin taustakuvan satunnaisesti, mutta ei samaa kuvaa peräkkäin.
 * Tämä skripti suoritetaan, kun DOM on latautunut.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Haetaan bannerielementti DOM:sta
  const banner = document.querySelector('.main-banner');

  // Varmistetaan, että bannerielementti on olemassa sivulla ennen jatkamista
  if (banner) {
    // Määritellään lista mahdollisista bannerikuvien URL-osoitteista
    const bannerImages = [
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1754040738/IMG_5076_cguykf.jpg',
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1754040737/IMG_5078_zywgt1.jpg',
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1754040737/IMG_5077_pptugn.jpg',
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1754040736/IMG_5079_qqolvs.jpg',
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1754040735/IMG_5080_nyd8g0.jpg',
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1754040734/IMG_5081_yd5dpw.jpg',
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1764342759/tulikaste_lf8bmp.png',
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629049/j%C3%A4%C3%A4k%C3%A4rit_mets%C3%A4ss%C3%A4_ygwrbx.png',
      'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629052/leopardi_patria_mo8gdh.png'
    ];

    // Haetaan viimeksi käytetyn kuvan indeksi istuntomuistista
    let lastIndex = sessionStorage.getItem('lastBannerIndex');
    let randomIndex;

    // Arvotaan uusi indeksi, kunnes se on eri kuin edellinen
    // do...while-rakenne on tähän täydellinen, koska se suoritetaan vähintään kerran
    do {
      randomIndex = Math.floor(Math.random() * bannerImages.length);
    } while (bannerImages.length > 1 && randomIndex.toString() === lastIndex);

    // Tallennetaan uusi indeksi istuntomuistiin seuraavaa sivunlatausta varten
    sessionStorage.setItem('lastBannerIndex', randomIndex.toString());

    // Muodostetaan URL-merkkijono valitulle kuvalle
    const randomImage = `url('${bannerImages[randomIndex]}')`;

    // Asetetaan valittu kuva bannerin taustakuvaksi
    banner.style.backgroundImage = randomImage;
  }
});

// Globaali ajastin scroll-tapahtuman "kuristamiseen" (throttling)
let scrollTimeout;

/**
 * Alustaa ja hallinnoi pelinjohtajan osioihin liittyvää varoitusdialogia.
 * Versio 2.0 - Lisätty dynaaminen sivun nimen näyttö.
 */
function initializeGmWarningModal() {
  const overlay = document.getElementById('gm-warning-overlay');
  const modal = document.getElementById('gm-warning-modal');
  const confirmButton = document.getElementById('gm-warning-confirm-button');
  const cancelButton = document.getElementById('gm-warning-cancel-button');
  const dontShowAgainCheckbox = document.getElementById('gm-warning-dont-show-again');
  // UUSI: Haetaan viittaus paikkamerkkiin sivun nimelle.
  const pageNameElement = document.getElementById('gm-warning-page-name');

  if (!modal || !overlay || !confirmButton || !cancelButton || !dontShowAgainCheckbox || !pageNameElement) {
    return; // Ei tehdä mitään, jos modaalin osia ei löydy.
  }

  let targetUrlForClick = '';

  const showModal = () => {
    document.body.classList.add('modal-open');
    overlay.classList.add('is-visible');
    modal.classList.add('is-visible');
  };

  const hideModal = () => {
    document.body.classList.remove('modal-open');
    overlay.classList.remove('is-visible');
    modal.classList.remove('is-visible');
  };

  const shouldShowModal = () => {
    const hideTimestamp = localStorage.getItem('hideGmWarningTimestamp');
    if (!hideTimestamp) return true; // Näytä aina, jos aikaa ei ole asetettu.

    const now = new Date().getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    return (now - parseInt(hideTimestamp, 10) > oneDayInMillis);
  };

  // --- KLIKKAUKSEN KÄSITTELY ---
  document.body.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const targetHref = link.getAttribute('href');
    const isTargetGmPage = targetHref && (targetHref.includes('punaiset-yksiköt.html') || targetHref.includes('pelinjohtajan-opas.html'));

    if (isTargetGmPage && shouldShowModal()) {
      event.preventDefault();
      targetUrlForClick = targetHref;
      const pageName = link.textContent.trim();
      pageNameElement.textContent = `"${pageName}"`;
      showModal(); // Funktio kutsutaan nyt ilman tarpeetonta argumenttia.
    }
  });

  // --- NÄYTÄ MODAALI SIVUN LATAUTUESSA ---
  const confirmedOnPrevPage = sessionStorage.getItem('modalConfirmed');
  if (confirmedOnPrevPage) {
    sessionStorage.removeItem('modalConfirmed');
  } else {
    const currentHref = window.location.href;
    const isCurrentPageGmPage = currentHref.includes('punaiset-yksiköt.html') || currentHref.includes('pelinjohtajan-opas.html');
    if (isCurrentPageGmPage) {
      const hideTimestamp = localStorage.getItem('hideGmWarningTimestamp');
      const now = new Date().getTime();
      const oneDayInMillis = 24 * 60 * 60 * 1000;

      if (!hideTimestamp || (now - parseInt(hideTimestamp, 10) > oneDayInMillis)) {
        // UUSI OSA: Asetetaan sivun nimi sivun otsikosta.
        const pageTitle = document.title.split(' - ')[1] || 'tälle sivulle';
        pageNameElement.textContent = `"${pageTitle}"`;

        showModal();
      }
    }
  }

  // --- NAPPIEN KUUNTELIJAT ---
  confirmButton.addEventListener('click', () => {
    if (dontShowAgainCheckbox.checked) {
      localStorage.setItem('hideGmWarningTimestamp', new Date().getTime().toString());
    }

    if (targetUrlForClick) {
      sessionStorage.setItem('modalConfirmed', 'true');
      window.location.href = targetUrlForClick;
    } else {
      hideModal();
    }
  });

  cancelButton.addEventListener('click', () => {
    targetUrlForClick = '';
    hideModal();
  });

  overlay.addEventListener('click', () => {
    targetUrlForClick = '';
    hideModal();
  });
}

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

    if (!isIndexPage && !/^\d+\./.test(headerText) && !header.classList.contains('no-numbering')) {
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

  // Valitsee staattiset otsikot ja .unit-card-elementit,
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
  const modalWatcher = setInterval(() => {
    // Tarkkaillaan modaalin pääelementin olemassaoloa.
    const modal = document.getElementById('gm-warning-modal');

    // Jos elementti löytyy, käynnistetään toiminto ja lopetetaan tarkkailu.
    if (modal) {
      clearInterval(modalWatcher);
      initializeGmWarningModal();
    }
    // Jos elementtiä ei löydy, tarkkailu jatkuu.
    // (Tässä voisi olla myös aikaraja, mutta koska modaalia ei ole kaikilla
    // sivuilla, annetaan sen vain olla. Funktio itsessään tarkistaa
    // loput elementit, joten virhettä ei synny.)

  }, 100); // Tarkistetaan 100 millisekunnin välein

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