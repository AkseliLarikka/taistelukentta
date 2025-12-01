const searchIndex = [
    // --- PÄÄSIVUT ---
    { title: "Etusivu", keywords: "aloitus, intro, koti, main", url: "index.html", category: "Sivu" },
    { title: "Ydinsäännöt", keywords: "säännöt, perusteet, noppa, heittäminen, vuoron vaiheet", url: "ydinsaannot.html", category: "Sivu" },
    { title: "Taktisen tason taistelu", keywords: "taistelu, ampuminen, komennot, vuoro, combat", url: "taktisen-tason-taistelu.html", category: "Sivu" },
    { title: "Skenaariot", keywords: "tehtävät, pelimuodot, kartat, operaatio, setup", url: "skenaariot.html", category: "Sivu" },
    { title: "Punaiset Yksiköt", keywords: "venäjä, vihollinen, kalusto, btr, tankki, opfor", url: "punaiset-yksikot.html", category: "Sivu" },
    { title: "Siniset Yksiköt", keywords: "suomi, omat, kalusto, pasi, leopard, fin", url: "siniset-yksikot.html", category: "Sivu" },
    { title: "Pelaajan Työkalu", keywords: "laskuri, apuri, sovellus, pikaopas, app", url: "pelaajan-pikaopas.html", category: "Työkalu" },
    { title: "Kampanjan Hallinta", keywords: "kokemus, xp, tp, täydennys, jatkuvuus, resurssit", url: "kampanjan-hallinta.html", category: "Sivu" },
    { title: "Sanasto ja UKK", keywords: "termit, lyhenteet, kysymykset, faq, help", url: "sanasto-ja-ukk.html", category: "Sivu" },

    // --- TAISTELUMEKANIIKAT ---
    { 
        title: "Moraali ja Moraalitestit", 
        keywords: "moraali, rohkeus, paniikki, kestävyys, dc, noppaheitto, murtuminen, pako, morale", 
        url: "taktisen-tason-taistelu.html#header-moraali", 
        category: "Sääntö" 
    },
    { 
        title: "Hallintavyöhyke (ZoC)", 
        keywords: "zoc, zone of control, alue, vaikutusalue, viereinen ruutu, liike pysähtyy, 2 cm, pysähtyminen, saarto", 
        url: "taktisen-tason-taistelu.html#header-hallintavyohyke-zone-of-control-zoc", 
        category: "Sääntö" 
    },
    { 
        title: "Komentopisteet (KP)", 
        keywords: "kp, resurssi, käskyt, toiminnot, johtaminen, pisteet, aktivointi, command points", 
        url: "taktisen-tason-taistelu.html#header-komentopisteet-ja-niiden-kaytto", 
        category: "Sääntö" 
    },
    { 
        title: "Tilaefektit (Vauriot, Lamautus)", 
        keywords: "lamautunut, vaurioitunut, tärähtänyt, vetäytyy, piiloutunut, status, kunto, suppressed, shaken, damage", 
        url: "taktisen-tason-taistelu.html#header-tarkeimmat-tilaefektit", 
        category: "Sääntö" 
    },
    { 
        title: "Tiedustelu ja Havaitseminen", 
        keywords: "havaitseminen, näkeminen, spotting, tähystys, kiikarit, piilo, häive, h, paljastaminen, epäily, tiedossa", 
        url: "taktisen-tason-taistelu.html#header-tiedustelu-ja-informaatiosota", 
        category: "Sääntö" 
    },
    { 
        title: "Liike ja Maasto", 
        keywords: "liikkuminen, nopeus, metsä, tie, suo, hidas, nopea, maasto, esteet, korkeusero, movement", 
        url: "taktisen-tason-taistelu.html#header-maaston-hierarkia-ja-vaikutukset-liikkeeseen", 
        category: "Sääntö" 
    },
    { 
        title: "Epäsuora Tulituki (Tykistö/KRH)", 
        keywords: "tykistö, krh, kranaatinheitin, keskitetty, pommitus, alue, mlrs, k9, moukari, artillery, indirect fire", 
        url: "taktisen-tason-taistelu.html#header-epasuora-tulituki", 
        category: "Sääntö" 
    },
    { 
        title: "Tulenjohto", 
        keywords: "jtac, tähystäjä, koordinaatit, radio, näköyhteys, viesti, forward observer", 
        url: "taktisen-tason-taistelu.html#header-tulenjohto", 
        category: "Sääntö" 
    },
    { 
        title: "Murtosulutteet ja Miinat", 
        keywords: "miina, miinoite, miinakenttä, murtosulute, este, ansa, raivaus, pioneeri, mines", 
        url: "taktisen-tason-taistelu.html#header-murtosulutteet", 
        category: "Sääntö" 
    },
    { 
        title: "Hyökkäys ja Osuminen", 
        keywords: "osuma, huti, raskas osuma, estotuli, vahinko, damage, critical, attack roll, hyökkäysheitto", 
        url: "taktisen-tason-taistelu.html#header-hyokkayksen-ratkaisu-vaikutuksen-asteet",
        category: "Sääntö"
    },
    { 
        title: "Vahinko- ja Kohdetyypit", 
        keywords: "sir, pst, sirpale, panssarintorjunta, pehmeä maali, kova maali, ajoneuvo, damage types", 
        url: "taktisen-tason-taistelu.html#header-vahinkotyypit-ja-kohdetyypit", 
        category: "Sääntö" 
    },

    // --- KOMENNOT JA TOIMINNOT ---
    { 
        title: "Hyökkäyskäsky", 
        keywords: "hyökkäys, ampuminen, 1 kp, tuli, attack order, fire", 
        url: "taktisen-tason-taistelu.html#header-joukkueenjohtajan-perustoiminnot-jokainen-pelaaja", 
        category: "Komento" 
    },
    { 
        title: "Irtautuminen", 
        keywords: "vetäytyminen, pako, zoc, poistuminen, 2 kp, disengage, retreat", 
        url: "taktisen-tason-taistelu.html#header-joukkueenjohtajan-perustoiminnot-jokainen-pelaaja", 
        category: "Komento" 
    },
    { 
        title: "Moraalin Kohotus", 
        keywords: "moraali, toipuminen, lamautus, palautus, rally, 2 kp", 
        url: "taktisen-tason-taistelu.html#header-joukkueenjohtajan-perustoiminnot-jokainen-pelaaja", 
        category: "Komento" 
    },
    { 
        title: "Tulen Keskittäminen", 
        keywords: "keskitys, bonus, osuminen, focus fire, 1 kp, yhteistuli", 
        url: "taktisen-tason-taistelu.html#header-joukkueenjohtajan-perustoiminnot-jokainen-pelaaja", 
        category: "Komento" 
    },
    { 
        title: "Valmius (Overwatch)", 
        keywords: "valmius, väijytys, reaktio, overwatch, 1 kp, reaction fire, odotus", 
        url: "taktisen-tason-taistelu.html#header-joukkueenjohtajan-perustoiminnot-jokainen-pelaaja", 
        category: "Komento" 
    },
    { 
        title: "Komennon Varmistus", 
        keywords: "bonus, osuminen, varmistus, reaktio, 1 kp, command confirmation", 
        url: "taktisen-tason-taistelu.html#header-joukkueenjohtajan-perustoiminnot-jokainen-pelaaja", 
        category: "Komento" 
    },
    { 
        title: "Uusintakäsky", 
        keywords: "uusintaheitto, reroll, epäonnistuminen, reaktio, 2 kp, command retry", 
        url: "taktisen-tason-taistelu.html#header-joukkueenjohtajan-perustoiminnot-jokainen-pelaaja", 
        category: "Komento" 
    },

    // --- KOMENTAJAN KYVYT ---
    { 
        title: "Mottitaktiikka", 
        keywords: "motti, saarto, erikoiskyky, 5 kp, komppaniapäällikkö", 
        url: "taktisen-tason-taistelu.html#header-komppanian-taktiikat-yksityiskohtaisesti", 
        category: "Kyky" 
    },
    { 
        title: "Painopisteen Muodostaminen", 
        keywords: "painopiste, hyökkäys, nopeus, 3 kp, liikebonus", 
        url: "taktisen-tason-taistelu.html#header-komppanian-taktiikat-yksityiskohtaisesti", 
        category: "Kyky" 
    },
    { 
        title: "Sitova Tuli", 
        keywords: "sitova, suppressio, moraali, 2 kp, debuff", 
        url: "taktisen-tason-taistelu.html#header-komppanian-taktiikat-yksityiskohtaisesti", 
        category: "Kyky" 
    },
    { 
        title: "Järjestäytynyt Vetäytyminen", 
        keywords: "vetäytyminen, pako, 3 kp, irtaantuminen", 
        url: "taktisen-tason-taistelu.html#header-komppanian-taktiikat-yksityiskohtaisesti", 
        category: "Kyky" 
    },

    // --- TARKENTAVAT SÄÄNNÖT ---
    { 
        title: "Näköyhteys (LoS)", 
        keywords: "näkeminen, los, line of sight, esteet, metsä, rakennus, visibility", 
        url: "taktisen-tason-taistelu.html#header-vaikutus-nakoyhteyteen", 
        category: "Sääntö" 
    },
    { 
        title: "Suoja ja Maasto", 
        keywords: "suoja, cover, metsä, rakennus, tiheikkö, puolustusbonus, armor", 
        url: "taktisen-tason-taistelu.html#header-vaikutus-suojaan-etsi-paras-suoja", 
        category: "Sääntö" 
    },
    { 
        title: "Korkeuserot", 
        keywords: "korkeus, mäki, kukkula, ylämäki, alamäki, elevation, height advantage", 
        url: "taktisen-tason-taistelu.html#header-korkeuserot", 
        category: "Sääntö" 
    },
    { 
        title: "Tilaisuusisku", 
        keywords: "ilmainen hyökkäys, opportunity attack, zoc, poistuminen, selusta", 
        url: "taktisen-tason-taistelu.html#header-hallintavyohyke-zone-of-control-zoc", 
        category: "Sääntö" 
    },
    { 
        title: "Kriittiset Tilanteet (Nat 1 & 20)", 
        keywords: "nat 1, nat 20, kriittinen, fumbled, critical hit, asehäiriö, onnistuminen", 
        url: "taktisen-tason-taistelu.html#header-kriittiset-tilanteet-hallittu-kaaos", 
        category: "Sääntö" 
    },

    // --- UKK / KYSYMYKSET ---
    {
        title: "Mitä nopat tarkoittavat?",
        keywords: "d20, d6, d4, noppa, nopat, mitä tarkoittaa d, dice",
        url: "sanasto-ja-ukk.html#ukk",
        category: "UKK"
    },
    {
        title: "Miten DC (Vaikeusaste) toimii?",
        keywords: "dc, vaikeusaste, difficulty class, onnistuminen, target number",
        url: "sanasto-ja-ukk.html#ukk",
        category: "UKK"
    },
    {
        title: "Etu ja Haitta (Advantage)",
        keywords: "etu, haitta, kaksi noppaa, advantage, disadvantage, plussa, miinus",
        url: "sanasto-ja-ukk.html#ukk",
        category: "UKK"
    },
    {
        title: "Mitä tapahtuu kun yksikkö tuhoutuu?",
        keywords: "kuolema, tappio, poistaminen, yksikkö tuhoutuu, destroyed",
        url: "sanasto-ja-ukk.html#ukk",
        category: "UKK"
    },
    {
        title: "Miten komppanianpäällikkö vaihdetaan?",
        keywords: "johtaja kuolee, uusi päällikkö, ylennys, komentoketju katkeaa, replacement",
        url: "taktisen-tason-taistelu.html#header-komentoketjun-katkeaminen",
        category: "Sääntö"
    },

    // --- KAMPANJA ---
    {
        title: "Kasarmi ja Yksiköt",
        keywords: "kasarmi, hallinta, roster, joukot, yksikkölista",
        url: "kampanjan-hallinta.html#header-kasarmi-komppanian-yksikkopooli-ja-hallintakeskus",
        category: "Kampanja"
    },
    {
        title: "Täydennyspisteet (TP)",
        keywords: "tp, täydennys, korjaus, osto, resurssit, points",
        url: "kampanjan-hallinta.html#header-taydennyspisteiden-tp-kaytto",
        category: "Kampanja"
    },
    {
        title: "Kokemuspisteet (XP)",
        keywords: "xp, kokemus, level up, taitotaso, kehitys, experience",
        url: "kampanjan-hallinta.html#header-yksikoiden-kehitys-ja-erikoisyksikot",
        category: "Kampanja"
    },
    {
        title: "Veteraanikyvyt",
        keywords: "veteraani, perk, kyky, erikoistuminen, sisu, kaupunkisissi",
        url: "kampanjan-hallinta.html#header-yksikoiden-erikoistuminen-veteraanikyvyt",
        category: "Kampanja"
    },
    {
        title: "Strategiset Doktriinit",
        keywords: "doktriini, erikoistuminen, viivytys, hyökkäys, tiedustelu, doctrine, passive",
        url: "kampanjan-hallinta.html#header-strategiset-doktriinit",
        category: "Kampanja"
    },
    {
        title: "Tappioiden Paikkaaminen",
        keywords: "tk palautus, parannus, korjaus, tp käyttö, healing, reinforcement",
        url: "kampanjan-hallinta.html#header-taisteluiden-valinen-toipuminen",
        category: "Kampanja"
    },

    // --- YKSIKÖT (Siniset) ---
    { title: "Jääkäriryhmä (SIN)", keywords: "suomi, jalkaväki, perusyksikkö, rynnäkkökivääri, kertasinko, apilas", url: "siniset-yksikot.html#unit-jaakariryhma", category: "Yksikkö" },
    { title: "Tukiryhmä KK (SIN)", keywords: "konekivääri, tulituki, suomi, lamauttava, pkm", url: "siniset-yksikot.html#unit-tukiryhma", category: "Yksikkö" },
    { title: "PST-ryhmä (SIN)", keywords: "panssarintorjunta, sinko, nlaw, raskas, suomi, at", url: "siniset-yksikot.html#unit-pst-ryhma", category: "Yksikkö" },
    { title: "KRH-ryhmä 81mm (SIN)", keywords: "kranaatinheitin, epäsuora tuli, heitin, suomi, mortar", url: "siniset-yksikot.html#unit-krh-ryhma", category: "Yksikkö" },
    { title: "Leopard 2A6 (SIN)", keywords: "panssarivaunu, tankki, ps-vaunu, 2a6, suomi, raskas, mbt", url: "siniset-yksikot.html#unit-leopard-2a6", category: "Yksikkö" },
    { title: "CV9030 (SIN)", keywords: "rynnäkköpanssarivaunu, rynnäkkövaunu, cv, suomi, konetykki, ifv", url: "siniset-yksikot.html#unit-cv90", category: "Yksikkö" },
    { title: "Sissi-jääkärit (SIN)", keywords: "tiedustelu, tarkka-ampuja, sniper, metsä, suomi, erikois, sissi", url: "siniset-yksikot.html#unit-sissi-jaakarit", category: "Yksikkö" },
    { title: "Pioneeriryhmä (SIN)", keywords: "miina, räjähde, raivaus, suomi, sulute, engineer", url: "siniset-yksikot.html#unit-pioneeriryhma", category: "Yksikkö" },
    { title: "K9 Panssarihaupitsi (SIN)", keywords: "tykistö, epäorgaaninen, 155mm, moukari, artillery", url: "siniset-yksikot.html#unit-tykistopatteri-155mm", category: "Yksikkö" },
    { title: "MLRS Raketinheitin (SIN)", keywords: "raketinheitin, raskas, epäorgaaninen, alue, tuho", url: "siniset-yksikot.html#unit-raketinheitin-mlrs", category: "Yksikkö" },

    // --- YKSIKÖT (Punaiset) ---
    { title: "Motorisoitu Jalkaväki (PUN)", keywords: "venäjä, punainen, aaltohyökkäys, perusyksikkö, btr-jalkaväki", url: "punaiset-yksikot.html#unit-motorisoitu-jalkavaki", category: "Yksikkö" },
    { title: "T-72B3 (PUN)", keywords: "panssarivaunu, tankki, venäläinen, punainen, raskas, mbt", url: "punaiset-yksikot.html#unit-t-72b3", category: "Yksikkö" },
    { title: "BTR-82A (PUN)", keywords: "kuljetuspanssarivaunu, pasi, btr, punainen, konetykki, apc", url: "punaiset-yksikot.html#unit-btr-82a", category: "Yksikkö" },
    { title: "Shturmovaya Gruppa (PUN)", keywords: "rynnäkköryhmä, liekinheitin, termobaarinen, kaupunki, punainen, storm", url: "punaiset-yksikot.html#unit-shturmovaya-gruppa", category: "Yksikkö" },
    { title: "Spetsnaz GRU (PUN)", keywords: "erikoisjoukko, tiedustelu, eliitti, punainen, sabotaasi, special forces", url: "punaiset-yksikot.html#unit-spetsnaz-gru", category: "Yksikkö" },
    { title: "PST-ryhmä Kornet (PUN)", keywords: "panssarintorjunta, ohjus, atgm, punainen", url: "punaiset-yksikot.html#unit-pst-ryhma-red", category: "Yksikkö" },
    { title: "KRH 120mm (PUN)", keywords: "kranaatinheitin, epäsuora tuli, mortar, punainen", url: "punaiset-yksikot.html#unit-krh-120mm", category: "Yksikkö" }
];