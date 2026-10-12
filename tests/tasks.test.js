import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTask,
  addTask,
  toggleTask,
  removeTask,
  countActive,
  countDone,
  moveDoneToEnd,
  todayString,
  isOverdue,
  formatDue,
  filterTasks,
} from '../src/tasks.js';

test('createTask usuwa spacje z początku i końca', () => {
  assert.deepEqual(createTask('  Kupić mleko  ', 1), { id: 1, title: 'Kupić mleko', done: false });
});

test('createTask nie przyjmuje pustej treści', () => {
  assert.throws(() => createTask('   '), /treść/);
});

test('addTask dodaje zadanie na koniec i nie zmienia starej listy', () => {
  const before = [{ id: 1, title: 'A', done: false }];
  const after = addTask(before, 'B', 2);
  assert.equal(after.length, 2);
  assert.equal(after[1].title, 'B');
  assert.equal(before.length, 1);
});

test('addTask wstawia nowe zadanie przed zrobionymi, zrobione zostają na końcu', () => {
  const before = [
    { id: 1, title: 'A', done: false },
    { id: 2, title: 'B', done: true },
    { id: 3, title: 'C', done: true },
  ];
  const after = addTask(before, 'D', 4);
  assert.deepEqual(after.map((task) => task.id), [1, 4, 2, 3]);
  assert.deepEqual(before.map((task) => task.id), [1, 2, 3]);
});

test('toggleTask odhacza i przywraca zadanie', () => {
  const tasks = [{ id: 1, title: 'A', done: false }];
  const once = toggleTask(tasks, 1);
  assert.equal(once[0].done, true);
  assert.equal(toggleTask(once, 1)[0].done, false);
});

test('removeTask usuwa zadanie o danym id', () => {
  const tasks = [
    { id: 1, title: 'A', done: false },
    { id: 2, title: 'B', done: false },
  ];
  assert.deepEqual(removeTask(tasks, 1).map((task) => task.id), [2]);
});

test('moveDoneToEnd przenosi zrobione na koniec, zachowuje kolejność i nie zmienia starej listy', () => {
  const before = [
    { id: 1, title: 'A', done: true },
    { id: 2, title: 'B', done: false },
    { id: 3, title: 'C', done: true },
    { id: 4, title: 'D', done: false },
  ];
  const after = moveDoneToEnd(before);
  assert.deepEqual(after.map((task) => task.id), [2, 4, 1, 3]);
  assert.deepEqual(before.map((task) => task.id), [1, 2, 3, 4]);
  assert.deepEqual(moveDoneToEnd([]), []);
});

test('countActive liczy tylko niezrobione zadania', () => {
  const tasks = [
    { id: 1, title: 'A', done: false },
    { id: 2, title: 'B', done: true },
    { id: 3, title: 'C', done: false },
  ];
  assert.equal(countActive(tasks), 2);
});

test('countDone liczy tylko zrobione zadania', () => {
  const tasks = [
    { id: 1, title: 'A', done: false },
    { id: 2, title: 'B', done: true },
    { id: 3, title: 'C', done: true },
  ];
  assert.equal(countDone(tasks), 2);
  assert.equal(countDone([]), 0);
});

test('createTask zapisuje termin, gdy jest podany', () => {
  assert.deepEqual(createTask('A', 1, '2026-03-09'), { id: 1, title: 'A', done: false, dueDate: '2026-03-09' });
});

test('createTask bez terminu albo z pustym nie dodaje pola dueDate', () => {
  assert.equal('dueDate' in createTask('A', 1), false);
  assert.equal('dueDate' in createTask('A', 1, ''), false);
  assert.equal('dueDate' in createTask('A', 1, null), false);
});

test('createTask odrzuca zły format i nieistniejącą datę terminu', () => {
  assert.throws(() => createTask('A', 1, '9.03.2026'), /Termin/);
  assert.throws(() => createTask('A', 1, '2026-02-31'), /Termin/);
  assert.throws(() => createTask('A', 1, 20260309), /Termin/);
});

test('addTask przekazuje termin i nie zmienia starej listy', () => {
  const before = [{ id: 1, title: 'A', done: false }];
  const after = addTask(before, 'B', 2, '2026-03-09');
  assert.equal(after[1].dueDate, '2026-03-09');
  assert.equal(before.length, 1);
});

test('todayString zwraca lokalną datę RRRR-MM-DD', () => {
  assert.equal(todayString(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(todayString(new Date(2026, 11, 31, 0, 0)), '2026-12-31');
});

test('isOverdue: po terminie dopiero od następnego dnia', () => {
  const task = { id: 1, title: 'A', done: false, dueDate: '2026-03-09' };
  assert.equal(isOverdue(task, '2026-03-10'), true);
  assert.equal(isOverdue(task, '2026-03-09'), false);
  assert.equal(isOverdue(task, '2026-03-08'), false);
});

test('isOverdue: brak terminu, zła wartość albo zrobione to nie po terminie', () => {
  assert.equal(isOverdue({ id: 1, title: 'A', done: false }, '2026-03-10'), false);
  assert.equal(isOverdue({ id: 1, title: 'A', done: false, dueDate: 5 }, '2026-03-10'), false);
  assert.equal(isOverdue({ id: 1, title: 'A', done: true, dueDate: '2026-03-01' }, '2026-03-10'), false);
});

test('formatDue pokazuje „dziś” dla dzisiejszego terminu, a datę dla pozostałych', () => {
  assert.equal(formatDue('2026-03-09', '2026-03-09'), 'Termin: dziś');
  assert.equal(formatDue('2026-03-10', '2026-03-09'), 'Termin: 2026-03-10');
  assert.equal(formatDue('2026-03-08', '2026-03-09'), 'Termin: 2026-03-08');
});

test('filterTasks zwraca wszystkie, tylko do zrobienia albo tylko zrobione i nie zmienia listy', () => {
  const tasks = [
    { id: 1, title: 'A', done: false },
    { id: 2, title: 'B', done: true },
    { id: 3, title: 'C', done: false },
  ];
  assert.deepEqual(filterTasks(tasks, 'all').map((t) => t.id), [1, 2, 3]);
  assert.deepEqual(filterTasks(tasks, 'active').map((t) => t.id), [1, 3]);
  assert.deepEqual(filterTasks(tasks, 'done').map((t) => t.id), [2]);
  assert.deepEqual(filterTasks(tasks, 'nieznany').map((t) => t.id), [1, 2, 3]);
  assert.equal(tasks.length, 3);
});
