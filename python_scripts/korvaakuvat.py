import os
import re
from urllib.parse import unquote

# Sanakirja, joka yhdistää vanhan tiedostonimen uuteen Cloudinary URL-osoitteeseen
# Tiedostonimet on poimittu automaattisesti antamistasi URL-osoitteista.
url_map = {
    'tkdkesken.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629057/tkdkesken_rxtrwx.png',
    'tkd20_QR_Code.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629057/tkd20_QR_Code_uqiccr.png',
    'TKD20LOGO.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629056/TKD20LOGO_tcsrcz.png',
    'tkd20ikoni.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629056/tkd20ikoni.png',
    'Tekijänoikeudet.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629056/Tekij%C3%A4noikeudet_iziu3j.png',
    'taistelukenttäisologo.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629055/taistelukentt%C3%A4isologo_mnvxlq.png',
    'sade.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629055/sade_mrsp3q.png',
    'Korpraali_hihalaatta.svg.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629046/Korpraali_hihalaatta.svg_pmryeq.png',
    'Kersantti_hihalaatta.svg.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629045/Kersantti_hihalaatta.svg_moun5e.png',
    'd20black.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629036/d20black_l3chke.png',
    'd20white.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629036/d20white_yiyixv.png',
    'bannertkd.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629036/bannertkd_ocvjff.jpg',
    'bannertkd.webp': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629036/bannertkd_uc8meh.webp',
    'Alikersantti_hihalaatta.svg.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629035/Alikersantti_hihalaatta.svg_d1c14f.png',
    'AI.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629035/AI_xmf0ox.png',
    'tykistö.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629057/tykist%C3%B6_gb8c5f.png',
    'PSTtuhoaaBTR.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629056/PSTtuhoaaBTR_ekewso.png',
    'valli.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629056/valli_bb1cer.png',
    'väijytys.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629056/v%C3%A4ijytys_ujiq3x.png',
    'taistelukenttä_sotilaat.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629054/taistelukentt%C3%A4_sotilaat_j80rsa.png',
    'komentajan_kartta.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629054/komentajan_kartta_uvzzkk.png',
    'leopardi_patria.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629052/leopardi_patria_mo8gdh.png',
    'komentaja.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629050/komentaja_itkdam.png',
    'abstrakti_kenttä.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629050/abstrakti_kentt%C3%A4_vxf8kc.png',
    'jääkäri_partio.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629050/j%C3%A4%C3%A4k%C3%A4ri_partio_x079qo.png',
    'jääkäri_läheltä.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629050/j%C3%A4%C3%A4k%C3%A4ri_l%C3%A4helt%C3%A4_ttgsmq.png',
    'jääkärit_metsässä.png': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629049/j%C3%A4%C3%A4k%C3%A4rit_mets%C3%A4ss%C3%A4_ygwrbx.png',
    'tiedustelu4.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629046/tiedustelu4_ue8ltx.jpg',
    'tiedustelu5.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629046/tiedustelu5_e28fvu.jpg',
    'tiedustelu3.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629045/tiedustelu3_kxyooa.jpg',
    'tiedustelu2.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629045/tiedustelu2_d12my4.jpg',
    'tiedustelu1.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629045/tiedustelu1_qnbmdb.jpg',
    'liike5.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629044/liike5_g2wvrh.jpg',
    'liike4.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629044/liike4_bybvz5.jpg',
    'liike3.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629044/liike3_r2lbnn.jpg',
    'liike2.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629040/liike2_pdrfx3.jpg',
    'komento4.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629038/komento4_pyfqxn.jpg',
    'komento5.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629038/komento5_lmubeh.jpg',
    'Liike1.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629038/Liike1_mjf7ql.jpg',
    'komento3.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629038/komento3_j5vgu8.jpg',
    'komento2.jpg': 'https://res.cloudinary.com/dtd8emlzk/image/upload/v1753629038/komento2_ymzdsb.jpg'
}

# Suoritetaan korvauslogiikka
def process_file(file_path, url_mapping):
    """Lukee tiedoston, korvaa kuvapolut ja tallentaa muutokset."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            original_content = content

        # Käydään läpi jokainen tiedostonimi ja sen uusi URL
        for filename, new_url in url_mapping.items():
            # Luodaan joustava regex-lauseke, joka löytää erilaisia polkuja
            # Esim. 'images/kuva.png', '../images/kuva.png', 'url('kuva.png')'
            pattern = re.compile(f"([\'\"])(.*?/)?{re.escape(filename)}([\'\"])")
            content = pattern.sub(f"\\1{new_url}\\3", content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"✅ Päivitetty: {file_path}")
            return True
        return False

    except Exception as e:
        print(f"❌ Virhe tiedostossa {file_path}: {e}")
        return False

# Pääohjelma
def main():
    """Käy läpi kaikki hakemistot ja suorittaa korvaukset."""
    root_dir = 'taistelukentta'
    total_files_changed = 0
    
    print("Aloitetaan kuvapolkujen automaattinen päivitys...")
    
    # Käydään läpi kaikki kansiot ja tiedostot 'taistelukentta'-hakemistossa
    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.html', '.css')):
                file_path = os.path.join(subdir, file)
                if process_file(file_path, url_map):
                    total_files_changed += 1

    print(f"\nValmis! Yhteensä {total_files_changed} tiedostoa muutettu.")

if __name__ == "__main__":
    main()