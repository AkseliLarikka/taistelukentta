import subprocess
import json
import re
import os

def export_git_log_to_json(repo_path, file_paths=None):
    """
    Eksportoi commit-datan annetusta Git-repositoriosta.

    Args:
        repo_path (str): Polku Git-repositorion juurikansioon.
        file_paths (list, optional): Lista tiedostopoluista tai hakemistopoluista (esim. "hakemisto/"),
                                     joihin commit-historia rajataan. Jos None, haetaan kaikki commitit.
                                     Defaults to None.

    Returns:
        list: Lista sanakirjoja, joissa jokainen sanakirja edustaa commitia.
    """
    # Varmista, että polku on olemassa ja on Git-repositorio
    if not os.path.isdir(os.path.join(repo_path, ".git")):
        print(f"Virhe: Polku '{repo_path}' ei näytä olevan Git-repositorion juurikansio.")
        return []

    # Base Git log command
    git_log_command = [
        "git", "log",
        "--pretty=format:COMMIT_START{\"hash\": \"%H\", \"author_name\": \"%an\", \"author_email\": \"%ae\", \"date\": \"%aI\", \"message_subject\": \"%s\"}",
        "--full-diff",
        "--no-color",
        "-M", "-C"
    ]

    # Lisää tiedostopolut, jos annettu
    if file_paths:
        git_log_command.extend(["--", *file_paths]) # "--" kertoo Gitille, että seuraavat argumentit ovat tiedostopolkuja

    commits = []
    try:
        # Suorita Git-komento annetussa repositorion polussa
        process = subprocess.run(git_log_command, cwd=repo_path, capture_output=True, text=True, check=True, encoding='utf-8')
        git_output = process.stdout
    except subprocess.CalledProcessError as e:
        print(f"Virhe Git-komennon suorituksessa repositoriossa '{repo_path}': {e}")
        print(f"Ulostulo: {e.stdout}")
        print(f"Virheulostulo: {e.stderr}")
        return []

    commit_blocks = git_output.split('COMMIT_START')[1:]

    for block in commit_blocks:
        json_match = re.search(r'^(\{.*?\})\n', block, re.DOTALL)
        if not json_match:
            print(f"Varoitus: Ei löytynyt JSON-dataa commit-lohkosta repositoriosta '{repo_path}': {block[:200]}...")
            continue

        try:
            commit_metadata = json.loads(json_match.group(1))
            # Lisää repositorion nimi/polku commit-dataan, jotta tiedät mistä se on peräisin
            commit_metadata['repository_path'] = repo_path
        except json.JSONDecodeError as e:
            print(f"Virhe JSON:n jäsentämisessä repositoriossa '{repo_path}': {e} kohdassa: {json_match.group(1)[:200]}...")
            continue

        message_body_match = re.search(r'^\s*\{.*?\}\n(.*?)(?=diff --git|$)', block, re.DOTALL)
        if message_body_match:
            message_body = message_body_match.group(1).strip()
            message_body = re.sub(r'^\s*\n', '', message_body, flags=re.MULTILINE)
            commit_metadata['message_body'] = message_body
        else:
            commit_metadata['message_body'] = ""

        diff_match = re.search(r'diff --git[\s\S]*', block)
        if diff_match:
            commit_metadata['diff'] = diff_match.group(0).strip()
        else:
            commit_metadata['diff'] = ""

        full_message = commit_metadata['message_subject']
        if commit_metadata['message_body']:
            full_message += "\n\n" + commit_metadata['message_body']
        commit_metadata['full_message'] = full_message

        commits.append(commit_metadata)

    return commits

if __name__ == "__main__":
    # Määrittele listana repositoriot, joista haluat hakea dataa
    # HUOM: Varmista, että nämä polut ovat oikein ja osoittavat kloonattujen Git-repositorioiden juurikansioihin.
    # Muista vaihtaa esimerkkipolut omiesi mukaisiksi.
    repositories_to_process = [
        # Olettaen, että "AkseliLarikka.github.io" on kloonattu kansioon kuten "/home/user/my_projects/AkseliLarikka.github.io"
        {"path": "AkseliLarikka.github.io/", "files": [
            "taistelukenttä.html",
            "Styles/d20.css",
            "Scripts/d20.js"
        ]},
        # Lisää tähän muita repoja ja niiden hakemistoja/tiedostoja tarvittaessa
    ]

    all_exported_commits = []

    for repo_info in repositories_to_process:
        repo_path = repo_info["path"]
        files_to_track = repo_info.get("files") # Käytä .get() varmuuden vuoksi

        print(f"Käsitellään repositoriota: {repo_path}")
        if files_to_track:
            print(f"  Rajaten polkuihin: {', '.join(files_to_track)}")
        else:
            print("  Haetaan kaikki commitit.")

        commits_from_repo = export_git_log_to_json(repo_path=repo_path, file_paths=files_to_track)
        all_exported_commits.extend(commits_from_repo)

    if all_exported_commits:
        # Lajittele commitit ajan mukaan (uusin ensin), jos haluat järjestyksen.
        # Commit-aika on ISO 8601 -muodossa, joten merkkijonovertailu toimii oikein.
        all_exported_commits.sort(key=lambda x: x['date'], reverse=True)

        output_filename = "git_commits_combined_specific_files.json"
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(all_exported_commits, f, ensure_ascii=False, indent=2)
        print(f"\nKaikki rajattu commit-data yhdistetty ja viety tiedostoon: {output_filename}")
        print(f"Yhteensä {len(all_exported_commits)} commitia viety.")
    else:
        print("\nEi committeja vietäväksi valituista repoista/tiedostoista tai virhe tapahtui.")