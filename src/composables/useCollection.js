import { ref, watch } from 'vue';
import { validateRecord } from '../collection-utils.js';

export function useCollection(name, schema) {
  const key = `workspace:${name}:v1`;
  let stored = [];
  try { stored = JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { stored = []; }
  const records = ref(Array.isArray(stored) ? stored : []);
  watch(records, value => localStorage.setItem(key, JSON.stringify(value)), { deep: true });

  function create(input) {
    const values = validateRecord(schema, input);
    const now = new Date().toISOString();
    const record = { id: crypto.randomUUID(), ...values, archived: false, createdAt: now, updatedAt: now };
    records.value.push(record);
    return record;
  }

  function update(id, changes) {
    const record = records.value.find(item => item.id === id);
    if (!record) return false;
    Object.assign(record, changes, { updatedAt: new Date().toISOString() });
    return true;
  }

  function remove(id) {
    records.value = records.value.filter(item => item.id !== id);
  }

  function archive(id) { return update(id, { archived: true }); }
  function restore(id) { return update(id, { archived: false }); }
  function clearArchived() { records.value = records.value.filter(item => !item.archived); }

  function duplicate(id) {
    const original = records.value.find(item => item.id === id);
    if (!original) return null;
    const values = Object.fromEntries(schema.map(field => [field.key, original[field.key]]));
    values.name = `${values.name} (copy)`;
    return create(values);
  }

  function importJson(text) {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed) || parsed.length > 1000) throw new TypeError('Expected up to 1000 records');
    records.value = parsed.map(item => ({ ...item, ...validateRecord(schema, item) }));
  }

  return { records, create, update, remove, archive, restore, clearArchived, duplicate, importJson };
}
