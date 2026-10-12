// Zapis i odczyt zadań w localStorage przeglądarki.

export const KEY = 'lista-zadan';
export const BACKUP_KEY = 'lista-zadan.uszkodzone';

export const SAMPLE_TASKS = [
  { id: 1, title: 'Kupić mleko', done: false },
  { id: 2, title: 'Odpisać na maile', done: true },
  { id: 3, title: 'Przygotować prezentację na piątek', done: false },
  { id: 4, title: 'Umówić wizytę u dentysty', done: false },
];

// Uszkodzony zapis kopiujemy pod osobny klucz (starszej kopii nie nadpisujemy),
// bo pierwszy zapis zadań nadpisałby go przykładami i dane przepadłyby na zawsze.
function backupBroken(raw, storage) {
  const key = storage.getItem(BACKUP_KEY) === null ? BACKUP_KEY : `${BACKUP_KEY}.${Date.now()}`;
  try {
    storage.setItem(key, raw);
  } catch {
    // Bez miejsca na kopię zostaje tylko oryginał, który i tak jeszcze nie jest nadpisany.
  }
}

// Zwraca { tasks, corrupted }. corrupted = zapis istniał, ale nie dało się go odczytać.
export function loadTasks(storage = globalThis.localStorage) {
  const raw = storage?.getItem(KEY);
  if (raw === null || raw === undefined) {
    return { tasks: SAMPLE_TASKS, corrupted: false };
  }
  try {
    const tasks = JSON.parse(raw);
    if (Array.isArray(tasks)) {
      return { tasks, corrupted: false };
    }
  } catch {
    // Przechodzimy do kopii zapasowej poniżej.
  }
  backupBroken(raw, storage);
  return { tasks: SAMPLE_TASKS, corrupted: true };
}

export function saveTasks(tasks, storage = globalThis.localStorage) {
  storage?.setItem(KEY, JSON.stringify(tasks));
}
