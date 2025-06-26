/**
 * Taistelukenttä d20 - Pelinjohtajan työkalupakki.
 * Versio 3.2 - Täydellinen ja korjattu versio, sisältää nollaustoiminnon.
 */
document.addEventListener('DOMContentLoaded', () => {
    const gmToolContainer = document.querySelector('.gm-tool-container');
    if (!gmToolContainer) return;

    // --- OSA 1: YKSIKKÖMALLIT ---
    const redUnitTemplates = [
        { name: "Jalkaväkiryhmä", maxTk: 10 },
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
        { name: "Tilannevaihe", checklist: ["Suorita vaaditut Moraalitestit kaikille yksiköille, jotka kärsivät tappioita tai olivat lähellä tuhoutuneita yksiköitä.", "Tarkista skenaarion tavoitteiden tilanne.", "Päivitä Voittopisteet (VP) molemmille osapuolille.", "Poista vuoron loppuun kestävät vaikutukset."] }
    ];
    let currentPhaseIndex = -1;

    // --- ELEMENTTIVIITTAUKSET ---
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

    // --- OSA 3: KESKEISET FUNKTIOT ---
    const showNotification = (message, type = 'info') => {
        const notif = document.createElement('div');
        notif.className = `gm-notification is-${type}`;
        notif.textContent = message;
        notificationsEl.appendChild(notif);
        setTimeout(() => { notif.classList.add('is-hidden'); setTimeout(() => notif.remove(), 500); }, 5000);
    };

    const checkFireSupportArrival = () => {
        const currentTurn = turnCounterEl.textContent;
        const fireSupportItems = JSON.parse(localStorage.getItem('gmToolData'))?.fireSupport || [];
        fireSupportItems.forEach(fs => { if (fs.turn === currentTurn) showNotification(`TULITUKI SAAPUU: ${fs.desc}`, 'warning'); });
    };

    const updatePhaseView = () => {
        if (currentPhaseIndex === -1) {
            phaseTitleEl.textContent = "Peli ei ole alkanut";
            phaseInstructionsEl.innerHTML = `<p>Aloita peli painamalla "Seuraava Vaihe".</p>`;
            phaseCounterEl.textContent = `Vaihe 0/${phases.length}`;
            prevPhaseBtn.disabled = true;
        } else {
            if (currentPhaseIndex === 0) checkFireSupportArrival();
            const phase = phases[currentPhaseIndex];
            phaseTitleEl.textContent = `${phase.name} (Vuoro ${turnCounterEl.textContent})`;
            let checklistHTML = '<ul>';
            phase.checklist.forEach((item, index) => {
                const checkboxId = `phase${currentPhaseIndex}-item${index}`;
                checklistHTML += `<li><input type="checkbox" id="${checkboxId}"><label for="${checkboxId}">${item}</label></li>`;
            });
            checklistHTML += '</ul>';
            phaseInstructionsEl.innerHTML = checklistHTML;
            if (phase.name === "Komentovaihe") {
                const kpCalcBtn = document.getElementById('kp-calc-btn');
                const kpCalcInput = document.getElementById('kp-calc-groups');
                if (kpCalcBtn && kpCalcInput) {
                    kpCalcBtn.addEventListener('click', () => {
                        const groups = parseInt(kpCalcInput.value) || 0;
                        kpPoolEl.textContent = groups * 3;
                        showNotification(`Komentopisteet päivitetty: ${kpPoolEl.textContent} KP`);
                        saveData();
                    });
                }
            }
            phaseCounterEl.textContent = `Vaihe ${currentPhaseIndex + 1}/${phases.length}`;
            prevPhaseBtn.disabled = (currentPhaseIndex === 0 && parseInt(turnCounterEl.textContent) === 1);
        }
        saveData();
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
            const unitName = unitElement.querySelector('.gm-unit-name').textContent;
            showNotification(`${unitName} tila muuttui: ${newStatus}`, 'warning');
        }
    };

    const addUnitToList = (unitTemplate, count) => {
        for (let i = 0; i < count; i++) {
            unitCounter++;
            const unitDiv = document.createElement('div');
            unitDiv.className = 'gm-unit-active-item';
            unitDiv.dataset.maxTk = unitTemplate.maxTk;
            let currentTk = unitTemplate.maxTk;
            unitDiv.innerHTML = `
                <span class="gm-unit-name">${unitTemplate.name} ${unitCounter}</span>
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
            unitDiv.querySelector('.tk-minus').addEventListener('click', () => { let tk = parseInt(tkDisplay.textContent); if (tk > 0) { tk--; tkDisplay.textContent = tk; updateUnitStatus(unitDiv, tk, unitTemplate.maxTk); saveData(); } });
            unitDiv.querySelector('.tk-plus').addEventListener('click', () => { let tk = parseInt(tkDisplay.textContent); if (tk < unitTemplate.maxTk) { tk++; tkDisplay.textContent = tk; updateUnitStatus(unitDiv, tk, unitTemplate.maxTk); saveData(); } });
            unitDiv.querySelector('.gm-delete-button').addEventListener('click', () => { unitDiv.remove(); saveData(); });
            unitDiv.querySelector('.gm-unit-status-select').addEventListener('change', saveData);
        }
        showNotification(`${count} x ${unitTemplate.name} lisätty peliin.`);
        saveData();
    };

    const populateUnitTemplates = () => {
        const container = document.getElementById('unit-templates-container');
        container.innerHTML = '';
        redUnitTemplates.forEach(template => {
            const templateDiv = document.createElement('div');
            templateDiv.className = 'gm-unit-template';
            templateDiv.innerHTML = `<span class="template-name">${template.name} (TK: ${template.maxTk})</span><div class="template-controls"><input type="number" value="1" min="1" class="template-add-count"><button class="template-add-btn">Lisää</button></div>`;
            container.appendChild(templateDiv);
            templateDiv.querySelector('.template-add-btn').addEventListener('click', () => { const count = parseInt(templateDiv.querySelector('.template-add-count').value); addUnitToList(template, count); });
        });
    };

    // --- OSA 4: TALLENNUS JA LATAUS ---
    const saveData = () => {
        const data = {
            turn: turnCounterEl.textContent,
            currentPhaseIndex: currentPhaseIndex,
            kp: kpPoolEl.textContent,
            blueVp: document.getElementById('blue-vp').textContent,
            redVp: document.getElementById('red-vp').textContent,
            units: [],
            fireSupport: [],
            notes: document.getElementById('gm-notes').value,
            unitCounter: unitCounter
        };
        document.querySelectorAll('.gm-unit-active-item').forEach(unitEl => {
            data.units.push({
                name: unitEl.querySelector('.gm-unit-name').textContent,
                currentTk: unitEl.querySelector('.tk-current').textContent,
                maxTk: unitEl.dataset.maxTk,
                status: unitEl.querySelector('.gm-unit-status-select').value
            });
        });
        document.querySelectorAll('#firesupport-list li').forEach(supportEl => {
            data.fireSupport.push({
                desc: supportEl.querySelector('.gm-unit-name').textContent,
                turn: supportEl.querySelector('span:not(.gm-unit-name)').textContent.replace('Saapuu vuorolla: ', '')
            });
        });
        localStorage.setItem('gmToolData', JSON.stringify(data));
    };

    const loadData = () => {
        const data = JSON.parse(localStorage.getItem('gmToolData'));
        if (!data) {
            updatePhaseView();
            return;
        }
        turnCounterEl.textContent = data.turn || '1';
        currentPhaseIndex = data.currentPhaseIndex !== undefined ? data.currentPhaseIndex : -1;
        kpPoolEl.textContent = data.kp || '0';
        document.getElementById('blue-vp').textContent = data.blueVp || '0';
        document.getElementById('red-vp').textContent = data.redVp || '0';
        document.getElementById('gm-notes').value = data.notes || '';
        unitCounter = data.unitCounter || 0;
        document.getElementById('active-unit-list').innerHTML = '';
        if (data.units) {
            data.units.forEach(unitData => {
                const unitDiv = document.createElement('div');
                unitDiv.className = 'gm-unit-active-item';
                unitDiv.dataset.maxTk = unitData.maxTk;
                unitDiv.innerHTML = `
                    <span class="gm-unit-name">${unitData.name}</span>
                    <div class="gm-unit-tk-tracker">
                        <button class="tk-btn tk-minus">-</button><span class="tk-current">${unitData.currentTk}</span><span class="tk-max">/ ${unitData.maxTk} TK</span><button class="tk-btn tk-plus">+</button>
                    </div>
                    <select class="gm-unit-status-select"><option value="Kunnossa">Kunnossa</option><option value="Vaurioitunut">Vaurioitunut</option><option value="Lamautunut">Lamautunut</option><option value="Tuhottu">Tuhottu</option></select>
                    <button class="gm-delete-button">X</button>`;
                unitDiv.querySelector('.gm-unit-status-select').value = unitData.status;
                document.getElementById('active-unit-list').appendChild(unitDiv);
                const tkDisplay = unitDiv.querySelector('.tk-current');
                unitDiv.querySelector('.tk-minus').addEventListener('click', () => { let tk = parseInt(tkDisplay.textContent); if (tk > 0) { tk--; tkDisplay.textContent = tk; updateUnitStatus(unitDiv, tk, unitData.maxTk); saveData(); } });
                unitDiv.querySelector('.tk-plus').addEventListener('click', () => { let tk = parseInt(tkDisplay.textContent); if (tk < unitData.maxTk) { tk++; tkDisplay.textContent = tk; updateUnitStatus(unitDiv, tk, unitData.maxTk); saveData(); } });
                unitDiv.querySelector('.gm-delete-button').addEventListener('click', () => { unitDiv.remove(); saveData(); });
                unitDiv.querySelector('.gm-unit-status-select').addEventListener('change', saveData);
            });
        }
        document.getElementById('firesupport-list').innerHTML = '';
        if (data.fireSupport) data.fireSupport.forEach(fs => addFireSupportToList(fs.desc, fs.turn));
        updatePhaseView();
    };
    
    // --- OSA 5: ALUSTUS JA EVENT LISTENERIT ---
    const resetTool = () => {
        localStorage.removeItem('gmToolData');
        location.reload();
    };

    resetToolBtn.addEventListener('click', () => {
        modalOverlay.classList.add('is-visible');
        modalContainer.classList.add('is-visible');
    });

    const hideModal = () => {
        modalOverlay.classList.remove('is-visible');
        modalContainer.classList.remove('is-visible');
        resetConfirmInput.value = '';
        resetConfirmBtn.disabled = true;
    };

    resetCancelBtn.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', hideModal);
    
    resetConfirmInput.addEventListener('input', () => {
        resetConfirmBtn.disabled = resetConfirmInput.value !== 'RESET';
    });

    resetConfirmBtn.addEventListener('click', () => {
        if (resetConfirmInput.value === 'RESET') {
            hideModal();
            resetTool();
        }
    });

    const addFireSupportToList = (desc, turn) => {
        if (!desc.trim() || !turn.trim()) return;
        const supportLi = document.createElement('li');
        supportLi.innerHTML = `<span class="gm-unit-name">${desc}</span><span>Saapuu vuorolla: ${turn}</span><button class="gm-delete-button">X</button>`;
        document.getElementById('firesupport-list').appendChild(supportLi);
        supportLi.querySelector('.gm-delete-button').addEventListener('click', () => { supportLi.remove(); saveData(); });
    };

    document.getElementById('add-firesupport-button').addEventListener('click', () => {
        const desc = document.getElementById('firesupport-desc-input').value;
        const turn = document.getElementById('firesupport-turn-input').value;
        addFireSupportToList(desc, turn);
        saveData();
        document.getElementById('firesupport-desc-input').value = '';
        document.getElementById('firesupport-turn-input').value = '';
    });
    
    nextPhaseBtn.addEventListener('click', () => {
        currentPhaseIndex++;
        if (currentPhaseIndex >= phases.length) {
            currentPhaseIndex = 0;
            turnCounterEl.textContent = parseInt(turnCounterEl.textContent) + 1;
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
        dec.addEventListener('click', () => {
            let val = parseInt(disp.textContent);
            if (id === 'turn-counter' && val > 1) {
                disp.textContent = val - 1;
                updatePhaseView();
            } else if (id !== 'turn-counter' && val > 0) {
                disp.textContent = val - 1;
            }
            saveData();
        });
        inc.addEventListener('click', () => {
            disp.textContent = parseInt(disp.textContent) + 1;
            if (id === 'turn-counter') updatePhaseView();
            saveData();
        });
    };
    ['turn-counter', 'kp-pool', 'blue-vp', 'red-vp'].forEach(setupCounter);
    
    const tabs = document.querySelectorAll('.gm-tab-button'), tabPanes = document.querySelectorAll('.gm-tab-pane');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
    
    const notesArea = document.getElementById('gm-notes');
    let notesTimeout;
    notesArea.addEventListener('keyup', () => { clearTimeout(notesTimeout); setTimeout(saveData, 500); });
    
    // --- KÄYNNISTYS ---
    populateUnitTemplates();
    loadData();
});