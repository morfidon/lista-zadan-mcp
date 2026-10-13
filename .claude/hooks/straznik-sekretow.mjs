// Hook UserPromptSubmit: blokuje prompt, w którym jest coś, co wygląda na klucz API.
// decision: 'block' odrzuca prompt (nie trafia do Claude), a reason widzi tylko użytkownik.
// W komunikacie podajemy wyłącznie rodzaj klucza, nigdy treść promptu ani sam klucz.

import { readFileSync } from 'node:fs';

const WZORCE = [
  ['klucz Anthropic (sk-ant-…)', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['klucz OpenAI (sk-…)', /\bsk-(?!ant-)(?:proj-)?[A-Za-z0-9_-]{32,}/],
  ['token GitHub (ghp_/gho_/ghu_/ghs_/ghr_…)', /\bgh[pousr]_[A-Za-z0-9]{36,}/],
  ['token GitHub (github_pat_…)', /\bgithub_pat_[A-Za-z0-9_]{50,}/],
  ['klucz AWS (AKIA…)', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['klucz Google (AIza…)', /\bAIza[0-9A-Za-z_-]{35}/],
  ['token Slack (xox…)', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['klucz prywatny (BEGIN … PRIVATE KEY)', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];

let prompt = '';
try {
  prompt = String(JSON.parse(readFileSync(0, 'utf8')).prompt ?? '');
} catch {
  process.exit(0);
}

const znalezione = WZORCE.filter(([, wzorzec]) => wzorzec.test(prompt)).map(([nazwa]) => nazwa);
if (znalezione.length === 0) process.exit(0);

// Blokada przez JSON (kod 0), bo tylko tak można przekazać suppressOriginalPrompt:
// bez niego Claude Code dopisuje do komunikatu „Original prompt” z całym kluczem.
process.stdout.write(
  JSON.stringify({
    decision: 'block',
    reason:
      `Strażnik sekretów: prompt zablokowany, bo wygląda na to, że zawiera sekret: ` +
      `${znalezione.join(', ')}. Usuń klucz (najlepiej go też unieważnij) i wyślij prompt jeszcze raz. ` +
      `Klucze trzymaj w .env, a nie w rozmowie.`,
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      suppressOriginalPrompt: true,
    },
  })
);
process.exit(0);
