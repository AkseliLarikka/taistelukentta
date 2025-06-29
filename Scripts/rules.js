/**
 * Taistelukenttä d20 -sivuston interaktiivisuutta ja navigaatiota hallinnoiva skripti.
 *
 * Vastuualueet:
 * 1. Sivupalkin navigaation luonti (sis. automaattisen numeroinnin alasivuilla).
 * 2. Vieritystoiminnot: Dynaamiset vierityspainikkeet ja niiden tilan hallinta.
 * 3. VIERITYSNAPPIEN SELITTEEN NÄYTTÖ
 *
 * @version 1.0
 * @author Akseli Larikka
 */
document.addEventListener('DOMContentLoaded', function () {

    // Noudetaan sivulta tarvittavat pääelementit myöhempää käyttöä varten.
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle'); // Sivupalkin toggle
    const mainNavbar = document.getElementById('main-navbar'); // Lisätty index.js:stä

    // Uudet elementit pudotusvalikon navigaatioon
    const currentPageNameElement = document.getElementById('current-page-name'); // "Nykyisen sivun nimi" painike
    const mainNavbarContent = document.getElementById('main-navbar-content'); // Varsinainen pudotusvalikon sisältö

    // Vianetsintä: Tarkista, että elementit löytyvät
    if (!currentPageNameElement) {
        console.error("currentPageNameElement (id='current-page-name') not found in DOM."); //
    }
    if (!mainNavbarContent) {
        console.error("mainNavbarContent (id='main-navbar-content') not found in DOM."); //
    }

    // Päivittää otsikoiden scrollMarginTop -arvon navbarin korkeuden mukaan.
    function updateScrollMargin() {
        if (mainNavbar) { // Käytetään mainNavbaria kuten index.js:ssä
            const navbarHeightPx = mainNavbar.offsetHeight; //
            const navbarHeightRem = (navbarHeightPx / 16) + 0.5; //
            const headers = mainContent.querySelectorAll('h1, h2, h3, h4'); //
            headers.forEach(header => { //
                header.style.scrollMarginTop = `${navbarHeightRem}rem`; //
            });
        }
    }

    updateScrollMargin(); //
    let resizeTimeout; //
    window.addEventListener('resize', () => { //
        clearTimeout(resizeTimeout); //
        resizeTimeout = setTimeout(updateScrollMargin, 150); //
    });

    // ====================================================================
    // OSA 1: SISÄLLÖN ALUSTUS JA SIVUPALKKI & YLÄNAVIGAATION DROPDOWN
    // ====================================================================

    window.initializeContentAndSidebar = function () {
        const navMenu = document.getElementById('nav-menu');
        const mainContent = document.getElementById('main-content');
        if (!navMenu || !mainContent) return;

        // Puhdista vanhat linkit, mutta säästä otsikko
        Array.from(navMenu.children).forEach(child => {
            if (!child.classList.contains('sidebar-title')) {
                navMenu.removeChild(child);
            }
        });

        const headersForSidebar = mainContent.querySelectorAll('h2, section:not(#gm-tool) h3, section:not(#gm-tool) h4');
        const currentFileName = window.location.pathname.split('/').pop();
        const isIndexPage = currentFileName === 'index.html' || currentFileName === '';

        // Yhtenäistetty laskuri, joka nollataan aina H2-otsikon kohdalla
        let counters = { h2: 0, h3: 0, h4: 0 };

        headersForSidebar.forEach(header => {
            const level = parseInt(header.tagName.substring(1));
            let headerText = header.textContent.trim(); // Käytä trimmattua tekstiä

            // Suorita numerointi VAIN jos emme ole etusivulla
            if (!isIndexPage) {
                if (level === 2) {
                    counters.h2++;
                    counters.h3 = 0; // Nollaa alemmat tasot
                    counters.h4 = 0;
                    headerText = `${counters.h2}. ${headerText}`;
                } else if (level === 3) {
                    counters.h3++;
                    counters.h4 = 0; // Nollaa alemmat tasot
                    headerText = `${counters.h2}.${counters.h3}. ${headerText}`;
                } else if (level === 4) {
                    counters.h4++;
                    headerText = `${counters.h2}.${counters.h3}.${counters.h4}. ${headerText}`;
                }
                // Päivitä otsikko DOM:iin vain jos se on numeroitu
                header.textContent = headerText;
            }

            // Luo ankkurilinkki (slug) ja varmista ID
            const originalText = header.textContent.replace(/^[\d\.]+\s/, ''); // Puhdista numerointi slugia varten
            const slug = 'header-' + originalText.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
            header.id = slug;

            // Luo ja lisää linkki sivupalkkiin
            const link = document.createElement('a');
            link.href = `#${slug}`;
            link.textContent = headerText; // Käytä mahdollisesti numeroitua tekstiä
            link.className = 'nav-link';

            if (level === 2) link.classList.add('font-bold');
            if (level === 3) link.classList.add('ml-4');
            if (level === 4) link.classList.add('ml-8');

            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
                if (window.innerWidth < 768) {
                    sidebar.classList.add('sidebar-hidden');
                }
            });

            navMenu.appendChild(link);
        });
    };

    // --- Mobiilivalikoiden näkyvyyden hallinta ---

    const toggleMobileSidebar = (hide) => { //
        if (hide) { //
            sidebar.classList.add('sidebar-hidden'); //
        } else { //
            sidebar.classList.remove('sidebar-hidden'); //
            toggleNavbarDropdown(true); // Sulje dropdown, jos sivupalkki avataan
        }
    };

    const toggleNavbarDropdown = (forceHide = false) => { // Lisää oletusarvon ja nimeä selkeämmin
        const isCurrentlyOpen = mainNavbarContent.classList.contains('dropdown-open'); //

        if (forceHide) { // Jos halutaan pakottaa sulkeminen (esim. toisen valikon avaamisen yhteydessä)
            mainNavbarContent.classList.remove('dropdown-open'); //
            currentPageNameElement.classList.remove('dropdown-open'); //
        } else if (isCurrentlyOpen) { // Jos on auki ja ei pakoteta sulkemaan, sulje
            mainNavbarContent.classList.remove('dropdown-open'); //
            currentPageNameElement.classList.remove('dropdown-open'); //
        } else { // Jos on kiinni ja ei pakoteta sulkemaan, avaa
            mainNavbarContent.classList.add('dropdown-open'); //
            currentPageNameElement.classList.add('dropdown-open'); //
            toggleMobileSidebar(true); // Sulje sivupalkki, jos dropdown avataan
        }
    };

    // Tapahtumakuuntelija sivupalkin toggle-painikkeelle
    if (menuToggle) { //
        menuToggle.addEventListener('click', (event) => { //
            event.stopPropagation(); //
            const isHidden = sidebar.classList.contains('sidebar-hidden'); //
            console.log("Menu toggle clicked. Sidebar hidden:", isHidden); // Vianetsintä
            toggleMobileSidebar(!isHidden); //
        });
    }

    // Tapahtumakuuntelija "Nykyisen sivun nimi" -painikkeelle (dropdownin avaaja)
    if (currentPageNameElement && mainNavbarContent) { //
        currentPageNameElement.addEventListener('click', (event) => { //
            event.preventDefault(); //
            event.stopPropagation(); //
            console.log("Current page name clicked."); //
            console.log("Window width:", window.innerWidth); //
            console.log("Is dropdown open BEFORE toggle:", mainNavbarContent.classList.contains('dropdown-open')); //

            if (window.innerWidth < 768) { // Vain mobiilissa
                toggleNavbarDropdown(); //
            }

            console.log("Is dropdown open AFTER toggle:", mainNavbarContent.classList.contains('dropdown-open')); //
        });

        // Lisää klikkauskuuntelija pudotusvalikon linkeille, jotta valikko sulkeutuu linkkiä klikatessa
        mainNavbarContent.querySelectorAll('.nav-link-top').forEach(link => { //
            link.addEventListener('click', () => { //
                if (window.innerWidth < 768) { //
                    toggleNavbarDropdown(true); // Pakota sulkeminen linkkiä klikatessa
                }
            });
        });
    } else {
        console.error("currentPageNameElement or mainNavbarContent not found, dropdown click handler not attached."); //
    }

    // Sulje valikot, jos klikataan niiden ulkopuolelle
    document.addEventListener('click', (event) => { //
        if (window.innerWidth < 768) { //
            // Sulje sivupalkki, jos klikattiin sen ulkopuolelle ja se on auki
            if (sidebar && menuToggle && !sidebar.contains(event.target) && !menuToggle.contains(event.target) && !sidebar.classList.contains('sidebar-hidden')) { //
                toggleMobileSidebar(true); //
            }

            // Sulje dropdown, jos klikattiin sen tai sen avaajan ulkopuolelle ja se on auki
            if (mainNavbarContent && currentPageNameElement && !mainNavbarContent.contains(event.target) && !currentPageNameElement.contains(event.target) && mainNavbarContent.classList.contains('dropdown-open')) { //
                toggleNavbarDropdown(true); //
            }
        }
    });

    // Sulje valikot, jos ikkunan kokoa muutetaan työpöytämoodiin
    window.addEventListener('resize', () => { //
        if (window.innerWidth >= 768) { //
            toggleMobileSidebar(true); //
            toggleNavbarDropdown(true); //
        }
    });

    // --- Sivupalkin aktiivisen linkin korostus vierittäessä ---
    const observer = new IntersectionObserver((entries) => { //
        entries.forEach(entry => { //
            const id = entry.target.id; //
            const navLink = navMenu.querySelector(`a[href="#${id}"]`); //

            if (navLink && entry.isIntersecting && entry.intersectionRatio > 0.5) { //
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active')); //
                navLink.classList.add('active'); //
                navLink.scrollIntoView({ //
                    behavior: 'smooth', //
                    block: 'nearest' //
                });
            }
        });
    }, {
        rootMargin: "-30% 0px -60% 0px", //
        threshold: 0.6 //
    });

    const setupIntersectionObserver = () => { //
        const headersForSidebar = mainContent.querySelectorAll('h2, h3, h4'); //
        headersForSidebar.forEach(header => observer.observe(header)); //
    };
    initializeContentAndSidebar();
    setupIntersectionObserver();
});