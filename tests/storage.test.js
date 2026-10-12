import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadTasks, saveTasks, SAMPLE_TASKS, KEY, BACKUP_KEY } from '../src/storage.js';

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    data,
  };
}

test('loadTasks: brak zapisu daje przykładowe zadania i nie uznaje tego za uszkodzenie', () => {
  const result = loadTasks(fakeStorage());
  assert.deepEqual(result, { tasks: SAMPLE_TASKS, corrupted: false });
});

test('loadTasks: poprawny zapis jest wczytany bez zmian', () => {
  const saved = [{ id: 7, title: 'Moje', done: false }];
  const storage = fakeStorage({ [KEY]: JSON.stringify(saved) });
  assert.deepEqual(loadTasks(storage), { tasks: saved, corrupted: false });
});

test('loadTasks: pusta lista zapisana przez użytkownika nie wraca do przykładów', () => {
  const storage = fakeStorage({ [KEY]: '[]' });
  assert.deepEqual(loadTasks(storage), { tasks: [], corrupted: false });
});

test('loadTasks: uszkodzony JSON jest zachowany pod osobnym kluczem', () => {
  const broken = '[{"id":1,"title":"Moje"';
  const storage = fakeStorage({ [KEY]: broken });
  const result = loadTasks(storage);
  assert.equal(result.corrupted, true);
  assert.deepEqual(result.tasks, SAMPLE_TASKS);
  assert.equal(storage.getItem(BACKUP_KEY), broken);
});

test('loadTasks: zapis, który nie jest tablicą, też jest zachowany', () => {
  const wrong = '{"tasks":[]}';
  const storage = fakeStorage({ [KEY]: wrong });
  const result = loadTasks(storage);
  assert.equal(result.corrupted, true);
  assert.equal(storage.getItem(BACKUP_KEY), wrong);
});

test('loadTasks: kolejne uszkodzenie nie kasuje wcześniejszej kopii', () => {
  const storage = fakeStorage({ [KEY]: '{zly', [BACKUP_KEY]: 'starsza kopia' });
  loadTasks(storage);
  assert.equal(storage.getItem(BACKUP_KEY), 'starsza kopia');
});

test('saveTasks: zapisuje zadania jako JSON pod głównym kluczem', () => {
  const storage = fakeStorage();
  const tasks = [{ id: 1, title: 'A', done: true }];
  saveTasks(tasks, storage);
  assert.deepEqual(JSON.parse(storage.getItem(KEY)), tasks);
});
