import os
import re

# Määritellään kansio, jossa HTML-tiedostot sijaitsevat
ROOT_DIRECTORY = '../' # Oletetaan, että skripti ajetaan juurihakemistosta

# ==============================================================================
# PÄIVITETTY JA LAAJENNETTU SANASTO
# Sisältää nyt kaikki komppaniatason taktiikat ja muut keskeiset termit.
# ==============================================================================
GLOSSARY = {
    # === Lyhenteet ===
    "DC": "dc",
    "GM": "gm",
    "JR": "jr",
    "KK": "kk",
    "KP": "kp",
    "KRH": "krh",
    "LoS": "los",
    "PST": "pst",
    "S": "suoja",
    "TK": "taistelukunto",
    "TR": "tr",
    "TT": "taitotaso",
    "VP": "vp",
    "XP": "xp",
    "M": "moraali",
    "TI": "tuli-isku",
    "H": "häive",
    "L": "liike",

    # === Käsitteet A-Ö ===
    "Ansat ja Sulutteet": "ansat ja sulutteet",
    "d20-järjestelmä": "d20-järjestelmä",
    "d20-järjestelmää": "d20-järjestelmä",
    "epäorgaaninen tulituki": "epäorgaaninen tulituki",
    "epäorgaanista tukea": "epäorgaaninen tulituki",
    "Etu": "etu ja haitta",
    "Edun": "etu ja haitta",
    "Haitta": "etu ja haitta",
    "Haitan": "etu ja haitta",
    "Hallintavyöhyke": "hallintavyöhyke",
    "Hallintavyöhykkeellä": "hallintavyöhyke",
    "Hallintavyöhykkeeltä": "hallintavyöhyke",
    "Järjestäytynyt Vetäytyminen": "jarjestaytynyt-vetaytyminen",
    "Komentopiste": "kp",
    "Komentopisteen": "kp",
    "Komentopisteet": "kp",
    "Komentopisteitä": "kp",
    "Komentopisteiden": "kp",
    "Komentopisteitänsä": "kp",
    "Komentoyhteys": "komentoyhteys",
    "Komppaniatason taktiikat": "komppaniatason taktiikat",
    "Koulutus": "koulutus",
    "Liike": "liike",
    "liikehidasteen": "liike",
    "Linnoittautuminen": "linnoittautuminen",
    "Moraali": "moraali",
    "Moraalibonus": "moraali",
    "Moraalitesti": "moraali",
    "Moraalitestin": "moraali",
    "Moraalitesteihin": "moraali",
    "Moraalin Kohotus": "moraali",
    "Mottitaktiikka": "mottitaktiikka",
    "Näköyhteys": "los",
    "näköyhteyden": "los",
    "orgaaninen tulituki": "orgaaninen tulituki",
    "Orgaaninen Tulituki": "orgaaninen tulituki",
    "orgaanista tulta": "orgaaninen tulituki",
    "Painopisteen Muodostaminen": "painopisteen-muodostaminen",
    "Sitova Tuli": "sitova-tuli",
    "sodan sumu": "sodan sumu",
    "Sodan Sumu": "sodan sumu",
    "Suoja": "suoja",
    "suojabonus": "suoja",
    "suoja-arvoa": "suoja",
    "Taistelukunto": "taistelukunto",
    "Taistelukuntoa": "taistelukunto",
    "Taitotaso": "taitotaso",
    "Taitotason": "taitotaso",
    "Tuli-isku": "tuli-isku",
    "Tulitukipyyntö": "epäorgaaninen tulituki",
    "Vahvistettu Maali": "vahvistettu-maali",
    "Vastakkainen heitto": "vastakkainen heitto",
    
    # === Tilaefektit ja niiden taivutusmuodot ===
    "Tilaefektit": "tilaefektit",
    "Vaurioitunut": "vaurioitunut",
    "Vaurioitunut-tilassa": "vaurioitunut",
    "vaurioitumiselle": "vaurioitunut",
    "Tärähtänyt": "tarahtanyt",
    "Lamautunut": "lamautunut",
    "Lamautunut-tilassa": "lamautunut",
    "Vetäytyy": "vetaytyy",
    "Piiloutunut": "piiloutunut",
    "Piiloutunut-tilan": "piiloutunut",
    "Piiloutunut-tilassa": "piiloutunut",
    "piiloutumiseen": "piiloutunut"
}


def tag_terms_in_html(html_part, glossary):
    """Apufunktio, joka lisää tagit annettuun HTML-tekstin osaan."""
    sorted_terms = sorted(glossary.keys(), key=len, reverse=True)
    for term in sorted_terms:
        data_term_key = glossary[term]
        replacement_template = f'<span class="glossary-term" data-term="{data_term_key}">\\1</span>'
        # Regex, joka etsii termin kokonaisena sanana ja välttää korvaamasta tekstiä attribuuteissa tai jo olemassa olevissa tageissa.
        regex = re.compile(
            rf'(\b{re.escape(term)}\b)'
            r'(?![^<>]*>)(?![^<]*<\/span>)',
            re.IGNORECASE
        )
        html_part = regex.sub(replacement_template, html_part)
    return html_part

def process_html_file(filepath, glossary):
    """
    Käy läpi HTML-tiedoston ja lisää span-tagit sanastotermeille,
    mutta ohittaa täysin <script>- ja <style>-lohkojen sisällön.
    """
    print(f"Käsitellään tiedostoa: {filepath}...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
    except Exception as e:
        print(f"!! Virhe tiedoston lukemisessa: {e}")
        return

    # Pilkotaan sisältö osiin: teksti, script-lohkot, style-lohkot
    parts = re.split(r'(<(?:script|style).*?>.*?</(?:script|style)>)', original_content, flags=re.IGNORECASE | re.DOTALL)
    
    processed_parts = []
    # Käydään osat läpi
    for i, part in enumerate(parts):
        if i % 2 == 1:
            processed_parts.append(part)
        else:
            processed_parts.append(tag_terms_in_html(part, glossary))
            
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
    project_root = 'akselilarikka/taistelukentta/taistelukentta-b37cef957ca0e3c105fab24324d2df01ab690a9e'
    if not os.path.isdir(project_root):
        print(f"VIRHE: KANSIOTA '{project_root}' EI LÖYDY.")
        print("Aja skripti oikeasta juurihakemistosta.")
        return

    for root, _, files in os.walk(project_root):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                process_html_file(file_path, GLOSSARY)
    
    print("\nKaikki HTML-tiedostot käsitelty!")

if __name__ == '__main__':
    main()