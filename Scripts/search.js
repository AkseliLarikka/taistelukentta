document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const navMenu = document.getElementById("nav-menu");

  if (!sidebar) return;

  // 1. Luodaan hakuelementit
  const searchContainer = document.createElement("div");
  searchContainer.className = "sidebar-search-container";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "sidebar-search-input";
  searchInput.placeholder = "Hae sääntöjä, yksiköitä...";
  searchInput.autocomplete = "off";

  const resultsContainer = document.createElement("div");
  resultsContainer.id = "sidebar-search-results";
  resultsContainer.className = "hidden";

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(resultsContainer);

  // Lisätään haku sivupalkkiin (nav-menun yläpuolelle)
  if (navMenu) {
    sidebar.insertBefore(searchContainer, navMenu);
  } else {
    sidebar.prepend(searchContainer);
  }

  // 2. Alustetaan Fuse.js (Sumea haku)
  // Varmistetaan että Fuse on ladattu HTML:ssä ja data on olemassa
  if (typeof Fuse === "undefined" || typeof searchIndex === "undefined") {
    console.warn("Haku ei toimi: Fuse.js tai searchData.js puuttuu.");
    return;
  }

  const fuseOptions = {
    includeScore: true,
    threshold: 0.4, // 0.0 = tarkka, 1.0 = mikä tahansa. 0.4 on hyvä "vähän väärin" -hakuun.
    keys: [
      { name: "title", weight: 0.7 },
      { name: "keywords", weight: 0.3 },
    ],
  };

  const fuse = new Fuse(searchIndex, fuseOptions);

  // 3. Hakutapahtuma
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    resultsContainer.innerHTML = "";

    if (query.length < 2) {
      resultsContainer.classList.add("hidden");
      return;
    }

    const results = fuse.search(query);

    if (results.length > 0) {
      resultsContainer.classList.remove("hidden");
      // Näytetään max 6 parasta tulosta
      results.slice(0, 6).forEach((result) => {
        const item = result.item;

        const resultLink = document.createElement("a");
        resultLink.href = item.url;
        resultLink.className = "search-result-item";

        resultLink.innerHTML = `
                    <span class="result-title">${item.title}</span>
                    <span class="result-category">${item.category}</span>
                `;

        // Sulje haku kun klikataan
        resultLink.addEventListener("click", () => {
          resultsContainer.classList.add("hidden");
          // Jos linkki on samalle sivulle ankkuriin, varmistetaan scrollaus
          if (
            item.url.startsWith(window.location.pathname.split("/").pop()) ||
            item.url.startsWith("#")
          ) {
            setTimeout(() => {
              window.location.reload(); // Tai monimutkaisempi scrollauslogiikka
            }, 50);
          }
        });

        resultsContainer.appendChild(resultLink);
      });
    } else {
      resultsContainer.classList.remove("hidden");
      resultsContainer.innerHTML =
        '<div class="search-no-results">Ei tuloksia</div>';
    }
  });

  // Piilota tulokset jos klikataan muualle
  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      resultsContainer.classList.add("hidden");
    }
  });
});
