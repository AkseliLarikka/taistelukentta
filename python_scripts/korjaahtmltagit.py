import os
import re
import sys

def korjaa_html_sisalto(sisalto):
    """
    Etsii ja korjaa määritellyt virheelliset link- ja meta-tagit
    HTML-sisällöstä.

    Args:
        sisalto (str): HTML-tiedoston alkuperäinen sisältö merkkijonona.

    Returns:
        tuple: Palauttaa muokatun sisällön ja tiedon siitä,
               tehtiinkö muutoksia (True/False).
    """
    muutoksia_tehty = False
    alkuperainen_sisalto = sisalto

    # Määritellään säännölliset lausekkeet ja niiden korvaukset
    # \1 on takaisinviittaus ensimmäiseen kaapattuun ryhmään (eli URL-osoitteeseen)
    korjaussaannot = [
        (
            re.compile(r'<link rel="(https://[^"]+)">'),
            r'<link rel="icon" href="\1">'
        ),
        (
            re.compile(r'<meta property="(https://[^"]+)">'),
            r'<meta property="og:image" content="\1">'
        ),
        (
            re.compile(r'<meta name="(https://[^"]+)">'),
            r'<meta name="twitter:image" content="\1">'
        )
    ]

    # Suoritetaan korvaukset
    for saanto, korvaus in korjaussaannot:
        sisalto = saanto.sub(korvaus, sisalto)

    # Tarkistetaan, muuttuiko sisältö
    if sisalto != alkuperainen_sisalto:
        muutoksia_tehty = True

    return sisalto, muutoksia_tehty

def kasittele_hakemisto(hakemisto_polku):
    """
    Käy läpi annetun hakemiston ja sen alihakemistot, etsii HTML-tiedostoja
    ja suorittaa niille korjausfunktion.

    Args:
        hakemisto_polku (str): Polku hakemistoon, jota käsitellään.
    """
    if not os.path.isdir(hakemisto_polku):
        print(f"Virhe: Hakemistoa '{hakemisto_polku}' ei löydy.")
        return

    print(f"Aloitetaan hakemiston '{hakemisto_polku}' käsittely...\n")
    muokattuja_tiedostoja = 0

    # Käydään läpi hakemistopuu
    for juuri, _, tiedostot in os.walk(hakemisto_polku):
        for tiedosto in tiedostot:
            # Käsitellään vain .html ja .htm -päätteiset tiedostot
            if tiedosto.lower().endswith(('.html', '.htm')):
                tiedoston_polku = os.path.join(juuri, tiedosto)
                try:
                    with open(tiedoston_polku, 'r', encoding='utf-8') as f:
                        alkuperainen_sisalto = f.read()

                    # Korjataan sisältö
                    uusi_sisalto, muutoksia_tehty = korjaa_html_sisalto(alkuperainen_sisalto)

                    # Jos muutoksia tehtiin, kirjoitetaan ne tiedostoon
                    if muutoksia_tehty:
                        print(f"Muokataan tiedostoa: {tiedoston_polku}")
                        with open(tiedoston_polku, 'w', encoding='utf-8') as f:
                            f.write(uusi_sisalto)
                        muokattuja_tiedostoja += 1

                except Exception as e:
                    print(f"Virhe tiedoston '{tiedoston_polku}' käsittelyssä: {e}")

    print(f"\nKäsittely valmis. Muokattuja tiedostoja yhteensä: {muokattuja_tiedostoja}.")

if __name__ == "__main__":
    # Kysytään käyttäjältä kohdehakemiston polku
    if len(sys.argv) > 1:
        kohde_hakemisto = sys.argv[1]
    else:
        kohde_hakemisto = input("Anna sen kansion polku, jonka HTML-tiedostot haluat korjata: ")

    # Varmistetaan, että käyttäjä haluaa jatkaa
    vahvistus = input(f"\nVAROITUS: Tämä skripti muokkaa tiedostoja kansiossa '{kohde_hakemisto}'.\n"
                      "Oletko ottanut varmuuskopion? (k/e): ")

    if vahvistus.lower() == 'k':
        kasittele_hakemisto(kohde_hakemisto)
    else:
        print("Toiminto peruttu.")