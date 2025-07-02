// Scripts/unit-data.js
// KESKITETTY TIETOLÄHDE KAIKILLE YKSIKÖILLE (Yksinkertaistettu v.2)

// --- SINISET YKSIKÖT ---
window.blueUnitData = {
    'unit-jaakariryhma': {
        name: 'JÄÄKÄRIRYHMÄ', type: 'Jalkaväki (10 sotilasta)', stats: { tk: 10, tt: '+3', s: 11, m: '+3', l: 7 },
        armament: [{ name: 'Jalkaväkiaseistus', damage: 'd6', attack: '+3', notes: '-' }, { name: 'Tiedustelulennokki', damage: '-', attack: '+5 (Tied.)', notes: '-' }],
        abilities: [
            { name: 'Sisu (Passiivinen)', description: 'Kun yksikkö on "Vaurioitunut", sen Moraali pysyy +3 (ei putoa +1).' },
            { name: 'Tulenjohto (Passiivinen)', description: 'Voi johtaa tulta. Vaurioituneena vaatii onnistuneen d6-heiton (4+).', isDamagedEffect: true }
        ],
        ammo: {}
    },
    'unit-tukiryhma': {
        name: 'TUKIRYHMÄ (KK)', type: 'Jalkaväki (Raskas konekivääri, 3 sotilasta)', stats: { tk: 8, tt: '+1', s: 10, m: '+2', l: 5 },
        armament: [{ name: 'Konekivääri', damage: 'd8', attack: '+4', notes: '-' }],
        abilities: [
            { name: 'Lamauttava Tuli (Aktiivinen, 2 KP)', description: 'Valitse kolme ruutua leveä alue. Kohteet tekevät Moraalitestin (DC 10) tai lamautuvat.', isDamagedEffect: true },
            { name: 'Tuliasema (Passiivinen)', description: '+1 Hyökkäykseen, jos yksikkö ei liiku vuoron aikana.' }
        ],
        ammo: {}
    },
    'unit-pst-ryhma': {
        name: 'PST-RYHMÄ', type: 'Jalkaväki (2 sotilasta)', stats: { tk: 6, tt: '+1', s: 10, m: '+2', l: 5 },
        armament: [{ name: 'Raskas kertasinko', damage: '2d12 (PST)', attack: '+2', notes: 'Uudelleenlataus vaatii Varustautuminen-toiminnon.' }, { name: 'Lähipuolustusaseet', damage: 'd6', attack: '+3', notes: 'Vain <=5cm etäisyydellä.' }, { name: 'Lämpökamera', damage: '-', attack: '+2 (Tied.)', notes: 'Voi tiedustella "Piiloutunut" tilassa olevia kohteita.' }],
        abilities: [
            { name: 'Panssarintuhoaja (Passiivinen)', description: '+2 Hyökkäykseen ajoneuvoja vastaan.' },
            { name: 'Varustautuminen (Aktiivinen)', description: 'PST-aseen lataaminen kuluttaa koko vuoron. Vaurioituneena vaatii onnistuneen TT-testin (DC 10).', isDamagedEffect: true }
        ],
        ammo: { '<strong>Ammukset</strong>': 3 }
    },
    'unit-krh-ryhma': {
        name: 'KRANAATINHEITINRYHMÄ (81mm)', type: 'Jalkaväki (Kevyt kranaatinheitin, 3 sotilasta)', stats: { tk: 8, tt: '+0', s: 9, m: '+2', l: 4 },
        armament: [{ name: '81mm Kranaatinheitin', damage: '2d6', attack: '+1', notes: 'Vaikutusalue 1 ruutu.' }, { name: 'Lähipuolustusaseet', damage: 'd6', attack: '+3', notes: 'Vain <=5cm etäisyydellä.' }],
        abilities: [
            { name: 'Orgaaninen Tulituki (Aktiivinen, 1 KP)', description: 'Voi antaa epäsuoraa tulta. Vaatii tulenjohdon.', isDamagedEffect: true }
        ],
        ammo: { '<strong>Ammukset</strong>': 4 }
    },
    'unit-huoltoryhma': {
        name: 'HUOLTO- JA LÄÄKINTÄRYHMÄ',
        type: 'Tuki (4 sotilasta)',
        stats: { tk: 8, tt: '+2', s: 9, m: '+1', l: 6 },
        armament: [{ name: 'Henkilökohtainen aseistus', damage: 'd6', attack: '+0', notes: 'Vain itsepuolustukseen <=5cm etäisyydellä.' }],
        abilities: [
            {
                name: 'Lääkintä (Aktiivinen, 2 KP)',
                description: 'Kohdista ystävälliseen yksikköön. Jos kohteen TK on alle 50%, palauta sen TK arvoon 50% + tämän ryhmän TT-bonus. Jos kohteen TK on yli 50%, se parantaa 1d4 + tämän ryhmän TT-bonus verran TK:ta.',
                isDamagedEffect: true
            },
            {
                name: 'Ammustäydennys (Aktiivinen, 3 KP)',
                description: 'Palauttaa 1d4 ammusta viereiselle yksikölle (ei yli yksikön maksimikapasiteetin). Voidaan käyttää 2 kertaa/taistelu.'
            }
        ],
        ammo: {}
    },
    'unit-sissi-jaakarit': {
        name: 'SISSI-JÄÄKÄRIT', type: 'Jalkaväki (Sissi, 7 sotilasta)', stats: { tk: 8, tt: '+4', s: 12, m: '+3', l: 8 },
        armament: [{ name: 'Jääkäriaseistus', damage: 'd6', attack: '+3', notes: '-' }, { name: 'Konekivääri', damage: 'd8', attack: '+4', notes: '-' }, { name: 'Kevyt kertasinko', damage: '1d12 (PST)', attack: '+2', notes: 'Ammus: 1 kpl.' }, { name: 'Tarkkuuskivääri', damage: 'd10', attack: '+5', notes: 'Osuessaan voi lamauttaa erikoiskyvyn.' }],
        abilities: [
            { name: 'Isku ja katoaminen (Aktiivinen, 2 KP)', description: 'Välittömästi suoritettuaan onnistuneen tulitoiminnon, tämä yksikkö voi tehdä ilmaisen liikkumisen, jonka pituus on puolet sen {Liike}-arvosta. Tämän liikkeen aikana se voi sivuuttaa vihollisen hallintavyöhykkeet (ZoC). Kun yksikkö on vaurioitunut ja kärsinyt tappioita, sen kyky ylläpitää tehokasta tulisuojaa omalle liikkeelleen romahtaa.', isDamagedEffect: true },
            { name: 'Koukkaus (Passiivinen)', description: 'Saa Edun hyökätessä sivustaan tai selustaan.' }
        ],
        ammo: { 'Kevyt PST-ase': 1 }
    },
    'unit-erikoisjaakari-osasto': {
        name: 'ERIKOISJÄÄKÄRI-OSASTO', type: 'Jalkaväki (Erikoisjoukko, 5 sotilasta)', stats: { tk: 10, tt: '+5', s: 13, m: '+5', l: 8 },
        armament: [{ name: 'Erikoisjoukkojen rynnäkkökivääri', damage: 'd8', attack: '+5', notes: '-' }, { name: 'Raskas tarkkuuskivääri', damage: 'd12', attack: '+6', notes: 'Osuessaan voi lamauttaa erikoiskyvyn.' }],
        abilities: [
            { name: 'Iskuosasto (Aktiivinen, 2 KP)', description: 'Saa +2 Hyökkäykseen ja ohittaa kohteen suojabonuksen.', isDamagedEffect: true },
            { name: 'Tulenjohto (Passiivinen)', description: 'Voi johtaa tulta. Vaurioituneena vaatii onnistuneen d6-heiton (4+).' }
        ],
        ammo: {}
    },
    'unit-komppanianpaallikko': {
        name: 'KOMPPANIANPÄÄLLIKKÖ (KP)', type: 'Komentoryhmä (3-5 sotilasta)', stats: { tk: 8, tt: '+4', s: 10, m: '+5', l: 5 },
        armament: [{ name: 'Henkilökohtainen aseistus', damage: 'd6', attack: '+1', notes: 'Vain itsepuolustukseen <=5cm etäisyydellä.' }, { name: 'Viestivälineistö', damage: '-', attack: '-', notes: 'Mahdollistaa komentotoiminnot.' }],
        abilities: [
            { name: 'Komentajan Aura (Passiivinen)', description: 'Ystävälliset yksiköt 60cm säteellä saavat +1 Moraalitesteihin.', isDamagedEffect: true },
            { name: 'Tilannekuva (Aktiivinen)', description: 'Kerran pelissä voi paljastaa yhden ?-merkin.' }
        ],
        ammo: {}
    },
    'unit-tykistopatteri-155mm': {
        name: 'TYKISTÖPATTERI (155mm)',
        type: 'Epäorgaaninen tulituki',
        // Stats-arvot eivät ole relevantteja, koska yksikkö ei ole kartalla.
        stats: { tk: 0, tt: '+0', s: 0, m: '+0', l: 0 },
        armament: [
            {
                name: '155mm Kenttäkanuuna',
                damage: '3d10',
                attack: 'Ohjattu',
                notes: 'Epäsuora tuli. Ks. sääntö 2.1.2 Taktisen tason taistelussa.'
            }
        ],
        abilities: [
            {
                name: 'Tulikomento (Aktiivinen, 3 KP)',
                description: 'Tulenjohtokykyinen yksikkö voi käyttää 3 KP kutsuakseen keskityksen. Ks. <em>Taktisen tason taistelu</em> -sivulta sääntö 2.1.2 tarkempia ohjeita varten.',
            },
            {
                name: 'Kartan Ulkopuolinen Yksikkö (Passiivinen)',
                description: 'Tätä yksikköä ei sijoiteta kartalle eikä se voi olla hyökkäyksen kohteena. Sen olemassaoloa edustavat sen tulikomennot.'
            }
        ],
        // Rajoitettu määrä tulikomentoja per taistelu.
        ammo: { '<strong>Keskitykset</strong>': 4 }
    }
};

// --- PUNAISET YKSIKÖT ---
window.redUnitData = {
    'unit-motorisoitu-jalkavaki': {
        name: 'MOTORISOITU JALKAVÄKIRYHMÄ', type: 'Jalkaväki (9 sotilasta)', stats: { tk: 10, m: '+2', s: 10, l: 7, tt: '+2' },
        armament: [{ name: 'Jalkaväkiaseistus', attack: '+2', damage: 'd6', notes: '-' }],
        abilities: [
            { name: 'Aaltohyökkäys (Passiivinen)', description: 'Jos vähintään 3 tämän tyyppistä ryhmää hyökkää samaan kohteeseen, ne saavat +1 Moraaliin seuraavalla vuorolla.', isDamagedEffect: true },
            { name: 'Peräänantamaton (Passiivinen)', description: 'Yksikkö ei tee ylimääräistä Moraalitestiä, kun se joutuu "Vaurioituneeksi".' }
        ],
        ammo: {}
    },
    'unit-btr-82a': {
        name: 'BTR-82A', type: 'Panssaroitu miehistönkuljetusvaunu', stats: { tk: 30, m: '+2', s: 15, l: '10 cm (Tie: +5 cm)', tt: '+1' },
        armament: [{ name: '30mm Konetykki (2A72)', attack: '+4', damage: 'd8', notes: 'Voi käyttää lamauttavaan tuleen (DC 10 Moraalitesti).' }],
        abilities: [
            { name: 'Kuljetuskyky (Passiivinen)', description: 'Voi kuljettaa yhden jalkaväkiryhmän suojassa jalkaväkiaseistuksen tulelta.' }
        ],
        ammo: {}
    },
    'unit-t-72b3': {
        name: 'T-72B3', type: 'Panssarivaunu', stats: { tk: 40, m: '+2', s: 18, l: '7 cm (Tie: +5 cm)', tt: '+0' },
        armament: [{ name: '125mm Kanuuna (2A46M)', attack: '+5', damage: '2d12 (PST)', notes: 'Jalkaväkeä vastaan d10.' }, { name: 'Konekiväärit', attack: '+3', damage: 'd8', notes: '-' }],
        abilities: [
            { name: 'Pelote (Passiivinen)', description: 'Joka vuoron alussa, vihollisen jalkaväki 5cm säteellä tekee Moraalitestin (DC 10). Epäonnistuessa se joutuu "Lamautunut" tilaan.' },
            { name: 'Raskas Panssari (Passiivinen)', description: 'Kaikki vahingot vähenevät 1 pisteellä. Vaurioituneena tämä kyky menetetään.', isDamagedEffect: true }
        ],
        ammo: {}
    },
    'unit-krh-120mm': {
        name: 'KRANAATINHEITIN&shy;RYHMÄ (120mm)', type: 'Jalkaväki (4 sotilasta)', stats: { tk: 10, m: '+1', s: 9, l: 4, tt: '+0' },
        armament: [{ name: '120mm Kranaatinheitin (2B11)', attack: '+1', damage: 'd10', notes: 'Vaikutusalue 2x2cm.' }, { name: 'Lähipuolustusaseet', attack: '+3', damage: 'd6', notes: 'Vain alle 5cm etäisyydellä.' }],
        abilities: [
            { name: 'Epäsuora Tuli (Aktiivinen)', description: 'Voi antaa epäsuoraa tulta. Vaatii tulenjohdon.', isDamagedEffect: true }
        ],
        ammo: { '<strong>Ammukset</strong>': 6 }
    },
    'unit-tiedustelu-erikoisryhma': {
        name: 'TIEDUSTELUERIKOIS&shy;RYHMÄ', type: 'Jalkaväki (9 sotilasta)', stats: { tk: 10, m: '+2', s: 10, l: 8, tt: '+2' },
        armament: [{ name: 'Jalkaväkiaseistus', attack: '+2', damage: 'd6', notes: '-' }, { name: 'Tarkkuuskivääri', attack: '+3', damage: 'd10', notes: 'Osuessaan voi lamauttaa yhden erikoiskyvyn vuoron ajaksi.' }],
        abilities: [
            { name: 'Tehostettu Tiedustelu (Passiivinen)', description: 'Saa +2 bonuksen tiedusteluheittoihin. Vaurioituneena bonus putoaa +1:een.', isDamagedEffect: true },
            { name: 'Peräänantamaton (Passiivinen)', description: 'Yksikkö ei tee ylimääräistä Moraalitestiä joutuessaan "Vaurioituneeksi".' }
        ],
        ammo: {}
    },
    'unit-shturmovaya-gruppa': {
        name: 'SHTURMOVAYA GRUPPA', type: 'Jalkaväki (Rynnäkköryhmä, 9 sotilasta)', stats: { tk: 12, m: '+2', s: 10, l: 5, tt: '+1' },
        armament: [{ name: 'Rynnäkköaseistus', attack: '+3', damage: 'd8', notes: '-' }, { name: 'Termobaarinen raketinheitin', attack: '+2', damage: '2d8', notes: 'Ohittaa suojan, +2 vahinkoa rakennuksissa oleviin yksikköihin.' }],
        abilities: [
            { name: 'Tulimuuri (Aktiivinen, 2 KP)', description: 'Valitse 5x2cm alue. Alueella olevat viholliset kärsivät -2 Hyökkäykseen ja tekevät Moraalitestin (DC 10).', isDamagedEffect: true },
            { name: 'Tiazholaya Bronya (Passiivinen)', description: 'Vähentää 1 pisteen jalkaväkiaseiden vahingosta. Vaurioituneena kärsii +1 lisävahinkoa.' }
        ],
        ammo: { 'Termobaarinen raketti': 4 }
    },
    'unit-spetsnaz-gru': {
        name: 'SPETSNAZ GRU:N DIVERSIORYHMÄ',
        type: 'Jalkaväki (Erikoisjoukko, 6 sotilasta)',
        stats: { tk: 7, m: '+4', s: 12, l: 9, tt: '+4' },
        armament: [{ name: 'Vaimennettu erikoiskivääri', attack: '+4', damage: 'd10', notes: 'Ampuminen ei poista "Piiloutunut"-tilaa (ellei kohde ole alle 10cm päässä).' }],
        abilities: [
            {
                name: 'Häirintäoperaatiot (Aktiivinen, 2 KP)',
                description: 'Piiloutuneena voi käyttää yhtä seuraavista: <ol><li>Elektroninen häirintä (yksi vihollisen joukkue 15cm säteellä menettää 1 KP seuraavalta vuorolta).</li><li>Sabotaasi (valitun 10cm säteellä olevan ajoneuvon pääase pois pelistä yhden vuoron ajan epäonnistuneella Moraalitestillä DC 12).</li></ol>',
                isDamagedEffect: true
            }
        ],
        ammo: {}
    },
    'unit-raketinheitinkeskitys-122mm': {
        name: 'RAKETINHEITIN&shy;KESKITYS (122mm)',
        type: 'Epäorgaaninen tulituki',
        // Stats-arvot eivät ole relevantteja, koska yksikkö ei ole kartalla.
        stats: { tk: 0, tt: '+0', s: 0, m: '+0', l: 0 },
        armament: [
            {
                name: '122mm Raketinheitin',
                damage: '3d8',
                attack: 'Ohjattu',
                notes: 'Epäsuora tuli. Ks. sääntö 2.1.2 Taktisen tason taistelussa.'
            }
        ],
        abilities: [
            {
                name: 'Sulutuskäsky (Aktiivinen, 3 KP)',
                description: 'Tulenjohtokykyinen yksikkö voi käyttää 3 KP kutsuakseen sulutuksen. Ks. <em>Taktisen tason taistelu</em> -sivulta sääntö 2.1.2 tarkempia ohjeita varten.'
            },
            {
                name: 'Kartan Ulkopuolinen Yksikkö (Passiivinen)',
                description: 'Tätä yksikköä ei sijoiteta kartalle eikä se voi olla hyökkäyksen kohteena. Sen olemassaoloa edustavat sen tulikomennot.'
            }
        ],
        // Rajoitettu määrä tulikomentoja per taistelu.
        ammo: { 'Sulutukset': 3 }
    }
};