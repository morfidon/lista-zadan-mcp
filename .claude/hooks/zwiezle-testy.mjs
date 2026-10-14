// Hook PreToolUse (Bash|PowerShell): gdy polecenie uruchamia `npm test` bez --test-reporter,
// dopisuje `-- --test-reporter=dot` (updatedInput) i prosi o zgodę (permissionDecision: 'ask'),
// żeby użytkownik widział zmienione polecenie. Reporter dot: kropka za każdy test,
// szczegóły tylko przy błędach, więc w kontekście zostaje mniej logu.

import { readFileSync } from 'node:fs';

let wejscie;
try {
  wejscie = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const polecenie = wejscie?.tool_input?.command;
if (typeof polecenie !== 'string' || polecenie === '') process.exit(0);

// Fragmenty, w których `npm test` jest tekstem, a nie poleceniem: napisy w cudzysłowach,
// here-stringi PowerShella i heredoki Basha (np. treść komunikatu commita).
const TEKST = /@'[\s\S]*?\n'@|@"[\s\S]*?\n"@|<<-?\s*['"]?(\w+)['"]?[\s\S]*?\n\s*\1(?=\s|$)|'[^']*'|"(?:\\.|`.|[^"\\`])*"/g;
const tekst = [...polecenie.matchAll(TEKST)].map((m) => [m.index, m.index + m[0].length]);
const wTekscie = (i) => tekst.some(([od, do_]) => i >= od && i < do_);

// `npm test` (także npm.cmd, `npm t`, `npm run test`) na początku polecenia albo po ; & | ( lub nowej linii,
// a potem jego argumenty aż do operatora powłoki. Przekierowanie typu 2>&1 nie jest argumentem.
const ARG = String.raw`(?:[^\S\n]+(?!\d*>)(?:"[^"]*"|'[^']*'|[^\s|;&<>()'"])+)*`;
const NPM_TEST = new RegExp(String.raw`(^|[;&|(\n]\s*)(npm(?:\.cmd)?\s+(?:test|t|run\s+test)(?![\w:-]))(${ARG})`, 'g');

let zmienione = false;
const nowe = polecenie.replace(NPM_TEST, (calosc, przed, npm, argumenty, indeks) => {
  if (wTekscie(indeks + przed.length) || /--test-reporter\b/.test(argumenty)) return calosc;
  zmienione = true;
  const maSeparator = /(^|\s)--(\s|$)/.test(argumenty);
  return `${przed}${npm}${argumenty}${maSeparator ? '' : ' --'} --test-reporter=dot`;
});

if (!zmienione) process.exit(0);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason:
        'Zwięzłe testy: dopisałem --test-reporter=dot do npm test (kropka za test, szczegóły tylko przy błędach). ' +
        `Polecenie po zmianie: ${nowe}`,
      updatedInput: { ...wejscie.tool_input, command: nowe },
    },
  })
);
process.exit(0);
