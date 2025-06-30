import os
import re

# Määritellään kansio, jossa HTML-tiedostot sijaitsevat
ROOT_DIRECTORY = 'taistelukentta'

# ==============================================================================
# PÄIVITETTY JA LAAJENNETTU SANASTO
# Sisältää nyt uusia taivutusmuotoja ja on järjestetty aakkosjärjestykseen.
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
    "M": "moraali", # Lisätty selkeyden vuoksi, vaikka kirjain on yksinään

    # === Käsitteet A-Ö ===
    "Ansat ja Sulutteet": "ansat ja sulutteet",
    "d20-järjestelmä": "d20-järjestelmä",
    "d20-järjestelmää": "d20-järjestelmä",
    "epäorgaaninen tulituki": "epäorgaaninen tulituki",
    "epäorgaanista tukea": "epäorgaaninen tulituki",
    "Epäorgaaninen Tulituki": "epäorgaaninen tulituki",
    "Etu": "etu ja haitta",
    "Etu ja Haitta": "etu ja haitta",
    "Edun": "etu ja haitta",
    "Haitta": "etu ja haitta",
    "Haitan": "etu ja haitta",
    "Hallintavyöhyke": "hallintavyöhyke",
    "Hallintavyöhykkeellä": "hallintavyöhyke",
    "Hallintavyöhykkeeltä": "hallintavyöhyke",
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
    "Näköyhteys": "los",
    "näköyhteyden": "los",
    "orgaaninen tulituki": "orgaaninen tulituki",
    "Orgaaninen Tulituki": "orgaaninen tulituki",
    "orgaanista tulta": "orgaaninen tulituki",
    "Piiloutunut": "piiloutunut",
    "sodan sumu": "sodan sumu", # Pienellä, koska esiintyy myös lauseen keskellä
    "Sodan Sumu": "sodan sumu", # Isolla, koska esiintyy otsikoissa
    "Suoja": "suoja",
    "suojabonus": "suoja",
    "suoja-arvoa": "suoja",
    "Taistelukunto": "taistelukunto",
    "Taistelukuntoa": "taistelukunto",
    "Taitotaso": "taitotaso",
    "Taitotason": "taitotaso",
    "Tilaefektit": "tilaefektit",
    "Tuli-isku": "tuli-isku",
    "Vastakkainen heitto": "vastakkainen heitto",
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
        # Jos osa on script- tai style-lohko (parittomat indeksit re.splitin tuloksessa),
        # lisätään se takaisin sellaisenaan.
        if i % 2 == 1:
            processed_parts.append(part)
        # Muussa tapauksessa osa on tavallista HTML-sisältöä, joka voidaan käsitellä.
        else:
            processed_parts.append(tag_terms_in_html(part, glossary))
            
    # Yhdistetään osat takaisin kokonaiseksi dokumentiksi
    new_content = "".join(processed_parts)

    # Tallennetaan tiedosto vain jos muutoksia on tehty
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
    if not os.path.isdir(ROOT_DIRECTORY):
        print(f"VIRHE: KANSIOTA '{ROOT_DIRECTORY}' EI LÖYDY.")
        print("Aja skripti samasta kansiosta, jossa 'taistelukentta'-kansio sijaitsee.")
        return

    for root, _, files in os.walk(ROOT_DIRECTORY):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                process_html_file(file_path, GLOSSARY)
    
    print("\nKaikki HTML-tiedostot käsitelty!")

if __name__ == '__main__':
    main()