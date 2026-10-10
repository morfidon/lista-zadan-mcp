// Interfejs: łączy logikę zadań (tasks.js) z HTML-em i zapisem (storage.js).

import { addTask, toggleTask, removeTask, moveDoneToEnd, countActive } from './tasks.js';
import { loadTasks, saveTasks } from './storage.js';

const form = document.querySelector('#new-task');
const input = document.querySelector('#task-title');
const list = document.querySelector('#tasks');
const counter = document.querySelector('#counter');
const empty = document.querySelector('#empty');

let tasks = loadTasks();

function update(next) {
  tasks = next;
  saveTasks(tasks);
  render();
}

function render() {
  list.replaceChildren();
  for (const task of tasks) {
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

    item.append(checkbox, title, remove);
    list.append(item);
  }

  const active = countActive(tasks);
  counter.textContent = `Do zrobienia: ${active}`;
  empty.hidden = tasks.length > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!input.value.trim()) {
    input.focus();
    return;
  }
  update(addTask(tasks, input.value));
  input.value = '';
  input.focus();
});

render();
