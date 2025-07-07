/**
 * Taistelukenttä d20 - Yksikkökorttien dynaaminen renderöinti
 *
 * Tämä skripti sisältää funktion, joka luo yksikkökortit annettujen
 * yksikkötietojen perusteella ja liittää ne määritettyyn HTML-elementtiin.
 *
 * @version 1.0
 * @author Akseli Larikka
 */

/**
 * Renderöi yksikkökortit annettujen tietojen perusteella.
 * @param {object} unitData - Yksikkötiedot sisältävä objekti (esim. window.blueUnitData).
 * @param {string} containerId - ID-attribuutti HTML-elementille, johon kortit liitetään.
 */
function renderUnitCards(unitData, containerId) {
    const contentContainer = document.getElementById(containerId);

    // Varmistetaan, että tarvittavat elementit ja data ovat olemassa.
    if (!contentContainer || !unitData) {
        console.error("Dynaamisen sisällön luonti epäonnistui: kohde-elementtiä tai yksikködataa puuttuu.", {
            containerId,
            unitDataExists: !!unitData
        });
        if (contentContainer) {
            contentContainer.innerHTML = '<p class="error-message">Virhe: Yksiköiden tietoja ei voitu ladata.</p>';
        }
        return;
    }

    contentContainer.innerHTML = ''; // Tyhjennetään vanha sisältö

    // Luodaan uniikki ID-slug linkitystä varten.
    const createSlug = (text) => 'unit-' + text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Korvaa välilyönnit viivalla
        .replace(/[^\w\-]+/g, '') // Poista kaikki erikoismerkit paitsi viivat
        .replace(/\-\-+/g, '-') // Korvaa useammat viivat yhdellä
        .replace(/^-+/, '') // Poista viivat alusta
        .replace(/-+$/, ''); // Poista viivat lopusta


    // Käydään kaikki yksiköt läpi ja luodaan niille kortit.
    for (const unitId in unitData) {
        const unit = unitData[unitId];
        const slug = createSlug(unit.name);
        const card = document.createElement('div');
        card.className = 'unit-card';
        card.id = slug;

        // Rakennetaan kykyjen lista HTML-muotoon.
        const abilitiesHtml = unit.abilities.map(ability => {
            const damagedEffectHtml = ability.isDamagedEffect ? ' <span class="vaurioitunut-tila">(Vaurioitunut)</span>' : '';
            return `<li><strong>${ability.name}${damagedEffectHtml}:</strong> ${ability.description}</li>`;
        }).join('');

        // Rakennetaan aseistuksen taulukko HTML-muotoon.
        const armamentHtml = unit.armament.map(w => `<tr><td>${w.name}</td><td>${w.attack}</td><td>${w.damage}</td><td>${w.notes}</td></tr>`).join('');

        // Rakennetaan ammusten lista HTML-muotoon, jos niitä on.
        let ammoHtml = '';
        if (Object.keys(unit.ammo).length > 0) {
            ammoHtml = `<li><strong>Ammukset:</strong> ${Object.entries(unit.ammo).map(([key, value]) => `${key.replace(/<[^>]*>/g, '')}: ${value} kpl`).join(', ')}</li>`;
        }

        // Kootaan koko kortin HTML-rakenne.
        card.innerHTML = `
            <h4>${unit.name}</h4>
            <div class="unit-card-content">
                <ul>
                    <li><strong>Tyyppi:</strong> ${unit.type}</li>
                    <li><strong><span class="glossary-term" data-term="taistelukunto">TK</span>:</strong> ${unit.stats.tk}</li>
                    <li><strong><span class="glossary-term" data-term="moraali">M</span>:</strong> ${unit.stats.m}</li>
                    <li><strong><span class="glossary-term" data-term="suoja">S</span>:</strong> ${unit.stats.s}</li>
                    <li><strong><span class="glossary-term" data-term="liike">Liike</span>:</strong> ${unit.stats.l}</li>
                    <li><strong><span class="glossary-term" data-term="taitotaso">TT</span>:</strong> ${unit.stats.tt}</li>
                    ${ammoHtml}
                    <li><strong>Kyvyt:</strong><ul>${abilitiesHtml}</ul></li>
                    <li><strong>Varustus:</strong>
                        <div class="table-container" style="margin-top: 0.5em;">
                            <table>
                                <thead><tr><th>Ase</th><th>Hyökkäys</th><th>Vahinko</th><th>Huom.</th></tr></thead>
                                <tbody>${armamentHtml}</tbody>
                            </table>
                        </div>
                    </li>
                </ul>
            </div>
        `;

        contentContainer.appendChild(card);
    }

    // Kun kaikki kortit on luotu, päivitetään sivupalkin sisällysluettelo.
    if (typeof window.buildSidebar === 'function') {
        window.buildSidebar();
    }
}