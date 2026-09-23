export const PRIORITIES = ['low', 'normal', 'high'];
export const STATUSES = ['todo', 'doing', 'done'];

export function normalizeTask(input) {
  const title = String(input.title ?? '').trim();
  if (!title || title.length > 120) throw new Error('Task title must be 1–120 characters');
  return {
    id: input.id ?? crypto.randomUUID(),
    title,
    description: String(input.description ?? '').trim(),
    priority: PRIORITIES.includes(input.priority) ? input.priority : 'normal',
    status: STATUSES.includes(input.status) ? input.status : 'todo',
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function filterTasks(tasks, { query = '', priority = 'all', status = 'all', sort = 'newest' } = {}) {
  const needle = query.trim().toLowerCase();
  const filtered = tasks.filter(task =>
    (priority === 'all' || task.priority === priority) &&
    (status === 'all' || task.status === status) &&
    (!needle || `${task.title} ${task.description}`.toLowerCase().includes(needle))
  );
  const weight = { high: 0, normal: 1, low: 2 };
  return [...filtered].sort((a, b) => sort === 'priority'
    ? weight[a.priority] - weight[b.priority] || a.title.localeCompare(b.title)
    : sort === 'oldest' ? a.createdAt.localeCompare(b.createdAt)
    : b.createdAt.localeCompare(a.createdAt));
}

export function taskStats(tasks) {
  return {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    doing: tasks.filter(task => task.status === 'doing').length,
    done: tasks.filter(task => task.status === 'done').length,
  };
}
