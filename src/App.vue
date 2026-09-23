<script setup>
import { computed, ref } from 'vue';
import TaskForm from './components/TaskForm.vue';
import TaskCard from './components/TaskCard.vue';
import { useTasks } from './composables/useTasks.js';
import { filterTasks, taskStats } from './task-utils.js';

const { tasks, add, update, remove, clearDone, exportJson, importJson } = useTasks();
const query = ref('');
const priority = ref('all');
const status = ref('all');
const sort = ref('newest');
const message = ref('');
const visible = computed(() => filterTasks(tasks.value, { query: query.value, priority: priority.value, status: status.value, sort: sort.value }));
const stats = computed(() => taskStats(tasks.value));

function download() {
  const blob = new Blob([exportJson()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'tasks.json'; link.click();
  URL.revokeObjectURL(url);
}
async function upload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try { importJson(await file.text()); message.value = `Imported ${tasks.value.length} tasks`; }
  catch (error) { message.value = error.message; }
  event.target.value = '';
}
</script>
<template>
  <main>
    <header><div><p class="eyebrow">Local workspace</p><h1>Task Board</h1></div><span class="count">{{ stats.total }} tasks</span></header>
    <section class="stats" aria-label="Task summary"><span>{{ stats.todo }} to do</span><span>{{ stats.doing }} doing</span><span>{{ stats.done }} done</span></section>
    <TaskForm @create="add" />
    <section class="toolbar" aria-label="Filters">
      <input v-model="query" placeholder="Search tasks" aria-label="Search tasks" />
      <select v-model="status" aria-label="Filter status"><option value="all">All status</option><option value="todo">To do</option><option value="doing">Doing</option><option value="done">Done</option></select>
      <select v-model="priority" aria-label="Filter priority"><option value="all">All priority</option><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select>
      <select v-model="sort" aria-label="Sort tasks"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="priority">Priority</option></select>
    </section>
    <ul class="task-list"><TaskCard v-for="task in visible" :key="task.id" :task="task" @update="update" @remove="remove" /></ul>
    <p v-if="!visible.length" class="empty">No matching tasks.</p>
    <footer><button @click="download">Export JSON</button><label class="import">Import JSON<input type="file" accept="application/json" @change="upload" /></label><button @click="clearDone">Clear done</button></footer>
    <p v-if="message" role="status">{{ message }}</p>
  </main>
</template>
