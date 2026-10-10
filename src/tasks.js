// Logika listy zadań: czyste funkcje, bez DOM i bez zapisu.
// Każda funkcja zwraca NOWĄ tablicę, nie zmienia tej, którą dostała.

export function createTask(title, id = Date.now()) {
  const clean = String(title ?? '').trim();
  if (!clean) {
    throw new Error('Zadanie musi mieć treść.');
  }
  return { id, title: clean, done: false };
}

export function addTask(tasks, title, id) {
  return [...tasks, createTask(title, id)];
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function countActive(tasks) {
  return tasks.filter((task) => !task.done).length;
}

export function countDone(tasks) {
  return tasks.filter((task) => task.done).length;
}
