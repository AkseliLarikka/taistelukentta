// Scripts/unit-data.js
// KESKITETTY TIETOLÄHDE KAIKILLE YKSIKÖILLE

// --- SINISET YKSIKÖT ---
window.blueUnitData = {
    'unit-jaakariryhma': {
        name: 'JÄÄKÄRIRYHMÄ', type: 'Jalkaväki (10 sotilasta)', stats: { tk: 10, tt: '+3', s: 11, m: '+3', l: 7 },
        armament: [{ name: 'Jalkaväkiaseistus', damage: 'd6', attack: '+3', notes: '-' }, { name: 'Tiedustelulennokki', damage: '-', attack: '+5 (Tied.)', notes: '-' }],
        abilities: [{ name: 'Sisu', description: 'Kun yksikkö on "Vaurioitunut", sen Moraali pysyy +3 (ei putoa +1).' }, { name: 'Maastoon Tottunut', description: 'Jättää huomiotta metsämaaston aiheuttaman liikehidasteen.' }, { name: 'Tulenjohto (Passiivinen)', description: 'Voi johtaa tulta. Vaurioituneena vaatii onnistuneen d6-heiton (4+).', isDamagedEffect: true }],
        ammo: {}
    },
    'unit-tukiryhma': {
        name: 'TUKIRYHMÄ (KK)', type: 'Jalkaväki (Raskas konekivääri, 3 sotilasta)', stats: { tk: 8, tt: '+1', s: 10, m: '+2', l: 5 },
        armament: [{ name: 'Konekivääri', damage: 'd8', attack: '+4', notes: 'Useita osumia mahdollinen.' }],
        abilities: [{ name: 'Lamauttava Tuli (2 KP)', description: 'Valitse 3x1cm alue. Kohteet tekevät Moraalitestin (DC 10) tai lamautuvat.' }, { name: 'Tuliasema', description: '+1 Hyökkäykseen, jos pysyy paikallaan. Ei käytössä vaurioituneena.', isDamagedEffect: true }],
        ammo: {}
    },
    'unit-pst-ryhma': {
        name: 'PST-RYHMÄ', type: 'Jalkaväki (2 sotilasta + PST-ase)', stats: { tk: 6, tt: '+1', s: 10, m: '+2', l: 5 },
        armament: [{ name: 'PST-ase', damage: '2d12 (PST)', attack: '+2', notes: 'Uudelleenlataus vaatii Varustautuminen-toiminnon.' }, { name: 'Lämpökamera', damage: '-', attack: '+2 (Tied.)', notes: '-' }],
        abilities: [{ name: 'Panssarintuhoaja', description: '+2 Hyökkäykseen ajoneuvoja vastaan.' }, { name: 'Kertakäyttöisyys', description: 'Jos PST-ase on lataamaton, voi siirtyä +2cm. Ei käytössä vaurioituneena.', isDamagedEffect: true }, { name: 'Varustautuminen', description: 'PST-aseen lataaminen kuluttaa koko vuoron.' }],
        ammo: { 'Ammukset': 3 }
    },
    'unit-krh-ryhma': {
        name: 'KRANAATINHEITINRYHMÄ (81mm)', type: 'Jalkaväki (Kevyt kranaatinheitin, 3 sotilasta)', stats: { tk: 8, tt: '+0', s: 9, m: '+2', l: 4 },
        armament: [{ name: '81mm Kranaatinheitin', damage: '2d6', attack: '+1', notes: 'Vaikutusalue 1 ruutu.' }, { name: 'Lähipuolustusaseet', damage: 'd6', attack: '+3', notes: 'Vain alle 5cm etäisyydellä.' }],
        abilities: [{ name: 'Orgaaninen Tulituki', description: 'Voi antaa epäsuoraa tulta. Vaatii tulenjohdon.' }],
        ammo: { 'Ammukset': 4 }
    },
    'unit-huoltoryhma': {
        name: 'HUOLTORYHMÄ', type: 'Tuki (4 sotilasta)', stats: { tk: 8, tt: '+2', s: 9, m: '+1', l: 6 },
        armament: [{ name: 'Henkilökohtainen aseistus', damage: 'd4', attack: '+0', notes: 'Vain itsepuolustukseen.' }],
        abilities: [{ name: 'Pikakorjaus (2 KP)', description: 'Poistaa ajoneuvosta "Vaurioitunut"-tilan haitat yhden vuoron ajaksi.' }, { name: 'Ammustäydennys (3 KP)', description: 'Palauttaa d4 ammusta viereiselle tulitukiyksikölle.' }],
        ammo: {}
    },
    'unit-sissi-jaakarit': {
        name: 'SISSI-JÄÄKÄRIT', type: 'Jalkaväki (Sissi, 7 sotilasta)', stats: { tk: 8, tt: '+4', s: 12, m: '+3', l: 8 },
        armament: [{ name: 'Jääkäriaseistus', damage: 'd6', attack: '+3', notes: '-' }, { name: 'Konekivääri', damage: 'd8', attack: '+4', notes: '-' }, { name: 'Kevyt PST-ase', damage: '2d12 (PST)', attack: '+2', notes: 'Ammus: 1 kpl.' }, { name: 'Tarkkuuskivääri', damage: 'd10', attack: '+5', notes: 'Osuessaan voi lamauttaa erikoiskyvyn.' }],
        abilities: [{ name: 'Koukkaus', description: 'Saa Edun hyökätessä sivustaan tai selustaan.' }, { name: 'Metsänpeitto (1 KP)', description: 'Voi saavuttaa "Piiloutunut"-tilan metsässä.' }, { name: 'Murtosulute (2 KP)', description: 'Voi asettaa miinakentän (3x1cm).' }, { name: 'Tulenjohto (Passiivinen)', description: 'Voi johtaa tulta. Vaurioituneena vaatii d6-heiton (4+).', isDamagedEffect: true }],
        ammo: { 'Kevyt PST-ase': 1 }
    },
    'unit-erikoisjaakari-osasto': {
        name: 'ERIKOISJÄÄKÄRI-OSASTO', type: 'Jalkaväki (Erikoisjoukko, 5 sotilasta)', stats: { tk: 10, tt: '+5', s: 13, m: '+5', l: 8 },
        armament: [{ name: 'Erikoisjoukkojen rynnäkkökivääri', damage: 'd8', attack: '+5', notes: '-' }, { name: 'Raskas tarkkuuskivääri', damage: 'd12', attack: '+6', notes: 'Osuessaan voi lamauttaa erikoiskyvyn.' }],
        abilities: [{ name: 'Iskuosasto (2 KP)', description: 'Saa +2 Hyökkäykseen ja ohittaa kohteen suojabonuksen.' }, { name: 'Tulenjohto (Passiivinen)', description: 'Voi johtaa tulta. Vaurioituneena vaatii d6-heiton (4+).', isDamagedEffect: true }],
        ammo: {}
    },
    'unit-komppanianpaallikko': {
        name: 'KOMPPANIANPÄÄLLIKKÖ (KP)', type: 'Komentoryhmä (3-5 sotilasta)', stats: { tk: 8, tt: '+4', s: 10, m: '+5', l: 5 },
        armament: [{ name: 'Henkilökohtainen aseistus', damage: 'd4', attack: '+1', notes: 'Vain itsepuolustukseen.' }, { name: 'Viestivälineistö', damage: '-', attack: '-', notes: 'Mahdollistaa komentotoiminnot.' }],
        abilities: [{ name: 'Komentajan Aura', description: 'Ystävälliset yksiköt 60cm säteellä saavat +1 Moraalitesteihin.' }, { name: 'Tilannekuva', description: 'Kerran pelissä voi yrittää paljastaa yhden ?-merkin (TT-testi, DC 14).' }, { name: 'Johtaa edestä', description: 'Vaurioituneena Komentajan Auran bonus poistuu, eikä Tilannekuva-kykyä voi käyttää.', isDamagedEffect: true }],
        ammo: {}
    }
};

// --- PUNAISET YKSIKÖT ---
window.redUnitData = {
    'unit-motorisoitu-jalkavaki': {
        name: 'MOTORISOITU JALKAVÄKIRYHMÄ', type: 'Jalkaväki (9 sotilasta)', stats: { tk: 10, m: '+2', s: 10, l: 7, tt: '+2' },
        armament: [{ name: 'Jalkaväkiaseistus', attack: '+2', damage: 'd6', notes: '-' }],
        abilities: [{ name: 'Peräänantamaton', description: 'Yksikkö ei tee ylimääräistä Moraalitestiä, kun se joutuu "Vaurioituneeksi".' }, { name: 'Aaltohyökkäys (0 KP)', description: 'Jos vähintään 3 Motorisoitua Jalkaväkiryhmää hyökkää samaan kohteeseen, ne saavat +1 Moraaliin seuraavalla vuorolla. Ei käytössä vaurioituneena.', isDamagedEffect: true }],
        ammo: {}
    },
    'unit-btr-82a': {
        name: 'BTR-82A', type: 'Panssaroitu miehistönkuljetusvaunu', stats: { tk: 30, m: '+2', s: 15, l: '10 cm (Tie: +5 cm)', tt: '+1' },
        armament: [{ name: '30mm Konetykki (2A72)', attack: '+4', damage: 'd8', notes: 'Voi käyttää lamauttavaan tuleen (DC 10 Moraalitesti).' }],
        abilities: [{ name: 'Panssaroitu', description: 'Jalkaväki sisällä on suojassa. PST-osumien vahinko sisällä olijoille puolitetaan.' }, { name: 'Vaurioitunut', description: 'Kun TK on alle 50%, Liike puolittuu.', isDamagedEffect: true }],
        ammo: {}
    },
    'unit-t-72b3': {
        name: 'T-72B3', type: 'Panssarivaunu', stats: { tk: 40, m: '+2', s: 18, l: '7 cm (Tie: +5 cm)', tt: '+0' },
        armament: [{ name: '125mm Kanuuna (2A46M)', attack: '+5', damage: '2d12 (PST)', notes: 'Jalkaväkeä vastaan d10.' }, { name: 'Konekiväärit', attack: '+3', damage: 'd8', notes: 'Voi käyttää lamauttavaan tuleen (DC 10 Moraalitesti).' }],
        abilities: [{ name: 'Pelote', description: 'Joka vuoron alussa, vihollisen jalkaväki 5cm säteellä tekee Moraalitestin (DC 10).' }, { name: 'Raskas Panssari', description: 'Kaikki vahingot vähenevät 1 pisteellä.' }, { name: 'Vaurioitunut (50% TK)', description: 'Raskas Panssari -kyky menetetään.', isDamagedEffect: true }, { name: 'Vaurioitunut (30% TK)', description: 'Telat poikki (ei liikettä), mutta tykki toimii. Kärsii +1 lisävahinkoa.', isDamagedEffect: true }],
        ammo: {}
    },
    'unit-krh-120mm': {
        name: 'KRANAATINHEITINRYHMÄ (120mm)', type: 'Jalkaväki (4 sotilasta)', stats: { tk: 10, m: '+1', s: 9, l: 4, tt: '+0' },
        armament: [{ name: '120mm Kranaatinheitin (2B11)', attack: '+1', damage: 'd10', notes: 'Vaikutusalue 2x2cm.' }, { name: 'Lähipuolustusaseet', attack: '+3', damage: 'd6', notes: 'Vain alle 5cm etäisyydellä.' }],
        abilities: [{ name: 'Epäsuora Tuli', description: 'Voi ampua yli esteiden spotterin avulla.' }, { name: 'Laaja Räjähdysalue', description: 'Kranaatit vaikuttavat suuremmalle alueelle.' }],
        ammo: {}
    },
    'unit-tiedustelu-erikoisryhma': {
        name: 'TIEDUSTELUERIKOISRYHMÄ', type: 'Jalkaväki (9 sotilasta)', stats: { tk: 10, m: '+2', s: 10, l: 8, tt: '+2' },
        armament: [{ name: 'Jalkaväkiaseistus', attack: '+2', damage: 'd6', notes: '-' }, { name: 'Tarkkuuskivääri', attack: '+3', damage: 'd10', notes: 'Osuessaan voi lamauttaa yhden erikoiskyvyn vuoron ajaksi.' }],
        abilities: [{ name: 'Tehostettu Tiedustelu', description: 'Saa +2 bonuksen tiedusteluheittoihin. Ei käytössä vaurioituneena.', isDamagedEffect: true }, { name: 'Peräänantamaton', description: 'Yksikkö ei tee ylimääräistä Moraalitestiä joutuessaan "Vaurioitunut"-tilaan.' }],
        ammo: {}
    },
    'unit-shturmovaya-gruppa': {
        name: 'SHTURMOVAYA GRUPPA', type: 'Jalkaväki (Rynnäkköryhmä, 9 sotilasta)', stats: { tk: 12, m: '+2', s: 10, l: 5, tt: '+1' },
        armament: [{ name: 'Rynnäkköaseistus', attack: '+3', damage: 'd8', notes: '-' }, { name: 'Termobaarinen raketinheitin', attack: '+2', damage: '2d8', notes: 'Ohittaa suojan, +2 vahinkoa rakennuksiin.' }],
        abilities: [{ name: 'Tiazholaya Bronya (Raskas panssari)', description: 'Vähentää 1 pisteen jalkaväkiaseiden vahingosta. Vaurioituneena kärsii +1 lisävahinkoa.', isDamagedEffect: true }, { name: 'Tulimuuri (2 KP)', description: 'Valitse 5x2cm alue. Alueella olevat viholliset kärsivät -2 Hyökkäykseen ja tekevät Moraalitestin (DC 10).' }],
        ammo: { 'Termobaarinen raketti': 4 }
    },
    'unit-spetsnaz-gru': {
        name: 'SPETSNAZ GRU:N DIVERSIORYHMÄ', type: 'Jalkaväki (Erikoisjoukko, 6 sotilasta)', stats: { tk: 7, m: '+4', s: 12, l: 9, tt: '+4' },
        armament: [{ name: 'Vaimennettu erikoiskivääri', attack: '+4', damage: 'd10', notes: 'Ampuminen ei poista "Piiloutunut"-tilaa (ellei kohde ole alle 10cm päässä).' }],
        abilities: [{ name: 'Häirintäoperaatiot (2 KP)', description: 'Piiloutuneena voi käyttää: 1) Elektroninen häirintä (vihollinen menettää 1 KP). 2) Pikasulute (pysäyttää vihollisen liikkeen). Ei käytössä vaurioituneena.', isDamagedEffect: true }],
        ammo: {}
    }
};