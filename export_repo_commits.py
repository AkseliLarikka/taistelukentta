import subprocess
import json
import re
import os

def export_git_log_to_json(repo_path, file_paths=None):
    """
    Eksportoi commit-datan annetusta Git-repositoriosta.
    Sisältää nyt myös yhteenvedon muutoksista.
    """
    # Varmista, että polku on olemassa ja on Git-repositorio
    git_dir = os.path.join(repo_path, ".git")
    if not os.path.isdir(repo_path) or not os.path.isdir(git_dir):
        print(f"Virhe: Polku '{repo_path}' ei ole kelvollinen Git-repositorio.")
        return []

    # Base Git log command - lisätty --stat
    git_log_command = [
        "git", "log",
        "--pretty=format:COMMIT_START{\"hash\": \"%H\", \"author_name\": \"%an\", \"author_email\": \"%ae\", \"date\": \"%aI\", \"message_subject\": \"%s\"}",
        "--stat",  # <--- LISÄTTY: Tämä lisää tiedostomuutosten yhteenvedon
        "--full-diff",
        "--no-color",
        "-M", "-C"
    ]

    if file_paths:
        git_log_command.extend(["--", *file_paths])

    commits = []
    try:
        process = subprocess.run(git_log_command, cwd=repo_path, capture_output=True, text=True, check=True, encoding='utf-8')
        git_output = process.stdout
    except subprocess.CalledProcessError as e:
        print(f"Virhe Git-komennon suorituksessa repositoriossa '{repo_path}': {e}")
        print(f"Virheulostulo: {e.stderr}")
        return []

    commit_blocks = git_output.split('COMMIT_START')[1:]

    for block in commit_blocks:
        # Etsitään JSON-metadata, kuten aiemminkin
        json_match = re.search(r'^(\{.*?\})\n', block, re.DOTALL)
        if not json_match:
            continue

        try:
            commit_metadata = json.loads(json_match.group(1))
            commit_metadata['repository_path'] = repo_path
        except json.JSONDecodeError as e:
            print(f"Virhe JSON:n jäsentämisessä repositoriossa '{repo_path}': {e}")
            continue

        # Erotellaan lohko osiin: viesti, stat-yhteenveto ja diff
        # Sisältö JSON-datan ja diffin välissä
        content_after_json = block[json_match.end():]
        
        diff_match = re.search(r'diff --git', content_after_json)
        diff_start_index = diff_match.start() if diff_match else -1

        # Erotetaan diff pois, jos se löytyy
        if diff_start_index != -1:
            content_before_diff = content_after_json[:diff_start_index]
            commit_metadata['diff'] = content_after_json[diff_start_index:].strip()
        else:
            content_before_diff = content_after_json
            commit_metadata['diff'] = ""

        # Etsitään stat-yhteenvetoa sisällöstä ennen diffiä
        # Se alkaa yleensä tiedostolistalla ja päättyy "X files changed..."
        stat_match = re.search(r'\n\s*([^:\n].*? \| .*?)\n(.*? files? changed,.*)', content_before_diff, re.DOTALL | re.MULTILINE)
        
        if stat_match:
            # Kaikki stat-lohkon alusta loppuun
            full_stat_block_start = stat_match.start(1)
            # Poimitaan koko stat-lohko ja siistitään se
            changes_summary = content_before_diff[full_stat_block_start:].strip()
            commit_metadata['changes_summary'] = changes_summary
            # Commit-viestin runko on kaikki ennen stat-lohkoa
            message_body = content_before_diff[:full_stat_block_start].strip()
        else:
            # Jos stat-lohkoa ei löytynyt, kaikki ennen diffiä on viestin runkoa
            commit_metadata['changes_summary'] = ""
            message_body = content_before_diff.strip()

        commit_metadata['message_body'] = message_body

        full_message = commit_metadata['message_subject']
        if commit_metadata['message_body']:
            full_message += "\n\n" + commit_metadata['message_body']
        commit_metadata['full_message'] = full_message

        commits.append(commit_metadata)

    return commits

if __name__ == "__main__":
    # Tämä osa toimii täysin samoin kuin ennen.
    # Muista muokata polut vastaamaan omaa paikallista ympäristöäsi,
    # jos ajat skriptin manuaalisesti. GitHub Actions käyttää suhteellisia polkuja.
    repositories_to_process = [
        {
            "path": "./taistelukentta", # Esimerkki: nykyinen kansio
            "files": None
        },
        # Voit lisätä muita repositorioita tänne samalla tavalla kuin aiemmin
    ]

    # Jos ajat tätä manuaalisesti paikallisesti, käytä aiempaa rakennetta:
    # repositories_to_process = [
    #     {
    #         "path": os.path.expanduser("~/github/taistelukentta"),
    #         "files": None
    #     },
    #     {
    #         "path": os.path.expanduser("~/github/AkseliLarikka.github.io"),
    #         "files": ["taistelukenttä.html", "Styles/d20.css", "Scripts/d20.js"]
    #     },
    # ]

    all_exported_commits = []

    for repo_info in repositories_to_process:
        repo_path = repo_info["path"]
        # Muunnetaan '.' absoluuttiseksi poluksi, jotta tuloste on selkeämpi
        if repo_path == '.':
            repo_path = os.getcwd()
            
        files_to_track = repo_info.get("files")

        print(f"Käsitellään repositoriota: {repo_path}")
        if files_to_track:
            print(f"  Rajaten polkuihin: {', '.join(files_to_track)}")
        else:
            print("  Haetaan kaikki commitit.")

        commits_from_repo = export_git_log_to_json(repo_path=repo_path, file_paths=files_to_track)
        all_exported_commits.extend(commits_from_repo)

    if all_exported_commits:
        all_exported_commits.sort(key=lambda x: x['date'], reverse=True)

        output_filename = "git_commits_combined_filtered.json"
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(all_exported_commits, f, ensure_ascii=False, indent=2)
        print(f"\nKaikki rajattu commit-data yhdistetty ja viety tiedostoon: {output_filename}")
        print(f"Yhteensä {len(all_exported_commits)} commitia viety.")
    else:
        print("\nEi committeja vietäväksi valituista repoista/poluista tai virhe tapahtui.")