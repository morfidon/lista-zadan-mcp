// Hook PreToolUse (Edit|Write): gdy Claude zmienia plik w folderze tests/, nie blokuje,
// tylko prosi użytkownika o zgodę (permissionDecision: 'ask') z krótkim powodem.
// Każdy inny plik przepuszcza bez komentarza (kod 0, pusty stdout = zwykłe uprawnienia).

import { readFileSync } from 'node:fs';
import path from 'node:path';

let wejscie;
try {
  wejscie = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const plik = wejscie?.tool_input?.file_path;
if (typeof plik !== 'string' || plik === '') process.exit(0);

const katalogProjektu = process.env.CLAUDE_PROJECT_DIR || wejscie.cwd || process.cwd();
const wzgledna = path.relative(path.resolve(katalogProjektu), path.resolve(katalogProjektu, plik));
const pierwszyCzlon = wzgledna.split(/[\\/]/)[0];

if (path.isAbsolute(wzgledna) || pierwszyCzlon.toLowerCase() !== 'tests') process.exit(0);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason:
        `Claude zmienia test (${wzgledna.replaceAll('\\', '/')}). ` +
        'Sprawdź, czy to zmiana wymagań, a nie obejście błędu w kodzie.',
    },
  })
);
process.exit(0);
