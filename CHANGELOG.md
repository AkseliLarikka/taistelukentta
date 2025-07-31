# Muutoshistoria - Taistelukenttä d20

Tämä dokumentti sisältää kaikki merkittävät muutokset ja päivitykset Taistelukenttä d20 -sotapeliin.

## [2025-07-31]

### Muutettu

* **Merkittävä sääntömuutos komentoyhteyteen:** Komentoyhteyden kantama on puolitettu (60cm -> 30cm) ja tiettyjen komentotoimintojen etäisyyttä on lyhennetty (30cm -> 20cm), mikä tekee komentorakenteen ylläpidosta haastavampaa ja taktisesti merkityksellisempää.
* **Sanaston ja UKK:n päivitys:** Päivitetty sanastoa ja Usein Kysytyt Kysymykset -osiota vastaamaan uusimpia sääntömuutoksia ja termejä.

### Lisätty

* **Pelinjohtajan varoitus:** Lisätty sivuille modaali-ikkuna, joka varoittaa pelaajia heidän siirtyessään vain pelinjohtajalle tarkoitettuun sisältöön.

## [2025-07-30]

### Muutettu

* **Pelaajan työkalujen ja sanaston parannukset:** Uudistettu pelaajan työkalujen käyttöliittymää ja parannettu sanaston toiminnallisuutta. Muutokset sisältävät määritelmien tarkennuksia ja automaattisen linkityksen parannuksia, jotka tekevät sääntöjen lukemisesta sujuvampaa.

## [2025-07-29]

### Lisätty

* **Uusi "Häive" (H) -ominaisuus:** Lisätty yksiköille uusi `Häive (H)` -arvo, joka kuvaa niiden kykyä pysyä piilossa. Tämä arvo korvaa `Suoja (S)` -arvon tiedustelua vastaan puolustautuessa, mikä tekee tiedustelusta dynaamisempaa ja realistisempaa.
* **Armeijan luontiohjeet:** Lisätty `skenaariot.html`-sivulle kattavat ohjeet armeijan luomisesta pisteillä, sisältäen säännöt vahvistusten ostamisesta kesken taistelun.

### Muutettu

* **Sääntöjen rakenneuudistus:** Siirretty useita sääntömekaniikkoja, kuten taistelun ja tiedustelun yksityiskohtaiset säännöt, `ydinsaannot.html`-sivulta `taktisen-tason-taistelu.html`-sivulle. Tämä selkeyttää ydinsääntöjen roolia perusmekaniikkojen esittelyssä.
* **Sanaston päivitys:** Lisätty uusi termi "häive" sanastoon (`glossaryData.js`).
* **Yksikkötietojen päivitys:** Päivitetty kaikki yksiköt (`unit-data.js`) sisältämään uuden `Häive (H)` -arvon.
* **Sääntöjen selkeytys:** Tarkennettu raskaan raketinheittimen (MLRS) tulitukipyynnön kustannuksia `taktisen-tason-taistelu.html`-sivulla.

### Korjattu

* **Pelaajan työkalun ilmoitukset:** Korjattu pelaajan työkalun ilmoitusten toimintaa.
* **Navigaation parannus:** Lisätty `ydinsaannot.html`-sivulle suora linkki komentopisteitä käsittelevään osioon.

## [2025-07-28]

### Lisätty

* **Yksiköiden pistekustannukset:** Yksiköille on lisätty pistekustannukset (`cost`), jotka näytetään nyt yksikkökorteilla. Tämä mahdollistaa tasapainoisempien joukkojen rakentamisen skenaarioissa.
* **Uusi epäsuoran tulen yksikkö:** Lisätty epäorgaanisen epäsuoran tulen yksikkö MLRS M270 raskas raketinheitin ja sille damage arvot.
* **Esimerkkikuvat:** Luotu ja lisätty epäsuoran tulen hajontaa kuvastavia esimerkkikuvia.

### Muutettu

* **Dokumentaation päivitys:** Päivitetty kampanjan hallinnan, ydinsääntöjen ja muiden sivujen dokumentaatiota vastaamaan uusimpia muutoksia.
* **Infrastruktuurin parannukset:** Uudistettu ja korjattu useita taustalla toimivia automaatiotyökaluja, kuten sanaston tägäystä ja sivuston julkaisua.

### Korjattu

* **CI/CD-työnkulku:** Korjattu `deploy.yml`-työnkulun polkuja, jotta automaattiset päivitykset toimivat luotettavasti.

## [2025-07-27]

### Muutettu

* **Sisällön selkeytys:** Uudistettu useiden sivujen HTML-rakennetta ja parannettu sisältöjen selkeyttä ja luettavuutta.
* **Infrastruktuurin päivitys:** Siirretty kaikki kuvatiedostot pois Git-repositoriosta [Cloudinary](https://cloudinary.com/)-palveluun sivuston latausnopeuden ja ylläpidettävyyden parantamiseksi. Kuvalinkit on päivitetty automaattisesti uuden `korvaakuvat.py`-skriptin avulla.

## [2025-07-25]

### Muutettu

* **Navigaation parannus:** Parannettu sivupalkin navigointilinkkien luontia ja vierityskäyttäytymistä (`rules.js`), mikä tekee sivuston selaamisesta sujuvampaa.

## [2025-07-23]

### Lisätty

* **Uudet yksiköt:** Lisätty uudet yksikkömääritelmät `Pioneeriryhmä`, `CV9030FIN` ja `Leopard 2A6` -yksiköille.
* **QR-koodi:** Lisätty projektiin QR-koodi, joka ohjaa pelin verkkosivuille.

## [2025-07-22]

### Lisätty

* **Sulutteet ja esteet:** Lisätty uusi sääntöosio `ydinsäännöt.html`-sivulle, joka käsittelee sulutteiden, kuten miinoitteiden ja murrosteiden, rakentamista ja vaikutuksia.

### Muutettu

* **Skenaarion päivitys:** Tarkennettu "Operaatio Leppäkeihäs" -skenaarion kuvausta ja sääntöjä `skenaariot.html`-sivulla.
* **Sääntöjen selkeytys:** Laajennettu esimerkkipelin kuvausta `ydinsäännöt.html`-sivulla selkeyden parantamiseksi.

### Korjattu

* **Sääntöjen johdonmukaisuus:** Korjattu useita kirjoitusvirheitä, sulkeiden käyttöä ja epäjohdonmukaisuuksia `ydinsäännöt.html`-sivulla.

## [2025-07-08]

### Lisätty

* **Kuvituskuvat:** Lisätty useita uusia kuvituskuvia eri sivuille parantamaan visuaalista ilmettä ja tunnelmaa.

### Muutettu

* **Oikeudelliset ilmoitukset:** Päivitetty `tietoja.html`-sivun lakitekstejä kattamaan uudet kuvituskuvat.

### Korjattu

* **Sääntöjen esitysvirhe:** Korjattu `ydinsäännöt.html`-sivulla ollut taulukon muotoiluvirhe.

## [2025-07-07]

### Lisätty

* **Automaattiset tulituki-ilmoitukset:** Pelaajan työkalu ilmoittaa nyt automaattisesti, kun pelaajan tilaama tulituki saapuu pelivuorolla. Saapunut tehtävä poistetaan samalla listalta.
* **Kutistettava yksikönlisäysosio:** Pelaajan työkalun "Lisää yksiköitä" -osion voi nyt piilottaa tilan säästämiseksi, mikä parantaa käytettävyyttä erityisesti pienemmillä näytöillä.
* **Havainnekuva sääntöihin:** Lisätty ydinsääntöihin uusi kuva havainnollistamaan pelitilannetta.

### Muutettu

* **Käyttöliittymän animaatiot:**
  * Yksikkökortin "Lisätty"-ilmoitus ei ainoastaan haalistu, vaan myös piiloutuu kokonaan vapauttaen tilaa.
  * Sivuston vierityspainikkeiden animaatioita ja vakautta on parannettu mobiililaitteilla.
* **Mobiilikäytettävyys:** Pelaajan työkalun yksikkökortin aseistustaulukko on nyt oikein vieritettävissä, mikä estää sivun leveyden rikkoutumisen.
* **Sääntöjen selkeytys:** Tehty laajoja parannuksia ja tarkennuksia ydinsääntöihin, pelaajan pikaoppaaseen ja sanastoon. Muutokset parantavat sääntöjen johdonmukaisuutta ja ratkovat aiemmin havaittuja epäselvyyksiä.
* **Oikeudellisten ilmoitusten päivitys:** Uudistettu `tietoja.html`-sivun lisenssi- ja lakitekstit selkeämmiksi ja kattavammiksi.
* **Sisältöpäivitykset:** Päivitetty etusivun sekä sanaston ja UKK-osion sisältöä.

### Korjattu

* **Kriittiset skriptivirheet:** Korjattu useita virheitä (`ReferenceError`, `TypeError`) `player-tools.js`-tiedostossa, jotka estivät vaiheseurannan ja muiden toimintojen toimivuuden.
* **Yksiköiden nimien renderöinti:** Korjattu bugi, jossa yksikkökorttien otsikot eivät näkyneet oikein. Datan ja esitystavan eriyttäminen parantaa ylläpidettävyyttä.
* **Punaiset Yksiköt -sivu:** Korjattu sivu näyttämään oikein punaisten yksiköiden tiedot virheellisten sinisten tietojen sijaan.

## [2025-07-03]

### Lisätty

* **Pelinjohtajan karttatyökalu (esimerkki):** Lisätty `pelinjohtajan-opas.html`-sivulle Figma-upotus, joka demonstroi, miten pelinjohtaja voisi hallita omaa salaista karttaansa ja yksiköidensä sijainteja.

### Korjattu

* **Vierityspainikkeiden korjaus:** Korjattu sivun vierityspainikkeiden toiminnassa ollut virhe ja parannettu niiden tilanhallintaa (`scroll-buttons.js`).

## [2025-07-02]

### Muutettu

* **Termistön ja yksikkötietojen päivitys:** Tehty laajoja päivityksiä ja tarkennuksia sanastoon ja yksiköiden tietoihin pelikokemuksen selkeyttämiseksi.

## [2025-07-01]

### Lisätty

* **Karttakoordinaatisto:** Lisätty `Operaatio Teräsvalli` -karttaan koordinaatisto, joka helpottaa sijaintien ja etäisyyksien määrittämistä.

### Muutettu

* **Termistön yhtenäistäminen:** Parannettu sanaston integraatiota ja yhtenäistetty termien käyttöä läpi koko sivuston, mikä tekee säännöistä selkeämpiä.
* **Käyttöliittymän selkeytys:** Muutettu noppien selitys käyttämään sanaston ponnahdusikkunaa, mikä vähentää toistoa ja parantaa luettavuutta.
* **Sääntöpäivitykset:** Tehty useita sääntötarkennuksia ja -päivityksiä pelikokemuksen parantamiseksi.

## [2025-06-30]

### Lisätty

* **Automatisoitu julkaisu (CI/CD):** Otettu käyttöön GitHub Actions -työnkulku, joka päivittää automaattisesti sivujen julkaisupäivämäärät ja julkaisee sivuston GitHub Pagesiin jokaisen `git push` -komennon jälkeen.
* **Tekninen SEO-parannus:** Lisätty `sitemap.xml`-tiedosto kaikkien sivujen indeksoinnin tehostamiseksi sekä `robots.txt`-tiedosto ohjaamaan hakukonerobotteja.
* **Saavutettavuus & Kuva-SEO:** Lisätty kuvaavat `alt`-tekstit kaikille kuville, mukaan lukien navigointielementit, parantaen sekä näkövammaisten käyttökokemusta että kuvien löydettävyyttä hakukoneissa.
* **SEO- ja esikatselupäivitys:** Lisätty kattavat Open Graph- ja Twitter Card -metatiedot kaikille sivuston sivuille. Tämä parantaa merkittävästi linkkien esikatselua sosiaalisen median alustoilla ja viestisovelluksissa. Lisäksi lisätty tuki strukturoidulle datalle (Schema.org JSON-LD), kanonisille URL-osoitteille ja tekijätiedoille.

## [2025-06-26]

### Lisätty

* **Pelaajan työkalut:** Lisätty täysin uusi Pelaajan työkalupakki (`player-tools.js` ja `player-tools.css`), joka sisältää laajoja toiminnallisuuksia pelaajille.

### Muutettu

* **Koodin refaktorointi:** Suoritettu laaja refaktorointi, joka parantaa olemassa olevien työkalujen, kuten Pelinjohtajan Työkalupakin (`gm-tool`), toiminnallisuutta ja ylläpidettävyyttä.
* **Dokumentaatio:** Lisätty `tietoja.html`-sivulle suora linkki tähän muutoshistoriaan.

### Korjattu

* **Käyttöliittymä:** Korjattu etusivun mobiilinäkymää ja parannettu yleistä käytettävyyttä.

## [2025-06-25]

### Lisätty

* Aloitettu Pelinjohtajan Työkalupakin (`gm-tool`) kehitys `pelinjohtajan-opas.html`-sivulle.

### Muutettu

* **Sääntöpäivitykset:** Tarkennettu sääntöjä koskien voittopisteiden (VP) ja komentopisteiden (KP) käyttöä pelinjohtajan oppaassa ja kampanjan hallinnassa.
* **Käyttöliittymä ja ulkoasu:** Toteutettu merkittävä CSS-uudistus, jossa luovuttiin Tailwind-viitekehyksestä ja siirryttiin käyttämään omia, selkeämpiä CSS-tiedostoja. Optimoitu navigointipainikkeiden kuvien kokoa ja parannettu sivuston suorituskykyä (Lighthouse-raportti). Siivottu ja selkeytetty CSS-tiedostoja.
* **Hakukoneoptimointi (SEO):** Päivitetty sivuston metatietoja (avainsanat, robots-tagit) hakukonenäkyvyyden parantamiseksi.

## [2025-06-24]

### Lisätty

* **Liikelaskuri:** Pelaajan pikaoppaaseen on lisätty uusi interaktiivinen liikelaskuri helpottamaan yksiköiden liikuttelua.
* **Havainnekuvat:** Esimerkkipeliin on lisätty runsaasti uusia havainnekuvia selkeyttämään pelin kulkua.
* **Automaattinen sanasto:** Sivustolle on lisätty merkittävä uusi ominaisuus, joka muuttaa sanaston termit automaattisesti klikattaviksi. Termiä klikkaamalla avautuu pieni ponnahdusikkuna, joka näyttää termin selityksen.
* **Uusi yksikkö:** Lisätty "Komppanianpäällikkö (esikunta)" -yksikkö sinisten joukkojen listaan.

### Muutettu

* **Sääntöpäivitykset:** Tehty useita sääntötarkennuksia ja -päivityksiä eri osioihin. Parannettu sanaston automaattista tägäysjärjestelmää. Laajennettu ja päivitetty merkittävästi "Pelaajan pikaopasta" pelitestauksesta saatujen havaintojen perusteella. Tarkennettu sääntöjä koskien maaston vaikutuksia taistelussa. Paranneltu ja laajennettu esimerkkipeliä `ydinsäännöt.html`-sivulla perustuen aitoon pelitilanteeseen. Päivitetty "Sanasto ja UKK" -sivun sisältöä.
* **Käyttöliittymä ja ulkoasu:** Päivitetty aloitussivun (`landing page`) sisältöä ja yhtenäistetty linkkien tyylejä. Yhtenäistetty otsikkotasojen käyttöä läpi sivuston rakenteen selkeyttämiseksi. Yhtenäistetty otsikoiden muotoilua ja päivitetty lisenssitiedot `tietoja.html`-sivulle.

### Korjattu

* **Käyttöliittymä ja ulkoasu:** Korjattu etusivun ja sääntösivujen vierityspainikkeiden toimintaa.

## [2025-06-23]

### Muutettu

* **Sivuston rakenneuudistus:** Sivusto on kokenut täydellisen rakenneuudistuksen. Aiempi yhden sivun rakenne on jaettu useille alasivuille (`ydinsäännöt`, `skenaariot`, `yksiköt` jne.), ja koko sivuston visuaalinen ilme on uusittu täysin uusilla CSS-tyyleillä ja JavaScript-toiminnoilla.
* **Hakukoneoptimointi (SEO):** Kaikille sivuille on päivitetty yksilölliset metakuvaukset (description) ja avainsanat (keywords) parantamaan niiden löydettävyyttä hakukoneissa.
* **Käyttöliittymä ja ulkoasu:** Parannettu ohjausnappien toimintaa ja asettelua mobiililaitteilla.

### Korjattu

* **Käyttöliittymä ja ulkoasu:** Korjattu navigointipalkin (`navbar`) leveyttä ja pehmustetta (`padding`) leveillä näytöillä.

## [2025-06-19]

### Lisätty

* Lisätty `CHANGELOG.md`-tiedosto muutoshistorian seuraamiseksi.
* Lisätty README-tiedostoon kehitysroadmap, joka kuvaa pelin tulevia vaiheita.
* Lisätty palautelomake ja yhteystiedot.
* Lisätty `Operaatio Teräsvalli` -kartta PDF-muodossa.
* Lisätty `Jälkisanat`-osio.

### Muutettu

* Päivitetty lisenssitietoihin Creative Commons -lisenssi.

### Poistettu

* Lisätty `.gitignore`-tiedosto estämään tarpeettomien tiedostojen seuraamisen versionhallinnassa.
