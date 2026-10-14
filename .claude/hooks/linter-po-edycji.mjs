// Hook PostToolUse (Edit|Write): po zmianie pliku .css uruchamia stylelint --fix,
// a po zmianie .js/.mjs/.cjs eslint --fix (przez API, z node_modules projektu).
// Poprawki automatyczne zgłasza krótko w additionalContext, a błędy, których --fix
// nie naprawił, oddaje jako decision: 'block' z listą (reason trafia do Claude).

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

let wejscie;
try {
  wejscie = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const plik = wejscie?.tool_input?.file_path;
if (typeof plik !== 'string' || plik === '') process.exit(0);

const katalogProjektu = path.resolve(process.env.CLAUDE_PROJECT_DIR || wejscie.cwd || process.cwd());
const pelna = path.resolve(katalogProjektu, plik);
const wzgledna = path.relative(katalogProjektu, pelna);
if (wzgledna.startsWith('..') || path.isAbsolute(wzgledna) || !existsSync(pelna)) process.exit(0);

const nazwa = wzgledna.replaceAll('\\', '/');
const rozszerzenie = path.extname(pelna).toLowerCase();

// Wspólny format problemu: { linia, kolumna, tekst, regula, blad }.
async function eslint() {
  const { ESLint } = await import('eslint');
  const linter = new ESLint({ cwd: katalogProjektu, fix: true });
  if (await linter.isPathIgnored(pelna)) return null;
  const wyniki = await linter.lintFiles([pelna]);
  await ESLint.outputFixes(wyniki);
  return wyniki.flatMap((w) =>
    w.messages.map((m) => ({
      linia: m.line ?? 0,
      kolumna: m.column ?? 0,
      tekst: m.message,
      regula: m.ruleId ?? 'składnia',
      blad: m.severity === 2,
    }))
  );
}

async function stylelint() {
  const { default: linter } = await import('stylelint');
  const { results } = await linter.lint({
    files: [pelna],
    cwd: katalogProjektu,
    fix: true,
    allowEmptyInput: true,
  });
  if (results.length === 0 || results.every((w) => w.ignored)) return null;
  return results.flatMap((w) => [
    ...w.warnings.map((m) => ({
      linia: m.line ?? 0,
      kolumna: m.column ?? 0,
      tekst: m.text.replace(new RegExp(`\\s*\\(${m.rule}\\)$`), ''),
      regula: m.rule,
      blad: m.severity === 'error',
    })),
    ...(w.parseErrors ?? []).map((m) => ({
      linia: m.line ?? 0,
      kolumna: m.column ?? 0,
      tekst: m.text,
      regula: 'składnia',
      blad: true,
    })),
  ]);
}

const uruchom = rozszerzenie === '.css' ? stylelint : ['.js', '.mjs', '.cjs'].includes(rozszerzenie) ? eslint : null;
if (!uruchom) process.exit(0);
const narzedzie = rozszerzenie === '.css' ? 'Stylelint' : 'ESLint';

const przed = readFileSync(pelna, 'utf8');
let problemy;
try {
  problemy = await uruchom();
} catch (e) {
  // Brak linterów albo zepsuta konfiguracja: nie blokujemy pracy, tylko informujemy.
  wypisz({ kontekst: `${narzedzie} nie uruchomił się na ${nazwa}: ${e.message}` });
  process.exit(0);
}
if (problemy === null) process.exit(0);

const poprawil = readFileSync(pelna, 'utf8') !== przed;
const opis = (m) => `- ${nazwa}:${m.linia}:${m.kolumna} ${m.tekst} (${m.regula})`;
const bledy = problemy.filter((m) => m.blad);
const ostrzezenia = problemy.filter((m) => !m.blad);

const kontekst = [];
if (poprawil) {
  kontekst.push(`${narzedzie} --fix poprawił automatycznie ${nazwa}. Plik na dysku różni się od tego, co zapisałeś, więc przed kolejną edycją przeczytaj go ponownie.`);
}
if (ostrzezenia.length > 0) {
  kontekst.push(`${narzedzie}: ostrzeżenia w ${nazwa} (nie blokują):\n${ostrzezenia.map(opis).join('\n')}`);
}

wypisz({
  kontekst: kontekst.join('\n'),
  blokada:
    bledy.length > 0
      ? `${narzedzie}: w ${nazwa} zostały błędy, których --fix nie naprawił (${bledy.length}):\n${bledy.map(opis).join('\n')}\nPopraw je.`
      : '',
});
process.exit(0);

function wypisz({ kontekst, blokada = '' }) {
  if (!kontekst && !blokada) return;
  const wynik = {};
  if (blokada) {
    wynik.decision = 'block';
    wynik.reason = blokada;
  }
  if (kontekst) {
    wynik.hookSpecificOutput = { hookEventName: 'PostToolUse', additionalContext: kontekst };
  }
  process.stdout.write(JSON.stringify(wynik));
}
