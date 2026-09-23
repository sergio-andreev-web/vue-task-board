import { ref, watch } from 'vue';
import sampleTasks from '../sample-tasks.json';
import { normalizeTask } from '../task-utils.js';

const STORAGE_KEY = 'vue-task-board:v2';

function initialTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).map(normalizeTask);
  } catch { /* Ignore invalid old local data. */ }
  return sampleTasks.slice(0, 6).map(normalizeTask);
}

export function useTasks() {
  const tasks = ref(initialTasks());
  watch(tasks, value => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true });

  function add(input) {
    const task = normalizeTask(input);
    tasks.value.push(task);
    return task;
  }

  function update(id, changes) {
    const index = tasks.value.findIndex(task => task.id === id);
    if (index === -1) return false;
    tasks.value[index] = normalizeTask({ ...tasks.value[index], ...changes, id });
    return true;
  }

  function remove(id) {
    tasks.value = tasks.value.filter(task => task.id !== id);
  }

  function clearDone() {
    tasks.value = tasks.value.filter(task => task.status !== 'done');
  }

  function exportJson() {
    return JSON.stringify(tasks.value, null, 2);
  }

  function importJson(text) {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('Expected a JSON array');
    if (parsed.length > 500) throw new Error('Maximum 500 tasks');
    tasks.value = parsed.map(normalizeTask);
  }

  return { tasks, add, update, remove, clearDone, exportJson, importJson };
}
