// Logika listy zadań: czyste funkcje, bez DOM i bez zapisu.
// Każda funkcja zwraca NOWĄ tablicę, nie zmienia tej, którą dostała.

function isValidDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export const PRIORITIES = ['low', 'normal', 'high'];
export const PRIORITY_LABELS = { low: 'niski', normal: 'normalny', high: 'wysoki' };
const PRIORITY_RANK = { high: 0, normal: 1, low: 2 };

// Brak pola (stare zapisy) lub nieznana wartość oznacza priorytet normalny.
export function getPriority(task) {
  return PRIORITIES.includes(task.priority) ? task.priority : 'normal';
}

// Termin jest opcjonalny: bez niego zadanie nie ma pola dueDate (RRRR-MM-DD).
// Priorytet też: normalny jest domyślny i nie jest zapisywany w zadaniu.
export function createTask(title, id = Date.now(), dueDate, priority = 'normal') {
  const clean = String(title ?? '').trim();
  if (!clean) {
    throw new Error('Zadanie musi mieć treść.');
  }
  if (!PRIORITIES.includes(priority)) {
    throw new Error('Priorytet musi być: low, normal albo high.');
  }
  let task = { id, title: clean, done: false };
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    if (typeof dueDate !== 'string' || !isValidDate(dueDate)) {
      throw new Error('Termin musi mieć format RRRR-MM-DD.');
    }
    task = { ...task, dueDate };
  }
  return priority === 'normal' ? task : { ...task, priority };
}

export function addTask(tasks, title, id, dueDate, priority) {
  return moveDoneToEnd([...tasks, createTask(title, id, dueDate, priority)]);
}

// Lokalna data (nie UTC), żeby „dziś” zgadzało się z dniem użytkownika.
export function todayString(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Po terminie dopiero od następnego dnia; zrobione i bez terminu nigdy.
export function isOverdue(task, today) {
  return typeof task.dueDate === 'string' && !task.done && task.dueDate < today;
}

// Tekst terminu do wyświetlenia: „dziś” zamiast daty, gdy termin wypada dzisiaj.
export function formatDue(dueDate, today) {
  return `Termin: ${dueDate === today ? 'dziś' : dueDate}`;
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function moveDoneToEnd(tasks) {
  return [...tasks.filter((task) => !task.done), ...tasks.filter((task) => task.done)];
}

// Kolejność widoku: do zrobienia od wysokiego priorytetu do niskiego, zrobione na końcu.
// Przy równym priorytecie zostaje dotychczasowa kolejność (sort jest stabilny).
export function sortByPriority(tasks) {
  const active = tasks.filter((task) => !task.done);
  active.sort((a, b) => PRIORITY_RANK[getPriority(a)] - PRIORITY_RANK[getPriority(b)]);
  return [...active, ...tasks.filter((task) => task.done)];
}

// Filtr widoku: 'all' (wszystkie), 'active' (do zrobienia), 'done' (zrobione).
export function filterTasks(tasks, filter) {
  if (filter === 'active') {
    return tasks.filter((task) => !task.done);
  }
  if (filter === 'done') {
    return tasks.filter((task) => task.done);
  }
  return [...tasks];
}

export function countActive(tasks) {
  return tasks.filter((task) => !task.done).length;
}

export function countDone(tasks) {
  return tasks.filter((task) => task.done).length;
}
