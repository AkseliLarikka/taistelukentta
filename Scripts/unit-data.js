// Scripts/unit-data.js
// KESKITETTY TIETOLÄHDE KAIKILLE YKSIKÖILLE
// Päivitetty v.2.1: Yksiköiden nimet on muutettu siistiin "Title Case" -muotoon luettavuuden parantamiseksi.

// --- SINISET YKSIKÖT ---
window.blueUnitData = {
  "unit-jaakariryhma": {
    name: "Jääkäriryhmä",
    type: "Jalkaväki (10 sotilasta)",
    cost: 20,
    stats: { tk: 10, tt: "+3", s: 11, h: "+3", m: "+3", l: 7 },
    armament: [
      { name: "Jalkaväkiaseistus", damage: "d6", attack: "+3", notes: "-" },
      {
        name: "Kevyt kertasinko",
        damage: "1d12 (PST)",
        attack: "+2",
        notes:
          "Vain ajoneuvoja vastaan. Heikompi panssarinläpäisy raskaasti panssaroituja maaleja (kuten T-72) vastaan (-2 vahinkoon).",
      },
      {
        name: "Tiedustelulennokki",
        damage: "-",
        attack: "+5 (Tied.)",
        notes: "Tiedustelun vaikutusalue 10cm.",
      },
    ],
    abilities: [
      {
        name: "Sisu (Passiivinen)",
        description:
          'Kun yksikkö on "Vaurioitunut", sen Moraali pysyy +3 (ei putoa +1).',
      },
      {
        name: "Tulenjohto (Passiivinen)",
        description:
          "Voi johtaa tulta. Vaurioituneena vaatii onnistuneen d6-heiton (4+).",
        isDamagedEffect: true,
      },
    ],
    ammo: { "Kevyt kertasinko": 2 },
  },
  "unit-tukiryhma": {
    name: "Tukiryhmä (KK)",
    type: "Jalkaväki (Raskas konekivääri, 3 sotilasta)",
    cost: 25,
    stats: { tk: 8, tt: "+1", s: 10, h: "+4", m: "+2", l: 5 },
    armament: [{ name: "Konekivääri", damage: "d8", attack: "+4", notes: "-" }],
    abilities: [
      {
        name: "Lamauttava Tuli (Aktiivinen, 2 KP)",
        description:
          "Valitse kolme ruutua leveä alue. Kohteet tekevät Moraalitestin (DC 10) tai lamautuvat.",
        isDamagedEffect: true,
      },
      {
        name: "Tuliasema (Passiivinen)",
        description: "+1 Hyökkäykseen, jos yksikkö ei liiku vuoron aikana.",
      },
    ],
    ammo: {},
  },
  "unit-pst-ryhma": {
    name: "PST-ryhmä",
    type: "Jalkaväki (2 sotilasta)",
    cost: 30,
    stats: { tk: 6, tt: "+1", s: 10, h: "+4", m: "+2", l: 5 },
    armament: [
      {
        name: "Raskas kertasinko",
        damage: "2d12 (PST)",
        attack: "+2",
        notes:
          "Kantama 15cm. Uudelleenlataus vaatii Varustautuminen-toiminnon.",
      },
      {
        name: "Lähipuolustusaseet",
        damage: "d6",
        attack: "+3",
        notes: "Vain <=5cm etäisyydellä.",
      },
      {
        name: "Lämpökamera",
        damage: "-",
        attack: "+2 (Tied.)",
        notes: 'Voi tiedustella "Piiloutunut" tilassa olevia kohteita.',
      },
    ],
    abilities: [
      {
        name: "Panssarintuhoaja (Passiivinen)",
        description: "+2 Hyökkäykseen ajoneuvoja vastaan.",
      },
      {
        name: "Varustautuminen (Aktiivinen)",
        description:
          "PST-aseen lataaminen kuluttaa koko vuoron. Vaurioituneena vaatii onnistuneen TT-testin (DC 10).",
        isDamagedEffect: true,
      },
    ],
    ammo: { "<strong>Ammukset</strong>": 3 },
  },
  "unit-krh-ryhma": {
    name: "Kranaatinheitin&shy;ryhmä (81mm)",
    type: "Jalkaväki (Kevyt kranaatinheitin, 3 sotilasta)",
    cost: 25,
    stats: { tk: 8, tt: "+0", s: 9, h: "+4", m: "+2", l: 4 },
    armament: [
      {
        name: "81mm Kranaatinheitin",
        damage: "2d6",
        attack: "+1",
        notes: "Kantama 5-15 cm. Vaikutusalue 1 ruutu.",
      },
      {
        name: "Lähipuolustusaseet",
        damage: "d6",
        attack: "+3",
        notes: "Vain <=5cm etäisyydellä.",
      },
    ],
    abilities: [
      {
        name: "Orgaaninen Tulituki (Aktiivinen, 1 KP)",
        description: "Voi antaa epäsuoraa tulta. Vaatii tulenjohdon.",
        isDamagedEffect: true,
      },
    ],
    ammo: { "<strong>Ammukset</strong>": 4 },
  },
  "unit-laakintaryhma": {
    name: "Lääkintäryhmä",
    type: "Tuki (4 sotilasta)",
    cost: 20,
    stats: { tk: 8, tt: "+2", s: 9, h: "+2", m: "+1", l: 8 },
    armament: [
      {
        name: "Henkilökohtainen aseistus",
        damage: "d6",
        attack: "+0",
        notes: "Vain itsepuolustukseen <=5cm.",
      },
    ],
    abilities: [
      {
        name: "Lääkintä (Aktiivinen, 1 KP)",
        description:
          "Palauttaa viereiselle jalkaväkiyksikölle 1d4+1 TK:ta. Ei voi ylittää maksimi-TK:ta. Kuluttaa yhden Lääkintätarvike-resurssin.",
        isDamagedEffect: true,
      },
      {
        name: "Huoltotoiminta (Passiivinen)",
        description:
          "Voi täydentää Lääkintätarvike-resurssejaan ollessaan Komppanianpäälliköstä 5cm säteellä.",
      },
    ],
    ammo: { "<strong>Lääkintätarvikkeet</strong>": 3 },
  },
  "unit-huoltoryhma": {
    name: "Huoltoryhmä",
    type: "Tuki (4 sotilasta)",
    cost: 20,
    stats: { tk: 8, tt: "+2", s: 9, h: "+2", m: "+1", l: 8 },
    armament: [
      {
        name: "Henkilökohtainen aseistus",
        damage: "d6",
        attack: "+0",
        notes: "Vain itsepuolustukseen <=5cm.",
      },
    ],
    abilities: [
      {
        name: "Ammustäydennys (Aktiivinen, 1 KP)",
        description:
          "Palauttaa viereiselle yksikölle yhden ammuksen (esim. PST-ohjus, KES, räjähde). Kuluttaa yhden Ammustäydennys-resurssin.",
      },
      {
        name: "Kenttäkorjaus (Aktiivinen, 2 KP)",
        description:
          "Voi yrittää korjata vaurioitunutta ajoneuvoa onnistuneella TT-testillä (DC 14) palauttaen sille 2d8 TK:ta. Kuluttaa yhden Ammustäydennys-resurssin.",
        isDamagedEffect: true,
      },
      {
        name: "Huoltotoiminta (Passiivinen)",
        description:
          "Voi täydentää Ammustäydennys-resurssejaan ollessaan Komppanianpäälliköstä 5cm säteellä.",
      },
    ],
    ammo: { "<strong>Ammustäydennykset</strong>": 3 },
  },
  "unit-sissi-jaakarit": {
    name: "Sissi-jääkärit",
    type: "Jalkaväki (Sissi, 7 sotilasta)",
    cost: 45,
    stats: { tk: 8, tt: "+4", s: 12, h: "+7", m: "+3", l: 8 },
    armament: [
      { name: "Jääkäriaseistus", damage: "d6", attack: "+3", notes: "-" },
      { name: "Konekivääri", damage: "d8", attack: "+4", notes: "-" },
      {
        name: "Kevyt kertasinko",
        damage: "1d12 (PST)",
        attack: "+2",
        notes: "Ammus: 2 kpl.",
      },
      {
        name: "Tarkkuuskivääri",
        damage: "d10",
        attack: "+5",
        notes: "Kantama 15cm. Osuessaan voi lamauttaa erikoiskyvyn.",
      },
    ],
    abilities: [
      {
        name: "Isku ja katoaminen (Aktiivinen, 2 KP)",
        description:
          "Välittömästi suoritettuaan onnistuneen tulitoiminnon, tämä yksikkö voi tehdä ilmaisen liikkumisen, jonka pituus on puolet sen {Liike}-arvosta. Tämän liikkeen aikana se voi sivuuttaa vihollisen hallintavyöhykkeet (ZoC). Kun yksikkö on vaurioitunut ja kärsinyt tappioita, sen kyky ylläpitää tehokasta tulisuojaa omalle liikkeelleen romahtaa.",
        isDamagedEffect: true,
      },
      {
        name: "Koukkaus (Passiivinen)",
        description: "Saa Edun hyökätessä sivustaan tai selustaan.",
      },
    ],
    ammo: { "Kevyt PST-ase": 1 },
  },
  "unit-erikoisjaakari-osasto": {
    name: "Erikoisjääkäri-osasto",
    type: "Jalkaväki (Erikoisjoukko, 5 sotilasta)",
    cost: 40,
    stats: { tk: 10, tt: "+5", s: 13, h: "+7", m: "+5", l: 8 },
    armament: [
      {
        name: "Erikoisjoukkojen rynnäkkökivääri",
        damage: "d8",
        attack: "+5",
        notes: "-",
      },
      {
        name: "Raskas tarkkuuskivääri",
        damage: "d12",
        attack: "+6",
        notes: "Kantama 20cm. Osuessaan voi lamauttaa erikoiskyvyn.",
      },
    ],
    abilities: [
      {
        name: "Iskuosasto (Aktiivinen, 2 KP)",
        description: "Saa +2 Hyökkäykseen ja ohittaa kohteen suojabonuksen.",
        isDamagedEffect: true,
      },
      {
        name: "Tulenjohto (Passiivinen)",
        description:
          "Voi johtaa tulta. Vaurioituneena vaatii onnistuneen d6-heiton (4+).",
      },
    ],
    ammo: {},
  },
  "unit-komppanianpaallikko": {
    name: "Komppanian&shy;päällikkö (KP)",
    type: "Komentoryhmä (3-5 sotilasta)",
    cost: 0, // Ilmainen yksikkö
    stats: { tk: 8, tt: "+4", s: 10, h: "+2", m: "+5", l: 5 },
    armament: [
      {
        name: "Henkilökohtainen aseistus",
        damage: "d6",
        attack: "+1",
        notes: "Vain itsepuolustukseen <=5cm etäisyydellä.",
      },
      {
        name: "Viestivälineistö",
        damage: "-",
        attack: "-",
        notes: "Mahdollistaa komentotoiminnot.",
      },
    ],
    abilities: [
      {
        name: "Komentajan Aura (Passiivinen)",
        description:
          "Ystävälliset yksiköt 60cm säteellä saavat +1 Moraalitesteihin.",
        isDamagedEffect: true,
      },
      {
        name: "Tilannekuva (Aktiivinen)",
        description: "Kerran pelissä voi paljastaa yhden ?-merkin.",
      },
    ],
    ammo: {},
  },
  "unit-tykistopatteri-155mm": {
    name: "Panssarihaupitsi&shy;patteri (K9 155mm)",
    type: "Epäorgaaninen tulituki",
    cost: 0, // Ei ostettavissa
    stats: { tk: 0, tt: "+0", s: 0, h: "+0", m: "+0", l: 0 },
    armament: [
      {
        name: "155mm haupitsi",
        damage: "3d10",
        attack: "Ohjattu",
        notes: "Epäsuora tuli. Ks. sääntö 2.1.2 Taktisen tason taistelussa.",
      },
    ],
    abilities: [
      {
        name: "Tulikomento (Aktiivinen, 3 KP)",
        description:
          "Tulenjohtokykyinen yksikkö voi käyttää 3 KP kutsuakseen keskityksen. Ks. <em>Taktisen tason taistelu</em> -sivulta sääntö 2.1.2 tarkempia ohjeita varten.",
      },
      {
        name: "Kartan Ulkopuolinen Yksikkö (Passiivinen)",
        description:
          "Tätä yksikköä ei sijoiteta kartalle eikä se voi olla hyökkäyksen kohteena. Sen olemassaoloa edustavat sen tulikomennot.",
      },
    ],
    ammo: { "<strong>Keskitykset</strong>": 4 },
  },
  "unit-raketinheitin-mlrs": {
    name: "Raskas Raketinheitin (MLRS)",
    type: "Epäorgaaninen tulituki",
    cost: 0, // Ei ostettavissa
    stats: { tk: 0, tt: "+0", s: 0, h: "+0", m: "+0", l: 0 },
    armament: [
      {
        name: "Raskas Raketinheitin",
        damage: "4d8",
        attack: "Ohjattu",
        notes: "Epäsuora tuli. Ks. sääntö 2.1.2 Taktisen tason taistelussa.",
      },
    ],
    abilities: [
      {
        name: "Sulutuskäsky (Aktiivinen, 3 KP)",
        description:
          "Komppanianpäällikkö voi käyttää 3 KP kutsuakseen laajan tuli-iskun. Ks. <em>Taktisen tason taistelu</em> -sivulta sääntö 2.1.2 tarkempia ohjeita varten.",
      },
      {
        name: "Kartan Ulkopuolinen Yksikkö (Passiivinen)",
        description:
          "Tätä yksikköä ei sijoiteta kartalle eikä se voi olla hyökkäyksen kohteena.",
      },
    ],
    ammo: { "<strong>Keskitykset</strong>": 2 },
  },
  "unit-pioneeriryhma": {
    name: "Pioneeriryhmä",
    type: "Jalkaväki (Erikoisryhmä, 8 sotilasta)",
    cost: 30,
    stats: { tk: 12, tt: "+4", s: 11, h: "+3", m: "+4", l: 6 },
    armament: [
      { name: "Jalkaväkiaseistus", damage: "d6", attack: "+3", notes: "-" },
      {
        name: "Räjähdepanokset",
        damage: "-",
        attack: "-",
        notes: "Erillisillä säännöillä, jotka on kuvattuna kyvyissä",
      },
    ],
    abilities: [
      {
        name: "Linnoittautuminen (Aktiivinen, 2 KP)",
        description:
          "Tämä tai viereinen ystävällinen yksikkö saa +2 Suoja-arvoon seuraavaan omaan vuoroon asti. Ei voi käyttää ajoneuvoihin.",
        isDamagedEffect: true,
      },
      {
        name: "Pioneeriosaaminen (Passiivinen)",
        description:
          "Tällä yksiköllä on erikoiskykyjä murtosulutteita vastaan: <ul><li>Suorittaa sulutteen havaitsemisen (Aktiivinen tiedustelu) ja varovaisen purkamisen alemmalla vaikeusasteella (DC 10).</li><li>Epäonnistuneen purkuyrityksen jälkeen voi yrittää välttää miinan laukeamisen TT-testillä (DC 10).</li><li>Suunniteltu purkaminen (DC 11) puhdistaa kerralla koko 2x2 cm suluteruudun.</li></ul>",
      },
      {
        name: "Räjähdepanokset (Aktiivinen, 1 KP)",
        description:
          "Yksikkö voi käyttää yhden erikoisräjähteistään: <ul><li><strong>Viuhkapanos:</strong> Asetetaan yhteen ruutuun ja päätetään suunta, mihin se tähdätään. Voi laukaista reaktiona, kun vihollinen liikkuu tähän tai viereiseen ruutuun. Aiheuttaa <strong>2d8 vahinkoa</strong> kaikille jalkaväkiyksiköille alueella.</li><li><strong>Kylkipanos:</strong> Asetetaan samoilla säännöillä kuin viuhkapanos. Aiheuttaa <strong>1d12 PST-vahinkoa.</strong></li></ul>",
      },
    ],
    ammo: { "<strong>Erikoisräjähteet</strong>": 2 },
  },
  "unit-cv90": {
    name: "CV9030FIN Rynnäkkö&shy;panssari&shy;vaunu",
    type: "Rynnäkköpanssarivaunu",
    cost: 70,
    stats: { tk: 35, tt: "+2", s: 18, h: "+1", m: "+3", l: 9 },
    armament: [
      {
        name: "30mm Konetykki",
        damage: "2d10 (PST)",
        attack: "+5",
        notes:
          "Jalkaväkeä vastaan 1d10. Sarjatuli mahdollinen (3 laukausta, -2 hyökkäysheittoon per laukaus). Eli 1. laukaus normaalisti ja seuraavat kaksi laukausta -2 rangaistuksella (ei kumulatiivinen).",
      },
      { name: "Konekivääri", damage: "d8", attack: "+3", notes: "-" },
    ],
    abilities: [
      {
        name: "Kuljetuskyky (Passiivinen)",
        description:
          "Voi kuljettaa yhden jalkaväkiryhmän suojassa jalkaväkiaseistuksen tulelta.",
      },
      {
        name: "Jalkaväen Tulituki (Passiivinen)",
        description:
          "Yksiköt, jotka ovat poistuneet tästä vaunusta tai ovat 2cm säteellä, saavat +1 hyökkäysheittoihinsa.",
      },
    ],
    ammo: {},
  },
  "unit-leopard-2a6": {
    name: "Leopard 2A6 taistelu&shy;panssari&shy;vaunu",
    type: "Panssarivaunu",
    cost: 80,
    stats: { tk: 50, tt: "+2", s: 22, h: "+0", m: "+4", l: 8 },
    armament: [
      {
        name: "120mm tykki",
        damage: "2d12 (PST)",
        attack: "+7",
        notes: "Jalkaväkeä vastaan d10.",
      },
      { name: "Konekiväärit", damage: "d8", attack: "+4", notes: "-" },
    ],
    abilities: [
      {
        name: "Ylivoimainen Tulenjohto (Passiivinen)",
        description:
          "Ohittaa kohteen perussuojabonuksen (esim. metsä, kevyt suoja). Ei koske raskasta suojaa (esim. bunkkeri, rakennus).",
        isDamagedEffect: true,
      },
      {
        name: "Metsästäjä-Tappaja (Aktiivinen, 2 KP)",
        description:
          "Voi ampua pääaseella kaksi kertaa yhden vuoron aikana. Toinen laukaus suoritetaan -2 rangaistuksella hyökkäysheittoon.",
      },
    ],
    ammo: {},
  },
};

// --- PUNAISET YKSIKÖT ---
window.redUnitData = {
  "unit-motorisoitu-jalkavaki": {
    name: "Motorisoitu jalkaväkiryhmä",
    type: "Jalkaväki (9 sotilasta)",
    stats: { tk: 10, m: "+2", s: 10, h: "+3", l: 7, tt: "+2" },
    armament: [
      { name: "Jalkaväkiaseistus", attack: "+2", damage: "d6", notes: "-" },
    ],
    abilities: [
      {
        name: "Aaltohyökkäys (Passiivinen)",
        description:
          "Jos vähintään 3 tämän tyyppistä ryhmää hyökkää samaan kohteeseen, ne saavat +1 Moraaliin seuraavalla vuorolla.",
        isDamagedEffect: true,
      },
      {
        name: "Peräänantamaton (Passiivinen)",
        description:
          'Yksikkö ei tee ylimääräistä Moraalitestiä, kun se joutuu "Vaurioituneeksi".',
      },
    ],
    ammo: {},
  },
  "unit-pst-ryhma-red": {
    name: "PST-ryhmä (Kornet)",
    type: "Jalkaväki (3 sotilasta)",
    stats: { tk: 8, m: "+2", s: 10, h: "+4", l: 5, tt: "+2" },
    armament: [
      {
        name: "Panssarintorjuntaohjus (Kornet)",
        attack: "+6",
        damage: "2d12+2 (PST)",
        notes:
          "Kantama 15cm. Vaatii koko vuoron ampuma-asemaan asettuakseen ennen ensimmäistä laukausta.",
      },
      {
        name: "Lähipuolustusaseet",
        attack: "+2",
        damage: "d6",
        notes: "Vain <=5cm etäisyydellä.",
      },
    ],
    abilities: [
      {
        name: "Tulenjohto-ohjus (Aktiivinen)",
        description:
          "Ohjus hakeutuu maaliin, joten ampuja voi vaihtaa asemaa heti laukaisun jälkeen. Yksikkö voi liikkua puolet liikkumisarvostaan ammuttuaan.",
        isDamagedEffect: true,
      },
    ],
    ammo: { "<strong>Ohjukset</strong>": 3 },
  },
  "unit-btr-82a": {
    name: "BTR-82A",
    type: "Panssaroitu miehistönkuljetusvaunu",
    stats: { tk: 30, m: "+2", s: 15, h: "+1", l: "10 cm (Tie: +5 cm)", tt: "+1" },
    armament: [
      {
        name: "30mm Konetykki (2A72)",
        attack: "+4",
        damage: "d8",
        notes: "Voi käyttää lamauttavaan tuleen (DC 10 Moraalitesti).",
      },
    ],
    abilities: [
      {
        name: "Kuljetuskyky (Passiivinen)",
        description:
          "Voi kuljettaa yhden jalkaväkiryhmän suojassa jalkaväkiaseistuksen tulelta.",
      },
    ],
    ammo: {},
  },
  "unit-t-72b3": {
    name: "T-72B3",
    type: "Panssarivaunu",
    stats: { tk: 40, m: "+2", s: 18, h: "+0", l: "7 cm (Tie: +5 cm)", tt: "+0" },
    armament: [
      {
        name: "125mm Kanuuna (2A46M)",
        attack: "+5",
        damage: "2d12 (PST)",
        notes: "Jalkaväkeä vastaan d10.",
      },
      { name: "Konekiväärit", attack: "+3", damage: "d8", notes: "-" },
    ],
    abilities: [
      {
        name: "Pelote (Passiivinen)",
        description:
          'Joka vuoron alussa, vihollisen jalkaväki 5cm säteellä tekee Moraalitestin (DC 10). Epäonnistuessa se joutuu "Lamautunut" tilaan.',
      },
      {
        name: "Raskas Panssari (Passiivinen)",
        description:
          "Kaikki vahingot vähenevät 1 pisteellä. Vaurioituneena tämä kyky menetetään.",
        isDamagedEffect: true,
      },
    ],
    ammo: {},
  },
  "unit-krh-120mm": {
    name: "Kranaatinheitin&shy;ryhmä (120mm)",
    type: "Jalkaväki (4 sotilasta)",
    stats: { tk: 10, m: "+1", s: 9, h: "+4", l: 4, tt: "+0" },
    armament: [
      {
        name: "120mm Kranaatinheitin (2B11)",
        attack: "+1",
        damage: "d10",
        notes: "Vaikutusalue 2x2cm.",
      },
      {
        name: "Lähipuolustusaseet",
        attack: "+3",
        damage: "d6",
        notes: "Vain alle 5cm etäisyydellä.",
      },
    ],
    abilities: [
      {
        name: "Epäsuora Tuli (Aktiivinen)",
        description: "Voi antaa epäsuoraa tulta. Vaatii tulenjohdon.",
        isDamagedEffect: true,
      },
    ],
    ammo: { "<strong>Ammukset</strong>": 6 },
  },
  "unit-tiedustelu-erikoisryhma": {
    name: "Tiedusteluerikois&shy;ryhmä",
    type: "Jalkaväki (9 sotilasta)",
    stats: { tk: 10, m: "+2", s: 10, h: "+7", l: 8, tt: "+2" },
    armament: [
      { name: "Jalkaväkiaseistus", attack: "+2", damage: "d6", notes: "-" },
      {
        name: "Tarkkuuskivääri",
        attack: "+3",
        damage: "d10",
        notes:
          "Kantama 15cm. Osuessaan voi lamauttaa yhden erikoiskyvyn vuoron ajaksi.",
      },
    ],
    abilities: [
      {
        name: "Tehostettu Tiedustelu (Passiivinen)",
        description:
          "Saa +2 bonuksen tiedusteluheittoihin. Vaurioituneena bonus putoaa +1:een.",
        isDamagedEffect: true,
      },
      {
        name: "Peräänantamaton (Passiivinen)",
        description:
          'Yksikkö ei tee ylimääräistä Moraalitestiä joutuessaan "Vaurioituneeksi".',
      },
    ],
    ammo: {},
  },
  "unit-shturmovaya-gruppa": {
    name: "Shturmovaya Gruppa",
    type: "Jalkaväki (Rynnäkköryhmä, 9 sotilasta)",
    stats: { tk: 12, m: "+2", s: 10, h: "+5", l: 5, tt: "+1" },
    armament: [
      { name: "Rynnäkköaseistus", attack: "+3", damage: "d8", notes: "-" },
      {
        name: "Termobaarinen raketinheitin",
        attack: "+2",
        damage: "2d8",
        notes:
          "Kantama 10cm. Ohittaa suojan, +2 vahinkoa rakennuksissa oleviin yksikköihin.",
      },
    ],
    abilities: [
      {
        name: "Tulimuuri (Aktiivinen, 2 KP)",
        description:
          "Valitse 5x2cm alue. Alueella olevat viholliset kärsivät -2 Hyökkäykseen ja tekevät Moraalitestin (DC 10).",
        isDamagedEffect: true,
      },
      {
        name: "Tiazholaya Bronya (Passiivinen)",
        description:
          "Vähentää 1 pisteen jalkaväkiaseiden vahingosta. Vaurioituneena kärsii +1 lisävahinkoa.",
      },
    ],
    ammo: { "Termobaarinen raketti": 4 },
  },
  "unit-spetsnaz-gru": {
    name: "Spetsnaz GRU:n diversioryhmä",
    type: "Jalkaväki (Erikoisjoukko, 6 sotilasta)",
    stats: { tk: 7, m: "+4", s: 12, h: "+7", l: 9, tt: "+4" },
    armament: [
      {
        name: "Vaimennettu erikoiskivääri",
        attack: "+4",
        damage: "d10",
        notes:
          'Ampuminen ei poista "Piiloutunut"-tilaa (ellei kohde ole alle 10cm päässä).',
      },
    ],
    abilities: [
      {
        name: "Häirintäoperaatiot (Aktiivinen, 2 KP)",
        description:
          "Piiloutuneena voi käyttää yhtä seuraavista: <ol><li>Elektroninen häirintä (yksi vihollisen joukkue 15cm säteellä menettää 1 KP seuraavalta vuorolta).</li><li>Sabotaasi (valitun 10cm säteellä olevan ajoneuvon pääase pois pelistä yhden vuoron ajan epäonnistuneella Moraalitestillä DC 12).</li></ol>",
        isDamagedEffect: true,
      },
    ],
    ammo: {},
  },
  "unit-raketinheitinkeskitys-122mm": {
    name: "Raketinheitin&shy;keskitys (122mm)",
    type: "Epäorgaaninen tulituki",
    stats: { tk: 0, tt: "+0", s: 0, h: "+0", m: "+0", l: 0 },
    armament: [
      {
        name: "122mm Raketinheitin",
        damage: "3d8",
        attack: "Ohjattu",
        notes: "Epäsuora tuli. Ks. sääntö 2.1.2 Taktisen tason taistelussa.",
      },
    ],
    abilities: [
      {
        name: "Sulutuskäsky (Aktiivinen, 3 KP)",
        description:
          "Tulenjohtokykyinen yksikkö voi käyttää 3 KP kutsuakseen sulutuksen. Ks. <em>Taktisen tason taistelu</em> -sivulta sääntö 2.1.2 tarkempia ohjeita varten.",
      },
      {
        name: "Kartan Ulkopuolinen Yksikkö (Passiivinen)",
        description:
          "Tätä yksikköä ei sijoiteta kartalle eikä se voi olla hyökkäyksen kohteena. Sen olemassaoloa edustavat sen tulikomennot.",
      },
    ],
    ammo: { Sulutukset: 3 },
  },
};
