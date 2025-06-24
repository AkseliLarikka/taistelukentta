import os
import re

# Määritellään kansio, jossa HTML-tiedostot sijaitsevat
ROOT_DIRECTORY = 'taistelukentta'

# ==============================================================================
# SANASTO ON MÄÄRITELTY TÄSSÄ
# Avain (vasemmalla) on sana, jota etsitään tekstistä.
# Arvo (oikealla) on avain, joka menee data-term attribuuttiin (aina pienillä).
#
# HUOM: Jos lisäät uusia termejä sivuillesi, lisää ne myös tähän listaan
# ja aja skripti uudelleen!
# ==============================================================================
GLOSSARY = {
    # Yksittäiset sanat ja lyhenteet
    "DC": "dc",
    "KP": "kp",
    "GM": "gm",
    "LoS": "los",
    "PST": "pst",
    "KK": "kk",
    "TK": "taistelukunto",
    "TT": "taitotaso",
    "XP": "xp",
    "VP": "vp",
    "JR": "jr",
    "TR": "tr",
    "KRH": "krh",
    "M": "moraali",
    "S": "suoja",
    
    # Käsitteet (lisää eri taivutusmuotoja tarvittaessa)
    "Ansat ja Sulutteet": "ansat ja sulutteet",
    "d20-järjestelmä": "d20-järjestelmä",
    "Etu ja Haitta": "etu ja haitta",
    "Etu": "etu ja haitta",
    "Haitta": "etu ja haitta",
    "Hallintavyöhyke": "hallintavyöhyke",
    "Komentopisteet": "kp",
    "Komentopisteitä": "kp",
    "Komentoyhteys": "komentoyhteys",
    "Komppaniatason taktiikat": "komppaniatason taktiikat",
    "Koulutus": "koulutus",
    "Liike": "liike",
    "Linnoittautuminen": "linnoittautuminen",
    "Moraali": "moraali",
    "Moraalitesti": "moraali",
    "Moraalitestin": "moraali",
    "Näköyhteys": "los",
    "orgaaninen tulituki": "orgaaninen tulituki",
    "epäorgaaninen tulituki": "epäorgaaninen tulituki",
    "Piiloutunut": "piiloutunut",
    "Sodan Sumu": "sodan sumu",
    "Suoja": "suoja",
    "Taistelukunto": "taistelukunto",
    "Taitotaso": "taitotaso",
    "Tilaefektit": "tilaefektit",
    "Tuli-isku": "tuli-isku",
    "Vastakkainen heitto": "vastakkainen heitto",
}

def process_html_file(filepath, glossary):
    """Käy läpi HTML-tiedoston ja lisää span-tagit sanastotermeille."""
    print(f"Käsitellään tiedostoa: {filepath}...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"!! Virhe tiedoston lukemisessa: {e}")
        return

    original_content = content

    # Käydään termit läpi pisimmästä lyhyimpään, jotta vältetään
    # päällekkäiset korvaukset (esim. "KP" ei korvaannu "Komppanianpäällikkö"-sanassa).
    sorted_terms = sorted(glossary.keys(), key=len, reverse=True)

    for term in sorted_terms:
        data_term_key = glossary[term]
        
        # Korvaava rakenne. \1 viittaa löydettyyn alkuperäiseen sanaan,
        # jotta sen kirjainkoko (esim. "Sodan sumu") säilyy.
        replacement_template = f'<span class="glossary-term" data-term="{data_term_key}">\\1</span>'
        
        # Regex, joka etsii termin kokonaisena sanana (`\b`) ja välttää korvaamasta
        # tekstiä HTML-tagien sisällä tai jo olemassa olevissa glossary-term-elementeissä.
        regex = re.compile(
            # Etsii termin (esim. Sodan Sumu) ja ottaa sen talteen ryhmään 1
            rf'(\b{re.escape(term)}\b)'
            # Negatiivinen lookahead: varmistaa, ettei seuraava merkki ole osa HTML-tagin sulkemista
            # tai jo olemassa olevan span-tagin sisältöä. Tämä estää uudelleenkorvaamisen.
            + r'(?![^<>]*>)(?![^<]*<\/span>)',
            re.IGNORECASE # Tekee hausta kirjainkoosta riippumattoman
        )
        
        content = regex.sub(replacement_template, content)

    # Tallennetaan tiedosto vain jos muutoksia on tehty
    if content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"-> Muutoksia tehty ja tiedosto tallennettu.")
        except Exception as e:
            print(f"!! Virhe tiedoston tallentamisessa: {e}")
    else:
        print(f"-> Ei muutoksia.")

def main():
    """Skriptin pääfunktio."""
    # Varmistetaan, että suorituskansio on oikea
    if not os.path.isdir(ROOT_DIRECTORY):
        print(f"VIRHE: KANSIOTA '{ROOT_DIRECTORY}' EI LÖYDY.")
        print("Aja skripti samasta kansiosta, jossa 'taistelukentta'-kansio sijaitsee.")
        return

    for root, _, files in os.walk(ROOT_DIRECTORY):
        for file in files:
            # Käsitellään vain .html-tiedostot
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                process_html_file(file_path, GLOSSARY)
    
    print("\nKaikki HTML-tiedostot käsitelty!")

if __name__ == '__main__':
    main()