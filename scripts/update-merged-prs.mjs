#!/usr/bin/env node
// Regenerates the merged-PR table in README.md between the MERGED-PRS markers.
// Run locally with:  GITHUB_TOKEN=$(gh auth token) node scripts/update-merged-prs.mjs

import { readFile, writeFile } from 'node:fs/promises';

const USER = process.env.GH_USER || 'Subhro-ai';
// PRs you merged into your own repositories are yours anyway — only external
// contributions are listed. Set INCLUDE_OWN=1 to list every merged PR.
const INCLUDE_OWN = process.env.INCLUDE_OWN === '1';
const README = new URL('../README.md', import.meta.url);
const START = '<!-- MERGED-PRS:START -->';
const END = '<!-- MERGED-PRS:END -->';

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN is not set');
  process.exit(1);
}

async function gh(path, params) {
  const url = new URL(`https://api.github.com/${path}`);
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      'user-agent': `${USER}-profile-readme`,
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url.pathname}`);
  return res.json();
}

async function searchMergedPrs() {
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const { items: batch = [] } = await gh('search/issues', {
      q: `is:pr author:${USER} is:merged`,
      per_page: '100',
      sort: 'created',
      order: 'desc',
      page: String(page),
    });
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

// The search API truncates long titles and omits diff stats, so each PR is
// re-fetched for its full title, merge date and line counts.
async function detail(item) {
  const [owner, repo] = new URL(item.repository_url).pathname.split('/').slice(-2);
  const pr = await gh(`repos/${owner}/${repo}/pulls/${item.number}`);
  return {
    repo: `${owner}/${repo}`,
    owner,
    number: pr.number,
    title: pr.title,
    url: pr.html_url,
    mergedAt: new Date(pr.merged_at),
    additions: pr.additions,
    deletions: pr.deletions,
    files: pr.changed_files,
  };
}

const htmlEscape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const month = (d) =>
  d.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// GitHub strips style/class from README HTML, so all colour comes from
// shields.io badges and all layout from plain table alignment.
const badge = (label, value, color) =>
  `<img alt="${htmlEscape(`${label}: ${value}`)}" src="https://img.shields.io/badge/` +
  `${encodeURIComponent(label)}-${encodeURIComponent(String(value))}-${color}` +
  `?style=for-the-badge&labelColor=161B22" />`;

function render(prs) {
  if (prs.length === 0) return '_No merged pull requests yet._';

  const byRepo = new Map();
  for (const pr of prs) {
    if (!byRepo.has(pr.repo)) byRepo.set(pr.repo, []);
    byRepo.get(pr.repo).push(pr);
  }
  const added = prs.reduce((n, pr) => n + pr.additions, 0);
  const removed = prs.reduce((n, pr) => n + pr.deletions, 0);
  const num = (n) => n.toLocaleString('en-US');

  const out = [
    '<p align="center">',
    `  ${badge('merged', prs.length, '8957E5')}`,
    `  ${badge('repositories', byRepo.size, '1F6FEB')}`,
    `  ${badge('added', `+${num(added)}`, '3FB950')}`,
    `  ${badge('removed', `\u2212${num(removed)}`, 'F85149')}`,
    '</p>',
    '',
  ];

  const repos = [...byRepo.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
  );

  for (const [repo, list] of repos) {
    const files = list.reduce((n, pr) => n + pr.files, 0);
    out.push(
      '<table>',
      '<tr><td colspan="2">',
      `<a href="https://github.com/${repo}"><b>${htmlEscape(repo)}</b></a>`,
      `&nbsp;·&nbsp; <sub>${plural(list.length, 'pull request')} merged` +
        `&nbsp;·&nbsp; ${plural(files, 'file')} changed</sub>`,
      '</td></tr>',
    );
    for (const pr of list) {
      out.push(
        '<tr>',
        `<td valign="top" align="right"><a href="${pr.url}"><code>#${pr.number}</code></a></td>`,
        '<td valign="top">',
        `<a href="${pr.url}">${htmlEscape(pr.title)}</a><br>`,
        `<sub>merged ${month(pr.mergedAt)} &nbsp;·&nbsp; ` +
          `<code>+${num(pr.additions)}</code> <code>\u2212${num(pr.deletions)}</code> &nbsp;·&nbsp; ` +
          `${plural(pr.files, 'file')}</sub>`,
        '</td>',
        '</tr>',
      );
    }
    out.push('</table>', '');
  }

  return out.join('\n').trimEnd();
}

const found = await searchMergedPrs();
const prs = (await Promise.all(found.map(detail)))
  .filter((p) => INCLUDE_OWN || p.owner.toLowerCase() !== USER.toLowerCase())
  .sort((a, b) => b.mergedAt - a.mergedAt);

const readme = await readFile(README, 'utf8');
const start = readme.indexOf(START);
const end = readme.indexOf(END);
if (start === -1 || end === -1) {
  console.error(`README.md is missing the ${START} / ${END} markers`);
  process.exit(1);
}

const block = [
  START,
  '<!-- Generated by scripts/update-merged-prs.mjs — edits here are overwritten. -->',
  '',
  render(prs),
  '',
  END,
].join('\n');

const updated = readme.slice(0, start) + block + readme.slice(end + END.length);
if (updated === readme) {
  console.log(`No change (${prs.length} merged PRs).`);
} else {
  await writeFile(README, updated);
  console.log(`Updated README.md with ${prs.length} merged PRs.`);
}
