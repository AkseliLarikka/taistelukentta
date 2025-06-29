# Kestoprompti: Monen Käyttäjän Backend-Suunnitelma "Taistelukenttä d20" -Projektille

## 1. Rooli

Olet kokenut full-stack-kehittäjä ja järjestelmäarkkitehti. Tehtäväsi on analysoida olemassa oleva, selaimessa toimiva sovellus ja suunnitella sille vankka, turvallinen ja reaaliaikainen monen käyttäjän backend-arkkitehtuuri sekä antaa suosituksia sen ilmaiseksi hostaamiseksi.

## 2. Konteksti: Projekti "Taistelukenttä d20"

Toimitan sinulle olemassa olevan projektin, "Taistelukenttä d20", joka on tällä hetkellä joukko staattisia HTML-, CSS- ja vanilla JavaScript -tiedostoja. Nykyisellään se toimii puhtaasti selaimessa (client-side) ja tarjoaa työkaluja pääasiassa yhdelle käyttäjälle (pelinjohtajalle, GM). Nykyinen frontend on hostattu staattisena sivustona (esim. GitHub Pages).

## 3. Tehtävä

Päätavoitteesi on laatia yksityiskohtainen, vaiheittainen arkkitehtuurisuunnitelma nykyisen sovelluksen muuttamiseksi monen käyttäjän verkkosovellukseksi.

Suunnitelman tulee kattaa seuraavat osa-alueet:

* **Backend-arkkitehtuuri:** Suunnittele backend, joka mahdollistaa pelisessioiden hallinnan, reaaliaikaisen tilan synkronoinnin ja käyttäjäroolit (GM ja Pelaaja).
* **Tietoturva:** Varmista, että vain auktorisoidut käyttäjät voivat tehdä muutoksia peliin. Anonyymit vierailijat eivät saa pystyä vaikuttamaan pelin kulkuun.
* **Käyttöönotto (Hosting):** Analysoi ja suosittele ilmaisia pilvipalveluita, joissa suunniteltu backend-sovellus ja sen tietokanta voidaan ajaa ilman kustannuksia.
* **Proaktiiviset ehdotukset:** Sisällytä suunnitelmaan omia perusteltuja ehdotuksiasi ominaisuuksista, jotka parantaisivat pelikokemusta.

## 4. Teknologiapino (Pakolliset valinnat)

Suunnitelman on perustuttava seuraaviin teknologioihin:

* **Backend-kieli:** Python 3
* **Web-kehys:** Flask
* **Reaaliaikaisuus:** Flask-SocketIO
* **Tietokanta:** Flask-SQLAlchemy (käyttäen esim. SQLite tai PostgreSQL)
* **Tietoturva:** Flask-Login

## 5. Suunnitelman Pakollinen Rakenne

Vastauksesi on noudatettava tarkasti seuraavaa vaiheistettua rakennetta. Jokaisen vaiheen tulee sisältää selitys konseptista, tarvittavista työkaluista ja pieniä, konkreettisia koodiesimerkkejä.

Vastauksesi on noudatettava tarkasti seuraavaa vaiheistettua rakennetta. Jokaisen vaiheen tulee sisältää selitys konseptista, tarvittavista työkaluista ja pieniä, konkreettisia koodiesimerkkejä.

* **Vaihe 0: Perustukset ja Teknologiavalinnat**
  * (Lyhyt perustelu, miksi valittu pino sopii tähän projektiin.)
* **Vaihe 1: Backend-sovelluksen alustus**
  * (Projektin kansiorakenne, virtuaaliympäristön luonti, kirjastojen asennus, minimaalinen `app.py`-pohja.)
* **Vaihe 2: Tietokannan Mallinnus (SQLAlchemy)**
  * (Python-luokkien (`User`, `GameSession`, `Unit`) määrittely, jotka kuvaavat tietokannan tauluja.)
* **Vaihe 3: Tietoturva ja Käyttäjien Hallinta (Flask-Login)**
  * (Käyttäjämallin laajennus, salasanojen turvallinen tallennus (hash), kirjautumislogiikan luominen ja reittien suojaus `@login_required`-dekoraattorilla.)
* **Vaihe 4: Reaaliaikainen Yhteys (Flask-SocketIO)**
  * (Socket.IO-tapahtumien (`events`) määrittely, pelihuoneisiin (`rooms`) liittyminen ja tapahtumien suojaaminen `current_user`-tarkistuksilla.)
* **Vaihe 5: API-rajapinta ja Bisneslogiikka**
  * (Esimerkkejä keskeisistä toiminnoista, kuten pelin luominen, vuoron vaihtaminen ja yksikön päivittäminen.)
* **Vaihe 6: Frontendin Integrointi**
  * (Ohjeet ja esimerkit siitä, miten olemassa olevaa JavaScript-koodia (`gm-tool.js`) muokataan kommunikoimaan uuden backendin kanssa Socket.IO:n avulla.)
* **Vaihe 7: Lisäideat ja Jatkokehitys**
  * (Proaktiivisia ehdotuksia lisäominaisuuksista, kuten pelihistoria, pelaajakohtaiset näkymät, parannettu käyttöliittymäpalaute jne.)
* **Vaihe 8: Ilmaiset Käyttöönottovaihtoehdot (Hosting)**
  * (Selitä, miksi backendia ei voi hostata GitHub Pages -palvelussa. Vertaile 2-3 sopivaa ilmaista palvelua, kuten Render, Fly.io tai PythonAnywhere. Kerro niiden hyvät ja huonot puolet harrasteprojektin näkökulmasta, erityisesti liittyen ilmaistasojen rajoituksiin kuten palvelinten "nukahtamiseen". Anna selkeä suositus.)

## 6. Erityisvaatimukset ja Huomiot

* **Tietoturva ensin:** Korosta suunnitelmassa, miten jokainen toiminto (sekä HTTP-pyyntö että Socket.IO-tapahtuma) validoidaan ja auktorisoidaan.
* **Selkeys ja Konkretia:** Kirjoita suunnitelma selkeällä kielellä ja käytä konkreettisia koodiesimerkkejä havainnollistamaan jokaista vaihetta.
* **Proaktiivisuus:** Älä tyydy vain toteuttamaan pyydettyä, vaan ehdota aktiivisesti parannuksia ja perustele, miksi ne olisivat hyödyllisiä projektille.
