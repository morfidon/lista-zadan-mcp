// Zapis i odczyt zadań w localStorage przeglądarki.

const KEY = 'lista-zadan';

export const SAMPLE_TASKS = [
  { id: 1, title: 'Kupić mleko', done: false },
  { id: 2, title: 'Odpisać na maile', done: true },
  { id: 3, title: 'Przygotować prezentację na piątek', done: false },
  { id: 4, title: 'Umówić wizytę u dentysty', done: false },
];

export function loadTasks(storage = globalThis.localStorage) {
  const raw = storage?.getItem(KEY);
  if (raw === null || raw === undefined) {
    return SAMPLE_TASKS;
  }
  try {
    const tasks = JSON.parse(raw);
    return Array.isArray(tasks) ? tasks : SAMPLE_TASKS;
  } catch {
    return SAMPLE_TASKS;
  }
}

export function saveTasks(tasks, storage = globalThis.localStorage) {
  storage?.setItem(KEY, JSON.stringify(tasks));
}
