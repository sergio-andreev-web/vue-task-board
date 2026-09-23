import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRecord, filterRecords, collectionStats } from './collection-utils.js';

const schema = [{ key: 'name', label: 'Name', type: 'string' }, { key: 'budget', label: 'Budget', type: 'number' }];

test('validates records', () => {
  assert.deepEqual(validateRecord(schema, { name: '  Project  ', budget: 10 }), { name: 'Project', budget: 10 });
  assert.throws(() => validateRecord(schema, { name: '', budget: 10 }));
  assert.throws(() => validateRecord(schema, { name: 'Project', budget: -1 }));
});

test('filters and counts records', () => {
  const records = [
    { name: 'Alpha', archived: false, createdAt: '2026-01-01' },
    { name: 'Beta', archived: true, createdAt: '2026-02-01' },
  ];
  assert.equal(filterRecords(records, { query: 'alp' }).length, 1);
  assert.equal(filterRecords(records, { archived: true }).length, 1);
  assert.deepEqual(collectionStats(records), { total: 2, active: 1, archived: 1 });
});
