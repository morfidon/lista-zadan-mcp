// Hook Stop: nie pozwala Claude skończyć pracy z czerwonymi testami.
// Bez niezatwierdzonych zmian w git nic nie robi. Gdy zmiany są, uruchamia
// npm test; jeśli testy padają, kończy się kodem 2 i wypisuje na stderr,
// które testy nie przeszły (Claude Code przekazuje stderr z powrotem Claude).

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Po tylu blokadach z rzędu w jednej sesji hook odpuszcza, żeby nie
// zapętlić Claude, gdy testów nie da się naprawić (np. padały już wcześniej).
const MAX_BLOKAD = 3;

function wczytajWejscie() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

const wejscie = wczytajWejscie();
const katalog = process.env.CLAUDE_PROJECT_DIR || wejscie.cwd || process.cwd();
const plikLicznika = join(
  tmpdir(),
  `bramka-testow-${String(wejscie.session_id || 'brak').replace(/[^\w-]/g, '')}.txt`
);

function wyzerujLicznik() {
  rmSync(plikLicznika, { force: true });
}

const git = spawnSync('git', ['status', '--porcelain'], { cwd: katalog, encoding: 'utf8' });
if (git.status !== 0 || git.stdout.trim() === '') {
  wyzerujLicznik();
  process.exit(0);
}

const test = spawnSync('npm test -- --test-reporter=tap', {
  cwd: katalog,
  encoding: 'utf8',
  shell: true,
  maxBuffer: 20 * 1024 * 1024,
});

if (test.status === 0) {
  wyzerujLicznik();
  process.exit(0);
}

let blokady = 0;
try {
  blokady = Number(readFileSync(plikLicznika, 'utf8')) || 0;
} catch {
  // brak pliku = pierwsza blokada
}
if (blokady >= MAX_BLOKAD) {
  wyzerujLicznik();
  process.exit(0);
}
writeFileSync(plikLicznika, String(blokady + 1));

// Z wyjścia TAP wyciągamy "not ok N - nazwa" i pierwszą linię "error:" pod nią.
const linie = `${test.stdout}\n${test.stderr}`.split(/\r?\n/);
const padly = [];
for (let i = 0; i < linie.length; i++) {
  const m = linie[i].match(/^(\s*)not ok \d+ - (.+)$/);
  if (!m) continue;
  let blad = '';
  for (let j = i + 1; j < linie.length && !/^\s*(ok|not ok) \d+/.test(linie[j]); j++) {
    const e = linie[j].match(/^\s*error:\s*(.+)$/);
    if (e) {
      blad = e[1].replace(/^['|>-]+\s*|'$/g, '').trim();
      if (!blad && linie[j + 1]) blad = linie[j + 1].trim();
      break;
    }
  }
  padly.push(`${m[1]}- ${m[2]}${blad ? ` → ${blad}` : ''}`);
}

const raport = padly.length
  ? padly.join('\n')
  : linie.filter(Boolean).slice(-30).join('\n');

process.stderr.write(
  `Bramka testów: w repozytorium są niezatwierdzone zmiany, a npm test nie przechodzi ` +
    `(próba ${blokady + 1}/${MAX_BLOKAD}). Nie kończ pracy, napraw te testy:\n${raport}\n`
);
process.exit(2);
