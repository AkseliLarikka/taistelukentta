/**
 * Taistelukenttä d20 - Pelaajan työkalupakki
 * Versio 4.3 - Lisätty automaattinen ilmoitus saapuvista tulitukitehtävistä.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Varmistetaan, että pääelementti on olemassa ennen kuin jatketaan.
    // Tämä estää virheet sivuilla, joilla työkalua ei ole.
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
    const turnCounterDisplay = document.getElementById('player-turn-counter'); // Lisätty viittaus

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
    const commanderTacticalAbilities = ['motti', 'painopiste', 'sitova', 'vetaytyminen'];
    const phases = [
        { name: "Liikevaihe", instructions: "<ul><li>Siirrä omat yksikkösi suunnitelman mukaisesti.</li><li>Huomioi vihollisen hallintavyöhykkeet (ZoC).</li><li>Varmista, että yksiköt päätyvät hyvään suojaan.</li></ul>", advice: "Vahvista suunnitelmasi ja siirrä yksiköt. Muista maaston vaikutus liikkeeseen." },
        { name: "Tiedusteluvaihe", instructions: "<ul><li>Onko sinulla yksiköitä, joilla haluat tiedustella? Käytä 'Tiedustelutoiminta' (1 KP).</li><li>Ilmoita GM:lle, mitä aluetta tai kohdetta tiedustelet.</li><li>Odota GM:n vastausta havainnoista.</li></ul>", advice: "Onko sinulla tiedustelijoita? Ilmoita kohteet pelinjohtajalle ja odota havaintoja." },
        { name: "Komentovaihe", instructions: "<ul><li>Käytä komentopisteesi (<span class='glossary-term' data-term='kp'>KP</span>).</li><li>Anna tulikomennot ('Hyökkäyskäsky', 1 KP).</li><li>Aktivoi erikoiskyvyt (esim. 'Lamauttava Tuli', 2 KP).</li><li>Päätä mahdolliset tulitukipyynnöt.</li></ul>", advice: "Tärkein vaiheesi! Käytä KP:t viisaasti. Anna tulikomennot ja aktivoi kyvyt." },
        { name: "Tulitoimintavaihe", instructions: "<ul><li>Tässä vaiheessa et voi enää antaa komentoja.</li><li>Seuraa, kun GM ratkaisee kaikki annetut tulikomennot.</li><li>Kirjaa ylös yksiköihisi kohdistuneet vahingot.</li></ul>", advice: "Seuraa taistelun lopputuloksia ja kirjaa tappiot. Et voi enää vaikuttaa tähän vuoroon." },
        { name: "Tilannevaihe", instructions: "<ul><li>Suorita vaaditut moraalitestit vahinkoa kärsineille yksiköille.</li><li>Päivitä yksiköiden tila (esim. Vaurioitunut, Lamautunut).</li><li>Valmistaudu seuraavaan vuoroon.</li></ul>", advice: "Suorita moraalitestit ja päivitä yksiköiden tilat. Valmistaudu seuraavaan vuoroon." }
    ];

    // --- KESKEISET FUNKTIOT ---

    // Ilmoitusten näyttäminen
    const showNotification = (message, type = 'info', duration = 6000) => {
        if (!notificationsEl) return;
        const notif = document.createElement('div');
        notif.className = `player-notification is-${type}`;
        notif.innerHTML = message;
        notificationsEl.insertBefore(notif, notificationsEl.firstChild);
        setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => notif.remove(), 500); }, duration);
    };

    // Datan tallennus ja lataus
    const savePlayerData = () => {
        playerData.currentPhaseIndex = currentPhaseIndex;
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

        playerData = savedData || {
            roles: { joukkueenjohtaja: true, komppanianpaallikko: false },
            kp: { joukkueenjohtaja: 3, komppanianpaallikko: 5 },
            activeUnits: [], notes: '', usedTacticalAbility: null,
            fireSupportMissions: [], usedGameAbilities: [],
            unitInstanceCounter: 0, turn: 1, currentPhaseIndex: -1
        };

        unitInstanceCounter = playerData.unitInstanceCounter || 0;
        currentPhaseIndex = playerData.currentPhaseIndex !== undefined ? playerData.currentPhaseIndex : -1;
    };

    // Yksiköiden hallinta
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
        // Lisätään tapahtumankuuntelijat vasta kun kaikki elementit ovat DOM:ssa
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
            showNotification('Anna yksikölle nimi ennen lisäämistä.', 'warning');
            customNameInput.focus();
            return;
        }
        if (playerData.activeUnits.some(unit => unit.name.toLowerCase() === customName.toLowerCase())) {
            showNotification(`Yksikkö nimellä "${customName}" on jo olemassa.`, 'warning');
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
        showNotification(`Yksikkö "${customName}" lisätty.`);
        customNameInput.value = '';
        renderActiveUnits();

        // Haetaan juuri luotu kortti ja ajastetaan sen headerin häivytys
        const newCardElement = document.getElementById(`player-card-${newUnit.instanceId}`);
        if (newCardElement) {
            setTimeout(() => {
                newCardElement.classList.add('header-hidden');
            }, 2500); // 2.5 sekunnin viive
        }

        savePlayerData();
    };

    const renderActiveUnits = () => {
        if (!unitDisplayArea) return;
        unitDisplayArea.innerHTML = '';
        if (playerData.activeUnits.length === 0) {
            unitDisplayArea.innerHTML = '<p>Ei aktiivisia yksiköitä.</p>';
            return;
        }
        playerData.activeUnits.forEach(unitState => {
            const cardDiv = document.createElement('div');
            cardDiv.id = `player-card-${unitState.instanceId}`;
            cardDiv.className = 'player-unit-card';
            unitDisplayArea.appendChild(cardDiv);
            renderSingleUnit(unitState.instanceId);
        });
    };

    const renderSingleUnit = (instanceId) => {
        const unit = playerData.activeUnits.find(u => u.instanceId === instanceId);
        const card = document.getElementById(`player-card-${instanceId}`);
        if (!unit || !card) return;

        const armamentHtml = unit.armament.map(w => `<tr><td>${w.name}</td><td>${w.attack}</td><td>${w.damage}</td><td>${w.notes}</td></tr>`).join('');
        const armamentTable = `
            <div class="table-container">
                <table class="armament-table">
                    <thead><tr><th>Ase</th><th>Hyökkäys</th><th>Vahinko (TI)</th><th>Huom.</th></tr></thead>
                    <tbody>${armamentHtml}</tbody>
                </table>
            </div>
        `;
        const abilitiesHtml = unit.abilities.map(a => `<li><strong>${a.name}:</strong> ${a.description}</li>`).join('');

        card.innerHTML = `
            <header>Yksikkö "${unit.name}" <span class="unit-type-display">(${unit.typeName})</span> lisätty onnistuneesti!</header>
            <div class="unit-card-header">
            <h4>${unit.name} <span class="unit-type-display">(${unit.typeName})</span></h4><span class="status-indicator status-${unit.status.toLowerCase().replace(/\s+/g, '-')}">${unit.status}</span>
            </div>
            <div class="unit-card-body">
                <div class="unit-stat-grid">
                    <div class="unit-stat tk-tracker"><div class="label">Taistelukunto</div><div class="unit-tracker"><button class="tk-btn tk-minus">-</button><span class="value tk-current">${unit.tk}</span><button class="tk-btn tk-plus">+</button></div></div>
                    <div class="unit-stat"><div class="label">Suoja</div><div class="value">${unit.s}</div></div>
                    <div class="unit-stat"><div class="label">Moraali</div><div class="value">${unit.m}</div></div>
                    <div class="unit-stat"><div class="label">Taitotaso</div><div class="value">${unit.tt}</div></div>
                    <div class="unit-stat"><div class="label">Liike</div><div class="value">${unit.l} cm</div></div>
                </div>
                <div class="unit-ammo-trackers"></div>
                <h5>Aseistus</h5>
                ${armamentTable}
                <h5>Kyvyt</h5>
                <ul class="abilities-list">${abilitiesHtml}</ul>
                <button class="remove-unit-btn danger-button">Poista Yksikkö</button>
            </div>
        `;

        const ammoContainer = card.querySelector('.unit-ammo-trackers');
        if (unit.ammo && Object.keys(unit.ammo).length > 0) {
            Object.keys(unit.ammo).forEach(weapon => {
                const ammoTrackerEl = document.createElement('div');
                ammoTrackerEl.className = 'ammo-tracker unit-tracker';
                ammoTrackerEl.innerHTML = `<span>${weapon.replace(/<[^>]*>/g, '')}: <strong class="ammo-count" data-weapon="${weapon}">${unit.ammo[weapon]}</strong></span><button class="use-ammo-btn" data-weapon="${weapon}">Käytä</button>`;
                ammoContainer.appendChild(ammoTrackerEl);
            });
        }

        card.querySelector('.tk-minus').addEventListener('click', () => updateUnitState(instanceId, unit.tk - 1, unit.maxTk));
        card.querySelector('.tk-plus').addEventListener('click', () => updateUnitState(instanceId, unit.tk + 1, unit.maxTk));
        card.querySelector('.remove-unit-btn').addEventListener('click', () => { playerData.activeUnits = playerData.activeUnits.filter(u => u.instanceId !== instanceId); renderActiveUnits(); savePlayerData(); });
        card.querySelectorAll('.use-ammo-btn').forEach(btn => btn.addEventListener('click', () => useAmmo(instanceId, btn.dataset.weapon)));
    };

    // KORJAUS: Tässä on uusi funktio tulituen tarkistamiseen
    const checkFireSupportArrival = () => {
        // Ajetaan vain jos on tulitoimintavaihe (indeksi 3)
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
                    'warning', // Käytetään varoitusväriä tärkeälle ilmoitukselle
                    10000 // Pidennetty näkyvyysaika
                );
            });

            // Poistetaan saapuneet tehtävät listalta
            playerData.fireSupportMissions = playerData.fireSupportMissions.filter(
                mission => parseInt(mission.arrivalTurn, 10) !== currentTurn
            );

            // Päivitetään tehtävälista käyttöliittymässä ja tallennetaan muutokset
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

            // KORJAUS: Kutsutaan uutta funktiota tässä
            checkFireSupportArrival();
        }
        savePlayerData();
    };

    const updateUIFromLoadedData = () => {
        roleCheckboxes.forEach(c => { c.checked = !!playerData.roles[c.value] });
        const notesEl = document.getElementById('player-notes');
        if (notesEl) notesEl.value = playerData.notes || '';
        if (turnCounterDisplay) turnCounterDisplay.textContent = playerData.turn;

        updateRole(true);
        renderActiveUnits();
        renderFireSupportMissions();
        updatePhaseView();
    };

    const updateRole = (isInitialLoad = false) => {
        const oldRoles = { ...playerData.roles };
        roleCheckboxes.forEach(checkbox => { playerData.roles[checkbox.value] = checkbox.checked; });
        if (playerData.roles.joukkueenjohtaja && !oldRoles.joukkueenjohtaja) playerData.kp.joukkueenjohtaja = 3;
        if (playerData.roles.komppanianpaallikko && !oldRoles.komppanianpaallikko) playerData.kp.komppanianpaallikko = 5;
        if (isInitialLoad) {
            if (playerData.roles.joukkueenjohtaja) playerData.kp.joukkueenjohtaja = playerData.kp.joukkueenjohtaja !== undefined ? playerData.kp.joukkueenjohtaja : 3;
            if (playerData.roles.komppanianpaallikko) playerData.kp.komppanianpaallikko = playerData.kp.komppanianpaallikko !== undefined ? playerData.kp.komppanianpaallikko : 5;
        }
        kpTrackerJJ.container.style.display = playerData.roles.joukkueenjohtaja ? 'flex' : 'none';
        kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja || 0;
        const isCommander = playerData.roles.komppanianpaallikko;
        kpTrackerKP.container.style.display = isCommander ? 'flex' : 'none';
        commandListCommander.style.display = isCommander ? 'block' : 'none';
        kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko || 0;
        const fireSupportTab = document.querySelector('[data-tab="tab-firesupport-player"]');
        if (fireSupportTab) fireSupportTab.style.display = isCommander ? 'inline-flex' : 'none';
        savePlayerData();
    };

    const resetKpPools = () => {
        if (playerData.roles.joukkueenjohtaja) playerData.kp.joukkueenjohtaja = 3;
        if (playerData.roles.komppanianpaallikko) playerData.kp.komppanianpaallikko = 5;
        kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja || 0;
        kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko || 0;
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
        showNotification(`Ei riittävästi komentopisteitä!`, 'warning');
        return false;
    };

    const updateUnitState = (instanceId, newTk, maxTk) => {
        const unit = playerData.activeUnits.find(u => u.instanceId === instanceId);
        if (!unit) return;

        unit.tk = Math.max(0, Math.min(newTk, maxTk));

        const oldStatus = unit.status;
        const percentage = (unit.tk / maxTk) * 100;

        let newStatus = "Kunnossa";
        if (unit.tk <= 0) newStatus = "Tuhottu";
        else if (percentage <= 25) newStatus = "Lamautunut";
        else if (percentage <= 50) newStatus = "Vaurioitunut";

        unit.status = newStatus;

        if (newStatus !== oldStatus) {
            let effectText = '';
            if (newStatus === 'Vaurioitunut') effectText = 'Liike & Tuli-isku puolitettu.';
            if (newStatus === 'Lamautunut') effectText = 'Ei toimintoja, hyökkäykset saavat Edun.';
            showNotification(`<strong>${unit.name}</strong> tila muuttui: <strong>${newStatus}</strong>. ${effectText}`, 'warning');
        }
        if (unit.tk < maxTk && unit.tookFirstHit === false) {
            showNotification(`<strong>${unit.name}</strong> kärsi ensivahingon! Moraalitesti vaaditaan (DC 10).`, 'warning');
            unit.tookFirstHit = true;
        }
        renderSingleUnit(instanceId);
        savePlayerData();
    };

    const useAmmo = (instanceId, weaponName) => {
        const unit = playerData.activeUnits.find(u => u.instanceId === instanceId);
        if (unit && unit.ammo[weaponName] > 0) {
            unit.ammo[weaponName]--;
            showNotification(`Ammus käytetty: <strong>${unit.name} / ${weaponName.replace(/<[^>]*>/g, '')}</strong>. Jäljellä: ${unit.ammo[weaponName]}`, 'info');
            renderSingleUnit(instanceId);
            savePlayerData();
        }
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
                showNotification(message, 'success');
                savePlayerData();
                document.getElementById('add-mission-form').reset();
            } else {
                showNotification('Täytä kaikki tulitukitehtävän tiedot!', 'warning');
                playerData.kp.komppanianpaallikko += cost;
                kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko;
            }
        }
    };

    // --- ALUSTUS JA TAPAHTUMANKUUNTELIJAT ---
    loadPlayerData();
    populatePlayerUnitTemplates();
    updateUIFromLoadedData();

    const tabs = document.querySelectorAll('.player-tab-button');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPaneId = tab.dataset.tab;
                const targetPane = document.getElementById(targetPaneId);
                document.querySelector('.player-tab-pane.active')?.classList.remove('active');
                document.querySelector('.player-tab-button.active')?.classList.remove('active');
                targetPane.classList.add('active');
                tab.classList.add('active');
            });
        });
        const initialActiveTab = document.querySelector('.player-tab-button.active');
        if (initialActiveTab) {
            const initialPane = document.getElementById(initialActiveTab.dataset.tab);
            if (initialPane) initialPane.classList.add('active');
        }
    }

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
                showNotification(message, 'success');
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
                    showNotification('Voit käyttää vain yhden taktisen erikoiskyvyn per vuoro.', 'warning'); return;
                }
                if (handleKpSpending(pool, cost)) {
                    playerData.usedTacticalAbility = abilityId;
                    updateCommanderAbilityButtons();
                    showNotification(`Käytetty ${cost} KP ${poolName} taktiseen kykyyn "${commandName}".`, 'success');
                }
            } else if (abilityType === 'game') {
                if (playerData.usedGameAbilities.includes(abilityId)) {
                    showNotification('Tämä kyky on jo käytetty tässä pelissä.', 'warning'); return;
                }
                if (handleKpSpending(pool, cost)) {
                    playerData.usedGameAbilities.push(abilityId);
                    updateCommanderAbilityButtons();
                    showNotification(`Käytetty ${cost} KP ${poolName} erikoiskykyyn "${commandName}".`, 'success');
                }
            } else {
                if (handleKpSpending(pool, cost)) {
                    showNotification(`Käytetty ${cost} KP ${poolName} komentoon "${commandName}".`, 'success');
                }
            }
        }
    });

    nextPhaseBtn?.addEventListener('click', () => {
        currentPhaseIndex++;
        if (currentPhaseIndex >= phases.length) {
            currentPhaseIndex = 0;
            playerData.turn++;
            if (turnCounterDisplay) turnCounterDisplay.textContent = playerData.turn;
            playerData.usedTacticalAbility = null;
            updateCommanderAbilityButtons();
            resetKpPools();
            showNotification(`Vuoro ${playerData.turn} alkoi! Taktiset kyvyt ja KP:t nollattu.`, 'success');
        }
        updatePhaseView();
    });

    prevPhaseBtn?.addEventListener('click', () => {
        if (currentPhaseIndex === 0 && playerData.turn > 1) {
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
            playerData.turn++;
            if (turnCounterDisplay) turnCounterDisplay.textContent = playerData.turn;
            updateCommanderAbilityButtons();
            resetKpPools();
            showNotification(`Vuoro ${playerData.turn} alkoi! Taktiset kyvyt ja KP:t nollattu.`, 'success');
            savePlayerData();
        });
    }

    const addMissionForm = document.getElementById('add-mission-form');
    if (addMissionForm) {
        addMissionForm.addEventListener('submit', handleAddMission);
    }

    const distCalcBtn = document.getElementById('calculate-distance-player');
    if (distCalcBtn) {
        distCalcBtn.addEventListener('click', () => { const input = document.getElementById('distance-input-player').value; const output = document.getElementById('distance-output-player'); if (input && !isNaN(input)) { const meters = input * 100; output.innerHTML = `<strong>${input} cm = ${meters} metriä.</strong>`; } else output.textContent = 'Syötä kelvollinen numero.'; });
    }

    const liikeCalcBtn = document.getElementById('calculate-liike-player');
    if (liikeCalcBtn) {
        liikeCalcBtn.addEventListener('click', () => { const liike = parseFloat(document.getElementById('liike-arvo-player').value) || 0; const tie = parseFloat(document.getElementById('matka-tie-player').value) || 0; const pelto = parseFloat(document.getElementById('matka-pelto-player').value) || 0; const metsa = parseFloat(document.getElementById('matka-metsa-player').value) || 0; const tihea = parseFloat(document.getElementById('matka-tihea-metsa-player').value) || 0; const output = document.getElementById('liike-output-player'); if (liike <= 0) { output.textContent = 'Syötä liike-arvo.'; return; } const cost = (tie * 0.5) + (pelto * 1) + (metsa * 2) + (tihea * 3); const remaining = liike - cost; output.innerHTML = `Reitin kustannus: <strong>${cost.toFixed(1)}</strong>. Jäljelle jää: <strong>${remaining.toFixed(1)}</strong>.`; output.style.color = remaining >= 0 ? 'green' : 'red'; });
    }

    const hideModal = () => { modalOverlay.classList.remove('is-visible'); modalContainer.classList.remove('is-visible'); resetConfirmInput.value = ''; resetConfirmBtn.disabled = true; };
    resetToolBtn?.addEventListener('click', () => { modalOverlay.classList.add('is-visible'); modalContainer.classList.add('is-visible'); });
    resetCancelBtn?.addEventListener('click', hideModal);
    modalOverlay?.addEventListener('click', hideModal);
    resetConfirmInput?.addEventListener('input', () => { resetConfirmBtn.disabled = resetConfirmInput.value !== 'RESET'; });
    resetConfirmBtn?.addEventListener('click', () => { if (resetConfirmInput.value === 'RESET') { hideModal(); localStorage.removeItem('tkd20PlayerData'); location.reload(); } });
});