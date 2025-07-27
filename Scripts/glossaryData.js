/**
 * Taistelukenttä d20 -sivuston sanastotietokantaa hallinnoiva skripti.
 * @version 2.1 - Syvälliset, mekaaniset selitykset kaikille avaintermeille.
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
    "suoja": "Vastaa panssaroinnin ja suojautumisen tasoa. Kuinka vaikea yksikköön on osua (vrt. Armor Class).",
    "tuli-isku": "Vahinkoarvo (TI), jota käytetään onnistuneiden osumien jälkeen. Ilmaistaan yleensä noppana (esim. d6, 2d12).",
    "taistelukunto": "Yksikön elinvoima (TK). Vahingot vähentävät tätä arvoa.",
    "taitotaso": "Yksikön yleinen osaaminen ja tehokkuus (TT). Lasketaan kaavalla: Koulutus + Kokemus. Lisätään hyökkäys- ja tiedusteluheittoihin.",
    "vastakkainen heitto": "Tilanne, jossa kaksi osapuolta heittää noppaa, ja heittojen tuloksia verrataan toisiinsa.",
    "vp": "Voittopiste. Mittaa taistelun tai kampanjan menestystä.",
    "xp": "Yksikön taistelukokemusta (Experience Points). Lisää yksikön tehokkuutta parantamalla sen Taitotasoa.",

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
    "piiloutunut": "<strong>Piiloutunut:</strong> Erityiskyvyllä saavutettu tila.<ul><li>Ei voi valita kohteeksi, ellei vihollinen ole 2 cm tai lähempänä.</li><li>Tila poistuu, jos yksikkö liikkuu, hyökkää tai vihollinen tulee 2 cm päähän.</li></ul>"
};