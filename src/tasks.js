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

// Termin jest opcjonalny: bez niego zadanie nie ma pola dueDate (RRRR-MM-DD).
export function createTask(title, id = Date.now(), dueDate) {
  const clean = String(title ?? '').trim();
  if (!clean) {
    throw new Error('Zadanie musi mieć treść.');
  }
  const task = { id, title: clean, done: false };
  if (dueDate === undefined || dueDate === null || dueDate === '') {
    return task;
  }
  if (typeof dueDate !== 'string' || !isValidDate(dueDate)) {
    throw new Error('Termin musi mieć format RRRR-MM-DD.');
  }
  return { ...task, dueDate };
}

export function addTask(tasks, title, id, dueDate) {
  return moveDoneToEnd([...tasks, createTask(title, id, dueDate)]);
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

export function countActive(tasks) {
  return tasks.filter((task) => !task.done).length;
}

export function countDone(tasks) {
  return tasks.filter((task) => task.done).length;
}
