import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks, normalizeTask, taskStats } from './task-utils.js';

test('normalizes and validates task inputs', () => {
  const task = normalizeTask({ title: '  Hello  ', priority: 'high', id: 'a' });
  assert.equal(task.title, 'Hello');
  assert.equal(task.status, 'todo');
  assert.throws(() => normalizeTask({ title: ' ' }));
});

test('filters, sorts, and counts tasks', () => {
  const tasks = [
    { title: 'Deploy', description: '', priority: 'high', status: 'todo', createdAt: '2026-01-01' },
    { title: 'Docs', description: '', priority: 'low', status: 'done', createdAt: '2026-02-01' },
  ];
  assert.equal(filterTasks(tasks, { status: 'done' }).length, 1);
  assert.equal(filterTasks(tasks, { sort: 'priority' })[0].title, 'Deploy');
  assert.deepEqual(taskStats(tasks), { total: 2, todo: 1, doing: 0, done: 1 });
});
