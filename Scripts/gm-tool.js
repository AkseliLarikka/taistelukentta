/**
 * Taistelukenttä d20 - Pelinjohtajan työkalupakin toiminnallisuus.
 *
 * Vastuualueet:
 * 1. Välilehtien hallinta.
 * 2. Laskurien (vuoro, KP, VP) toiminta.
 * 3. Yksiköiden ja tulituen dynaaminen lisääminen ja poistaminen.
 * 4. Kaikkien tietojen tallentaminen ja lataaminen selaimen localStorageen.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Varmistetaan, että työkalu on olemassa sivulla ennen skriptin suorittamista
    const gmToolContainer = document.querySelector('.gm-tool-container');
    if (!gmToolContainer) {
        return;
    }

    const tabs = document.querySelectorAll('.gm-tab-button');
    const tabPanes = document.querySelectorAll('.gm-tab-pane');

    // --- OSA 1: Välilehtien toiminnallisuus ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Poista aktiivinen tila kaikilta
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Aseta aktiivinen tila klikatulle
            tab.classList.add('active');
            const targetPane = document.getElementById(tab.dataset.tab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // --- OSA 2: Tietojen tallennus ja lataus (localStorage) ---
    const saveData = () => {
        const data = {
            turn: document.getElementById('turn-counter').textContent,
            kp: document.getElementById('kp-pool').textContent,
            blueVp: document.getElementById('blue-vp').textContent,
            redVp: document.getElementById('red-vp').textContent,
            units: [],
            fireSupport: [],
            notes: document.getElementById('gm-notes').value
        };

        document.querySelectorAll('#unit-list .gm-unit').forEach(unitEl => {
            data.units.push({
                name: unitEl.querySelector('.gm-unit-name').textContent,
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
        if (!data) return;

        document.getElementById('turn-counter').textContent = data.turn || '1';
        document.getElementById('kp-pool').textContent = data.kp || '0';
        document.getElementById('blue-vp').textContent = data.blueVp || '0';
        document.getElementById('red-vp').textContent = data.redVp || '0';
        document.getElementById('gm-notes').value = data.notes || '';

        if (data.units) data.units.forEach(unit => addUnitToList(unit.name, unit.status));
        if (data.fireSupport) data.fireSupport.forEach(support => addFireSupportToList(support.desc, support.turn));
    };

    // --- OSA 3: Laskurien hallinta ---
    const setupCounter = (id) => {
        const decrementBtn = document.getElementById(`${id}-decrement`);
        const incrementBtn = document.getElementById(`${id}-increment`);
        const display = document.getElementById(id);

        decrementBtn.addEventListener('click', () => {
            let value = parseInt(display.textContent);
            if (value > 0) { // Vuoro ei voi mennä alle 1
                if (id === 'turn-counter' && value === 1) return;
                display.textContent = value - 1;
                saveData();
            }
        });

        incrementBtn.addEventListener('click', () => {
            display.textContent = parseInt(display.textContent) + 1;
            saveData();
        });
    };
    
    setupCounter('turn-counter');
    setupCounter('kp-pool');
    setupCounter('blue-vp');
    setupCounter('red-vp');

    // --- OSA 4: Yksiköiden ja tulituen hallinta ---
    const unitList = document.getElementById('unit-list');
    const unitNameInput = document.getElementById('unit-name-input');
    const addUnitButton = document.getElementById('add-unit-button');

    const fireSupportList = document.getElementById('firesupport-list');
    const fireSupportDescInput = document.getElementById('firesupport-desc-input');
    const fireSupportTurnInput = document.getElementById('firesupport-turn-input');
    const addFireSupportButton = document.getElementById('add-firesupport-button');

    // Yksikön lisääminen listalle
    const addUnitToList = (name, status = 'Kunnossa') => {
        if (!name.trim()) return;

        const unitDiv = document.createElement('div');
        unitDiv.className = 'gm-unit';
        unitDiv.innerHTML = `
            <span class="gm-unit-name">${name}</span>
            <select class="gm-unit-status-select">
                <option value="Kunnossa">Kunnossa</option>
                <option value="Vaurioitunut">Vaurioitunut</option>
                <option value="Lamautunut">Lamautunut</option>
                <option value="Tuhottu">Tuhottu</option>
            </select>
            <button class="gm-delete-button">X</button>
        `;

        unitDiv.querySelector('.gm-unit-status-select').value = status;
        unitList.appendChild(unitDiv);

        unitDiv.querySelector('.gm-delete-button').addEventListener('click', () => {
            unitDiv.remove();
            saveData();
        });
        
        unitDiv.querySelector('.gm-unit-status-select').addEventListener('change', saveData);

        saveData();
    };
    
    // Tulituen lisääminen listalle
    const addFireSupportToList = (desc, turn) => {
        if (!desc.trim() || !turn.trim()) return;

        const supportLi = document.createElement('li');
        supportLi.innerHTML = `
            <span class="gm-unit-name">${desc}</span>
            <span>Saapuu vuorolla: ${turn}</span>
            <button class="gm-delete-button">X</button>
        `;

        fireSupportList.appendChild(supportLi);

        supportLi.querySelector('.gm-delete-button').addEventListener('click', () => {
            supportLi.remove();
            saveData();
        });

        saveData();
    };

    addUnitButton.addEventListener('click', () => {
        addUnitToList(unitNameInput.value);
        unitNameInput.value = '';
    });
    
    addFireSupportButton.addEventListener('click', () => {
        addFireSupportToList(fireSupportDescInput.value, fireSupportTurnInput.value);
        fireSupportDescInput.value = '';
        fireSupportTurnInput.value = '';
    });

    // --- OSA 5: Muistiinpanojen tallennus ---
    const notesArea = document.getElementById('gm-notes');
    let notesTimeout;
    notesArea.addEventListener('keyup', () => {
        clearTimeout(notesTimeout);
        notesTimeout = setTimeout(saveData, 500); // Tallentaa 500ms kirjoituksen lopettamisen jälkeen
    });

    // Ladataan tiedot, kun sivu on valmis
    loadData();
});