// Interfejs: łączy logikę zadań (tasks.js) z HTML-em i zapisem (storage.js).

import {
  addTask,
  toggleTask,
  removeTask,
  moveDoneToEnd,
  countActive,
  filterTasks,
  todayString,
  isOverdue,
  formatDue,
} from './tasks.js';
import { loadTasks, saveTasks } from './storage.js';

const form = document.querySelector('#new-task');
const input = document.querySelector('#task-title');
const dueInput = document.querySelector('#task-due');
const list = document.querySelector('#tasks');
const counter = document.querySelector('#counter');
const empty = document.querySelector('#empty');

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

let tasks = loadTasks();
let filter = 'all';

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

function render() {
  list.replaceChildren();
  const today = todayString();
  const visible = filterTasks(tasks, filter);
  for (const task of visible) {
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

    item.append(checkbox, title);
    if (typeof task.dueDate === 'string') {
      const due = document.createElement('span');
      due.className = isOverdue(task, today) ? 'due overdue' : 'due';
      due.textContent = formatDue(task.dueDate, today);
      item.append(due);
    }
    item.append(remove);
    list.append(item);
  }

  const active = countActive(tasks);
  counter.textContent = `Do zrobienia: ${active}`;
  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  }
  empty.textContent = emptyMessages[tasks.length === 0 ? 'all' : filter];
  empty.hidden = visible.length > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!input.value.trim()) {
    input.focus();
    return;
  }
  update(addTask(tasks, input.value, undefined, dueInput.value));
  input.value = '';
  dueInput.value = '';
  input.focus();
});

render();
