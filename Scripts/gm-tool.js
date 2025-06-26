/**
 * Taistelukenttä d20 - Pelinjohtajan työkalupakki.
 * Versio 6.0 - Täysin dynaaminen, yksityiskohtaiset kortit, duplikaattien esto ja keskitetty data.
 */
document.addEventListener('DOMContentLoaded', () => {
    const gmToolContainer = document.querySelector('.gm-tool-container');
    if (!gmToolContainer) return;

    // --- ELEMENTTIVIITTAUKSET ---
    const activeUnitListEl = document.getElementById('active-unit-list');
    const unitTemplatesContainer = document.getElementById('unit-templates-container');
    const phaseTitleEl = document.getElementById('phase-title');
    const phaseInstructionsEl = document.getElementById('phase-instructions');
    const phaseCounterEl = document.getElementById('phase-counter');
    const nextPhaseBtn = document.getElementById('next-phase-button');
    const prevPhaseBtn = document.getElementById('prev-phase-button');
    const turnCounterEl = document.getElementById('turn-counter');
    const kpPoolEl = document.getElementById('kp-pool');
    const notificationsEl = document.getElementById('gm-notifications');
    const resetToolBtn = document.getElementById('gm-reset-tool-button');
    const modalOverlay = document.getElementById('gm-modal-overlay');
    const modalContainer = document.getElementById('gm-modal-container');
    const resetCancelBtn = document.getElementById('gm-reset-cancel-button');
    const resetConfirmBtn = document.getElementById('gm-reset-confirm-button');
    const resetConfirmInput = document.getElementById('gm-reset-confirm-input');
    const tacticalAdviceEl = document.getElementById('gm-tactical-advice');
    const moraleCheckListEl = document.getElementById('morale-check-list');
    const secretNotesEl = document.getElementById('gm-secret-notes');

    // --- MUUTTUJAT ---
    let gmData = {};
    let unitInstanceCounter = 0;
    const phases = [
        { name: "Liikevaihe", checklist: ["Siirrä Sinisen puolen yksiköt.", "Siirrä Punaisen puolen yksiköt sääntöjen ja doktriinin mukaisesti.", "Tarkista reaktiotuli ja varotoimenpiteet liikkeen aikana."] },
        { name: "Tiedusteluvaihe", checklist: ["Suorita Sinisen puolen tiedusteluheitot.", "Onnistuiko tiedustelu? Paljasta Punaisen yksiköitä ('?'-merkit) tarvittaessa.", "Suorita Punaisen puolen tiedustelu ja päivitä sodan sumua."] },
        { name: "Komentovaihe", checklist: ['Laske Punaisen KP-pooli: <input type="number" id="kp-calc-groups" min="0" style="width: 50px;"> Taisteluryhmää <button id="kp-calc-btn">Laske</button>', "Jaa Komentopisteet Sinisen puolen johtajille.", "Anna komennot ja aktivoi kyvyt (esim. Punaisen 'Aaltohyökkäys').", "Suunnittele ja ilmoita tulitukipyynnöt."] },
        { name: "Tulitoimintavaihe", checklist: ["Suorita kaikki ilmoitetut tulitoiminnot (suora tuli, epäsuora tuli).", "Heitä osumat ja vahingot.", "Päivitä osuman saaneiden yksiköiden tila (Vaurioitunut, Lamautunut, Tuhottu) Yksiköt-välilehdellä."] },
        { name: "Tilannevaihe", checklist: ["Suorita vaaditut Moraalitestit kaikille yksiköille, jotka kärsivät tappioita tai olivat lähellä tuhoutuneita yksiköitä.", "Tyhjennä moraalitestilista.", "Tarkista skenaarion tavoitteiden tilanne.", "Päivitä Voittopisteet (VP) molemmille osapuolille.", "Poista vuoron loppuun kestävät vaikutukset."] }
    ];
    let currentPhaseIndex = -1;
    let battleGroupKpUsage = {};

    // --- YLEISET FUNKTIOT ---
    const showNotification = (message, type = 'info', duration = 5000) => {
        const notif = document.createElement('div');
        notif.className = `gm-notification is-${type}`;
        notif.textContent = message;
        notificationsEl.appendChild(notif);
        setTimeout(() => { notif.classList.add('is-hidden'); setTimeout(() => notif.remove(), 500); }, duration);
    };

    const saveData = () => {
        // Tallennetaan kaikki tiedot yhteen gmData-objektiin
        gmData.turn = turnCounterEl.textContent;
        gmData.currentPhaseIndex = currentPhaseIndex;
        gmData.kp = kpPoolEl.textContent;
        gmData.blueVp = document.getElementById('blue-vp').textContent;
        gmData.redVp = document.getElementById('red-vp').textContent;
        gmData.notes = document.getElementById('gm-notes').value;
        gmData.secretNotes = secretNotesEl.value;
        gmData.unitInstanceCounter = unitInstanceCounter;
        gmData.battleGroupKpUsage = battleGroupKpUsage;
        gmData.moraleCheckListHTML = moraleCheckListEl.innerHTML;
        // Listojen tallennus
        gmData.fireSupport = Array.from(document.querySelectorAll('#firesupport-list li')).map(el => ({ desc: el.querySelector('.gm-unit-name').textContent, turn: el.querySelector('span:not(.gm-unit-name)').textContent.replace('Saapuu vuorolla: ', '') }));
        gmData.undetectedUnits = Array.from(document.querySelectorAll('#undetected-list li')).map(el => ({ desc: el.querySelector('span').textContent }));
        gmData.reinforcements = Array.from(document.querySelectorAll('#reinforcement-list li')).map(el => ({ desc: el.querySelector('.gm-unit-name').textContent, turn: el.querySelector('span:not(.gm-unit-name)').textContent.replace('Saapuu vuorolla: ', '') }));

        localStorage.setItem('gmToolData', JSON.stringify(gmData));
    };

    const loadData = () => {
        const savedData = JSON.parse(localStorage.getItem('gmToolData'));
        gmData = savedData || {
            turn: 1, currentPhaseIndex: -1, kp: 0, blueVp: 0, redVp: 0, notes: '', secretNotes: '',
            unitInstanceCounter: 0, battleGroupKpUsage: {},
            moraleCheckListHTML: '<li>Ei yksiköitä, jotka vaativat testin.</li>',
            activeUnits: [], fireSupport: [], undetectedUnits: [], reinforcements: []
        };
        unitInstanceCounter = gmData.unitInstanceCounter || 0;
        battleGroupKpUsage = gmData.battleGroupKpUsage || {};
        updateUIFromLoadedData();
    };

    const updateUIFromLoadedData = () => {
        turnCounterEl.textContent = gmData.turn;
        currentPhaseIndex = gmData.currentPhaseIndex;
        kpPoolEl.textContent = gmData.kp;
        document.getElementById('blue-vp').textContent = gmData.blueVp;
        document.getElementById('red-vp').textContent = gmData.redVp;
        document.getElementById('gm-notes').value = gmData.notes;
        secretNotesEl.value = gmData.secretNotes;
        moraleCheckListEl.innerHTML = gmData.moraleCheckListHTML;

        renderList('firesupport', gmData.fireSupport || []);
        renderList('undetected', gmData.undetectedUnits || []);
        renderList('reinforcement', gmData.reinforcements || []);
        renderActiveUnits();
        updatePhaseView();
    };

    // --- YKSIKÖIDEN HALLINTA ---
    const populateUnitTemplates = () => {
        const container = document.getElementById('unit-templates-container');
        if (!container || typeof window.redUnitData === 'undefined') {
            console.error("Punaisten yksiköiden datalähdettä ei löytynyt.");
            return;
        }
        container.innerHTML = '';
        for (const typeId in window.redUnitData) {
            const template = window.redUnitData[typeId];
            const templateDiv = document.createElement('div');
            templateDiv.className = 'gm-unit-template';
            templateDiv.innerHTML = `
            <span class="template-name">${template.name} (TK: ${template.stats.tk})</span>
            <div class="template-controls">
                <input type="text" class="template-custom-name" placeholder="Anna yksilöllinen nimi/tunnus...">
                <button class="template-add-btn" data-type-id="${typeId}">Lisää</button>
            </div>`;
            container.appendChild(templateDiv);
        }
        unitTemplatesContainer.querySelectorAll('.template-add-btn').forEach(btn => {
            btn.addEventListener('click', addUnitToList);
        });
    };

    const addUnitToList = (event) => {
        const btn = event.target;
        const typeId = btn.dataset.typeId;
        const template = window.redUnitData[typeId];
        const parentDiv = btn.closest('.gm-unit-template');
        const nameInput = parentDiv.querySelector('.template-custom-name');
        const uniqueName = nameInput.value.trim();

        if (!uniqueName) {
            showNotification('Anna yksikölle nimi/tunnus ennen lisäämistä.', 'warning');
            nameInput.focus();
            return;
        }

        const isNameTaken = gmData.activeUnits.some(unit => unit.name.toLowerCase() === uniqueName.toLowerCase());
        if (isNameTaken) {
            showNotification(`Yksikkö nimellä "${uniqueName}" on jo olemassa. Anna yksilöllinen nimi.`, 'warning');
            nameInput.focus();
            return;
        }

        unitInstanceCounter++;
        const instanceId = `gm-unit-${unitInstanceCounter}`;
        const newUnit = {
            instanceId,
            typeId,
            name: uniqueName,
            groupId: uniqueName.toUpperCase(), // Käytetään annettua nimeä myös ryhmätunnuksena
            tk: template.stats.tk,
            maxTk: template.stats.tk,
            status: 'Kunnossa',
            tookFirstHit: false
        };
        gmData.activeUnits.push(newUnit);
        gmData.unitInstanceCounter = unitInstanceCounter;

        showNotification(`Yksikkö "${uniqueName}" lisätty.`);
        nameInput.value = ''; // Tyhjennetään kenttä onnistuneen lisäyksen jälkeen
        renderActiveUnits();
        saveData();
    };

    const renderActiveUnits = () => {
        activeUnitListEl.innerHTML = '';
        if (!gmData.activeUnits || gmData.activeUnits.length === 0) return;

        gmData.activeUnits.forEach(unitData => {
            const template = window.redUnitData[unitData.typeId];
            if (!template) {
                console.error(`Templaattia ei löytynyt tyypille: ${unitData.typeId}`);
                return;
            }

            const cardDiv = document.createElement('div');
            cardDiv.id = unitData.instanceId;
            cardDiv.className = 'gm-unit-active-item';

            const abilitiesHtml = template.abilities.map(a => `<li><strong>${a.name}${a.isDamagedEffect ? ' <span class="vaurioitunut-tila">(Vaurioitunut)</span>' : ''}:</strong> ${a.description}</li>`).join('');
            const armamentHtml = template.armament.map(w => `<tr><td>${w.name}</td><td>${w.attack}</td><td>${w.damage}</td><td>${w.notes}</td></tr>`).join('');

            cardDiv.innerHTML = `
                <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h4 style="margin:0; font-size: 1.2em;">${unitData.name} <span style="font-size:0.8em; color: #57534e;">(${template.name})</span></h4>
                        <span class="gm-unit-group">${unitData.groupId || 'Ei ryhmää'}</span>
                    </div>
                    <div class="gm-unit-tk-tracker">
                        <button class="tk-btn tk-minus">-</button>
                        <span class="tk-current">${unitData.tk}</span>
                        <span class="tk-max">/ ${unitData.maxTk} TK</span>
                        <button class="tk-btn tk-plus">+</button>
                    </div>
                    <select class="gm-unit-status-select">
                        <option value="Kunnossa">Kunnossa</option>
                        <option value="Vaurioitunut">Vaurioitunut</option>
                        <option value="Lamautunut">Lamautunut</option>
                        <option value="Tuhottu">Tuhottu</option>
                    </select>
                </div>
                <div class="unit-stat-grid" style="grid-column: 1 / -1;">
                     <div class="unit-stat"><div class="label">Suoja (S)</div><div class="value">${template.stats.s}</div></div>
                     <div class="unit-stat"><div class="label">Moraali (M)</div><div class="value">${template.stats.m}</div></div>
                     <div class="unit-stat"><div class="label">Taitotaso (TT)</div><div class="value">${template.stats.tt}</div></div>
                     <div class="unit-stat"><div class="label">Liike (L)</div><div class="value">${template.stats.l}</div></div>
                </div>
                <div style="grid-column: 1 / -1;">
                    <h5>Aseistus</h5>
                    <div class="table-container"><table class="armament-table"><thead><tr><th>Ase</th><th>Hyökkäys</th><th>Vahinko</th><th>Huom.</th></tr></thead><tbody>${armamentHtml}</tbody></table></div>
                    <h5>Kyvyt</h5>
                    <ul class="abilities-list">${abilitiesHtml}</ul>
                    <button class="gm-delete-button danger-button">Poista Yksikkö</button>
                </div>
            `;
            activeUnitListEl.appendChild(cardDiv);
            cardDiv.querySelector('.gm-unit-status-select').value = unitData.status;

            const tkDisplay = cardDiv.querySelector('.tk-current');
            cardDiv.querySelector('.tk-minus').addEventListener('click', () => {
                const unit = gmData.activeUnits.find(u => u.instanceId === unitData.instanceId);
                if (unit && unit.tk > 0) {
                    if (unit.tk === unit.maxTk) addUnitToMoraleCheck(unit.name);
                    unit.tk--;
                    updateUnitStatus(cardDiv, unit.tk, unit.maxTk);
                    tkDisplay.textContent = unit.tk;
                    saveData();
                }
            });
            cardDiv.querySelector('.tk-plus').addEventListener('click', () => {
                const unit = gmData.activeUnits.find(u => u.instanceId === unitData.instanceId);
                if (unit && unit.tk < unit.maxTk) {
                    unit.tk++;
                    updateUnitStatus(cardDiv, unit.tk, unit.maxTk);
                    tkDisplay.textContent = unit.tk;
                    saveData();
                }
            });
            cardDiv.querySelector('.gm-unit-status-select').addEventListener('change', (e) => {
                const unit = gmData.activeUnits.find(u => u.instanceId === unitData.instanceId);
                if (unit) { unit.status = e.target.value; saveData(); }
            });
            cardDiv.querySelector('.gm-delete-button').addEventListener('click', () => {
                gmData.activeUnits = gmData.activeUnits.filter(u => u.instanceId !== unitData.instanceId);
                renderActiveUnits();
                saveData();
            });
        });
    };

    const updateUnitStatus = (unitElement, currentTk, maxTk) => {
        const statusSelect = unitElement.querySelector('.gm-unit-status-select');
        const percentage = (currentTk / maxTk) * 100;
        let newStatus = "Kunnossa";
        if (currentTk <= 0) newStatus = "Tuhottu";
        else if (percentage <= 25) newStatus = "Lamautunut";
        else if (percentage <= 50) newStatus = "Vaurioitunut";
        if (statusSelect.value !== newStatus) {
            statusSelect.value = newStatus;
            const unitName = unitElement.querySelector('h4').textContent.split('(')[0].trim();
            showNotification(`${unitName} tila muuttui: ${newStatus}`, 'warning');
            if (newStatus !== "Kunnossa") addUnitToMoraleCheck(unitName);
        }
    };

    // --- MUUT APUFUNKTIOT JA TAPAHTUMANKUUNTELIJAT ---
    const addToList = (type, desc, turn) => {
        if (!desc.trim()) return;
        let listEl, content;
        switch (type) {
            case 'firesupport': listEl = document.getElementById('firesupport-list'); content = `<span class="gm-unit-name">${desc}</span><span>Saapuu vuorolla: ${turn}</span><button class="gm-delete-button">X</button>`; break;
            case 'undetected': listEl = document.getElementById('undetected-list'); content = `<span>${desc}</span><button class="reveal-button">Paljasta</button><button class="gm-delete-button">X</button>`; break;
            case 'reinforcement': listEl = document.getElementById('reinforcement-list'); content = `<span class="gm-unit-name">${desc}</span><span>Saapuu vuorolla: ${turn}</span><button class="gm-delete-button">X</button>`; break;
        }
        const li = document.createElement('li');
        li.innerHTML = content;
        listEl.appendChild(li);
        li.querySelector('.gm-delete-button').addEventListener('click', () => { li.remove(); saveData(); });
        if (type === 'undetected') li.querySelector('.reveal-button').addEventListener('click', () => { showNotification(`Yksikkö "${desc}" paljastettu. Lisää se manuaalisesti Yksiköt-välilehdeltä.`); li.remove(); saveData(); });
        saveData();
    };

    const renderList = (type, items) => {
        const listId = `${type}-list`;
        const listEl = document.getElementById(listId);
        if (!listEl) return;
        listEl.innerHTML = '';
        items.forEach(item => addToList(type, item.desc, item.turn));
    };

    // (Phase tracker, counter setup, etc. from the original file)
    const updatePhaseView = () => { if (currentPhaseIndex === -1) { phaseTitleEl.textContent = "Peli ei ole alkanut"; phaseInstructionsEl.innerHTML = "<p>Aloita peli painamalla \"Seuraava Vaihe\".</p>"; phaseCounterEl.textContent = `Vaihe 0/${phases.length}`; prevPhaseBtn.disabled = true } else { const e = phases[currentPhaseIndex]; phaseTitleEl.textContent = `${e.name} (Vuoro ${turnCounterEl.textContent})`; let t = "<ul>"; e.checklist.forEach((e, o) => { const a = `phase${currentPhaseIndex}-item${o}`; t += `<li><input type="checkbox" id="${a}"><label for="${a}">${e}</label></li>` }), t += "</ul>", phaseInstructionsEl.innerHTML = t, e.name === "Komentovaihe" ? document.getElementById("kp-calc-btn")?.addEventListener("click", () => { const e = parseInt(document.getElementById("kp-calc-groups").value) || 0; kpPoolEl.textContent = 3 * e, showNotification(`Komentopisteet päivitetty: ${kpPoolEl.textContent} KP`), saveData() }) : e.name === "Tulitoimintavaihe" ? checkFireSupportArrival() : e.name === "Tilannevaihe" && (() => { const e = document.createElement("button"); e.textContent = "Tyhjennä moraalitestilista", e.style.marginTop = "1rem", e.addEventListener("click", () => { moraleCheckListEl.innerHTML = "<li>Ei yksiköitä, jotka vaativat testin.</li>", saveData() }), phaseInstructionsEl.appendChild(e) })(), phaseCounterEl.textContent = `Vaihe ${currentPhaseIndex + 1}/${phases.length}`, prevPhaseBtn.disabled = currentPhaseIndex === 0 && parseInt(turnCounterEl.textContent) === 1 } updateTacticalAdvice(), saveData() }, checkFireSupportArrival = () => { const e = turnCounterEl.textContent, t = gmData.fireSupport || []; t.forEach(t => { t.turn === e && showNotification(`TULITUKI SAAPUU: ${t.desc}`, "warning") }) }, addUnitToMoraleCheck = e => { let t = !1; moraleCheckListEl.querySelectorAll("li").forEach(o => { o.textContent === e && (t = !0) }), t || (moraleCheckListEl.querySelectorAll("li").length === 1 && moraleCheckListEl.querySelectorAll("li")[0].textContent.includes("Ei yksiköitä") && (moraleCheckListEl.innerHTML = ""), (() => { const t = document.createElement("li"); t.textContent = e, moraleCheckListEl.appendChild(t) })(), showNotification(`${e} vaatii moraalitestin!`, "warning"), saveData()) };
    nextPhaseBtn.addEventListener('click', () => { currentPhaseIndex++, currentPhaseIndex >= phases.length && (currentPhaseIndex = 0, turnCounterEl.textContent = parseInt(turnCounterEl.textContent) + 1, battleGroupKpUsage = {}), updatePhaseView() });
    prevPhaseBtn.addEventListener('click', () => { currentPhaseIndex === 0 && parseInt(turnCounterEl.textContent) > 1 ? (currentPhaseIndex = phases.length - 1, turnCounterEl.textContent = parseInt(turnCounterEl.textContent) - 1) : currentPhaseIndex > 0 && currentPhaseIndex--, updatePhaseView() });
    const setupCounter = (e) => { const t = document.getElementById(`${e}-decrement`), o = document.getElementById(`${e}-increment`), a = document.getElementById(e); t.addEventListener("click", () => { let t = parseInt(a.textContent); t > 0 && (a.textContent = t - 1), saveData() }), o.addEventListener("click", () => { a.textContent = parseInt(a.textContent) + 1, saveData() }) };
    ['turn-counter', 'kp-pool', 'blue-vp', 'red-vp'].forEach(setupCounter);
    const tabs = document.querySelectorAll(".gm-tab-button"), tabPanes = document.querySelectorAll(".gm-tab-pane"); tabs.forEach(e => { e.addEventListener("click", () => { tabs.forEach(e => e.classList.remove("active")), tabPanes.forEach(e => e.classList.remove("active")), e.classList.add("active"), document.getElementById(e.dataset.tab).classList.add("active") }) });
    document.getElementById('add-firesupport-button').addEventListener('click', () => { const e = document.getElementById('firesupport-desc-input'), t = document.getElementById('firesupport-turn-input'); e.value.trim() && t.value.trim() && addToList('firesupport', e.value, t.value), e.value = "", t.value = "" });
    document.getElementById('add-undetected-button').addEventListener('click', () => { const e = document.getElementById('undetected-desc-input'); e.value.trim() && addToList('undetected', e.value), e.value = "" });
    document.getElementById('add-reinforcement-button').addEventListener('click', () => { const e = document.getElementById('reinforcement-desc-input'), t = document.getElementById('reinforcement-turn-input'); e.value.trim() && t.value.trim() && addToList('reinforcement', e.value, t.value), e.value = "", t.value = "" });
    let notesTimeout; document.getElementById('gm-notes').addEventListener('keyup', () => { clearTimeout(notesTimeout); notesTimeout = setTimeout(saveData, 500) });
    secretNotesEl.addEventListener('keyup', () => { clearTimeout(notesTimeout); notesTimeout = setTimeout(saveData, 500); });
    const hideModal = () => { modalOverlay.classList.remove("is-visible"), modalContainer.classList.remove("is-visible"), resetConfirmInput.value = "", resetConfirmBtn.disabled = !0 };
    resetToolBtn.addEventListener("click", () => { modalOverlay.classList.add("is-visible"), modalContainer.classList.add("is-visible") });
    resetCancelBtn.addEventListener("click", hideModal); modalOverlay.addEventListener("click", hideModal);
    resetConfirmInput.addEventListener("input", () => { resetConfirmBtn.disabled = resetConfirmInput.value !== "RESET" });
    resetConfirmBtn.addEventListener("click", () => { if (resetConfirmInput.value === "RESET") { hideModal(); localStorage.removeItem("gmToolData"); location.reload() } });

    // --- KÄYNNISTYS ---
    populateUnitTemplates();
    loadData();
});