/**
 * Taistelukenttä d20 -sivuston sanastotietokantaa hallinnoiva skripti.
 * @version 1.1 - Lisätty yksityiskohtaiset selitykset tilaefekteille.
 * @author Akseli Larikka
 */
const glossaryData = {
    "ansat ja sulutteet": "Pelaajien salaa asettamia vaaroja, kuten miinakenttiä, jotka laukeavat vihollisen liikkeestä.",
    "d20-järjestelmä": "Pelin ydinmekaniikka, joka perustuu 20-sivuisen nopan (d20) heittoon. Heittoon lisätään bonuksia ja tulosta verrataan vaikeusasteeseen (DC) tai vastustajan arvoon.",
    "dc": "Vaikeusaste. Luku, joka nopanheiton on ylitettävä tai saavutettava onnistuakseen. Esimerkiksi moraalitesti DC 12 vaatii heiton tulokseksi vähintään 12.",
    "epäorgaaninen tulituki": "Kartan ulkopuolinen tulituki, kuten pataljoonan tykistö.",
    "etu ja haitta": "Noppamekaniikat, jotka muokkaavat heittoja:<ul><li><strong>Etu (Advantage):</strong> Heitetään kaksi d20-noppaa ja käytetään korkeampaa tulosta.</li><li><strong>Haitta (Disadvantage):</strong> Heitetään kaksi d20-noppaa ja käytetään matalampaa tulosta.</li></ul>",
    "globaalit/kohdennetut kyvyt": "Komppanianpäällikön kykyjen kaksi luokkaa. Globaalit kyvyt (esim. Tulitukipyyntö) eivät vaadi yhteyttä alaisiin, kun taas kohdennetut kyvyt (esim. Painopisteen muodostaminen) vaativat toimivan komentoyhteyden.",
    "gm": "Toimii Red Teamin komentajana ja tuomarina.",
    "hallintavyöhyke": "Yksikön ympärillä oleva 2 cm säteinen vyöhyke, joka vaikeuttaa vihollisen liikkumista.",
    "koulutus": "Yksikön peruskoulutuksen laatu. Pysyvä arvo, joka vaikuttaa Taitotasoon (TT).",
    "kk": "Lyhenne konekiväärille. Yksiköt, kuten Tukiryhmä (KK), ovat erikoistuneet sen käyttöön.",
    "komentoyhteys": "Komppanianpäällikön ja Joukkueenjohtajan välinen yhteys, joka vaaditaan Komentopisteiden siirtoon ja tiettyihin käskyihin.",
    "komppaniatason taktiikat": "Komppanianpäällikön käyttämiä strategisia käskyjä.",
    "kp": "Pelaajan komentajan kyky vaikuttaa yksiköihin. Käytetään erikoistoimintoihin.",
    "liike": "Yksikön liikkumisnopeus eri maastotyypeissä senttimetreinä.",
    "linnoittautuminen": "Toiminto, jossa yksikkö parantaa puolustusasemaansa. Linnoittautunutta kohdetta vastaan hyökätessä saa Haitan (Disadvantage).",
    "los": "Näköyhteys. Suora, esteetön linja yksiköstä kohteeseen, joka mahdollistaa suoran tulen. Tietyt maastot, kuten tiheä metsä tai rakennukset, estävät LoS:n.",
    "moraali": "Moraalitestin bonus. Korkeampi tarkoittaa parempaa henkistä kestävyyttä.",
    "orgaaninen tulituki": "Pelaajan suoraan ohjaama tulitukiyksikkö pelilaudalla.",
    "pelitasot": "Kuvaavat pelin laajuutta (Joukkuepeli, Komppaniapeli).",
    "pelivuoron vaiheet": "Pelin ydinmekaniikka, joka jakaantuu viiteen vaiheeseen.",
    "pst": "Lyhenne panssarintorjunnalle. PST-ryhmät ja -aseet ovat erikoistuneet ajoneuvojen tuhoamiseen.",
    "suoja": "Vastaa panssaroinnin tasoa. Kuinka vaikea yksikköön on osua.",
    "sodan sumu": "Pelin keskeinen teema, joka simuloi epätäydellistä tietoa vihollisen sijainnista ja vahvuudesta. Tiedustelu on avain sen hälventämiseen.",
    "tuli-isku": "Vahinkoarvo, jota käytetään osumien jälkeen.",
    "taistelukunto": "Yksikön elinvoima. Vahingot vähentävät tätä.",
    "taitotaso": "Yksikön osaaminen. Lasketaan: Koulutus + Kokemus.",
    "vastakkainen heitto": "Tilanne, jossa kaksi osapuolta heittää noppaa, ja heittojen tuloksia verrataan toisiinsa. Esimerkiksi tiedustelussa tiedustelijan heittoa verrataan kohteen heittoon.",
    "vp": "Mittaa taistelun tai kampanjan menestystä.",
    "xp": "Yksikön taistelukokemusta. Lisää yksikön tehokkuutta kampanjapelissä.",
    "jr": "Lyhenne jääkäriryhmälle. Jääkärit ovat suomalaisen sotilasdoktriinin selkäranka.",
    "tr": "Lyhenne tukiryhmälle. Tukiryhmät ovat erikoistuneet konekiväärien ja lamauttavan tulen käyttöön.",
    "krh": "Lyhenne kranaatinheittimelle. KRH-ryhmät ovat erikoistuneet tarkan orgaanisen epäsuorantulen käyttöön.",

    // === YKSITYISKOHTAISET TILAEFEKTIT ===
    "tilaefektit": "Yleisnimitys yksiköiden toimintakykyyn vaikuttaville tiloille, kuten Vaurioitunut, Lamautunut, Tärähtänyt, Vetäytyy ja Piiloutunut.",
    "vaurioitunut": "<strong>Vaurioitunut:</strong> Yksikkö siirtyy tähän tilaan, kun sen TK putoaa alle 50%.<br><ul><li>Pakollinen Moraalitesti (DC 12).</li><li>Liike-arvo ja Tuli-isku puolitettu.</li><li>Ansaitsee vain puolet XP:stä kampanjassa.</li><li>Yksikön yksikkökortissa on merkitty kyky, jonka tekeminen vaikeutuu vaurioitumisen seurauksena.</li></ul>",
    "tarahtanyt": "<strong>Tärähtänyt (Shaken):</strong> Lievästi epäonnistuneen moraalitestin seuraus. Yksikkö kärsii -2 rangaistuksen seuraavaan hyökkäysheittoonsa, mutta voi muuten toimia normaalisti. Tila poistuu hyökkäyksen jälkeen tai vuoron lopussa.",
    "lamautunut": "<strong>Lamautunut (Suppressed):</strong> Epäonnistuneen moraalitestin seuraus.<ul><li>Ei voi liikkua tai käyttää toimintoja.</li><li>Sitä vastaan tehdyt hyökkäykset saavat Edun (Advantage).</li><li>Poistuu onnistuneella moraalitestillä tai 'Moraalin Kohotus' -komennolla.</li></ul>",
    "vetaytyy": "<strong>Vetäytyy:</strong> Kriittisesti epäonnistuneen moraalitestin seuraus. Yksikkö pakenee hallitsemattomasti täyden liikkeensä verran poispäin lähimmästä vihollisesta.",
    "piiloutunut": "<strong>Piiloutunut:</strong> Erityiskyvyllä saavutettu tila.<ul><li>Ei voi valita kohteeksi, ellei vihollinen ole 5 cm tai lähempänä.</li><li>Tila poistuu, jos yksikkö liikkuu, hyökkää tai vihollinen tulee 5 cm päähän.</li></ul>"
};