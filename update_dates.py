import os
from datetime import datetime, timezone
import re

# Hakemisto, josta etsitään HTML-tiedostoja (nykyinen hakemisto)
root_dir = '.'
# Haettava metatagi
tag_pattern = re.compile(r'(<meta property="article:published_time" content=")(.*?)(".*?>)')

# --- KORJATTU OSA ---
# Haetaan nykyinen aika käyttäen suositeltua, aikavyöhyketietoista tapaa.
# .now(timezone.utc) tuottaa ajan suoraan UTC-aikavyöhykkeessä.
current_time_utc = datetime.now(timezone.utc)
current_time_iso = current_time_utc.strftime('%Y-%m-%d T%H:%M:%S')


print(f"Päivitetään julkaisuaika muotoon: {current_time_iso}")

# Käydään läpi kaikki tiedostot ja kansiot
for subdir, _, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(subdir, file)
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Etsitään ja korvataan olemassa oleva päivämäärä
                new_content, num_replacements = tag_pattern.subn(
                    rf'\g<1>{current_time_iso}\g<3>', 
                    content
                )
                
                # Jos korvaus tehtiin, tallennetaan tiedosto
                if num_replacements > 0:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Päivitetty: {file_path}")
                else:
                    print(f"Ei päivitettävää tagia tiedostossa: {file_path}")

            except Exception as e:
                print(f"Virhe käsiteltäessä tiedostoa {file_path}: {e}")

print("Päivitys valmis.")