// Scripts/player-tools.js

/**
 * Taistelukenttä d20 - Pelaajan työkalupakki
 * Versio 2.1 - Lopullinen, täysin dynaaminen versio keskitetyllä datalla ja nollaustoiminnolla.
 */
document.addEventListener('DOMContentLoaded', () => {
    const playerToolContainer = document.getElementById('player-tool-container');
    if (!playerToolContainer) return;

    // --- ELEMENTTIVIITTAUKSET ---
    const unitDisplayArea = document.getElementById('active-units-display');
    const unitTemplatesContainer = document.getElementById('player-unit-templates-container');
    const roleCheckboxes = document.querySelectorAll('input[name="player-role"]');
    const notificationsEl = document.getElementById('player-notifications');
    const commandListCommander = document.getElementById('command-list-commander');
    const commandListGeneral = document.getElementById('command-list-general');

    const kpTrackerJJ = { container: document.getElementById('kp-tracker-container-jj'), display: document.getElementById('player-kp-value-jj'), decBtn: document.getElementById('kp-decrement-btn-jj'), incBtn: document.getElementById('kp-increment-btn-jj'), };
    const kpTrackerKP = { container: document.getElementById('kp-tracker-container-kp'), display: document.getElementById('player-kp-value-kp'), decBtn: document.getElementById('kp-decrement-btn-kp'), incBtn: document.getElementById('kp-increment-btn-kp'), };

    // Reset-modaalin elementit
    const resetToolBtn = document.getElementById('player-reset-tool-button');
    const modalOverlay = document.getElementById('player-modal-overlay');
    const modalContainer = document.getElementById('player-modal-container');
    const resetCancelBtn = document.getElementById('player-reset-cancel-button');
    const resetConfirmBtn = document.getElementById('player-reset-confirm-button');
    const resetConfirmInput = document.getElementById('player-reset-confirm-input');

    let playerData = {};
    let unitInstanceCounter = 0;
    const commanderTacticalAbilities = ['motti', 'painopiste', 'sitova', 'vetaytyminen'];

    // --- KESKEISET FUNKTIOT ---
    const showNotification = (message, type = 'info', duration = 6000) => {
        const notif = document.createElement('div');
        notif.className = `player-notification is-${type}`;
        notif.innerHTML = message;
        notificationsEl.insertBefore(notif, notificationsEl.firstChild);
        setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => notif.remove(), 500); }, duration);
    };

    const savePlayerData = () => localStorage.setItem('tkd20PlayerData', JSON.stringify(playerData));

    const loadPlayerData = () => {
        let savedData;
        try {
            savedData = JSON.parse(localStorage.getItem('tkd20PlayerData'));
            if (savedData && savedData.activeUnits && !Array.isArray(savedData.activeUnits)) {
                savedData.activeUnits = [];
                savedData.unitInstanceCounter = 0;
            }
        } catch (error) {
            savedData = null;
        }

        playerData = savedData || {
            roles: { joukkueenjohtaja: true, komppanianpaallikko: false },
            kp: { joukkueenjohtaja: 3, komppanianpaallikko: 5 },
            activeUnits: [], notes: '', usedTacticalAbility: null,
            fireSupportMissions: [], usedGameAbilities: [],
            unitInstanceCounter: 0, turn: 1
        };

        if (!playerData.turn) playerData.turn = 1;
        unitInstanceCounter = playerData.unitInstanceCounter || 0;
    };

    const populatePlayerUnitTemplates = () => {
        if (!unitTemplatesContainer) return;
        unitTemplatesContainer.innerHTML = '';
        if (typeof window.blueUnitData === 'undefined') {
            console.error("Yksikködataa (window.blueUnitData) ei löydy. Varmista, että unit-data.js on ladattu ennen tätä skriptiä.");
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
        const parentDiv = btn.parentElement;
        const customNameInput = parentDiv.querySelector('.template-custom-name');
        const customName = customNameInput.value.trim();

        if (!customName) {
            showNotification('Anna yksikölle nimi ennen lisäämistä.', 'warning');
            customNameInput.focus();
            return;
        }
        const isNameTaken = playerData.activeUnits.some(unit => unit.name.toLowerCase() === customName.toLowerCase());
        if (isNameTaken) {
            showNotification(`Yksikkö nimellä "${customName}" on jo olemassa. Anna yksilöllinen nimi.`, 'warning');
            customNameInput.focus();
            return;
        }

        unitInstanceCounter++;
        const instanceId = `unit-${unitInstanceCounter}`;
        const newUnit = {
            instanceId,
            typeId,
            name: customName,
            typeName: template.name,
            tk: template.stats.tk, maxTk: template.stats.tk,
            tt: template.stats.tt, s: template.stats.s, m: template.stats.m, l: template.stats.l,
            status: 'Kunnossa', tookFirstHit: false,
            ammo: JSON.parse(JSON.stringify(template.ammo)),
            abilities: template.abilities,
            armament: template.armament
        };
        playerData.activeUnits.push(newUnit);
        playerData.unitInstanceCounter = unitInstanceCounter;
        showNotification(`Yksikkö "${customName}" lisätty.`);
        customNameInput.value = '';
        renderActiveUnits();
        savePlayerData();
    };

    const renderActiveUnits = () => {
        unitDisplayArea.innerHTML = '';
        if (!playerData.activeUnits || playerData.activeUnits.length === 0) {
            unitDisplayArea.innerHTML = '<p>Lisää yksiköitä "Lisää yksiköitä peliin" -osiosta.</p>';
            return;
        }
        playerData.activeUnits.forEach(unitState => {
            const cardDiv = document.createElement('div');
            cardDiv.id = `player-card-${unitState.instanceId}`;
            cardDiv.className = 'unit-card';

            let armamentHtml = '';
            if (unitState.armament && unitState.armament.length > 0) {
                armamentHtml = `
                    <h5>Aseistus</h5>
                    <table class="armament-table">
                        <thead>
                            <tr>
                                <th>Ase</th>
                                <th>Hyökkäys</th>
                                <th>Vahinko (TI)</th>
                                <th>Huom.</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${unitState.armament.map(w => `
                                <tr>
                                    <td>${w.name}</td>
                                    <td>${w.attack}</td>
                                    <td>${w.damage}</td>
                                    <td>${w.notes}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }

            let abilitiesHtml = '';
            if (unitState.abilities && unitState.abilities.length > 0) {
                abilitiesHtml = `
                    <h5>Kyvyt</h5>
                    <ul class="abilities-list">
                        ${unitState.abilities.map(a => {
                    const damagedEffectHtml = a.isDamagedEffect ? ' <span class="vaurioitunut-tila">(Vaurioitunut)</span>' : '';
                    return `<li><strong>${a.name}${damagedEffectHtml}:</strong> ${a.description}</li>`;
                }).join('')}
                    </ul>
                `;
            }

            cardDiv.innerHTML = `
                <h4>${unitState.name} <span class="unit-type-display">(${unitState.typeName})</span></h4>
                <div class="unit-card-content">
                    <div class="unit-stat-grid">
                        <div class="unit-stat tk-tracker">
                            <div class="label">Taistelukunto</div>
                            <div class="unit-tracker">
                                <button class="tk-btn tk-minus">-</button>
                                <span class="value tk-current">${unitState.tk}</span>
                                <button class="tk-btn tk-plus">+</button>
                            </div>
                        </div>
                        <div class="unit-stat"><div class="label">Tila</div><div class="value status-indicator status-${unitState.status.toLowerCase()}">${unitState.status}</div></div>
                        <div class="unit-stat"><div class="label">Suoja (S)</div><div class="value">${unitState.s}</div></div>
                        <div class="unit-stat"><div class="label">Moraali (M)</div><div class="value">${unitState.m}</div></div>
                        <div class="unit-stat"><div class="label">Taitotaso (TT)</div><div class="value">${unitState.tt}</div></div>
                        <div class="unit-stat"><div class="label">Liike (L)</div><div class="value">${unitState.l} cm</div></div>
                    </div>
                    <div class="unit-ammo-trackers"></div>
                    ${armamentHtml}
                    ${abilitiesHtml}
                    <button class="remove-unit-btn danger-button">Poista Yksikkö</button>
                </div>
            `;
            unitDisplayArea.appendChild(cardDiv);

            const ammoContainer = cardDiv.querySelector('.unit-ammo-trackers');
            if (Object.keys(unitState.ammo).length > 0) {
                Object.keys(unitState.ammo).forEach(weapon => {
                    const ammoTrackerEl = document.createElement('div');
                    ammoTrackerEl.className = 'ammo-tracker unit-tracker';
                    ammoTrackerEl.innerHTML = `<span>${weapon}: <strong class="ammo-count" data-weapon="${weapon}">${unitState.ammo[weapon]}</strong></span><button class="use-ammo-btn" data-weapon="${weapon}">Käytä</button>`;
                    ammoContainer.appendChild(ammoTrackerEl);
                    ammoTrackerEl.querySelector('button').addEventListener('click', () => useAmmo(unitState.instanceId, weapon));
                });
            }

            cardDiv.querySelector('.tk-minus').addEventListener('click', () => { const unit = playerData.activeUnits.find(u => u.instanceId === unitState.instanceId); if (unit && unit.tk > 0) updateUnitState(unitState.instanceId, unit.tk - 1, unit.maxTk); });
            cardDiv.querySelector('.tk-plus').addEventListener('click', () => { const unit = playerData.activeUnits.find(u => u.instanceId === unitState.instanceId); if (unit && unit.tk < unit.maxTk) updateUnitState(unitState.instanceId, unit.tk + 1, unit.maxTk); });
            cardDiv.querySelector('.remove-unit-btn').addEventListener('click', () => { playerData.activeUnits = playerData.activeUnits.filter(u => u.instanceId !== unitState.instanceId); renderActiveUnits(); savePlayerData(); });

            renderSingleUnit(unitState.instanceId);
        });
    };

    const updateUIFromLoadedData = () => {
        roleCheckboxes.forEach(c => { c.checked = !!playerData.roles[c.value] });
        document.getElementById('player-notes').value = playerData.notes || '';
        document.getElementById('player-turn-counter').textContent = playerData.turn;
        updateRole(true);
        renderActiveUnits();
        renderFireSupportMissions();
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
        kpTrackerJJ.container.style.display = playerData.roles.joukkueenjohtaja ? 'block' : 'none';
        kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja || 0;
        const isCommander = playerData.roles.komppanianpaallikko;
        kpTrackerKP.container.style.display = isCommander ? 'block' : 'none';
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
        showNotification(`Ei riittävästi komentopisteitä poolissa!`, 'warning');
        return false;
    };

    const updateUnitState = (instanceId, newTk, maxTk) => {
        const unit = playerData.activeUnits.find(u => u.instanceId === instanceId);
        if (!unit) return;
        unit.tk = newTk;
        const oldStatus = unit.status;
        const percentage = (newTk / maxTk) * 100;
        let newStatus = "Kunnossa";
        if (newTk <= 0) newStatus = "Tuhottu";
        else if (percentage <= 25) newStatus = "Lamautunut";
        else if (percentage <= 50) newStatus = "Vaurioitunut";
        unit.status = newStatus;
        if (newStatus !== oldStatus) {
            let effectText = '';
            if (newStatus === 'Vaurioitunut') effectText = 'Liike & Tuli-isku puolitettu.';
            if (newStatus === 'Lamautunut') effectText = 'Ei toimintoja, hyökkäykset saavat Edun.';
            showNotification(`<strong>${unit.name}</strong> tila muuttui: <strong>${newStatus}</strong>. ${effectText}`, 'warning');
        }
        if (newTk < maxTk && unit.tookFirstHit === false) {
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
            showNotification(`Ammus käytetty: <strong>${unit.name} / ${weaponName}</strong>. Jäljellä: ${unit.ammo[weaponName]}`, 'info');
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

    const renderSingleUnit = (instanceId) => {
        const unit = playerData.activeUnits.find(u => u.instanceId === instanceId);
        const card = document.getElementById(`player-card-${instanceId}`);
        if (!unit || !card) return;
        card.querySelector('.tk-current').textContent = unit.tk;
        const statusEl = card.querySelector('.status-indicator');
        statusEl.textContent = unit.status;
        statusEl.className = `status-indicator status-${unit.status.toLowerCase()}`;
        Object.keys(unit.ammo).forEach(weapon => {
            const ammoSpan = card.querySelector(`.ammo-count[data-weapon="${weapon}"]`);
            const useBtn = card.querySelector(`.use-ammo-btn[data-weapon="${weapon}"]`);
            if (ammoSpan) ammoSpan.textContent = unit.ammo[weapon];
            if (useBtn) useBtn.disabled = (unit.ammo[weapon] <= 0);
        });
        updateCommanderAbilityButtons();
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
                const indexToRemove = parseInt(e.target.dataset.index);
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
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPaneId = tab.dataset.tab; const targetPane = document.getElementById(targetPaneId);
            const currentActivePane = document.querySelector('.player-tab-pane.active');
            if (currentActivePane === targetPane) { return; }
            tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
            if (currentActivePane) { currentActivePane.classList.remove('is-visible'); }
            setTimeout(() => {
                if (currentActivePane) { currentActivePane.classList.remove('active'); }
                targetPane.classList.add('active');
                setTimeout(() => { targetPane.classList.add('is-visible'); }, 20);
            }, 300);
        });
    });
    const initialActiveTab = document.querySelector('.player-tab-button.active');
    if (initialActiveTab) { const initialPane = document.getElementById(initialActiveTab.dataset.tab); if (initialPane) { initialPane.classList.add('active'); initialPane.classList.add('is-visible'); } }

    roleCheckboxes.forEach(checkbox => checkbox.addEventListener('change', () => updateRole(false)));
    kpTrackerJJ.decBtn.addEventListener('click', () => { if (playerData.kp.joukkueenjohtaja > 0) { playerData.kp.joukkueenjohtaja--; kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja; savePlayerData(); } });
    kpTrackerJJ.incBtn.addEventListener('click', () => { playerData.kp.joukkueenjohtaja++; kpTrackerJJ.display.textContent = playerData.kp.joukkueenjohtaja; savePlayerData(); });
    kpTrackerKP.decBtn.addEventListener('click', () => { if (playerData.kp.komppanianpaallikko > 0) { playerData.kp.komppanianpaallikko--; kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko; savePlayerData(); } });
    kpTrackerKP.incBtn.addEventListener('click', () => { playerData.kp.komppanianpaallikko++; kpTrackerKP.display.textContent = playerData.kp.komppanianpaallikko; savePlayerData(); });
    document.getElementById('player-notes').addEventListener('input', (e) => { playerData.notes = e.target.value; savePlayerData(); });

    commandListGeneral.addEventListener('click', e => {
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
    commandListCommander.addEventListener('click', e => {
        if (e.target.classList.contains('command-btn') || e.target.classList.contains('ability-btn')) {
            const btn = e.target;
            const cost = parseInt(btn.dataset.cost);
            const pool = btn.dataset.pool;
            const abilityId = btn.dataset.abilityId || btn.id;
            const abilityType = btn.dataset.abilityType;
            const commandName = btn.closest('.command-list-item').querySelector('.command-name').textContent.trim();
            const poolName = 'komppanianpäällikön';
            if (abilityType === 'tactical') {
                if (playerData.usedTacticalAbility) {
                    showNotification('Voit käyttää vain yhden taktisen erikoiskyvyn per vuoro.', 'warning');
                    return;
                }
                if (handleKpSpending(pool, cost)) {
                    playerData.usedTacticalAbility = abilityId;
                    updateCommanderAbilityButtons();
                    const message = `Käytetty ${cost} KP ${poolName} taktiseen kykyyn "${commandName}".`;
                    showNotification(message, 'success');
                }
            } else if (abilityType === 'game') {
                if (playerData.usedGameAbilities.includes(abilityId)) {
                    showNotification('Tämä kyky on jo käytetty tässä pelissä.', 'warning');
                    return;
                }
                if (handleKpSpending(pool, cost)) {
                    playerData.usedGameAbilities.push(abilityId);
                    btn.disabled = true;
                    btn.textContent = `${btn.textContent.split('(')[0].trim()} (Käytetty)`;
                    const message = `Käytetty ${cost} KP ${poolName} erikoiskykyyn "${commandName}".`;
                    showNotification(message, 'success');
                    savePlayerData();
                }
            } else {
                if (handleKpSpending(pool, cost)) {
                    const message = `Käytetty ${cost} KP ${poolName} komentoon "${commandName}".`;
                    showNotification(message, 'success');
                }
            }
        }
    });

    document.getElementById('new-turn-button').addEventListener('click', () => {
        playerData.usedTacticalAbility = null;
        playerData.turn++;
        document.getElementById('player-turn-counter').textContent = playerData.turn;
        updateCommanderAbilityButtons();
        resetKpPools();
        showNotification(`Vuoro ${playerData.turn} alkoi! Taktiset kyvyt ja KP:t nollattu.`, 'success');
        savePlayerData();
    });

    const addMissionForm = document.getElementById('add-mission-form');
    if (addMissionForm) {
        addMissionForm.addEventListener('submit', handleAddMission);
    }

    document.getElementById('calculate-distance-player').addEventListener('click', () => { const input = document.getElementById('distance-input-player').value; const output = document.getElementById('distance-output-player'); if (input && !isNaN(input)) { const meters = input * 100; output.innerHTML = `<strong>${input} cm = ${meters} metriä.</strong>`; } else output.textContent = 'Syötä kelvollinen numero.'; });
    document.getElementById('calculate-liike-player').addEventListener('click', () => { const liike = parseFloat(document.getElementById('liike-arvo-player').value) || 0; const tie = parseFloat(document.getElementById('matka-tie-player').value) || 0; const pelto = parseFloat(document.getElementById('matka-pelto-player').value) || 0; const metsa = parseFloat(document.getElementById('matka-metsa-player').value) || 0; const tihea = parseFloat(document.getElementById('matka-tihea-metsa-player').value) || 0; const output = document.getElementById('liike-output-player'); if (liike <= 0) { output.textContent = 'Syötä liike-arvo.'; return; } const cost = (tie * 0.5) + (pelto * 1) + (metsa * 2) + (tihea * 3); const remaining = liike - cost; output.innerHTML = `Reitin kustannus: <strong>${cost.toFixed(1)}</strong>. Jäljelle jää: <strong>${remaining.toFixed(1)}</strong>.`; output.style.color = remaining >= 0 ? 'green' : 'red'; });

    // Nollausmodaalin logiikka
    const hideModal = () => { modalOverlay.classList.remove('is-visible'); modalContainer.classList.remove('is-visible'); resetConfirmInput.value = ''; resetConfirmBtn.disabled = true; };
    resetToolBtn.addEventListener('click', () => { modalOverlay.classList.add('is-visible'); modalContainer.classList.add('is-visible'); });
    resetCancelBtn.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', hideModal);
    resetConfirmInput.addEventListener('input', () => { resetConfirmBtn.disabled = resetConfirmInput.value !== 'RESET'; });
    resetConfirmBtn.addEventListener('click', () => { if (resetConfirmInput.value === 'RESET') { hideModal(); localStorage.removeItem('tkd20PlayerData'); location.reload(); } });

}); // PÄÄLOHKO LOPPUU