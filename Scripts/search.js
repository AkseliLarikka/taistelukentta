document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const navMenu = document.getElementById('nav-menu');

    // Jos sivupalkkia ei ole, ei tehdä mitään
    if (!sidebar) return;

    // 1. Luodaan hakuelementit, jos niitä ei ole
    let searchContainer = document.querySelector('.sidebar-search-container');
    
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.className = 'sidebar-search-container';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'sidebar-search-input';
        searchInput.placeholder = 'Hae sääntöjä, yksiköitä...';
        searchInput.autocomplete = 'off';

        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'sidebar-search-results';
        resultsContainer.className = 'hidden';

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(resultsContainer);

        // Lisätään haku sivupalkkiin navigaation yläpuolelle
        if (navMenu) {
            sidebar.insertBefore(searchContainer, navMenu);
        } else {
            sidebar.prepend(searchContainer);
        }
    }

    const searchInput = document.getElementById('sidebar-search-input');
    const resultsContainer = document.getElementById('sidebar-search-results');

    // Varmistetaan Fuse.js ja data
    if (typeof Fuse === 'undefined' || typeof searchIndex === 'undefined') {
        console.warn('Haku ei toimi: Fuse.js tai searchData.js puuttuu.');
        return;
    }

    // 2. Konfiguroidaan Fuse.js (Sumea haku)
    const fuseOptions = {
        includeScore: true,
        threshold: 0.4, // Sallii kirjoitusvirheitä
        ignoreLocation: true, // Etsii mistä kohtaa sanaa tahansa
        keys: [
            { name: 'title', weight: 0.7 },
            { name: 'keywords', weight: 0.4 }, // Avainsanat auttavat löytämään "alue" -> "Hallintavyöhyke"
            { name: 'category', weight: 0.1 }
        ]
    };

    const fuse = new Fuse(searchIndex, fuseOptions);

    // 3. Apufunktio skrollaukseen
    const handleNavigation = (url, e) => {
        // Tarkistetaan onko linkki samalle sivulle (sisältää #)
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const targetPath = url.split('#')[0] || 'index.html'; // Jos pelkkä #, se on sama sivu
        const hash = url.includes('#') ? '#' + url.split('#')[1] : null;

        // Jos ollaan samalla sivulla ja on ankkuri
        if ((url.startsWith('#') || targetPath === currentPath) && hash) {
            e.preventDefault();
            
            // 1. Päivitetään URL
            history.pushState(null, null, hash);
            
            // 2. Etsitään elementti
            // Koodataan hash auki (esim %C3%A4 -> ä), poistetaan #
            const targetId = decodeURIComponent(hash.substring(1));
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // 3. Lasketaan sijainti (headerin korkeus huomioiden)
                const navbarHeight = document.getElementById("main-navbar")?.offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navbarHeight - 20;

                // 4. Skrollataan
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // 5. Mobiilifix: Suljetaan sivupalkki
                if (window.innerWidth < 768) {
                    sidebar.classList.add('sidebar-hidden');
                    // Päivitetään hampurilaisikonin tila tarvittaessa
                    const mainNavbarContent = document.getElementById("main-navbar-content");
                    if (mainNavbarContent) mainNavbarContent.classList.remove("dropdown-open");
                }
            }
            
            // Piilotetaan tulokset
            resultsContainer.classList.add('hidden');
            searchInput.value = '';
        } 
        // Jos eri sivu, annetaan selaimen hoitaa
    };

    // 4. Hakutapahtuma
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        resultsContainer.innerHTML = '';

        if (query.length < 2) {
            resultsContainer.classList.add('hidden');
            return;
        }

        const results = fuse.search(query);

        if (results.length > 0) {
            resultsContainer.classList.remove('hidden');
            // Näytetään max 8 tulosta
            results.slice(0, 8).forEach(result => {
                const item = result.item;
                
                const resultLink = document.createElement('a');
                resultLink.href = item.url;
                resultLink.className = 'search-result-item';
                
                resultLink.innerHTML = `
                    <div class="result-content">
                        <span class="result-title">${item.title}</span>
                        <span class="result-category">${item.category}</span>
                    </div>
                `;
                
                resultLink.addEventListener('click', (e) => handleNavigation(item.url, e));

                resultsContainer.appendChild(resultLink);
            });
        } else {
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = '<div class="search-no-results">Ei tuloksia</div>';
        }
    });

    // Estetään klikkauksen leviäminen sivupalkkiin (ettei se sulkeudu vahingossa mobiilissa kirjoittaessa)
    searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Piilota tulokset jos klikataan muualle
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });
});