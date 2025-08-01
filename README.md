# Taistelukenttä d20

> **Enemmän kuin sotapeli – Yhteistyöhön perustuva komentajan simulaattori.**

Taistelukenttä d20 ei ole peli yksinäisille kenraaleille. Se on moderniin sodankäyntiin keskittyvä strategiapeli, jossa sinä ja ystäväsi muodostatte toimivan komentoketjun. Peli ammentaa inspiraatiota sotapelien "isästä" – [Kriegsspiel](https://fi.wikipedia.org/wiki/Kriegsspiel)-sotapelistä ja pyrkii tuomaan [ammattimaisen sotapelaamisen](https://en.wikipedia.org/wiki/Professional_wargaming) periaatteet, kuten sodan sumun ja komentoketjun haasteet, kaikkien harrastajien ulottuville helpommin lähestyttävässä muodossa.

Yksi pelaaja ottaa joukkueenjohtajuuden lisäksi komppanianpäällikön strategisemman roolin, kun taas muut johtavat omia joukkueitaan etulinjassa. Menestys ei riipu vain omista siirroistasi, vaan kyvystäsi kommunikoida, koordinoida ja tehdä vaikeita päätöksiä yhdessä ryhmänä – jatkuvan sodan sumun ja paineen alla.

### Avainominaisuudet

* **Jaettu Komentajuus:** Et ole yksinäinen kenraali, vaan osa komentoketjua. Yksi pelaaja toimii komppanianpäällikkönä, ja muut johtavat omia joukkueitaan. Yhteinen menestys vaatii aitoa kommunikaatiota, neuvottelua ja käskyjen koordinointia.
* **Monitasoinen Päätöksenteko:** Johda omaa joukkuettasi taktisella tasolla ja tee samalla yhteistyötä muiden komentajien kanssa saavuttaaksesi operatiiviset tavoitteet. Jokaisen pelaajan päätökset vaikuttavat koko komppanian onnistumiseen.
* **Aito Sodan Sumu:** Toimikaa epätäydellisen ja viivästyneen tiedon varassa. Yhden pelaajan havainto on kriittinen tiedonjyvä, joka on jaettava muille, jotta kokonaiskuva muodostuu – aivan kuten oikeat komentajat tekevät.
* **Lähestyttävä d20-järjestelmä:** Hyödyntää tuttua noppamekaniikkaa, mutta soveltaa sitä joukkue- ja komppaniatasolle, tehden monimutkaisistakin tilanteista hallittavia.

### Projektin nykytila

Peli on aktiivisessa kehitysvaiheessa. Tällä hetkellä sen **taktinen taso** on pelattavissa ja testattavassa. Kehitämme peliä jatkuvasti kohti täyttä operatiivista ja strategista kokemusta.

### Kenelle peli on suunnattu?

Taistelukenttä d20 on suunniteltu pelaajille, jotka nauttivat yksityiskohtaisesta simulaatiosta, strategisesta suunnittelusta ja **haastavasta ryhmätyöstä paineen alla**. Se sopii erityisesti heille, jotka ovat kiinnostuneita perinteisten [sotapelien](https://fi.wikipedia.org/wiki/Sotapeli) strategiaelementeistä, mutta kaipaavat syvempää simulaatiota ja roolipelimäistä yhteistyötä.

### Tutustu peliin

Oletko valmis ottamaan komennon? Kaikki tarvittava löytyy pelin pääsivulta.

# [Avaa Taistelukenttä d20 -pääsivu tästä](https://akselilarikka.github.io/taistelukentta)

Sivulta löydät täydet säännöt, yksikkölistat, skenaariot ja palautekanavat.

### Miten voit osallistua?

Projekti elää yhteisön palautteesta ja osallistumisesta. Kaikenlainen apu on tervetullutta!

* **Lue säännöt:** Tutustu sääntöihin ja kerro, mikä on epäselvää tai mitä voisi parantaa.
* **Pelitestaa:** Kokeile peliä! Parhaat havainnot syntyvät pelaamalla. Raportoi bugeista, epätasapainosta tai hyvistä hetkistä.
* **Anna palautetta:** Käytä sääntösivun lopusta löytyvää palautelomaketta tai ota suoraan yhteyttä.
* **Kehitä koodia:** Jos löydät virheen sivuston toiminnallisuudessa tai haluat ehdottaa parannusta, voit tehdä "Issue" tai "Pull Request" -pyynnön suoraan GitHubissa.

### Viimeisimmät päivitykset

Projekti kehittyy jatkuvasti. Voit seurata yksityiskohtaista muutoshistoriaa [CHANGELOG.md-tiedostosta](CHANGELOG.md).

---

# Taistelukenttä d20: Kehityspolku

> **Päämäärä:** Luoda monitasoinen sotapelikokemus, jossa pelaajat voivat osallistua konfliktiin niin yksittäisen joukkueen johtajana, operatiivisena komentajana kuin strategisena sodanjohtajanakin.

---

## Vaihe 1: "Taktinen Taso" – Viimeistely ja Pelattavuus

* **Nykyinen tila:** Pelin ydin, eli taktinen taistelu joukkue- ja komppaniatasolla, on toiminnallisesti valmis. Seuraavat askeleet keskittyvät sen hiomiseen ja pelikokemuksen parantamiseen.
* **Tavoitteet:**
    1. **Arvojen tasapainotus:** Aktiivinen pelitestaus on avainasemassa yksiköiden arvojen, kykyjen ja kustannusten tasapainottamiseksi.
    2. **Fyysisten pelimerkkien kehitys:** Pelin hallinnoinnin helpottamiseksi suunnitellaan ja otetaan käyttöön värikoodattu pelimerkkijärjestelmä, joka tekee pelitilanteen seuraamisesta intuitiivisempaa.

### Värikoodijärjestelmä (ehdotus)

| Väri | Käyttötarkoitus | Selite ja käyttötapa |
| :--- | :--- | :--- |
| **Osapuolten tunnistus** | | |
| Sininen | Suomalainen yksikkö | Perusmerkki, joka tunnistaa yksikön siniseen osapuoleen kuuluvaksi. |
| Punainen | Venäläinen yksikkö | Perusmerkki, joka tunnistaa yksikön punaiseen osapuoleen kuuluvaksi. |
| Vaaleanvihreä| Siviili | Merkitsee kartalla siviili-elementtejä, joiden suojeleminen on **aina** osa tehtävää. |
| **Tiedustelu ja informaatio** | | |
| Keltainen | Tiedustelutaso: Epäily | Asetetaan kartalle "?-merkiksi" kuvaamaan epämääräistä havaintoa. |
| Oranssi | Tiedustelutaso: Tiedossa | Korvaa keltaisen merkin, kun yksikön tyyppi on tunnistettu. Mahdollistaa epäsuoran tulen. |
| **Yksikön tilat** | | |
| Valkoinen | Tilaefekti: Lamautunut | Asetetaan yksikölle, kun se on epäonnistunut moraalitestissä ja on toimintakyvytön. |
| Tummanruskea| Tilaefekti: Vaurioitunut| Merkitsee, että yksikön taistelukunto on alle 50 % ja sen suorituskyky on heikentynyt. |
| Tumma oranssi| Tilaefekti: Vetäytyy | Kuvaa hallitsematonta pakoa, erottaen sen hallitusta lamaantumisesta (oranssi). |
| Kulta | Tilaefekti: Tärähtänyt | Asetetaan yksikölle, kun se on hetkellisesti häiriintynyt, esimerkiksi estotulen seurauksena. |
| Luonnonväri | Tilaefekti: Piiloutunut | Merkitsee, että yksikkö on onnistuneesti naamioitunut erikoiskykynsä avulla. |
| Tummansininen| Tila: Valmius (Overwatch)| Asetetaan yksikölle, kun se on saanut `Valmius`-käskyn, ja se toimii varoituksena vastustajalle. |
| **Resurssit ja komennot** | | |
| Musta | Ammukset | Seuraa erikoisammusten (esim. PST-laukaukset) määrää. Asetetaan yleensä yksikkökortille. |
| Harmaa | Joukkueenjohtajan KP | Kuvaa Joukkueenjohtajan käytössä olevia taktisia komentopisteitä (oletuksena 3 kpl/vuoro). |
| Violetti | Komppanianpäällikön KP| Kuvaa Komppanianpäällikön strategisia komentopisteitä (oletuksena 5 kpl/vuoro), erottaen ne selvästi Joukkueenjohtajan pisteistä. |

---

## Vaihe 2: "Operatiivinen Askel" – Pataljoonan Komentaminen

* **Visio:** Pelin painopiste siirtyy yksittäisistä ryhmistä laajempiin operaatioihin. Pelaajat johtavat komppanioita ja pataljoonia, ja taistelut ratkaistaan abstraktimmin. Huollon, tiedustelun ja resurssienhallinnan merkitys kasvaa. Kartan mittakaava on 1:50 000 – 1:100 000.
* **Tavoitteet:**
    1. **Nopeutettu pelimekaniikka:** Yksittäiset taistelut ratkaistaan nopeasti muutamalla nopanheitolla sen sijaan, että pelattaisiin läpi kokonainen taktinen skenaario. Tämä pitää pelin temmon yllä. (Toki jos haluaa, niin taistelut saa suorittaa taktisen tason kautta.)
    2. **Huollon ja logistiikan mallintaminen:** Otetaan käyttöön huoltopisteet (HP), jotka kuvaavat polttoainetta, ammuksia ja muonaa. Yksiköiden toimintakyky on riippuvainen toimivista huoltoyhteyksistä.
    3. **Dynaaminen tiedustelu:** Tiedustelutiedot ovat epätarkkoja ja vanhenevat nopeasti, mikä pakottaa komentajat tekemään päätöksiä epävarmuuden alla.

### Operatiivisen tason pelisilmukka (ehdotus)

1. **Direktiivivaihe:** Ylempi johto (strateginen taso tai pelinjohtaja) antaa operatiiviselle komentajalle (pelaaja) tavoitteen (esim. "Vallatkaa tie X", "Viivyttäkää vihollista Y:n alueella 24 tuntia").
2. **Suunnitteluvaihe:** Pelaaja allokoi joukkojaan (komppanioita) ja resurssejaan (huoltopisteitä, tiedustelua) tehtävään. Hän laatii karkean suunnitelman.
3. **Toteutusvaihe:** Pelivuorot etenevät (esim. 1 vuoro = 4 tuntia). Pelaaja liikuttaa yksiköitään kartalla. Kun viholliskontakti syntyy:
    * **Konfliktin ratkaisu:** Taistelu ratkaistaan yhdellä vastakkaisella heitolla, johon vaikuttavat joukkojen vahvuus, tyyppi, maasto ja komentajan taktinen päätös (esim. "Hidas hyökkäys", "Raju rynnäkkö", "Viivytys").
    * **Tulos:** Taistelun tulos määrittää tappiot, resurssien kulutuksen ja uuden tilanteen kartalla. Vain erityisen kriittiset taistelut voidaan "zoomata sisään" ja pelata erillisinä taktisina skenaarioina.
4. **Raportointivaihe:** Vuoron lopussa pelaaja raportoi tilanteesta ylemmälle johdolle. Huoltotilanne päivitetään ja uudet tiedustelutiedot saapuvat.

---

## Vaihe 3: "Strateginen Perspektiivi" – Sodan Johtaminen

* **Visio:** Ylin abstraktiotaso, jossa pelaajat johtavat prikaateja ja armeijakuntia koko Suomen kartalla. Pelissä keskitytään kansalliseen resurssienhallintaan, joukkojen keskittämiseen ja pitkän aikavälin strategiaan.
* **Tavoitteet:**
    1. **Kansallinen resurssienhallinta:** Pelaajat hallinnoivat valtakunnallisia resursseja, kuten tuotantoa, täydennysjoukkoja ja ulkopoliittista tukea.
    2. **Pitkän aikavälin suunnittelu:** Pelivuorot kuvaavat viikkoja tai kuukausia. Päätökset joukkojen sijoittelusta ja suurhyökkäysten ajoituksesta ovat keskiössä.
    3. **Integraatio operatiiviseen tasoon:** Strategisen tason päätökset luovat direktiivejä ja resurssipuitteet operatiivisen tason pelaajille.

### Strategisen tason pelisilmukka (ehdotus)

1. **Tilannekuvavaihe:** Pelaajat saavat tiedusteluraportit ja yleiskuvan rintamatilanteesta.
2. **Resurssivaihe:** Uudet resurssit (tuotanto, täydennykset) tulevat käyttöön.
3. **Strateginen suunnitteluvaihe:** Pelaajat antavat yleisluontoisia käskyjä (direktiivejä) armeijakunnilleen, kuten "Aloittakaa hyökkäys Karjalassa" tai "Vahvistakaa puolustusta Lapissa".
4. **Operatiivinen toteutus:** Nämä direktiivit annetaan operatiivisen tason pelaajille, jotka toteuttavat ne omilla pelilaudoillaan. Strateginen peli taukoaa, kunnes operatiiviset tehtävät on suoritettu.
5. **Lopputulosvaihe:** Operatiivisten pelien tulokset (aluevaltaukset, tappiot) päivitetään strategiseen karttaan, mikä luo uuden lähtötilanteen seuraavalle strategiselle vuorolle.

---

## Vaihe 4: "Yhtenäinen Kokonaisuus" – Integraatio ja Elävä Peli

* **Tavoite:** Sitouttaa kaikki kolme tasoa yhteen saumattomaksi kokonaisuudeksi. Strateginen päätös johtaa operatiiviseen tehtävään, jonka kriittisimmät hetket ratkaistaan taktisilla taisteluilla. Taktisen taistelun lopputulos (tappiot, resurssien kulutus) raportoidaan takaisin ylöspäin, vaikuttaen sekä operatiiviseen että strategiseen tilanteeseen.
* **Lopputulos:** Dynaaminen ja elävä pelikokemus, jossa jokaisen pelaajan rooli on aidosti merkityksellinen koko sodan kannalta.
