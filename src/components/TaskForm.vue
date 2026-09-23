<script setup>
import { ref } from 'vue';
const emit = defineEmits(['create']);
const title = ref('');
const description = ref('');
const priority = ref('normal');
function submit() {
  if (!title.value.trim()) return;
  emit('create', { title: title.value, description: description.value, priority: priority.value });
  title.value = '';
  description.value = '';
  priority.value = 'normal';
}
</script>
<template>
  <form class="task-form" @submit.prevent="submit">
    <label>Title <input v-model="title" maxlength="120" required placeholder="What needs doing?" /></label>
    <label>Notes <input v-model="description" placeholder="Optional details" /></label>
    <label>Priority <select v-model="priority"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></label>
    <button type="submit">Add task</button>
  </form>
</template>
