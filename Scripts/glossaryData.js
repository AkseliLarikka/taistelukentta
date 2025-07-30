/**
 * Taistelukenttä d20 -sivuston sanastotietokantaa hallinnoiva skripti.
 * @version 2.3 - Lisätty vahinkotyypit SIR ja PST.
 * @author Akseli Larikka
 */
const glossaryData = {
    // === Yleistermit ===
    "ansat ja sulutteet": "Pelaajien salaa asettamia vaaroja, kuten miinakenttiä, jotka laukeavat vihollisen liikkeestä.",
    "d20-järjestelmä": "Pelin ydinmekaniikka, joka perustuu 20-sivuisen nopan (d20) heittoon. Heittoon lisätään bonuksia ja tulosta verrataan vaikeusasteeseen (DC) tai vastustajan arvoon.",
    "dc": "Vaikeusaste (Difficulty Class). Luku, joka nopanheiton on ylitettävä tai saavutettava onnistuakseen. Esimerkiksi moraalitesti DC 12 vaatii heiton tulokseksi vähintään 12.",
    "epäorgaaninen tulituki": "Kartan ulkopuolinen tulituki, kuten pataljoonan tai prikaatin tykistö (esim. Panssarihaupitsi K9 tai Raskas Raketinheitin MLRS). Sen kutsuminen vaatii yleensä Komppanianpäällikön toimia.",
    "etu ja haitta": "Noppamekaniikat, jotka muokkaavat heittoja:<ul><li><strong>Etu (Advantage):</strong> Heitetään kaksi d20-noppaa ja käytetään korkeampaa tulosta.</li><li><strong>Haitta (Disadvantage):</strong> Heitetään kaksi d20-noppaa ja käytetään matalampaa tulosta.</li></ul>",
    "gm": "Game Master eli Pelinjohtaja. Toimii Punaisen puolen komentajana ja pelin tuomarina.",
    "hallintavyöhyke": "Yksikön ympärillä oleva 2 cm säteinen vyöhyke (Zone of Control, ZoC), joka vaikeuttaa vihollisen liikkumista. Vihollisen liike päättyy välittömästi, kun se saapuu vyöhykkeelle.",
    "koulutus": "Yksikön peruskoulutuksen laatu. Pysyvä arvo, joka vaikuttaa Taitotasoon (TT).",
    "komentoyhteys": "Komppanianpäällikön ja Joukkueenjohtajan välinen toimiva viestiyhteys, joka vaaditaan Komentopisteiden siirtoon ja tiettyihin kohdennettuihin käskyihin.",
    "kp": "Komentopiste. Pelaajan komentajan kyky vaikuttaa yksiköihin. Käytetään erikoistoimintoihin, kuten hyökkäyskäskyihin ja kykyjen aktivointiin.",
    "liike": "Yksikön liikkumisnopeus eri maastotyypeissä senttimetreinä.",
    "linnoittautuminen": "Toiminto, jossa yksikkö parantaa puolustusasemaansa. Linnoittautunutta kohdetta vastaan hyökätessä saa Haitan (Disadvantage).",
    "los": "Näköyhteys (Line of Sight). Suora, esteetön linja yksiköstä kohteeseen, joka mahdollistaa suoran tulen.",
    "moraali": "Moraalitestiin lisättävä bonus. Korkeampi arvo tarkoittaa parempaa henkistä kestävyyttä ja taistelutahtoa.",
    "orgaaninen tulituki": "Pelaajan suoraan ohjaama tulitukiyksikkö, joka on fyysisesti pelilaudalla, kuten komppanian oma kranaatinheitinryhmä.",
    "sodan sumu": "Pelin keskeinen teema, joka simuloi epätäydellistä tietoa vihollisen sijainnista ja vahvuudesta. Tiedustelu on avain sen hälventämiseen.",
    "suoja": "Vastaa panssaroinnin ja suojautumisen tasoa. Kuinka vaikea yksikköön on osua.",
    "tuli-isku": "Vahinkoarvo (TI), jota käytetään onnistuneiden osumien jälkeen. Ilmaistaan yleensä noppana (esim. d6, 2d12).",
    "taistelukunto": "Yksikön elinvoima (TK). Vahingot vähentävät tätä arvoa.",
    "taitotaso": "Yksikön yleinen osaaminen ja tehokkuus (TT). Lasketaan kaavalla: Koulutus + Kokemus. Lisätään hyökkäys- ja tiedusteluheittoihin.",
    "vastakkainen heitto": "Tilanne, jossa kaksi osapuolta heittää noppaa, ja heittojen tuloksia verrataan toisiinsa.",
    "vp": "Voittopiste. Mittaa taistelun tai kampanjan menestystä.",
    "xp": "Yksikön taistelukokemusta (Experience Points). Lisää yksikön tehokkuutta parantamalla sen Taitotasoa.",
    "häive": "Yksikön kyky välttää havaituksi tuleminen. Korkeampi arvo vaikeuttaa vihollisen havaitsemista.",
    "vahinkotyyppi-sir": "<strong>SIR (Sirpalevaikutus):</strong> Yleisvahinko jalkaväkiaseista ja räjähdyksistä. Tehokas pehmeitä maaleja (jalkaväkeä) vastaan, mutta tehoton panssaroituja ajoneuvoja vastaan.",
    "vahinkotyyppi-pst": "<strong>PST (Panssarintorjunta):</strong> Erikoisvahinko panssarinläpäisyyn suunnitelluista aseista. Tehokas panssaroituja maaleja vastaan, mutta tehoton pehmeitä maaleja (jalkaväkeä) vastaan.",

    // === Lyhenteet ===
    "jr": "Lyhenne jääkäriryhmälle.",
    "kk": "Lyhenne konekiväärille.",
    "krh": "Lyhenne kranaatinheittimelle.",
    "pst": "Lyhenne panssarintorjunnalle.",
    "tr": "Lyhenne tukiryhmälle.",
    
    // === Komppaniatason taktiikat (YKSITYISKOHTAISET SELITYKSET) ===
    "komppaniatason taktiikat": "<strong>Yleisnimitys Komppanianpäällikön voimakkaille erikoiskyvyille.</strong> Päällikkö voi käyttää vain yhden näistä (Motti, Painopiste, Sitova Tuli, Järjestäytynyt Vetäytyminen) per vuoro.",
    "mottitaktiikka": "<strong>Mottitaktiikka (5 KP, kerran/taistelu):</strong> Komppanianpäällikkö valitsee kartalta pisteen. Kaikki vihollisyksiköt 10 cm säteellä tästä pisteestä joutuvat tekemään välittömästi Moraalitestin (DC 15). Jos testi epäonnistuu, yksikkö joutuu Vetäytyy-tilaan.",
    "painopisteen-muodostaminen": "<strong>Painopisteen Muodostaminen (3 KP):</strong> Komppanianpäällikkö nimeää yhden omista joukkueistaan. Tämän vuoron ajan kaikki kyseisen joukkueen yksiköt saavat +5 cm lisää liikkumista, kun niille annetaan Hyökkäyskäsky.",
    "sitova-tuli": "<strong>Sitova Tuli (2 KP):</strong> Komppanianpäällikkö nimeää yhden omista joukkueistaan. Tämän vuoron ajan kyseisen joukkueen onnistuneet hyökkäykset antavat kohteelle -1 rangaistuksen sen seuraavaan Moraalitestiin. Vaikutus on kasautuva.",
    "jarjestaytynyt-vetaytyminen": "<strong>Järjestäytynyt Vetäytyminen (3 KP):</strong> Komppanianpäällikkö valitsee enintään kolme omaa yksikköä. Nämä yksiköt voivat vetäytyä ja silti ampua samalla vuorolla (normaalisti vetäytyminen estää ampumisen).",
    "vahvistettu-maali": "<strong>Vahvistettu Maali (1 KP):</strong> Jos vähintään kaksi omaa yksikköä eri joukkueista näkee saman vihollisen, Komppanianpäällikkö voi käyttää tämän kyvyn. Seuraava hyökkäys kyseistä vihollista vastaan saa +2 bonuksen osumiseen. Bonus kasvaa +2:lla jokaisesta lisäjoukkueesta, joka näkee maalin.",

    // === YKSITYISKOHTAISET TILAEFEKTIT ===
    "tilaefektit": "Yleisnimitys yksiköiden toimintakykyyn vaikuttaville tiloille.",
    "vaurioitunut": "<strong>Vaurioitunut:</strong> Yksikkö siirtyy tähän tilaan, kun sen TK putoaa alle 50%.<br><ul><li>Pakollinen Moraalitesti (DC 12).</li><li>Liike-arvo ja Tuli-isku puolitettu.</li><li>Ansaitsee vain puolet XP:stä kampanjassa.</li></ul>",
    "tarahtanyt": "<strong>Tärähtänyt (Shaken):</strong> Lievästi epäonnistuneen moraalitestin seuraus. Yksikkö kärsii -2 rangaistuksen seuraavaan hyökkäysheittoonsa, mutta voi muuten toimia normaalisti.",
    "lamautunut": "<strong>Lamautunut (Suppressed):</strong> Epäonnistuneen moraalitestin seuraus.<ul><li>Ei voi liikkua tai käyttää toimintoja.</li><li>Sitä vastaan tehdyt hyökkäykset saavat Edun (Advantage).</li><li>Poistuu onnistuneella moraalitestillä tai 'Moraalin Kohotus' -komennolla.</li></ul>",
    "vetaytyy": "<strong>Vetäytyy:</strong> Kriittisesti epäonnistuneen moraalitestin seuraus. Yksikkö pakenee hallitsemattomasti täyden liikkeensä verran poispäin lähimmästä vihollisesta.",
    "piiloutunut": "<strong>Piiloutunut:</strong> Erityiskyvyllä saavutettu tila.<ul><li>Ei voi valita kohteeksi, ellei vihollinen ole 2 cm tai lähempänä.</li><li>Tila poistuu, jos yksikkö liikkuu, hyökkää tai vihollinen tulee 2 cm päähän.</li></ul>",
    
    // === TAISTELUN YDINMEKANIIKAT ===
    "vaikutuksen-asteet": "Taistelun lopputuloksen määrittävä järjestelmä, jossa hyökkäysheiton tulosta verrataan puolustajan suoja-arvoon. Lopputulos voi olla Puhdas Huti, Estotuli, Normaali Osuma tai Raskas Osuma.",
    "estotuli": "Vaikutuksen aste, joka syntyy, kun hyökkäysheitto alittaa puolustusarvon 1–4 pisteellä. Ei aiheuta vahinkoa, mutta antaa kohteelle <strong>Tärähtänyt</strong>-tilan.",
    "raskas-osuma": "Vaikutuksen aste, joka syntyy, kun hyökkäysheitto ylittää puolustusarvon vähintään 5 pisteellä. Aiheuttaa normaalin vahingon lisäksi +1d6 lisävahinkoa.",
    "vahinkotyypit": "Aseiden aiheuttama vahinko jaetaan kahteen tyyppiin: <strong>SIR (Sirpalevaikutus)</strong>, joka on tehokas jalkaväkeä vastaan, ja <strong>PST (Panssarintorjunta)</strong>, joka on tehokas panssaroituja ajoneuvoja vastaan.",
    "tilaisuusisku": "Ilmainen hyökkäys, jonka yksikkö saa tehdä vihollisyksikköä vastaan, joka yrittää poistua sen hallintavyöhykkeeltä ilman Irtautuminen-komentoa.",
    "valmius": "Komentopisteellä aktivoitava tila, jossa yksikkö voi keskeyttää vihollisen vuoron ja ampua välittömästi, jos vihollisyksikkö liikkuu sen näköyhteydelle.",

    // === KAMPANJAN HALLINTA ===
    "tp": "Täydennyspiste. Taisteluista ansaittava resurssi, jota käytetään yksiköiden taistelukunnon (TK) palauttamiseen ja uusien yksiköiden ostamiseen tuhoutuneiden tilalle.",
    "kasarmi": "Komppanian yksikköpooli ja hallintakeskus, jota edustaa Komppanian Vahvuusluettelo. Kasarmilta valitaan yksiköt kuhunkin skenaarioon.",
    "strateginen-doktriini": "Ennen kampanjan alkua valittava komppanian yleinen erikoistuminen (esim. Viivytystaistelu), joka antaa pysyviä etuja tietyissä tilanteissa.",
    "veteraanikyvyt": "Pysyviä erikoiskykyjä, joita yksiköt voivat oppia kerättyään riittävästi kokemusta (XP). Yksikkö voi valita ensimmäisen kykynsä saavutettuaan 20 XP:tä.",
    
    // === SÄÄNTÖTEKNISET TARKENNUKSET ===
    "tulenjohto": "Kyky kutsua ja ohjata epäsuoraa tulta. Pelissä tämä kyky on integroitu Jääkäriryhmiin. Onnistunut tulenjohto vaatii vähintään 'Tiedossa'-tason havainnon kohteesta.",
    "korkeusero": "Maaston korkeuskäyrien aiheuttama taktinen etu tai haitta. Ylempänä oleva yksikkö saa bonuksia hyökkäys- ja tiedusteluheittoihin.",
    "hyökkäyskäsky": "Yhden komentopisteen (1 KP) maksava käsky, joka antaa yksikölle luvan suorittaa hyökkäyksen Tulitoimintavaiheessa. Tämä on yleensä tarpeen, jos yksikkö on ensin liikkunut samalla vuorolla.",
    "irtautuminen": "Kahden komentopisteen (2 KP) arvoinen komento, joka antaa yksikölle luvan vetäytyä hallitusti vihollisen hallintavyöhykkeeltä ilman, että vihollinen saa tehdä siihen tilaisuusiskua.",
    "tulen-keskittäminen": "Yhden komentopisteen (1 KP) komento, jolla nimetään yksi tai useampi oman joukkueen ryhmä keskittämään tulensa yhteen maaliin. Jokainen käskyn alainen ryhmä saa +1 bonuksen hyökkäysheittoonsa kyseistä maalia vastaan.",
    "tiedustelutoiminta": "Yhden komentopisteen (1 KP) komento, joka antaa ryhmälle luvan suorittaa aktiivisen tiedusteluheiton piilossa olevien vihollisten tai ansojen havaitsemiseksi.",
    "taisteluryhmä": "Pelinjohtajan tapa jaotella Punaisen puolen joukkoja (esim. 'Panssarikiila'). Jokainen taisteluryhmä tuottaa oman erillisen KP-poolinsa, ja yhteen taisteluryhmään voi käyttää enintään 4 KP per vuoro.",
    "order-of-battle": "Skenaarion alussa määritelty lista kummankin osapuolen joukoista, niiden määrästä ja tyypistä.",
    "resurssipisteet": "Kartalla olevia strategisia kohteita (esim. ammusvarasto), joiden valtaaminen ja hallussapito antaa skenaarion lopussa bonuksia, kuten ylimääräisiä Täydennyspisteitä (TP), kampanjavaiheeseen.",
    "kohdetyypit": "Yksiköt jaetaan kahteen kohdetyyppiin: <strong>Pehmeä maali</strong> (jalkaväki) ja <strong>Panssaroitu maali</strong> (ajoneuvot). Vahinkotyyppi (SIR/PST) määrittää, kuinka tehokas hyökkäys on eri kohdetyyppejä vastaan.",
    "kriittiset-tilanteet": "Erityisseuraukset, jotka aktivoituvat d20-heiton tuloksella 1 (katastrofaalinen virhe, esim. asehäiriö) tai 20 (erinomainen suoritus, esim. automaattinen Raskas Osuma osuessaan).",
    "aaltohyökkäys": "Motorisoitujen jalkaväkiryhmien passiivinen kyky. Jos vähintään kolme tällaista ryhmää hyökkää samaan kohteeseen samalla vuorolla, ne kaikki saavat +1 Moraaliin seuraavalla vuorollaan.",
    "sisu": "Jääkäriryhmän passiivinen kyky, jonka ansiosta sen Moraali-arvo ei putoa, vaikka yksikkö joutuisi Vaurioitunut-tilaan."
};