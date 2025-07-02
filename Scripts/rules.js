/**
 * Taistelukenttä d20 - Sivuston navigaatio ja interaktiivisuus
 * @version 3.0 - Manuaalinen vierityslaskenta, ohittaa scrollIntoView-ongelmat
 * @author Akseli Larikka
 */

// ====================================================================
// GLOBAALIT FUNKTIOT
// ====================================================================
let observer; // Globaali viittaus observeriin

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
    if (header.closest("#unit-display-container")) return;
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

  // Käsitellään dynaamiset yksikköotsikot
  if (unitNavMenu) {
    const unitHeaders = mainContent.querySelectorAll(
      "#unit-display-container .unit-card h4"
    );
    unitHeaders.forEach((header) => {
      const headerText = header.textContent.trim();
      const slug = header.closest(".unit-card")?.id;
      if (slug) {
        createAndAppendLink(header, headerText, 4, unitNavMenu, true);
      }
    });
  }
};

/**
 * Apufunktio, joka luo ja lisää linkin sivupalkkiin.
 * SISÄLTÄÄ UUDEN, MANUAALISEN VIERITYSLOGIIKAN.
 */
function createAndAppendLink(
  headerElement,
  text,
  level,
  menuElement,
  isUnitLink = false
) {
  let slug = isUnitLink
    ? headerElement.closest(".unit-card")?.id
    : headerElement.id;
  if (!slug) {
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
  if (!slug) return;

  const link = document.createElement("a");
  link.href = `#${slug}`;
  link.textContent = text;
  link.className = "nav-link";

  if (isUnitLink) {
    link.classList.add("ml-4");
  } else {
    if (level === 2) link.classList.add("font-bold");
    if (level === 3) link.classList.add("ml-4");
    if (level === 4) link.classList.add("ml-8");
  }

  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetElement = document.getElementById(slug);

    if (targetElement) {
      const navbarHeight =
        document.getElementById("main-navbar")?.offsetHeight || 70; // Varakorkeus
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.scrollY - navbarHeight - 48; // 16px (1rem) lisäpuskuri

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

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
  window.buildSidebar();

  // Mobiilivalikoiden ja observerin koodi
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const mainNavbarContent = document.getElementById("main-navbar-content");
  const currentPageNameElement = document.getElementById("current-page-name");
  const mainContent = document.getElementById("main-content");

  const toggleMobileSidebar = (hide) => {
    if (sidebar)
      hide
        ? sidebar.classList.add("sidebar-hidden")
        : sidebar.classList.remove("sidebar-hidden");
    if (!hide) toggleNavbarDropdown(true);
  };
  const toggleNavbarDropdown = (forceHide = false) => {
    if (!mainNavbarContent || !currentPageNameElement) return;
    const isCurrentlyOpen =
      mainNavbarContent.classList.contains("dropdown-open");
    if (forceHide || isCurrentlyOpen) {
      mainNavbarContent.classList.remove("dropdown-open");
      currentPageNameElement.classList.remove("dropdown-open");
    } else {
      mainNavbarContent.classList.add("dropdown-open");
      currentPageNameElement.classList.add("dropdown-open");
      toggleMobileSidebar(true);
    }
  };
  if (menuToggle) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileSidebar(sidebar.classList.contains("sidebar-hidden"));
    });
  }
  if (currentPageNameElement) {
    currentPageNameElement.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth < 768) toggleNavbarDropdown();
    });
  }
  mainNavbarContent?.querySelectorAll(".nav-link-top").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) toggleNavbarDropdown(true);
    });
  });
  document.addEventListener("click", (e) => {
    if (window.innerWidth < 768) {
      if (
        sidebar &&
        !sidebar.contains(e.target) &&
        !menuToggle?.contains(e.target)
      )
        toggleMobileSidebar(true);
      if (
        mainNavbarContent &&
        !mainNavbarContent.contains(e.target) &&
        !currentPageNameElement?.contains(e.target)
      )
        toggleNavbarDropdown(true);
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      toggleMobileSidebar(true);
      toggleNavbarDropdown(true);
    }
  });

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

  mainContent
    ?.querySelectorAll("h2, h3, h4, .unit-card")
    .forEach((header) => observer.observe(header));
});
