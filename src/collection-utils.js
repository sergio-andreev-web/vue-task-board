export function validateRecord(schema, record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError('Record must be an object');
  const output = {};
  for (const field of schema) {
    const value = record[field.key];
    if (field.type === 'string') {
      if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${field.label} is required`);
      output[field.key] = value.trim();
    } else if (field.type === 'number') {
      const number = Number(value);
      if (!Number.isFinite(number) || number < 0) throw new TypeError(`${field.label} must be non-negative`);
      output[field.key] = number;
    } else if (field.type === 'boolean') {
      output[field.key] = Boolean(value);
    }
  }
  return output;
}

export function filterRecords(records, { query = '', sort = 'newest', archived = false } = {}) {
  const needle = query.trim().toLowerCase();
  const visible = records.filter(record =>
    Boolean(record.archived) === archived &&
    Object.values(record).some(value => String(value).toLowerCase().includes(needle))
  );
  return [...visible].sort((a, b) => sort === 'name'
    ? String(a.name).localeCompare(String(b.name))
    : sort === 'oldest' ? a.createdAt.localeCompare(b.createdAt)
    : b.createdAt.localeCompare(a.createdAt));
}

export function collectionStats(records) {
  return {
    total: records.length,
    active: records.filter(record => !record.archived).length,
    archived: records.filter(record => record.archived).length,
  };
}

export function exportRecords(records, name) {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${name}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
