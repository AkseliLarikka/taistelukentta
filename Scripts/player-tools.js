/**
 * Taistelukenttä d20 - Pelaajan työkalupakki
 * Versio 5.1 - Dynaaminen stattien päivitys, tilanhallinta, parannetut ilmoitukset ja toimiva välilehtinavigaatio.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Varmistetaan, että pääelementti on olemassa ennen kuin jatketaan.
    const playerToolContainer = document.getElementById('player-tool-container');
    if (!playerToolContainer) return;

    // --- KAIKKI ELEMENTTIVIITTaukset TÄNNE ---
    const unitDisplayArea = document.getElementById('active-units-display');
    const unitTemplatesContainer = document.getElementById('player-unit-templates-container');
    const roleCheckboxes = document.querySelectorAll('input[name="player-role"]');
    const notificationsEl = document.getElementById('player-notifications');
    const commandListCommander = document.getElementById('command-list-commander');
    const commandListGeneral = document.getElementById('command-list-general');

    const kpTrackerJJ = { container: document.getElementById('kp-tracker-container-jj'), display: document.getElementById('player-kp-value-jj'), decBtn: document.getElementById('kp-decrement-btn-jj'), incBtn: document.getElementById('kp-increment-btn-jj'), };
    const kpTrackerKP = { container: document.getElementById('kp-tracker-container-kp'), display: document.getElementById('player-kp-value-kp'), decBtn: document.getElementById('kp-decrement-btn-kp'), incBtn: document.getElementById('kp-increment-btn-kp'), };

    // Vaiheseurannan elementit
    const phaseTitleEl = document.getElementById('player-phase-title');
    const phaseInstructionsEl = document.getElementById('player-phase-instructions');
    const phaseCounterEl = document.getElementById('player-phase-counter');
    const nextPhaseBtn = document.getElementById('player-next-phase-button');
    const prevPhaseBtn = document.getElementById('player-prev-phase-button');
    const tacticalAdviceEl = document.getElementById('player-tactical-advice');
    const turnCounterDisplay = document.getElementById('player-turn-counter');

    // Reset-modaalin elementit
    const resetToolBtn = document.getElementById('player-reset-tool-button');
    const modalOverlay = document.getElementById('player-modal-overlay');
    const modalContainer = document.getElementById('player-modal-container');
    const resetCancelBtn = document.getElementById('player-reset-cancel-button');
    const resetConfirmBtn = document.getElementById('player-reset-confirm-button');
    const resetConfirmInput = document.getElementById('player-reset-confirm-input');

    // --- MUUTTUJAT JA VAKIOT ---
    let playerData = {};
    let unitInstanceCounter = 0;
    let currentPhaseIndex = -1;
    let hiddenCardHeaders = new Set();
    const commanderTacticalAbilities = ['motti', 'painopiste', 'sitova', 'vetaytyminen'];
    const phases = [
        { name: "Liikevaihe", instructions: "<ul><li>Siirrä omat yksikkösi suunnitelman mukaisesti.</li><li>Huomioi vihollisen hallintavyöhykkeet (ZoC).</li><li>Varmista, että yksiköt päätyvät hyvään suojaan.</li></ul>", advice: "Vahvista suunnitelmasi ja siirrä yksiköt. Muista maaston vaikutus liikkeeseen." },
        { name: "Tiedusteluvaihe", instructions: "<ul><li>Onko sinulla yksiköitä, joilla haluat tiedustella? Käytä 'Tiedustelutoiminta' (1 KP).</li><li>Ilmoita GM:lle, mitä aluetta tai kohdetta tiedustelet.</li><li>Odota GM:n vastausta havainnoista.</li></ul>", advice: "Onko sinulla tiedustelijoita? Ilmoita kohteet pelinjohtajalle ja odota havaintoja." },
        { name: "Komentovaihe", instructions: "<ul><li>Käytä komentopisteesi (<span class='glossary-term' data-term='kp'>KP</span>).</li><li>Anna tulikomennot ('Hyökkäyskäsky', 1 KP).</li><li>Aktivoi erikoiskyvyt (esim. 'Lamauttava Tuli', 2 KP).</li><li>Päätä mahdolliset tulitukipyynnöt.</li></ul>", advice: "Tärkein vaiheesi! Käytä KP:t viisaasti. Anna tulikomennot ja aktivoi kyvyt." },
        { name: "Tulitoimintavaihe", instructions: "<ul><li>Tässä vaiheessa et voi enää antaa komentoja.</li><li>Seuraa, kun GM ratkaisee kaikki annetut tulikomennot.</li><li>Kirjaa ylös yksiköihisi kohdistuneet vahingot.</li></ul>", advice: "Seuraa taistelun lopputuloksia ja kirjaa tappiot. Et voi enää vaikuttaa tähän vuoroon." },
        { name: "Tilannevaihe", instructions: "<ul><li>Suorita vaaditut moraalitestit vahinkoa kärsineille yksiköille.</li><li>Päivitä yksiköiden tila (esim. Vaurioitunut, Lamautunut).</li><li>Valmistaudu seuraavaan vuoroon.</li></ul>", advice: "Suorita moraalitestit ja päivitä yksiköiden tilat. Valmistaudu seuraavaan vuoroon." }
    ];

    // --- KESKEISET FUNKTIOT ---

    /**
     * Näyttää ilmoituksen joko pääsisällössä tai yläpalkin header-tyylisenä.
     * @param {string} message - Näytettävä viesti.
     * @param {string} type - Ilmoituksen tyyppi ('info', 'warning', 'success').
     * @param {boolean} isHeader - Onko kyseessä yläpalkin ilmoitus.
     * @param {number} duration - Kauanko ilmoitus näkyy (ms).
     */
    const showNotification = (message, type = 'info', isHeader = false, duration = 6000) => {
        if (isHeader) {
            const headerNotif = document.createElement('div');
            headerNotif.className = `header-notification is-${type}`;
            headerNotif.innerHTML = message;
            document.body.appendChild(headerNotif);
            // Animaatio sisään
            setTimeout(() => headerNotif.classList.add('is-visible'), 10);
            // Animaatio ulos ja poisto
            setTimeout(() => {
                headerNotif.classList.remove('is-visible');
                setTimeout(() => headerNotif.remove(), 500);
            }, duration);
        } else {
            if (!notificationsEl) return;
            const notif = document.createElement('div');
            notif.className = `player-notification is-${type}`;
            notif.innerHTML = message;
            notificationsEl.insertBefore(notif, notificationsEl.firstChild);
            setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => notif.remove(), 500); }, duration);
        }
    };

    // Datan tallennus ja lataus
    const savePlayerData = () => {
        playerData.currentPhaseIndex = currentPhaseIndex;
        playerData.hiddenCardHeaders = Array.from(hiddenCardHeaders);
        localStorage.setItem('tkd20PlayerData', JSON.stringify(playerData));
    };

    const loadPlayerData = () => {
        let savedData;
        try {
            savedData = JSON.parse(localStorage.getItem('tkd20PlayerData'));
        } catch (error) {
            console.error("Pelaajadatan lataus epäonnistui:", error);
            savedData = null;
        }

        const defaultData = {
            roles: { joukkueenjohtaja: true, komppanianpaallikko: false },
            kp: { joukkueenjohtaja: 3, komppanianpaallikko: 5 },
            activeUnits: [], notes: '', usedTacticalAbility: null,
            fireSupportMissions: [], usedGameAbilities: [],
            unitInstanceCounter: 0, turn: 1, currentPhaseIndex: -1
        };

        playerData = savedData || defaultData;

        // **TÄRKEÄ KORJAUS**: Hydratoidaan vanhat yksiköt ja varmistetaan datan eheys
        if (playerData.activeUnits && Array.isArray(playerData.activeUnits)) {
            playerData.activeUnits.forEach(unit => {
                const template = window.blueUnitData[unit.typeId];
                if (template) {
                    if (!unit.abilities) unit.abilities = template.abilities;
                    if (!unit.armament) unit.armament = template.armament;
                    if (!unit.maxTk) unit.maxTk = template.stats.tk;

                    // Muunnetaan vanha string-muotoinen status uuteen array-muotoon
                    if (typeof unit.status === 'string') {
                        unit.status = [unit.status];
                    }
                    // Varmistetaan, että status on aina taulukko
                    if (!Array.isArray(unit.status)) {
                        unit.status = ['Kunnossa'];
                    }
                }
            });
        }

        unitInstanceCounter = playerData.unitInstanceCounter || 0;
        currentPhaseIndex = playerData.currentPhaseIndex !== undefined ? playerData.currentPhaseIndex : -1;
        hiddenCardHeaders = new Set(playerData.hiddenCardHeaders || []);
    };



    /**
     * Laskee yksikön modifioidut taisteluarvot sen nykyisen tilan ja kykyjen perusteella.
     * @param {object} unitState - Yksikön tilaobjekti.
     * @returns {object} Objekti, joka sisältää lasketut arvot.
     */
    const calculateModifiedStats = (unitState) => {
        const baseUnit = window.blueUnitData[unitState.typeId];
        if (!baseUnit) return { liike: 0, tuliIsku: '-', moraali: unitState.m };

        const baseStats = baseUnit.stats;
        let modified = {
            liike: baseStats.l,
            tuliIsku: baseUnit.armament.find(w => w.name.toLowerCase().includes('aseistus'))?.damage || '-',
            moraali: baseStats.m
        };

        const activeStatuses = unitState.status || [];

        // Käydään kaikki aktiiviset statukset läpi
        if (activeStatuses.includes('Vaurioitunut')) {
            modified.liike = Math.floor(baseStats.l / 2);
            const diceMap = { 'd12': 'd10', 'd10': 'd8', 'd8': 'd6', 'd6': 'd4', 'd4': 'd4' };
            modified.tuliIsku = diceMap[modified.tuliIsku] || modified.tuliIsku;

            const hasSisu = unitState.abilities && unitState.abilities.some(a => a.name.toLowerCase().includes("sisu"));
            if (!hasSisu) {
                // Säännöissä ei määritellä suoraa moraalirangaistusta vaurioitumisesta,
                // mutta tämä olisi paikka lisätä se tarvittaessa.
            }
        }

        if (activeStatuses.includes('Lamautunut') || activeStatuses.includes('Tuhottu') || activeStatuses.includes('Vetäytyy')) {
            modified.liike = 0;
            modified.tuliIsku = '-';
        }

        return modified;
    };


    /**
     * Päivittää yksikön tilaa ja laskee sen arvot uudelleen.
     * @param {string} instanceId - Yksikön uniikki ID.
     * @param {object} updates - Päivitettävät arvot.
     */
    const updateUnitState = (instanceId, updates) => {
        const unit = playerData.activeUnits.find(u => u.instanceId === instanceId);
        if (!unit) return;

        // Otetaan kopiot vanhoista arvoista vertailua varten
        const oldTk = unit.tk;
        const oldStatusesJSON = JSON.stringify([...unit.status].sort());

        // Yhdistetään päivitykset (esim. tk tai status muuttuu)
        Object.assign(unit, updates);

        // Varmistetaan, että TK on rajojen sisällä
        unit.tk = Math.max(0, Math.min(unit.tk, unit.maxTk));

        // --- Automaattinen tilan päivitys TK:n perusteella ---
        // Ajetaan vain, jos päivitys EI tullut manuaalisesti status-valintaruuduista
        if (updates.tk !== undefined && updates.status === undefined) {
            const tkBasedStatuses = ['Kunnossa', 'Vaurioitunut', 'Lamautunut', 'Tuhottu'];

            // 1. Poistetaan vanhat TK-pohjaiset tilat, mutta säilytetään manuaaliset (kuten Tärähtänyt)
            let newStatusArray = unit.status.filter(s => !tkBasedStatuses.includes(s));

            // 2. Määritetään uusi TK-pohjainen tila sääntötaulukon mukaan
            const percentage = (unit.tk / unit.maxTk) * 100;
            let newTkStatus = 'Kunnossa';
            if (unit.tk <= 0) {
                newTkStatus = "Tuhottu";
            } else if (percentage <= 25) {
                newTkStatus = "Lamautunut";
            } else if (percentage <= 50) {
                newTkStatus = "Vaurioitunut";
            }

            // 3. Lisätään uusi TK-pohjainen tila listaan, jos se ei ole jo siellä
            if (!newStatusArray.includes(newTkStatus)) {
                newStatusArray.push(newTkStatus);
            }

            // 4. Siivotaan lista: jos 'Kunnossa' on muiden tilojen kanssa, poistetaan se.
            if (newStatusArray.length > 1) {
                newStatusArray = newStatusArray.filter(s => s !== 'Kunnossa');
            }

            unit.status = newStatusArray;
        }

        // --- Ilmoitusten ja renderöinnin käsittely ---
        const newStatusesJSON = JSON.stringify([...unit.status].sort());

        // Näytetään ilmoitus vain, jos tilojen lista on oikeasti muuttunut
        if (newStatusesJSON !== oldStatusesJSON) {
            const statusEffectDescriptions = {
                'Tärähtänyt': 'Kärsii -2 rangaistuksen seuraavaan hyökkäykseen.',
                'Vaurioitunut': 'Liike & Tuli-isku puolitettu.',
                'Lamautunut': 'Ei voi toimia. Vastaan hyökätessä saa Edun.',
                'Vetäytyy': 'Pakenee hallitsemattomasti.',
                'Tuhottu': 'Poistettu pelistä.'
            };
            const activeEffects = unit.status.filter(s => statusEffectDescriptions[s]).map(s => `<strong>${s}</strong>`);

            showNotification(`<strong>${unit.name}</strong> tila muuttui: ${activeEffects.join(' & ')}`, 'warning', true);
        }

        // Ensimmäisen osuman ilmoitus
        if (unit.tk < oldTk && unit.tookFirstHit === false && unit.tk < unit.maxTk) {
            showNotification(`<strong>${unit.name}</strong> kärsi ensivahingon! Moraalitesti vaaditaan (DC 10).`, 'warning', true);
            unit.tookFirstHit = true;
        }

        // Päivitetään aina UI ja tallennetaan data
        renderSingleUnit(instanceId);
        savePlayerData();
    };


    /**
     * Renderöi yksittäisen yksikkökortin näkyviin.
     * @param {string} instanceId - Renderöitävän yksikön uniikki ID.
     */
    const renderSingleUnit = (instanceId) => {
        const unit = playerData.activeUnits.find(u => u.instanceId === instanceId);
        const card = document.getElementById(`player-card-${instanceId}`);
        if (!unit || !card) return;

        if (!Array.isArray(unit.status)) {
            unit.status = ['Kunnossa'];
        }

        const modifiedStats = calculateModifiedStats(unit);

        const statusEffectDescriptions = {
            'Tärähtänyt': 'Kärsii -2 rangaistuksen seuraavaan hyökkäykseen.',
            'Vaurioitunut': 'Liike & Tuli-isku puolitettu. Pakollinen moraalitesti (DC 12).',
            'Lamautunut': 'Ei voi toimia. Vastaan hyökätessä saa Edun.',
            'Vetäytyy': 'Pakenee hallitsemattomasti.',
            'Tuhottu': 'Poistettu pelistä.'
        };

        const armamentHtml = unit.armament.map(w => {
            const isPrimaryWeapon = w.name.toLowerCase().includes('aseistus');
            const displayDamage = isPrimaryWeapon ? modifiedStats.tuliIsku : w.damage;
            return `<tr><td>${w.name}</td><td>${w.attack}</td><td>${displayDamage}</td><td>${w.notes}</td></tr>`;
        }).join('');
        const armamentTable = `<div class="table-container"><table class="armament-table"><thead><tr><th>Ase</th><th>Hyökkäys</th><th>Vahinko (TI)</th><th>Huom.</th></tr></thead><tbody>${armamentHtml}</tbody></table></div>`;

        const abilitiesHtml = unit.abilities ? unit.abilities.map(a => `<li><strong>${a.name}:</strong> ${a.description}</li>`).join('') : '';

        const allStatuses = ['Kunnossa', 'Tärähtänyt', 'Vaurioitunut', 'Lamautunut', 'Vetäytyy', 'Tuhottu'];
        const statusCheckboxesHtml = `
            <div class="status-checkbox-group">
                ${allStatuses.map(s => `
                    <label>
                        <input type="checkbox" class="status-checkbox" value="${s}" ${unit.status.includes(s) ? 'checked' : ''}>
                        <span>${s}</span>
                    </label>
                `).join('')}
            </div>
        `;

        const activeEffectsHtml = `
            <ul class="active-effects-list">
                ${unit.status
                .filter(s => statusEffectDescriptions[s])
                .map(s => `<li><strong>${s}:</strong> ${statusEffectDescriptions[s]}</li>`)
                .join('')}
            </ul>
        `;

        card.innerHTML = `
            <div class="unit-card-header">
                <h4>${unit.name} <span class="unit-type-display">(${unit.typeName})</span></h4>
            </div>
            <div class="unit-card-body">
                <div class="unit-stat-grid">
                    <div class="unit-stat tk-tracker"><div class="label">Taistelukunto</div><div class="unit-tracker"><button class="tk-btn tk-minus">-</button><span class="value tk-current">${unit.tk} / ${unit.maxTk}</span><button class="tk-btn tk-plus">+</button></div></div>
                    <div class="unit-stat"><div class="label">Suoja</div><div class="value">${unit.s}</div></div>
                    <div class="unit-stat"><div class="label">Moraali</div><div class="value">${modifiedStats.moraali}</div></div>
                    <div class="unit-stat"><div class="label">Taitotaso</div><div class="value">${unit.tt}</div></div>
                    <div class="unit-stat"><div class="label">Liike</div><div class="value">${modifiedStats.liike} cm</div></div>
                </div>
                
                <h5>Tilaefektit</h5>
                ${statusCheckboxesHtml}
                ${activeEffectsHtml}
                
                <div class="unit-ammo-trackers"></div>
                <h5>Aseistus</h5>${armamentTable}
                <h5>Kyvyt</h5><ul class="abilities-list">${abilitiesHtml}</ul>
                <button class="remove-unit-btn danger-button">Poista Yksikkö</button>
            </div>`;

        const ammoContainer = card.querySelector('.unit-ammo-trackers');
        if (unit.ammo && Object.keys(unit.ammo).length > 0) {
            // Lisätään otsikko vain jos ammuksia on
            const ammoHeader = document.createElement('h5');
            ammoHeader.textContent = 'Ammukset';
            ammoContainer.before(ammoHeader);

            Object.keys(unit.ammo).forEach(weapon => {
                const ammoTrackerEl = document.createElement('div');
                ammoTrackerEl.className = 'ammo-tracker';
                // LISÄTTY "Ammu"-nappi
                ammoTrackerEl.innerHTML = `
                    <span class="ammo-label">${weapon.replace(/<[^>]*>/g, '')}:</span>
                    <div class="unit-tracker">
                        <button class="ammo-btn ammo-minus" data-weapon="${weapon}">-</button>
                        <span class="value ammo-count">${unit.ammo[weapon]}</span>
                        <button class="ammo-btn ammo-plus" data-weapon="${weapon}">+</button>
                    </div>
                    <button class="fire-ammo-btn" data-weapon="${weapon}" ${unit.ammo[weapon] <= 0 ? 'disabled' : ''}>Ammu</button>
                `;
                ammoContainer.appendChild(ammoTrackerEl);
            });
        }

        // Tapahtumankuuntelijat
        card.querySelector('.tk-minus').addEventListener('click', () => updateUnitState(instanceId, { tk: unit.tk - 1 }));
        card.querySelector('.tk-plus').addEventListener('click', () => updateUnitState(instanceId, { tk: unit.tk + 1 }));
        card.querySelector('.remove-unit-btn').addEventListener('click', () => { playerData.activeUnits = playerData.activeUnits.filter(u => u.instanceId !== instanceId); renderActiveUnits(); savePlayerData(); });

        card.querySelectorAll('.status-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const selectedStatuses = Array.from(card.querySelectorAll('.status-checkbox:checked')).map(cb => cb.value);
                if (selectedStatuses.length === 0) {
                    selectedStatuses.push('Kunnossa');
                }
                if (selectedStatuses.length > 1 && selectedStatuses.includes('Kunnossa')) {
                    const index = selectedStatuses.indexOf('Kunnossa');
                    selectedStatuses.splice(index, 1);
                }
                updateUnitState(instanceId, { status: selectedStatuses });
            });
        });

        card.querySelectorAll('.ammo-minus').forEach(btn => btn.addEventListener('click', () => { const weapon = btn.dataset.weapon; const newAmmo = { ...unit.ammo }; if (newAmmo[weapon] > 0) { newAmmo[weapon]--; updateUnitState(instanceId, { ammo: newAmmo }); } }));
        card.querySelectorAll('.ammo-plus').forEach(btn => btn.addEventListener('click', () => { const weapon = btn.dataset.weapon; const newAmmo = { ...unit.ammo }; newAmmo[weapon]++; updateUnitState(instanceId, { ammo: newAmmo }); }));

        // LISÄTTY "Ammu"-napin tapahtumankuuntelija
        card.querySelectorAll('.fire-ammo-btn').forEach(btn => btn.addEventListener('click', () => {
            const weapon = btn.dataset.weapon;
            const newAmmo = { ...unit.ammo };
            if (newAmmo[weapon] > 0) {
                newAmmo[weapon]--;
                showNotification(`<strong>${unit.name}</strong> ampui aseella: <strong>${weapon.replace(/<[^>]*>/g, '')}</strong>`, 'info', true);
                updateUnitState(instanceId, { ammo: newAmmo });
            }
        }));
    };

    const renderActiveUnits = () => {
        if (!unitDisplayArea) return;
        unitDisplayArea.innerHTML = '';
        if (!playerData.activeUnits || playerData.activeUnits.length === 0) {
            unitDisplayArea.innerHTML = '<p>Ei aktiivisia yksiköitä.</p>';
            return;
        }
        playerData.activeUnits.forEach(unitState => {
            const cardDiv = document.createElement('div');
            cardDiv.id = `player-card-${unitState.instanceId}`;
            cardDiv.className = 'player-unit-card';
            if (hiddenCardHeaders.has(unitState.instanceId)) {
                cardDiv.classList.add('header-hidden');
            }
            unitDisplayArea.appendChild(cardDiv);
            renderSingleUnit(unitState.instanceId);
        });
    };

    const populatePlayerUnitTemplates = () => {
        if (!unitTemplatesContainer) return;
        unitTemplatesContainer.innerHTML = '';
        if (typeof window.blueUnitData === 'undefined') {
            console.error("Yksikködataa (window.blueUnitData) ei löydy.");
            return;
        }
        for (const typeId in window.blueUnitData) {
            const template = window.blueUnitData[typeId];
            const templateDiv = document.createElement('div');
            templateDiv.className = 'player-unit-template-item';
            templateDiv.innerHTML = `<span class="template-name">${template.name}</span>
                <input type="text" class="template-custom-name" placeholder="Anna yksikölle nimi...">
                <button class="template-add-btn" data-type-id="${typeId}">Lisää</button>`;
            unitTemplatesContainer.appendChild(templateDiv);
        }
        unitTemplatesContainer.querySelectorAll('.template-add-btn').forEach(btn => {
            btn.addEventListener('click', addPlayerUnit);
        });
    };

    const addPlayerUnit = (event) => {
        const btn = event.target;
        const typeId = btn.dataset.typeId;
        const template = window.blueUnitData[typeId];
        const parentDiv = btn.closest('.player-unit-template-item');
        const customNameInput = parentDiv.querySelector('.template-custom-name');
        const customName = customNameInput.value.trim();

        if (!customName) {
            showNotification('Anna yksikölle nimi ennen lisäämistä.', 'warning', true);
            customNameInput.focus();
            return;
        }
        if (playerData.activeUnits.some(unit => unit.name.toLowerCase() === customName.toLowerCase())) {
            showNotification(`Yksikkö nimellä "${customName}" on jo olemassa.`, 'warning', true);
            customNameInput.focus();
            return;
        }

        unitInstanceCounter++;
        const newUnit = {
            instanceId: `unit-${unitInstanceCounter}`,
            typeId, name: customName, typeName: template.name,
            tk: template.stats.tk, maxTk: template.stats.tk,
            tt: template.stats.tt, s: template.stats.s, m: template.stats.m, l: template.stats.l,
            status: 'Kunnossa', tookFirstHit: false,
            ammo: JSON.parse(JSON.stringify(template.ammo)),
            abilities: template.abilities, armament: template.armament
        };
        playerData.activeUnits.push(newUnit);
        playerData.unitInstanceCounter = unitInstanceCounter;
        showNotification(`Yksikkö "${customName}" lisätty.`, 'success', true);
        customNameInput.value = '';
        renderActiveUnits();

        savePlayerData();
    };

    const checkFireSupportArrival = () => {
        if (currentPhaseIndex !== 3) {
            return;
        }

        const currentTurn = playerData.turn;
        const arrivingMissions = playerData.fireSupportMissions.filter(
            mission => parseInt(mission.arrivalTurn, 10) === currentTurn
        );

        if (arrivingMissions.length > 0) {
            arrivingMissions.forEach(mission => {
                showNotification(
                    `<strong>TULITUKI SAAPUU:</strong> "${mission.type}" kohteeseen "${mission.target}"!`,
                    'warning', true, 10000
                );
            });
            playerData.fireSupportMissions = playerData.fireSupportMissions.filter(
                mission => parseInt(mission.arrivalTurn, 10) !== currentTurn
            );
            renderFireSupportMissions();
            savePlayerData();
        }
    };

    const updatePhaseView = () => {
        if (!phaseTitleEl || !phaseInstructionsEl || !phaseCounterEl || !prevPhaseBtn) {
            return;
        }

        if (currentPhaseIndex < 0 || currentPhaseIndex >= phases.length) {
            phaseTitleEl.textContent = "Peli ei ole alkanut";
            phaseInstructionsEl.innerHTML = "<p>Aloita peli painamalla \"Seuraava Vaihe\".</p>";
            if (tacticalAdviceEl) tacticalAdviceEl.textContent = "Valmistaudu ensimmäiseen siirtoon!";
            phaseCounterEl.textContent = `Vaihe 0/${phases.length}`;
            prevPhaseBtn.disabled = true;
        } else {
            const phase = phases[currentPhaseIndex];
            phaseTitleEl.textContent = `${phase.name} (Vuoro ${playerData.turn})`;
            phaseInstructionsEl.innerHTML = phase.instructions;
            if (tacticalAdviceEl) tacticalAdviceEl.textContent = phase.advice;
            phaseCounterEl.textContent = `Vaihe ${currentPhaseIndex + 1}/${phases.length}`;
            prevPhaseBtn.disabled = (currentPhaseIndex === 0 && playerData.turn === 1);
            checkFireSupportArrival();
        }
        savePlayerData();
    };

    const updateUIFromLoadedData = () => {
        roleCheckboxes.forEach(c => { c.checked = !!(playerData.roles && playerData.roles[c.value]) });
        const notesEl = document.getElementById('player-notes');
        if (notesEl) notesEl.value = playerData.notes || '';
        if (turnCounterDisplay) turnCounterDisplay.textContent = playerData.turn || 1;

        updateRole(true);
        renderActiveUnits();
        renderFireSupportMissions();
        updatePhaseView();
    };

    const updateRole = (isInitialLoad = false) => {
        if (!playerData.roles) playerData.roles = {};
        if (!playerData.kp) playerData.kp = {};

        const oldRoles = { ...playerData.roles };
        roleCheckboxes.forEach(checkbox => { playerData.roles[checkbox.value] = checkbox.checked; });

        if (playerData.roles.joukkueenjohtaja && !oldRoles.joukkueenjohtaja) playerData.kp.joukkueenjohtaja = 3;
        if (playerData.roles.komppanianpaallikko && !oldRoles.komppanianpaallikko) playerData.kp.komppanianpaallikko = 5;

        if (isInitialLoad) {
            if (playerData.roles.joukkueenjohtaja) playerData.kp.joukkueenjohtaja = playerData.kp.joukkueenjohtaja !== undefined ? playerData.kp.joukkueenjohtaja : 3;
            if (playerData.roles.komppanianpaallikko) playerData.kp.komppanianpaallikko = playerData.kp.komppanianpaallikko !== undefined ? playerData.kp.komppanianpaallikko : 5;
        }
        kpTrackerJJ.container.style.display = playerData.roles.joukkueenjohtaja ? 'flex' : 'none';
        if (kpTrackerJJ.display) kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja || 0;

        const isCommander = playerData.roles.komppanianpaallikko;
        kpTrackerKP.container.style.display = isCommander ? 'flex' : 'none';
        if (commandListCommander) commandListCommander.style.display = isCommander ? 'block' : 'none';
        if (kpTrackerKP.display) kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko || 0;

        const fireSupportTab = document.querySelector('[data-tab="tab-firesupport-player"]');
        if (fireSupportTab) fireSupportTab.style.display = isCommander ? 'inline-flex' : 'none';

        savePlayerData();
    };

    const resetKpPools = () => {
        if (playerData.roles.joukkueenjohtaja) playerData.kp.joukkueenjohtaja = 3;
        if (playerData.roles.komppanianpaallikko) playerData.kp.komppanianpaallikko = 5;
        if (kpTrackerJJ.display) kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja || 0;
        if (kpTrackerKP.display) kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko || 0;
    };

    const handleKpSpending = (pool, cost) => {
        if (pool === 'jj') {
            if (playerData.kp.joukkueenjohtaja >= cost) {
                playerData.kp.joukkueenjohtaja -= cost;
                kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja;
                savePlayerData(); return true;
            }
        } else if (pool === 'kp') {
            if (playerData.kp.komppanianpaallikko >= cost) {
                playerData.kp.komppanianpaallikko -= cost;
                kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko;
                savePlayerData(); return true;
            }
        }
        showNotification(`Ei riittävästi komentopisteitä!`, 'warning', true);
        return false;
    };

    const updateCommanderAbilityButtons = () => {
        commanderTacticalAbilities.forEach(ability => {
            const btn = document.getElementById(`use-ability-${ability}`);
            if (btn) btn.disabled = (playerData.usedTacticalAbility !== null);
        });
        document.querySelectorAll('.ability-btn[data-ability-type="game"]').forEach(btn => {
            const abilityId = btn.dataset.abilityId;
            if (playerData.usedGameAbilities.includes(abilityId)) {
                btn.disabled = true;
                btn.textContent = `${btn.textContent.split('(')[0].trim()} (Käytetty)`;
            }
        });
    };

    const renderFireSupportMissions = () => {
        const missionList = document.getElementById('fire-support-mission-list');
        if (!missionList) return;
        missionList.innerHTML = '';
        if (!playerData.fireSupportMissions || playerData.fireSupportMissions.length === 0) {
            missionList.innerHTML = '<tr><td colspan="4">Ei aktiivisia tulitukitehtäviä.</td></tr>';
            return;
        }
        playerData.fireSupportMissions.forEach((mission, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${mission.type}</td><td>${mission.target}</td><td>${mission.arrivalTurn}</td><td><button class="remove-mission-btn" data-index="${index}">Poista</button></td>`;
            missionList.appendChild(row);
        });
        missionList.querySelectorAll('.remove-mission-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index, 10);
                playerData.fireSupportMissions.splice(indexToRemove, 1);
                renderFireSupportMissions();
                savePlayerData();
            });
        });
    };

    const handleAddMission = (e) => {
        e.preventDefault();
        const cost = 3;
        const pool = 'kp';
        const commandName = "Tulitukipyyntö (Epäorgaaninen)";
        const poolName = "komppanianpäällikön";
        if (handleKpSpending(pool, cost)) {
            const type = document.getElementById('mission-type-input').value;
            const target = document.getElementById('mission-target-input').value;
            const arrivalTurn = document.getElementById('mission-arrival-input').value;
            if (type && target && arrivalTurn) {
                playerData.fireSupportMissions.push({ type, target, arrivalTurn });
                renderFireSupportMissions();
                const message = `Käytetty ${cost} KP ${poolName} komentoon "${commandName}".`;
                showNotification(message, 'success', true);
                savePlayerData();
                document.getElementById('add-mission-form').reset();
            } else {
                showNotification('Täytä kaikki tulitukitehtävän tiedot!', 'warning', true);
                playerData.kp.komppanianpaallikko += cost;
                kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko;
            }
        }
    };

    // --- ALUSTUS JA TAPAHTUMANKUUNTELIJAT ---
    const tabs = document.querySelectorAll('.player-tab-button');
    const tabPanes = document.querySelectorAll('.player-tab-pane');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const targetPane = document.getElementById(tab.dataset.tab);
                if (targetPane) targetPane.classList.add('active');
            });
        });
        const initialActiveTab = document.querySelector('.player-tab-button.active');
        if (!initialActiveTab && tabs.length > 0) {
            tabs[0].classList.add('active');
            const firstPane = document.getElementById(tabs[0].dataset.tab);
            if (firstPane) firstPane.classList.add('active');
        } else if (initialActiveTab) {
            const activePane = document.getElementById(initialActiveTab.dataset.tab);
            if (activePane) activePane.classList.add('active');
        }
    }

    loadPlayerData();
    populatePlayerUnitTemplates();
    updateUIFromLoadedData();

    roleCheckboxes.forEach(checkbox => checkbox.addEventListener('change', () => updateRole(false)));
    kpTrackerJJ.decBtn?.addEventListener('click', () => { if (playerData.kp.joukkueenjohtaja > 0) { playerData.kp.joukkueenjohtaja--; kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja; savePlayerData(); } });
    kpTrackerJJ.incBtn?.addEventListener('click', () => { playerData.kp.joukkueenjohtaja++; kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja; savePlayerData(); });
    kpTrackerKP.decBtn?.addEventListener('click', () => { if (playerData.kp.komppanianpaallikko > 0) { playerData.kp.komppanianpaallikko--; kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko; savePlayerData(); } });
    kpTrackerKP.incBtn?.addEventListener('click', () => { playerData.kp.komppanianpaallikko++; kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko; savePlayerData(); });

    const notesEl = document.getElementById('player-notes');
    if (notesEl) notesEl.addEventListener('input', (e) => { playerData.notes = e.target.value; savePlayerData(); });

    commandListGeneral?.addEventListener('click', e => {
        if (e.target.classList.contains('command-btn')) {
            const btn = e.target;
            const cost = parseInt(btn.dataset.cost);
            const pool = btn.dataset.pool;
            const commandName = btn.closest('.command-list-item').querySelector('.command-name').textContent.trim();
            const poolName = pool === 'jj' ? 'joukkueenjohtajan' : 'komppanianpäällikön';
            if (handleKpSpending(pool, cost)) {
                const message = `Käytetty ${cost} KP ${poolName} komentoon "${commandName}".`;
                showNotification(message, 'success', true);
            }
        }
    });

    commandListCommander?.addEventListener('click', e => {
        if (e.target.classList.contains('command-btn') || e.target.classList.contains('ability-btn')) {
            const btn = e.target;
            const cost = parseInt(btn.dataset.cost, 10);
            const pool = btn.dataset.pool;
            const abilityId = btn.dataset.abilityId || btn.id;
            const abilityType = btn.dataset.abilityType;
            const commandName = btn.closest('.command-list-item').querySelector('.command-name').textContent.trim();
            const poolName = 'komppanianpäällikön';
            if (abilityType === 'tactical') {
                if (playerData.usedTacticalAbility) {
                    showNotification('Voit käyttää vain yhden taktisen erikoiskyvyn per vuoro.', 'warning', true); return;
                }
                if (handleKpSpending(pool, cost)) {
                    playerData.usedTacticalAbility = abilityId;
                    updateCommanderAbilityButtons();
                    showNotification(`Käytetty ${cost} KP ${poolName} taktiseen kykyyn "${commandName}".`, 'success', true);
                }
            } else if (abilityType === 'game') {
                if (playerData.usedGameAbilities.includes(abilityId)) {
                    showNotification('Tämä kyky on jo käytetty tässä pelissä.', 'warning', true); return;
                }
                if (handleKpSpending(pool, cost)) {
                    playerData.usedGameAbilities.push(abilityId);
                    updateCommanderAbilityButtons();
                    showNotification(`Käytetty ${cost} KP ${poolName} erikoiskykyyn "${commandName}".`, 'success', true);
                }
            } else {
                if (handleKpSpending(pool, cost)) {
                    showNotification(`Käytetty ${cost} KP ${poolName} komentoon "${commandName}".`, 'success', true);
                }
            }
        }
    });

    nextPhaseBtn?.addEventListener('click', () => {
        currentPhaseIndex++;
        if (currentPhaseIndex >= phases.length) {
            currentPhaseIndex = 0;
            playerData.turn = (playerData.turn || 1) + 1;
            if (turnCounterDisplay) turnCounterDisplay.textContent = playerData.turn;
            playerData.usedTacticalAbility = null;
            updateCommanderAbilityButtons();
            resetKpPools();
            showNotification(`Vuoro ${playerData.turn} alkoi! Taktiset kyvyt ja KP:t nollattu.`, 'success', true);
        }
        updatePhaseView();
    });

    prevPhaseBtn?.addEventListener('click', () => {
        if (currentPhaseIndex === 0 && (playerData.turn || 1) > 1) {
            currentPhaseIndex = phases.length - 1;
            playerData.turn--;
            if (turnCounterDisplay) turnCounterDisplay.textContent = playerData.turn;
        } else if (currentPhaseIndex > 0) {
            currentPhaseIndex--;
        }
        updatePhaseView();
    });

    const newTurnBtn = document.getElementById('new-turn-button');
    if (newTurnBtn) {
        newTurnBtn.addEventListener('click', () => {
            playerData.usedTacticalAbility = null;
            playerData.turn = (playerData.turn || 1) + 1;
            if (turnCounterDisplay) turnCounterDisplay.textContent = playerData.turn;
            updateCommanderAbilityButtons();
            resetKpPools();
            showNotification(`Vuoro ${playerData.turn} alkoi! Taktiset kyvyt ja KP:t nollattu.`, 'success', true);
            savePlayerData();
        });
    }

    const addMissionForm = document.getElementById('add-mission-form');
    if (addMissionForm) {
        addMissionForm.addEventListener('submit', handleAddMission);
    }

    const liikeCalcBtn = document.getElementById('calculate-liike-player');
    if (liikeCalcBtn) {
        liikeCalcBtn.addEventListener('click', () => {
            const liike = parseFloat(document.getElementById('liike-arvo-player').value) || 0;
            const tie = parseFloat(document.getElementById('matka-tie-player').value) || 0;
            const pelto = parseFloat(document.getElementById('matka-pelto-player').value) || 0;
            const metsa = parseFloat(document.getElementById('matka-metsa-player').value) || 0;
            const tihea = parseFloat(document.getElementById('matka-tihea-metsa-player').value) || 0;
            const output = document.getElementById('liike-output-player');
            if (liike <= 0) { output.textContent = 'Syötä liike-arvo.'; return; }
            const cost = (tie * 0.5) + (pelto * 1) + (metsa * 2) + (tihea * 3);
            const remaining = liike - cost;
            output.innerHTML = `Reitin kustannus: <strong>${cost.toFixed(1)}</strong>. Jäljelle jää: <strong>${remaining.toFixed(1)}</strong>.`;
            output.style.color = remaining >= 0 ? 'green' : 'red';
        });
    }

    const hideModal = () => { modalOverlay.classList.remove('is-visible'); modalContainer.classList.remove('is-visible'); resetConfirmInput.value = ''; resetConfirmBtn.disabled = true; };
    resetToolBtn?.addEventListener('click', () => { modalOverlay.classList.add('is-visible'); modalContainer.classList.add('is-visible'); });
    resetCancelBtn?.addEventListener('click', hideModal);
    modalOverlay?.addEventListener('click', hideModal);
    resetConfirmInput?.addEventListener('input', () => { resetConfirmBtn.disabled = resetConfirmInput.value !== 'RESET'; });
    resetConfirmBtn?.addEventListener('click', () => { if (resetConfirmInput.value === 'RESET') { hideModal(); localStorage.removeItem('tkd20PlayerData'); location.reload(); } });
});