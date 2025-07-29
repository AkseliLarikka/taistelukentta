import subprocess
import json
import re
import os
import logging

def export_git_log_to_json(repo_path, file_paths=None):
    """
    Eksportoi commit-datan annetusta Git-repositoriosta.
    Sisältää nyt myös yhteenvedon muutoksista.
    """
    git_dir = os.path.join(repo_path, ".git")
    if not os.path.isdir(repo_path) or not os.path.isdir(git_dir):
        logging.error(f"Virhe: Polku '{repo_path}' ei ole kelvollinen Git-repositorio.")
        return []

    pretty_format = "COMMIT_START%H<--SEP-->%an<--SEP-->%ae<--SEP-->%aI<--SEP-->%s<--SEP-->%b"

    git_log_command = [
        "git", "log",
        f"--pretty=format:{pretty_format}",
        "--stat",
        "--word-diff",
        "--cc",  # Tärkeä merge-committien käsittelyyn
        "--no-color",
        "-M", "-C"
    ]

    if file_paths:
        git_log_command.extend(["--", *file_paths])

    commits = []
    try:
        # Lisätään selkeyttävä lokitus suoritettavasta komennosta ja hakemistosta
        abs_repo_path = os.path.abspath(repo_path)
        logging.info(f"  Suoritetaan Git-komento hakemistossa: {abs_repo_path}")
        
        process = subprocess.run(git_log_command, cwd=repo_path, capture_output=True, text=True, check=True, encoding='utf-8')
        git_output = process.stdout
        
        if not git_output:
            logging.warning("  Git-komento suoritettiin, mutta se ei tuottanut tulostetta (stdout).")
            return []

    except subprocess.CalledProcessError as e:
        logging.error(f"Virhe Git-komennon suorituksessa repositoriossa '{repo_path}': {e}")
        logging.error(f"Virheulostulo (stderr): {e.stderr}")
        return []
    except FileNotFoundError:
        logging.error("Virhe: 'git'-komentoa ei löytynyt. Varmista, että Git on asennettu ja sen polku on määritelty järjestelmän PATH-ympäristömuuttujassa.")
        return []


    commit_blocks = git_output.split('COMMIT_START')[1:]

    for block in commit_blocks:
        try:
            metadata_part, rest_of_block = block.split('\n', 1)
        except ValueError:
            continue

        metadata = metadata_part.split('<--SEP-->')
        if len(metadata) != 6:
            logging.warning(f"Ohitetaan viallinen commit-lohko repositoriossa '{repo_path}': {metadata_part}")
            continue
        
        commit_metadata = {
            'hash': metadata[0],
            'author_name': metadata[1],
            'author_email': metadata[2],
            'date': metadata[3],
            'message_subject': metadata[4],
            'message_body': metadata[5].strip(),
            'repository_path': repo_path
        }
        
        # ✅ PARANNETTU: Tunnistaa sekä 'diff --git' että 'diff --cc' (merge-commiteille)
        diff_match = re.search(r'diff --(git|cc)', rest_of_block)
        diff_start_index = diff_match.start() if diff_match else -1

        if diff_start_index != -1:
            content_before_diff = rest_of_block[:diff_start_index]
            commit_metadata['diff'] = rest_of_block[diff_start_index:].strip()
        else:
            content_before_diff = rest_of_block
            commit_metadata['diff'] = ""
            
        stat_lines = []
        for line in content_before_diff.strip().splitlines():
             if '|' in line or 'file changed' in line:
                 stat_lines.append(line.strip())
        
        commit_metadata['changes_summary'] = '\n'.join(stat_lines)

        full_message = commit_metadata['message_subject']
        if commit_metadata['message_body']:
            full_message += "\n\n" + commit_metadata['message_body']
        commit_metadata['full_message'] = full_message

        commits.append(commit_metadata)

    return commits

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

    # Määrittele käsiteltävät repositoriot tähän
    repositories_to_process = [
        {
            "path": "./taistelukentta",
            "files": None 
        },
    ]

    all_exported_commits = []

    for repo_info in repositories_to_process:
        repo_path = repo_info["path"]
        # Varmistetaan, että '.'-polku viittaa nykyiseen työhakemistoon
        if repo_path == '.':
            repo_path = os.getcwd()

        files_to_track = repo_info.get("files")

        logging.info(f"Käsitellään repositoriota: {repo_path}")
        if files_to_track:
            logging.info(f"  Rajaten polkuihin: {', '.join(files_to_track)}")
        else:
            logging.info("  Haetaan kaikki commitit.")

        commits_from_repo = export_git_log_to_json(repo_path=repo_path, file_paths=files_to_track)
        all_exported_commits.extend(commits_from_repo)

    if all_exported_commits:
        # Järjestetään kaikki commitit uusimmasta vanhimpaan
        all_exported_commits.sort(key=lambda x: x['date'], reverse=True)

        output_filename = "git_commits_combined_filtered.json"
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(all_exported_commits, f, ensure_ascii=False, indent=2)
        logging.info(f"\nKaikki rajattu commit-data yhdistetty ja viety tiedostoon: {output_filename}")
        logging.info(f"Yhteensä {len(all_exported_commits)} commitia viety.")
    else:
        logging.info("\nEi committeja vietäväksi valituista repoista/poluista tai virhe tapahtui.")