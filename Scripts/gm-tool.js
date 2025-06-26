/**
 * Taistelukenttä d20 - Pelinjohtajan työkalupakki.
 * Versio 4.1 - Tarkennuksia moraalitesteihin ja tulituen ajoitukseen.
 */
document.addEventListener('DOMContentLoaded', () => {
    const gmToolContainer = document.querySelector('.gm-tool-container');
    if (!gmToolContainer) return;

    // --- OSA 1: YKSIKKÖMALLIT ---
    const redUnitTemplates = [
        { name: "Motorisoitu jalkaväkiryhmä", maxTk: 10 },
        { name: "Kranaatinheitinryhmä", maxTk: 8 },
        { name: "BTR-82A", maxTk: 25 },
        { name: "T-72B3", maxTk: 40 }
    ];
    let unitCounter = 0;

    // --- OSA 2: VUORON VAIHEET ---
    const phases = [
        { name: "Liikevaihe", checklist: ["Siirrä Sinisen puolen yksiköt.", "Siirrä Punaisen puolen yksiköt sääntöjen ja doktriinin mukaisesti.", "Tarkista reaktiotuli ja varotoimenpiteet liikkeen aikana."] },
        { name: "Tiedusteluvaihe", checklist: ["Suorita Sinisen puolen tiedusteluheitot.", "Onnistuiko tiedustelu? Paljasta Punaisen yksiköitä ('?'-merkit) tarvittaessa.", "Suorita Punaisen puolen tiedustelu ja päivitä sodan sumua."] },
        { name: "Komentovaihe", checklist: ['Laske Punaisen KP-pooli: <input type="number" id="kp-calc-groups" min="0" style="width: 50px;"> Taisteluryhmää <button id="kp-calc-btn">Laske</button>', "Jaa Komentopisteet Sinisen puolen johtajille.", "Anna komennot ja aktivoi kyvyt (esim. Punaisen 'Aaltohyökkäys').", "Suunnittele ja ilmoita tulitukipyynnöt."] },
        { name: "Tulitoimintavaihe", checklist: ["Suorita kaikki ilmoitetut tulitoiminnot (suora tuli, epäsuora tuli).", "Heitä osumat ja vahingot.", "Päivitä osuman saaneiden yksiköiden tila (Vaurioitunut, Lamautunut, Tuhottu) Yksiköt-välilehdellä."] },
        { name: "Tilannevaihe", checklist: ["Suorita vaaditut Moraalitestit kaikille yksiköille, jotka kärsivät tappioita tai olivat lähellä tuhoutuneita yksiköitä.", "Tyhjennä moraalitestilista.", "Tarkista skenaarion tavoitteiden tilanne.", "Päivitä Voittopisteet (VP) molemmille osapuolille.", "Poista vuoron loppuun kestävät vaikutukset."] }
    ];
    let currentPhaseIndex = -1;
    let battleGroupKpUsage = {};

    // --- ELEMENTTIVIITTAUKSET ---
    // (Olemassa olevat viittaukset pysyvät samoina)
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

    // --- OSA 3: KESKEISET FUNKTIOT ---
    const showNotification = (message, type = 'info', duration = 5000) => {
        const notif = document.createElement('div');
        notif.className = `gm-notification is-${type}`;
        notif.textContent = message;
        notificationsEl.appendChild(notif);
        setTimeout(() => { notif.classList.add('is-hidden'); setTimeout(() => notif.remove(), 500); }, duration);
    };

    const updateTacticalAdvice = () => {
        tacticalAdviceEl.innerHTML = '';
        if (currentPhaseIndex === -1) return;
        const phaseName = phases[currentPhaseIndex].name;
        let advice = '';
        if (phaseName === "Komentovaihe") advice = `<strong>Doktriinivinkki:</strong> Muista Punaisen doktriini! Käytä KP:t aggressiivisesti "Hyökkäyskäskyyn" ja "Tulen Keskittämiseen" paineen ylläpitämiseksi.`;
        else if (phaseName === "Liikevaihe") advice = `<strong>Doktriinivinkki:</strong> Käytä ajoneuvoja kärkijoukkoina murtamaan linjoja ja tarjoamaan suojaa jalkaväelle. Massa on valttia!`;
        const reinforcements = JSON.parse(localStorage.getItem('gmToolData'))?.reinforcements || [];
        const currentTurn = parseInt(turnCounterEl.textContent);
        const arrivingReinforcements = reinforcements.find(r => parseInt(r.turn) === currentTurn);
        if (arrivingReinforcements) advice += `<br><strong>Vahvistusmuistutus:</strong> ${arrivingReinforcements.desc} saapuu tällä vuorolla!`;
        tacticalAdviceEl.innerHTML = advice;
        tacticalAdviceEl.style.display = advice ? 'block' : 'none';
    };

    // MUOKATTU: Estää duplikaatit moraalitestilistalla
    const addUnitToMoraleCheck = (unitName) => {
        let alreadyExists = false;
        moraleCheckListEl.querySelectorAll('li').forEach(li => {
            if (li.textContent === unitName) alreadyExists = true;
        });

        if (alreadyExists) return; // Älä lisää, jos on jo listalla

        const existingItems = moraleCheckListEl.querySelectorAll('li');
        if (existingItems.length === 1 && existingItems[0].textContent.includes('Ei yksiköitä')) {
            moraleCheckListEl.innerHTML = '';
        }
        const li = document.createElement('li');
        li.textContent = unitName;
        moraleCheckListEl.appendChild(li);
        showNotification(`${unitName} vaatii moraalitestin!`, 'warning');
        saveData();
    };

    const trackKpUsage = (groupId, amount = 1) => {
        if (!groupId || groupId.trim() === '') return;
        if (!battleGroupKpUsage[groupId]) battleGroupKpUsage[groupId] = 0;
        battleGroupKpUsage[groupId] += amount;
        if (battleGroupKpUsage[groupId] > 4) showNotification(`Varoitus: Taisteluryhmään ${groupId} on käytetty ${battleGroupKpUsage[groupId]} KP tällä vuorolla (max 4).`, 'warning', 8000);
        saveData();
    };

    // UUSI: Funktio tulituen saapumisen tarkistamiseen
    const checkFireSupportArrival = () => {
        const currentTurn = turnCounterEl.textContent;
        const fireSupportItems = JSON.parse(localStorage.getItem('gmToolData'))?.fireSupport || [];
        fireSupportItems.forEach(fs => {
            if (fs.turn === currentTurn) {
                showNotification(`TULITUKI SAAPUU: ${fs.desc}`, 'warning');
            }
        });
    };

    // MUOKATTU: Kutsuu tulitukitarkistusta oikeassa vaiheessa
    const updatePhaseView = () => {
        if (currentPhaseIndex === -1) {
            phaseTitleEl.textContent = "Peli ei ole alkanut";
            phaseInstructionsEl.innerHTML = `<p>Aloita peli painamalla "Seuraava Vaihe".</p>`;
            phaseCounterEl.textContent = `Vaihe 0/${phases.length}`;
            prevPhaseBtn.disabled = true;
        } else {
            const phase = phases[currentPhaseIndex];
            phaseTitleEl.textContent = `${phase.name} (Vuoro ${turnCounterEl.textContent})`;
            let checklistHTML = '<ul>';
            phase.checklist.forEach((item, index) => {
                const checkboxId = `phase${currentPhaseIndex}-item${index}`;
                checklistHTML += `<li><input type="checkbox" id="${checkboxId}"><label for="${checkboxId}">${item}</label></li>`;
            });
            checklistHTML += '</ul>';
            phaseInstructionsEl.innerHTML = checklistHTML;

            // Suoritetaan vaihekohtaiset toiminnot
            if (phase.name === "Komentovaihe") {
                document.getElementById('kp-calc-btn')?.addEventListener('click', () => {
                    const groups = parseInt(document.getElementById('kp-calc-groups').value) || 0;
                    kpPoolEl.textContent = groups * 3;
                    showNotification(`Komentopisteet päivitetty: ${kpPoolEl.textContent} KP`);
                    saveData();
                });
            } else if (phase.name === "Tulitoimintavaihe") {
                // TÄMÄ ON UUSI KOHTA: Tarkista tulituki tässä vaiheessa
                checkFireSupportArrival();
            } else if (phase.name === "Tilannevaihe") {
                const clearMoraleButton = document.createElement('button');
                clearMoraleButton.textContent = "Tyhjennä moraalitestilista";
                clearMoraleButton.style.marginTop = "1rem";
                clearMoraleButton.addEventListener('click', () => {
                    moraleCheckListEl.innerHTML = '<li>Ei yksiköitä, jotka vaativat testin.</li>';
                    saveData();
                });
                phaseInstructionsEl.appendChild(clearMoraleButton);
            }
            phaseCounterEl.textContent = `Vaihe ${currentPhaseIndex + 1}/${phases.length}`;
            prevPhaseBtn.disabled = (currentPhaseIndex === 0 && parseInt(turnCounterEl.textContent) === 1);
        }
        updateTacticalAdvice();
        saveData();
    };

    const updateUnitStatus = (unitElement, currentTk, maxTk) => {
        const statusSelect = unitElement.querySelector('.gm-unit-status-select');
        const oldStatus = statusSelect.value;
        const percentage = (currentTk / maxTk) * 100;
        let newStatus = "Kunnossa";
        if (currentTk <= 0) newStatus = "Tuhottu";
        else if (percentage <= 25) newStatus = "Lamautunut";
        else if (percentage <= 50) newStatus = "Vaurioitunut";

        if (statusSelect.value !== newStatus) {
            statusSelect.value = newStatus;
            const unitName = unitElement.querySelector('.gm-unit-name').textContent;
            showNotification(`${unitName} tila muuttui: ${newStatus}`, 'warning');
            if (newStatus === "Vaurioitunut" || newStatus === "Lamautunut" || newStatus === "Tuhottu") {
                addUnitToMoraleCheck(unitName);
            }
        }
    };

    // TÄSTÄ FUNKTIOSTA MUOKATAAN VAIN YKSI RIVI
    const addUnitToList = (unitTemplate, count, groupId) => {
        for (let i = 0; i < count; i++) {
            unitCounter++;
            const unitDiv = document.createElement('div');
            unitDiv.className = 'gm-unit-active-item';
            unitDiv.dataset.maxTk = unitTemplate.maxTk;
            unitDiv.dataset.groupId = groupId;
            let currentTk = unitTemplate.maxTk;
            unitDiv.innerHTML = `
                <div>
                  <span class="gm-unit-name">${unitTemplate.name} ${unitCounter}</span>
                  <span class="gm-unit-group">${groupId || 'Ei ryhmää'}</span>
                </div>
                <div class="gm-unit-tk-tracker">
                    <button class="tk-btn tk-minus">-</button>
                    <span class="tk-current">${currentTk}</span>
                    <span class="tk-max">/ ${unitTemplate.maxTk} TK</span>
                    <button class="tk-btn tk-plus">+</button>
                </div>
                <select class="gm-unit-status-select">
                    <option value="Kunnossa">Kunnossa</option>
                    <option value="Vaurioitunut">Vaurioitunut</option>
                    <option value="Lamautunut">Lamautunut</option>
                    <option value="Tuhottu">Tuhottu</option>
                </select>
                <button class="gm-delete-button">X</button>`;
            document.getElementById('active-unit-list').appendChild(unitDiv);

            const tkDisplay = unitDiv.querySelector('.tk-current');
            const maxTk = unitTemplate.maxTk;
            const unitName = unitDiv.querySelector('.gm-unit-name').textContent;

            // MUOKATTU: TK:n vähennyksen käsittelijä
            unitDiv.querySelector('.tk-minus').addEventListener('click', () => {
                let oldTk = parseInt(tkDisplay.textContent);
                if (oldTk > 0) {
                    tkDisplay.textContent = oldTk - 1;
                    // TÄMÄ ON UUSI EHTO: Jos TK oli täysi, vaadi moraalitesti.
                    if (oldTk === maxTk) {
                        addUnitToMoraleCheck(unitName);
                    }
                    updateUnitStatus(unitDiv, oldTk - 1, maxTk);
                    saveData();
                }
            });
            unitDiv.querySelector('.tk-plus').addEventListener('click', () => {
                let tk = parseInt(tkDisplay.textContent);
                if (tk < maxTk) {
                    tkDisplay.textContent = tk + 1;
                    updateUnitStatus(unitDiv, tk + 1, maxTk);
                    saveData();
                }
            });

            unitDiv.querySelector('.gm-delete-button').addEventListener('click', () => { unitDiv.remove(); saveData(); });
            unitDiv.querySelector('.gm-unit-status-select').addEventListener('change', saveData);
        }
        showNotification(`${count} x ${unitTemplate.name} lisätty ryhmään ${groupId || 'Ei ryhmää'}.`);
        saveData();
    };

    const populateUnitTemplates = () => {
        const container = document.getElementById('unit-templates-container');
        container.innerHTML = '';
        redUnitTemplates.forEach(template => {
            const templateDiv = document.createElement('div');
            templateDiv.className = 'gm-unit-template';
            templateDiv.innerHTML = `
                <span class="template-name">${template.name} (TK: ${template.maxTk})</span>
                <div class="template-controls">
                    <input type="text" class="template-group-id" placeholder="Ryhmä ID">
                    <input type="number" value="1" min="1" class="template-add-count">
                    <button class="template-add-btn">Lisää</button>
                </div>`;
            container.appendChild(templateDiv);
            templateDiv.querySelector('.template-add-btn').addEventListener('click', () => {
                const count = parseInt(templateDiv.querySelector('.template-add-count').value);
                const groupId = templateDiv.querySelector('.template-group-id').value.trim().toUpperCase();
                addUnitToList(template, count, groupId);
            });
        });
    };

    // --- OSA 4: TALLENNUS JA LATAUS (LAAJENNETTU) ---
    const saveData = () => {
        const data = {
            turn: turnCounterEl.textContent,
            currentPhaseIndex: currentPhaseIndex,
            kp: kpPoolEl.textContent,
            blueVp: document.getElementById('blue-vp').textContent,
            redVp: document.getElementById('red-vp').textContent,
            notes: document.getElementById('gm-notes').value,
            unitCounter: unitCounter,
            battleGroupKpUsage: battleGroupKpUsage,
            moraleCheckListHTML: moraleCheckListEl.innerHTML,
            secretNotes: secretNotesEl.value,
            units: [], fireSupport: [], undetectedUnits: [], reinforcements: [],
        };
        document.querySelectorAll('.gm-unit-active-item').forEach(unitEl => {
            data.units.push({
                name: unitEl.querySelector('.gm-unit-name').textContent,
                groupId: unitEl.dataset.groupId,
                currentTk: unitEl.querySelector('.tk-current').textContent,
                maxTk: unitEl.dataset.maxTk,
                status: unitEl.querySelector('.gm-unit-status-select').value
            });
        });
        document.querySelectorAll('#firesupport-list li').forEach(el => data.fireSupport.push({ desc: el.querySelector('.gm-unit-name').textContent, turn: el.querySelector('span:not(.gm-unit-name)').textContent.replace('Saapuu vuorolla: ', '') }));
        document.querySelectorAll('#undetected-list li').forEach(el => data.undetectedUnits.push({ desc: el.querySelector('span').textContent }));
        document.querySelectorAll('#reinforcement-list li').forEach(el => data.reinforcements.push({ desc: el.querySelector('.gm-unit-name').textContent, turn: el.querySelector('span:not(.gm-unit-name)').textContent.replace('Saapuu vuorolla: ', '') }));
        localStorage.setItem('gmToolData', JSON.stringify(data));
    };

    // TÄSTÄ FUNKTIOSTA MUOKATAAN VAIN YKSI RIVI
    const loadData = () => {
        const data = JSON.parse(localStorage.getItem('gmToolData'));
        if (!data) {
            updatePhaseView(); return;
        }
        turnCounterEl.textContent = data.turn || '1';
        currentPhaseIndex = data.currentPhaseIndex !== undefined ? data.currentPhaseIndex : -1;
        kpPoolEl.textContent = data.kp || '0';
        document.getElementById('blue-vp').textContent = data.blueVp || '0';
        document.getElementById('red-vp').textContent = data.redVp || '0';
        document.getElementById('gm-notes').value = data.notes || '';
        unitCounter = data.unitCounter || 0;
        battleGroupKpUsage = data.battleGroupKpUsage || {};
        moraleCheckListEl.innerHTML = data.moraleCheckListHTML || '<li>Ei yksiköitä, jotka vaativat testin.</li>';
        secretNotesEl.value = data.secretNotes || '';

        document.getElementById('active-unit-list').innerHTML = '';
        if (data.units) {
            data.units.forEach(unitData => {
                const unitDiv = document.createElement('div');
                unitDiv.className = 'gm-unit-active-item';
                unitDiv.dataset.maxTk = unitData.maxTk;
                unitDiv.dataset.groupId = unitData.groupId;
                unitDiv.innerHTML = `
                    <div>
                        <span class="gm-unit-name">${unitData.name}</span>
                        <span class="gm-unit-group">${unitData.groupId || 'Ei ryhmää'}</span>
                    </div>
                    <div class="gm-unit-tk-tracker">
                        <button class="tk-btn tk-minus">-</button><span class="tk-current">${unitData.currentTk}</span><span class="tk-max">/ ${unitData.maxTk} TK</span><button class="tk-btn tk-plus">+</button>
                    </div>
                    <select class="gm-unit-status-select"><option value="Kunnossa">Kunnossa</option><option value="Vaurioitunut">Vaurioitunut</option><option value="Lamautunut">Lamautunut</option><option value="Tuhottu">Tuhottu</option></select>
                    <button class="gm-delete-button">X</button>`;
                unitDiv.querySelector('.gm-unit-status-select').value = unitData.status;
                document.getElementById('active-unit-list').appendChild(unitDiv);

                const tkDisplay = unitDiv.querySelector('.tk-current');
                const maxTk = parseInt(unitData.maxTk);
                const unitName = unitData.name;

                // MUOKATTU: TK:n vähennyksen käsittelijä ladatuille yksiköille
                unitDiv.querySelector('.tk-minus').addEventListener('click', () => {
                    let oldTk = parseInt(tkDisplay.textContent);
                    if (oldTk > 0) {
                        tkDisplay.textContent = oldTk - 1;
                        if (oldTk === maxTk) {
                            addUnitToMoraleCheck(unitName);
                        }
                        updateUnitStatus(unitDiv, oldTk - 1, maxTk);
                        saveData();
                    }
                });
                unitDiv.querySelector('.tk-plus').addEventListener('click', () => {
                    let tk = parseInt(tkDisplay.textContent);
                    if (tk < maxTk) {
                        tkDisplay.textContent = tk + 1;
                        updateUnitStatus(unitDiv, tk + 1, maxTk);
                        saveData();
                    }
                });
                unitDiv.querySelector('.gm-delete-button').addEventListener('click', () => { unitDiv.remove(); saveData(); });
                unitDiv.querySelector('.gm-unit-status-select').addEventListener('change', saveData);
            });
        }
        document.getElementById('firesupport-list').innerHTML = '';
        if (data.fireSupport) data.fireSupport.forEach(fs => addToList('firesupport', fs.desc, fs.turn));
        document.getElementById('undetected-list').innerHTML = '';
        if (data.undetectedUnits) data.undetectedUnits.forEach(u => addToList('undetected', u.desc));
        document.getElementById('reinforcement-list').innerHTML = '';
        if (data.reinforcements) data.reinforcements.forEach(r => addToList('reinforcement', r.desc, r.turn));
        updatePhaseView();
    };

    // --- OSA 5: ALUSTUS JA EVENT LISTENERIT ---
    const resetTool = () => { localStorage.removeItem('gmToolData'); location.reload(); };
    resetToolBtn.addEventListener('click', () => { modalOverlay.classList.add('is-visible'); modalContainer.classList.add('is-visible'); });
    const hideModal = () => { modalOverlay.classList.remove('is-visible'); modalContainer.classList.remove('is-visible'); resetConfirmInput.value = ''; resetConfirmBtn.disabled = true; };
    resetCancelBtn.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', hideModal);
    resetConfirmInput.addEventListener('input', () => { resetConfirmBtn.disabled = resetConfirmInput.value !== 'RESET'; });
    resetConfirmBtn.addEventListener('click', () => { if (resetConfirmInput.value === 'RESET') { hideModal(); resetTool(); } });

    const addToList = (type, desc, turn) => {
        if (!desc.trim()) return;
        const li = document.createElement('li');
        let listEl, content;
        switch (type) {
            case 'firesupport': listEl = document.getElementById('firesupport-list'); content = `<span class="gm-unit-name">${desc}</span><span>Saapuu vuorolla: ${turn}</span><button class="gm-delete-button">X</button>`; break;
            case 'undetected': listEl = document.getElementById('undetected-list'); content = `<span>${desc}</span><button class="reveal-button">Paljasta</button><button class="gm-delete-button">X</button>`; break;
            case 'reinforcement': listEl = document.getElementById('reinforcement-list'); content = `<span class="gm-unit-name">${desc}</span><span>Saapuu vuorolla: ${turn}</span><button class="gm-delete-button">X</button>`; break;
        }
        li.innerHTML = content;
        listEl.appendChild(li);
        li.querySelector('.gm-delete-button').addEventListener('click', () => { li.remove(); saveData(); });
        if (type === 'undetected') li.querySelector('.reveal-button').addEventListener('click', () => { showNotification(`Yksikkö "${desc}" paljastettu. Lisää se manuaalisesti Yksiköt-välilehdeltä.`); li.remove(); saveData(); });
    };

    document.getElementById('add-firesupport-button').addEventListener('click', () => {
        const desc = document.getElementById('firesupport-desc-input'); const turn = document.getElementById('firesupport-turn-input');
        if (desc.value.trim() && turn.value.trim()) addToList('firesupport', desc.value, turn.value); saveData(); desc.value = ''; turn.value = '';
    });
    document.getElementById('add-undetected-button').addEventListener('click', () => {
        const desc = document.getElementById('undetected-desc-input'); if (desc.value.trim()) addToList('undetected', desc.value); saveData(); desc.value = '';
    });
    document.getElementById('add-reinforcement-button').addEventListener('click', () => {
        const desc = document.getElementById('reinforcement-desc-input'); const turn = document.getElementById('reinforcement-turn-input');
        if (desc.value.trim() && turn.value.trim()) addToList('reinforcement', desc.value, turn.value); saveData(); desc.value = ''; turn.value = '';
    });
    let notesTimeout;
    secretNotesEl.addEventListener('keyup', () => { clearTimeout(notesTimeout); notesTimeout = setTimeout(saveData, 500); });

    nextPhaseBtn.addEventListener('click', () => {
        currentPhaseIndex++;
        if (currentPhaseIndex >= phases.length) {
            currentPhaseIndex = 0;
            turnCounterEl.textContent = parseInt(turnCounterEl.textContent) + 1;
            battleGroupKpUsage = {};
        }
        updatePhaseView();
    });
    prevPhaseBtn.addEventListener('click', () => {
        if (currentPhaseIndex === 0 && parseInt(turnCounterEl.textContent) > 1) {
            currentPhaseIndex = phases.length - 1;
            turnCounterEl.textContent = parseInt(turnCounterEl.textContent) - 1;
        } else if (currentPhaseIndex > 0) {
            currentPhaseIndex--;
        }
        updatePhaseView();
    });

    const setupCounter = (id) => {
        const dec = document.getElementById(`${id}-decrement`), inc = document.getElementById(`${id}-increment`), disp = document.getElementById(id);
        dec.addEventListener('click', () => { let val = parseInt(disp.textContent); if (val > 0) disp.textContent = val - 1; saveData(); });
        inc.addEventListener('click', () => { disp.textContent = parseInt(disp.textContent) + 1; saveData(); });
    };
    ['turn-counter', 'kp-pool', 'blue-vp', 'red-vp'].forEach(setupCounter);

    const tabs = document.querySelectorAll('.gm-tab-button'), tabPanes = document.querySelectorAll('.gm-tab-pane');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active')); tabPanes.forEach(p => p.classList.remove('active'));
            tab.classList.add('active'); document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    const notesArea = document.getElementById('gm-notes');
    notesArea.addEventListener('keyup', () => { clearTimeout(notesTimeout); notesTimeout = setTimeout(saveData, 500); });

    // --- KÄYNNISTYS ---
    populateUnitTemplates();
    loadData();
});