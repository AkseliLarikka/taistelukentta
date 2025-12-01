const searchIndex = [
    // --- PÄÄSIVUT ---
    { title: "Etusivu", keywords: "aloitus, intro, koti", url: "index.html", category: "Sivu" },
    { title: "Ydinsäännöt", keywords: "säännöt, perusteet, noppa, heittäminen", url: "ydinsaannot.html", category: "Sivu" },
    { title: "Taktisen tason taistelu", keywords: "taistelu, ampuminen, komennot, vuoro", url: "taktisen-tason-taistelu.html", category: "Sivu" },
    { title: "Skenaariot", keywords: "tehtävät, pelimuodot, kartat, operaatio", url: "skenaariot.html", category: "Sivu" },
    { title: "Punaiset Yksiköt", keywords: "venäjä, vihollinen, kalusto, btr, tankki", url: "punaiset-yksiköt.html", category: "Sivu" },
    { title: "Siniset Yksiköt", keywords: "suomi, omat, kalusto, pasi, leopard", url: "siniset-yksiköt.html", category: "Sivu" },
    { title: "Pelaajan Työkalu", keywords: "laskuri, apuri, sovellus, pikaopas", url: "pelaajan-pikaopas.html", category: "Työkalu" },

    // --- SÄÄNTÖMEKANIIKAT (Ohjataan sääntösivuille, EI sanastoon) ---
    { 
        title: "Hallintavyöhyke (ZoC)", 
        keywords: "zoc, zone of control, alue, vaikutusalue, viereinen ruutu, liike pysähtyy, 2 cm, pysähtyminen, saarto", 
        url: "ydinsaannot.html#header-hallintavyohyke-zone-of-control-zoc", 
        category: "Sääntö" 
    },
    { 
        title: "Komentopisteet (KP)", 
        keywords: "kp, resurssi, käskyt, toiminnot, johtaminen, pisteet, aktivointi", 
        url: "taktisen-tason-taistelu.html#header-komentopisteet-kp-ja-johtaminen", 
        category: "Sääntö" 
    },
    { 
        title: "Moraalitesti", 
        keywords: "moraali, rohkeus, paniikki, kestävyys, dc, noppaheitto, murtuminen, pako", 
        url: "ydinsaannot.html#header-moraali", 
        category: "Sääntö" 
    },
    { 
        title: "Tilaefektit (Vauriot)", 
        keywords: "lamautunut, vaurioitunut, tärähtänyt, vetäytyy, piiloutunut, status, kunto, suppressed, shaken", 
        url: "ydinsaannot.html#header-tilaefektit", 
        category: "Sääntö" 
    },
    { 
        title: "Tiedustelu ja Havaitseminen", 
        keywords: "havaitseminen, näkeminen, spotting, tähystys, kiikarit, piilo, häive, h, paljastaminen", 
        url: "taktisen-tason-taistelu.html#header-tiedustelu-ja-informaatiosota", 
        category: "Sääntö" 
    },
    { 
        title: "Liike ja Maasto", 
        keywords: "liikkuminen, nopeus, metsä, tie, suo, hidas, nopea, maasto, esteet, korkeusero", 
        url: "taktisen-tason-taistelu.html#header-maaston-hierarkia-ja-vaikutukset-liikkeeseen", 
        category: "Sääntö" 
    },
    { 
        title: "Epäsuora Tulituki", 
        keywords: "tykistö, krh, kranaatinheitin, keskitetty, pommitus, alue, mlrs, k9, moukari", 
        url: "taktisen-tason-taistelu.html#header-epasuora-tulituki", 
        category: "Sääntö" 
    },
    { 
        title: "Tulenjohto", 
        keywords: "jtac, tähystäjä, koordinaatit, radio, näköyhteys, viesti", 
        url: "taktisen-tason-taistelu.html#header-tulenjohto", 
        category: "Sääntö" 
    },
    { 
        title: "Murtosulutteet ja Miinat", 
        keywords: "miina, miinoite, miinakenttä, murtosulute, este, ansa, raivaus, pioneeri", 
        url: "taktisen-tason-taistelu.html#header-murtosulutteet", 
        category: "Sääntö" 
    },
    { 
        title: "Komppaniatason taktiikat", 
        keywords: "erikoiskyvyt, motti, painopiste, sitova tuli, vetäytyminen, päällikkö, komentaja", 
        url: "taktisen-tason-taistelu.html#header-komppanian-taktiikat-yksityiskohtaisesti", 
        category: "Komentaminen" 
    },
    {
        title: "Vaikutuksen Asteet (Osuminen)",
        keywords: "osuma, huti, raskas osuma, estotuli, vahinko, damage, critical",
        url: "ydinsaannot.html#header-hyokkayksen-ratkaisu-vaikutuksen-asteet",
        category: "Sääntö"
    },

    // --- UKK / KYSYMYKSET (Ohjataan UKK-sivulle) ---
    {
        title: "Mitä nopat tarkoittavat?",
        keywords: "d20, d6, d4, noppa, nopat, mitä tarkoittaa d",
        url: "sanasto-ja-ukk.html#ukk",
        category: "UKK / Kysymys"
    },
    {
        title: "Miten DC (Vaikeusaste) toimii?",
        keywords: "dc, vaikeusaste, difficulty class, onnistuminen",
        url: "sanasto-ja-ukk.html#ukk",
        category: "UKK / Kysymys"
    },
    {
        title: "Etu ja Haitta (Advantage/Disadvantage)",
        keywords: "etu, haitta, kaksi noppaa, advantage, disadvantage, plussa, miinus",
        url: "sanasto-ja-ukk.html#ukk",
        category: "UKK / Kysymys"
    },
    {
        title: "Mitä tapahtuu kun yksikkö tuhoutuu?",
        keywords: "kuolema, tappio, poistaminen, yksikkö tuhoutuu",
        url: "ydinsaannot.html#header-taistelukunnon-vaikutukset", // Tämä on parempi säännöissä
        category: "Kysymys"
    },
    {
        title: "Miten komppanianpäällikkö vaihdetaan?",
        keywords: "johtaja kuolee, uusi päällikkö, ylennys, komentoketju katkeaa",
        url: "taktisen-tason-taistelu.html#header-komentoketjun-katkeaminen",
        category: "Kysymys"
    },

    // --- YKSIKÖT (Siniset) ---
    { title: "Jääkäriryhmä", keywords: "suomi, jalkaväki, perusyksikkö, rynnäkkökivääri, kertasinko", url: "siniset-yksiköt.html#unit-jaakariryhma", category: "Yksikkö (Sininen)" },
    { title: "Tukiryhmä (KK)", keywords: "konekivääri, tulituki, suomi, lamauttava", url: "siniset-yksiköt.html#unit-tukiryhma", category: "Yksikkö (Sininen)" },
    { title: "PST-ryhmä", keywords: "panssarintorjunta, sinko, apilas, nlaw, raskas, suomi", url: "siniset-yksiköt.html#unit-pst-ryhma", category: "Yksikkö (Sininen)" },
    { title: "KRH-ryhmä (81mm)", keywords: "kranaatinheitin, epäsuora tuli, heitin, suomi", url: "siniset-yksiköt.html#unit-krh-ryhma", category: "Yksikkö (Sininen)" },
    { title: "Leopard 2A6", keywords: "panssarivaunu, tankki, ps-vaunu, 2a6, suomi, raskas", url: "siniset-yksiköt.html#unit-leopard-2a6", category: "Yksikkö (Sininen)" },
    { title: "CV9030", keywords: "rynnäkköpanssarivaunu, rynnäkkövaunu, cv, suomi, konetykki", url: "siniset-yksiköt.html#unit-cv90", category: "Yksikkö (Sininen)" },
    { title: "Sissi-jääkärit", keywords: "tiedustelu, tarkka-ampuja, sniper, metsä, suomi, erikois", url: "siniset-yksiköt.html#unit-sissi-jaakarit", category: "Yksikkö (Sininen)" },
    { title: "Pioneeriryhmä", keywords: "miina, räjähde, raivaus, suomi, sulute", url: "siniset-yksiköt.html#unit-pioneeriryhma", category: "Yksikkö (Sininen)" },

    // --- YKSIKÖT (Punaiset) ---
    { title: "Motorisoitu Jalkaväki", keywords: "venäjä, punainen, aaltohyökkäys, perusyksikkö", url: "punaiset-yksiköt.html#unit-motorisoitu-jalkavaki", category: "Yksikkö (Punainen)" },
    { title: "T-72B3", keywords: "panssarivaunu, tankki, venäläinen, punainen, raskas", url: "punaiset-yksiköt.html#unit-t-72b3", category: "Yksikkö (Punainen)" },
    { title: "BTR-82A", keywords: "kuljetuspanssarivaunu, pasi, btr, punainen, konetykki", url: "punaiset-yksiköt.html#unit-btr-82a", category: "Yksikkö (Punainen)" },
    { title: "Shturmovaya Gruppa", keywords: "rynnäkköryhmä, liekinheitin, termobaarinen, kaupunki, punainen", url: "punaiset-yksiköt.html#unit-shturmovaya-gruppa", category: "Yksikkö (Punainen)" },
    { title: "Spetsnaz GRU", keywords: "erikoisjoukko, tiedustelu, eliitti, punainen, sabotaasi", url: "punaiset-yksiköt.html#unit-spetsnaz-gru", category: "Yksikkö (Punainen)" }
];