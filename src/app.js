// Interfejs: łączy logikę zadań (tasks.js) z HTML-em i zapisem (storage.js).

import {
  addTask,
  toggleTask,
  removeTask,
  removeDone,
  moveDoneToEnd,
  countActive,
  countDone,
  filterTasks,
  searchTasks,
  sortByPriority,
  todayString,
  isOverdue,
  formatDue,
  getPriority,
  PRIORITY_LABELS,
} from './tasks.js';
import { loadTasks, saveTasks } from './storage.js';

const form = document.querySelector('#new-task');
const input = document.querySelector('#task-title');
const dueInput = document.querySelector('#task-due');
const priorityInput = document.querySelector('#task-priority');
const list = document.querySelector('#tasks');
const counter = document.querySelector('#counter');
const empty = document.querySelector('#empty');
const searchInput = document.querySelector('#search');
const clearDone = document.querySelector('#clear-done');

const themeToggle = document.querySelector('#theme-toggle');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeToggle.textContent = dark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', dark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny');
  try {
    localStorage.setItem('motyw', theme);
  } catch {
    // Bez zapisu motyw działa tylko do odświeżenia strony.
  }
}

themeToggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

const filterButtons = document.querySelectorAll('#filters button');
const emptyMessages = {
  all: 'Brak zadań. Dodaj pierwsze!',
  active: 'Nic do zrobienia. Odpocznij!',
  done: 'Żadne zadanie nie jest jeszcze zrobione.',
};

const recovery = document.querySelector('#recovery');

function setRecoveryVisible(visible) {
  recovery.hidden = !visible;
}

document.querySelector('#recovery-close').addEventListener('click', () => setRecoveryVisible(false));

const loaded = loadTasks();
setRecoveryVisible(loaded.corrupted);
let tasks = loaded.tasks;
let filter = 'all';

searchInput.addEventListener('input', () => render());

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    render();
  });
}

function update(next) {
  tasks = next;
  saveTasks(tasks);
  render();
}

clearDone.addEventListener('click', () => update(removeDone(tasks)));

function createTaskItem(task, today) {
  const item = document.createElement('li');
  item.className = task.done ? 'task done' : 'task';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', `Zrobione: ${task.title}`);
  checkbox.addEventListener('change', () => update(moveDoneToEnd(toggleTask(tasks, task.id))));

  const title = document.createElement('span');
  title.className = 'title';
  title.textContent = task.title;

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'remove';
  remove.textContent = '×';
  remove.setAttribute('aria-label', `Usuń: ${task.title}`);
  remove.addEventListener('click', () => update(removeTask(tasks, task.id)));

  const priority = getPriority(task);
  const badge = document.createElement('span');
  badge.className = `priority priority-${priority}`;
  badge.textContent = PRIORITY_LABELS[priority];
  badge.title = `Priorytet: ${PRIORITY_LABELS[priority]}`;

  item.append(checkbox, title, badge);
  if (typeof task.dueDate === 'string') {
    const due = document.createElement('span');
    due.className = isOverdue(task, today) ? 'due overdue' : 'due';
    due.textContent = formatDue(task.dueDate, today);
    item.append(due);
  }
  item.append(remove);
  return item;
}

function render() {
  list.replaceChildren();
  const today = todayString();
  const query = searchInput.value.trim();
  const visible = searchTasks(filterTasks(sortByPriority(tasks), filter), query);
  for (const task of visible) {
    list.append(createTaskItem(task, today));
  }

  const active = countActive(tasks);
  counter.textContent = `Do zrobienia: ${active}`;
  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  }
  if (tasks.length === 0) {
    empty.textContent = emptyMessages.all;
  } else if (query && filterTasks(tasks, filter).length > 0) {
    empty.textContent = `Brak zadań pasujących do „${query}”.`;
  } else {
    empty.textContent = emptyMessages[filter];
  }
  empty.hidden = visible.length > 0;
  const done = countDone(tasks);
  clearDone.hidden = done === 0;
  clearDone.textContent = `Usuń zrobione (${done})`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!input.value.trim()) {
    input.focus();
    return;
  }
  update(addTask(tasks, input.value, undefined, dueInput.value, priorityInput.value));
  input.value = '';
  dueInput.value = '';
  priorityInput.value = 'normal';
  input.focus();
});

render();
