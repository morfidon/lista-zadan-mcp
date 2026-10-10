import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTask, addTask, toggleTask, removeTask, countActive, countDone, moveDoneToEnd } from '../src/tasks.js';

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
