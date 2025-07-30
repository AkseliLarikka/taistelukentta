import os
import re

# Oletetaan, että skripti ajetaan 'taistelukentta'-kansion yläkansiosta.
PROJECT_ROOT = 'taistelukentta/'

# ==============================================================================
# SANASTO
# Varmistetaan, että pidemmät ja tarkemmat termit ovat listassa.
# ==============================================================================
GLOSSARY = {
    # === Lyhenteet ===
    "DC": "dc", "GM": "gm", "JR": "jr", "KK": "kk", "KP": "kp", "KRH": "krh",
    "LoS": "los", "PST": "pst", "S": "suoja", "TK": "taistelukunto", "TR": "tr",
    "TT": "taitotaso", "VP": "vp", "XP": "xp", "M": "moraali", "TI": "tuli-isku",
    "H": "häive", "L": "liike", "TP": "tp",

    # === Vahinkotyypit (tarkat muodot) ===
    "SIR-vahinko": "vahinkotyyppi-sir", "SIR vahinko": "vahinkotyyppi-sir",
    "PST-vahinko": "vahinkotyyppi-pst", "PST vahinko": "vahinkotyyppi-pst",

    # === Käsitteet A-Ö ===
    "Aaltohyökkäys": "aaltohyökkäys", "Ansat ja Sulutteet": "ansat ja sulutteet",
    "d20-järjestelmä": "d20-järjestelmä", "d20-järjestelmää": "d20-järjestelmä",
    "epäorgaaninen tulituki": "epäorgaaninen tulituki", "epäorgaanista tukea": "epäorgaaninen tulituki",
    "Estotuli": "estotuli", "Etu": "etu ja haitta", "Edun": "etu ja haitta",
    "Haitta": "etu ja haitta", "Haitan": "etu ja haitta", "Hallintavyöhyke": "hallintavyöhyke",
    "Hallintavyöhykkeellä": "hallintavyöhyke", "Hallintavyöhykkeeltä": "hallintavyöhyke",
    "Hyökkäyskäsky": "hyökkäyskäsky", "Irtautuminen": "irtautuminen",
    "Järjestäytynyt Vetäytyminen": "jarjestaytynyt-vetaytyminen", "Kasarmi": "kasarmi",
    "Kohdetyypit": "kohdetyypit", "Komentopiste": "kp", "Komentopisteen": "kp",
    "Komentopisteet": "kp", "Komentopisteitä": "kp", "Komentopisteiden": "kp",
    "Komentopisteitänsä": "kp", "Komentoyhteys": "komentoyhteys",
    "Komppaniatason taktiikat": "komppaniatason taktiikat", "Korkeusero": "korkeusero",
    "Koulutus": "koulutus", "Kriittiset Tilanteet": "kriittiset-tilanteet",
    "Liike": "liike", "liikehidasteen": "liike", "Linnoittautuminen": "linnoittautuminen",
    "Moraali": "moraali", "Moraalibonus": "moraali", "Moraalitesti": "moraali",
    "Moraalitestin": "moraali", "Moraalitesteihin": "moraali", "Moraalin Kohotus": "moraali",
    "Mottitaktiikka": "mottitaktiikka", "Näköyhteys": "los", "näköyhteyden": "los",
    "Order of Battle": "order-of-battle", "orgaaninen tulituki": "orgaaninen tulituki",
    "Orgaaninen Tulituki": "orgaaninen tulituki", "orgaanista tulta": "orgaaninen tulituki",
    "Painopisteen Muodostaminen": "painopisteen-muodostaminen", "Raskas Osuma": "raskas-osuma",
    "Resurssipisteet": "resurssipisteet", "Sisu": "sisu", "Sitova Tuli": "sitova-tuli",
    "sodan sumu": "sodan sumu", "Sodan Sumu": "sodan sumu", "Strateginen Doktriini": "strateginen-doktriini",
    "Suoja": "suoja", "suojabonus": "suoja", "suoja-arvoa": "suoja",
    "Taisteluryhmä": "taisteluryhmä", "Taistelukunto": "taistelukunto", "Taistelukuntoa": "taistelukunto",
    "Taitotaso": "taitotaso", "Taitotason": "taitotaso", "Tiedustelutoiminta": "tiedustelutoiminta",
    "Tilaisuusisku": "tilaisuusisku", "Tulenjohto": "tulenjohto", "Tulen keskittäminen": "tulen-keskittäminen",
    "Tuli-isku": "tuli-isku", "Tulitukipyyntö": "epäorgaaninen tulituki", "Täydennyspisteet": "tp",
    "Vahinkotyypit": "vahinkotyypit", "Vaikutuksen Asteet": "vaikutuksen-asteet",
    "Valmius": "valmius", "Vahvistettu Maali": "vahvistettu-maali", "Vastakkainen heitto": "vastakkainen heitto",
    "Veteraanikyvyt": "veteraanikyvyt",

    # === Tilaefektit ===
    "Tilaefektit": "tilaefektit", "Vaurioitunut": "vaurioitunut", "Vaurioitunut-tilassa": "vaurioitunut",
    "vaurioitumiselle": "vaurioitunut", "Tärähtänyt": "tarahtanyt", "Lamautunut": "lamautunut",
    "Lamautunut-tilassa": "lamautunut", "Vetäytyy": "vetaytyy", "Piiloutunut": "piiloutunut",
    "Piiloutunut-tilan": "piiloutunut", "Piiloutunut-tilassa": "piiloutunut", "piiloutumiseen": "piiloutunut"
}


def clean_incorrect_tags(html_part):
    """Etsii ja purkaa virheellisesti tägätyt osittaiset termit takaisin tekstiksi."""
    # Esimerkki: muuttaa '<span...>PST</span>-vahinko' -> 'PST-vahinko'
    pattern = re.compile(
        r'<span class="glossary-term"[^>]*>(\b(?:PST|SIR)\b)</span>([-\s]*vahinko)',
        re.IGNORECASE
    )
    return pattern.sub(r'\1\2', html_part)

def tag_terms_in_html(html_part, glossary):
    """Lisää span-tagit sanastotermeille, pisimmät ensin."""
    # Järjestetään avaimet pituuden mukaan laskevasti, jotta "PST-vahinko" löytyy ennen "PST".
    sorted_terms = sorted(glossary.keys(), key=len, reverse=True)
    
    for term in sorted_terms:
        data_term_key = glossary[term]
        replacement_template = f'<span class="glossary-term" data-term="{data_term_key}">\\1</span>'
        
        # Tämä parannettu regex käyttää negatiivisia lookaroundeja varmistamaan,
        # että termiä ei löydetä toisen sanan sisältä. Se toimii luotettavammin
        # kuin \b yhdysmerkkejä sisältävien termien kanssa.
        regex = re.compile(
            rf'(?<!\w)({re.escape(term)})(?!\w)'  # Esim. (?<!\w)(PST-vahinko)(?!\w)
            r'(?![^<>]*>)(?![^<]*<\/span>)',    # Varmistaa, ettei olla tagin sisällä
            re.IGNORECASE
        )
        html_part = regex.sub(replacement_template, html_part)
        
    return html_part

def process_html_file(filepath, glossary):
    """Käsittelee yhden HTML-tiedoston: puhdistaa vanhat virheet ja tägää uudelleen."""
    print(f"Käsitellään tiedostoa: {filepath}...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
    except Exception as e:
        print(f"!! Virhe tiedoston lukemisessa: {e}")
        return

    # Erotellaan sisältö osiin, jotta emme muokkaa script- tai style-tageja.
    parts = re.split(r'(<(?:script|style).*?>.*?</(?:script|style)>)', original_content, flags=re.IGNORECASE | re.DOTALL)
    
    processed_parts = []
    for i, part in enumerate(parts):
        # Ohitetaan script/style-lohkot
        if i % 2 == 1:
            processed_parts.append(part)
        else:
            # VAIHE 1: Siivotaan vanhat, osittaiset tägit.
            cleaned_part = clean_incorrect_tags(part)
            # VAIHE 2: Lisätään uudet, oikeat tägit siivottuun tekstiin.
            tagged_part = tag_terms_in_html(cleaned_part, glossary)
            processed_parts.append(tagged_part)
            
    new_content = "".join(processed_parts)

    if new_content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"-> Muutoksia tehty ja tiedosto tallennettu.")
        except Exception as e:
            print(f"!! Virhe tiedoston tallentamisessa: {e}")
    else:
        print(f"-> Ei muutoksia.")

def main():
    """Skriptin pääfunktio."""
    if not os.path.isdir(PROJECT_ROOT):
        print(f"VIRHE: KANSIOTA '{PROJECT_ROOT}' EI LÖYDY.")
        print("Aja skripti oikeasta juurihakemistosta (kansiosta, joka sisältää 'taistelukentta'-kansion).")
        return

    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Estetään skriptiä muokkaamasta itseään tai muita python-skriptejä
        if 'python_scripts' in dirs:
            dirs.remove('python_scripts')
            
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                process_html_file(file_path, GLOSSARY)
    
    print("\nKaikki HTML-tiedostot käsitelty!")

if __name__ == '__main__':
    main()