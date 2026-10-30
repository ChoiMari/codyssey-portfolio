const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required to refresh the public repository snapshot.');

  const response = await fetch('https://api.github.com/users/ChoiMari/repos?per_page=100&sort=updated', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'codyssey-portfolio-pages'
    }
  });
  if (!response.ok) throw new Error(`GitHub API returned HTTP ${response.status}.`);

  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('GitHub API did not return a repository array.');
  const repos = data.map(({ name, html_url, description, language, stargazers_count }) => ({
    name, html_url, description, language, stargazers_count
  }));
  const destination = path.join(__dirname, '..', 'data', 'repos.json');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(repos, null, 2)}\n`);
  console.log(`Saved ${repos.length} public repositories for the Pages fallback.`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
