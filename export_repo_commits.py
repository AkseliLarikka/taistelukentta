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

    git_log_command = [
        "git", "log",
        "--pretty=format:COMMIT_START{\"hash\": \"%H\", \"author_name\": \"%an\", \"author_email\": \"%ae\", \"date\": \"%aI\", \"message_subject\": \"%s\"}",
        "--stat",
        "--word-diff",
        "--cc",
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
        logging.error(f"Virhe Git-komennon suorituksessa repositoriossa '{repo_path}': {e}")
        logging.error(f"Virheulostulo: {e.stderr}")
        return []

    commit_blocks = git_output.split('COMMIT_START')[1:]

    for block in commit_blocks:
        json_match = re.search(r'^(\{.*?\})\n', block, re.DOTALL)
        if not json_match:
            continue

        try:
            commit_metadata = json.loads(json_match.group(1))
            commit_metadata['repository_path'] = repo_path
        except json.JSONDecodeError as e:
            logging.error(f"Virhe JSON:n jäsentämisessä repositoriossa '{repo_path}': {e}")
            continue

        content_after_json = block[json_match.end():]
        diff_match = re.search(r'diff --git', content_after_json)
        diff_start_index = diff_match.start() if diff_match else -1

        if diff_start_index != -1:
            content_before_diff = content_after_json[:diff_start_index]
            commit_metadata['diff'] = content_after_json[diff_start_index:].strip()
        else:
            content_before_diff = content_after_json
            commit_metadata['diff'] = ""

        # ✅ Korjattu stat-yhteenvedon poiminta
        stat_lines = []
        for line in content_before_diff.strip().splitlines():
            if '|' in line or 'file changed' in line:
                stat_lines.append(line.strip())

        commit_metadata['changes_summary'] = '\n'.join(stat_lines)
        message_body_lines = [
            line for line in content_before_diff.strip().splitlines()
            if line.strip() not in stat_lines
        ]
        message_body = '\n'.join(message_body_lines).strip()
        commit_metadata['message_body'] = message_body

        full_message = commit_metadata['message_subject']
        if commit_metadata['message_body']:
            full_message += "\n\n" + commit_metadata['message_body']
        commit_metadata['full_message'] = full_message

        commits.append(commit_metadata)

    return commits


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

    repositories_to_process = [
        {
            "path": "./taistelukentta",
            "files": None
        },
    ]

    all_exported_commits = []

    for repo_info in repositories_to_process:
        repo_path = repo_info["path"]
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
        all_exported_commits.sort(key=lambda x: x['date'], reverse=True)

        output_filename = "git_commits_combined_filtered.json"
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(all_exported_commits, f, ensure_ascii=False, indent=2)
        logging.info(f"\nKaikki rajattu commit-data yhdistetty ja viety tiedostoon: {output_filename}")
        logging.info(f"Yhteensä {len(all_exported_commits)} commitia viety.")
    else:
        logging.info("\nEi committeja vietäväksi valituista repoista/poluista tai virhe tapahtui.")


# ==========================
# ✅ Unit testit
# ==========================

import unittest
from unittest.mock import patch

class TestExportGitLogToJson(unittest.TestCase):
    @patch('subprocess.run')
    def test_word_diff_and_merge_commit_parsing(self, mock_run):
        mock_git_output = (
            'COMMIT_START{"hash": "abc123", "author_name": "Test User", "author_email": "test@example.com", "date": "2024-06-01T12:00:00+00:00", "message_subject": "Add feature"}\n'
            ' file1.py | 2 +-\n'
            ' 1 file changed, 1 insertion(+), 1 deletion(-)\n'
            'diff --git a/file1.py b/file1.py\n'
            'index e69de29..4b825dc 100644\n'
            '--- a/file1.py\n'
            '+++ b/file1.py\n'
            '@@ -0,0 +1,2 @@\n'
            '+print("Hello world")\n'
            '-print("Bye world")\n'
            '\n'
            'COMMIT_START{"hash": "def456", "author_name": "Merge Bot", "author_email": "merge@example.com", "date": "2024-06-02T12:00:00+00:00", "message_subject": "Merge branch \'feature\'"}\n'
            ' file2.py | 4 +++-\n'
            ' 1 file changed, 3 insertions(+), 1 deletion(-)\n'
            'diff --git a/file2.py b/file2.py\n'
            'index 1111111..2222222 100644\n'
            '--- a/file2.py\n'
            '+++ b/file2.py\n'
            '@@ -1,4 +1,7 @@\n'
            '-print("Old")\n'
            '+print("New")\n'
        )
        mock_run.return_value = subprocess.CompletedProcess(
            args=['git'], returncode=0, stdout=mock_git_output, stderr=''
        )

        with patch('os.path.isdir', return_value=True):
            commits = export_git_log_to_json('dummy_repo')

        self.assertEqual(len(commits), 2)
        self.assertEqual(commits[0]['hash'], 'abc123')
        self.assertIn('file1.py', commits[0]['changes_summary'])
        self.assertIn('diff --git', commits[0]['diff'])
        self.assertEqual(commits[1]['hash'], 'def456')
        self.assertIn('file2.py', commits[1]['changes_summary'])
        self.assertIn('diff --git', commits[1]['diff'])

if __name__ == "__main__":
    unittest.main(exit=False)
