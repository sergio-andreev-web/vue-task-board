<script setup>
import { ref, watch } from 'vue';
import sampleTasks from './sample-tasks.json';
const tasks = ref(JSON.parse(localStorage.getItem('tasks') || JSON.stringify(sampleTasks.slice(0, 6).map((task, index) => ({ id: String(index), title: task.title, done: false })))));
const title = ref('');
watch(tasks, value => localStorage.setItem('tasks', JSON.stringify(value)), { deep: true });
function addTask() {
  if (!title.value.trim()) return;
  tasks.value.push({ id: crypto.randomUUID(), title: title.value.trim(), done: false });
  title.value = '';
}
function removeTask(id) { tasks.value = tasks.value.filter(task => task.id !== id); }
</script>
<template>
  <main>
    <h1>Task Board</h1>
    <form @submit.prevent="addTask"><input v-model="title" placeholder="New task" aria-label="New task" /><button>Add</button></form>
    <ul><li v-for="task in tasks" :key="task.id"><label><input v-model="task.done" type="checkbox" /><span :class="{ done: task.done }">{{ task.title }}</span></label><button @click="removeTask(task.id)">Delete</button></li></ul>
    <p v-if="!tasks.length">No tasks yet.</p>
  </main>
</template>
