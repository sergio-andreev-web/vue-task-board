<script setup>
import { ref } from 'vue';
const props = defineProps({ task: { type: Object, required: true } });
const emit = defineEmits(['update', 'remove']);
const editing = ref(false);
const editedTitle = ref('');
function beginEdit() { editedTitle.value = props.task.title; editing.value = true; }
function save() {
  if (editedTitle.value.trim()) emit('update', props.task.id, { title: editedTitle.value });
  editing.value = false;
}
</script>
<template>
  <li class="task-card">
    <div class="task-copy">
      <form v-if="editing" @submit.prevent="save"><input v-model="editedTitle" maxlength="120" aria-label="Edit title" /><button>Save</button></form>
      <template v-else><strong>{{ task.title }}</strong><small v-if="task.description">{{ task.description }}</small></template>
      <span class="badge" :class="task.priority">{{ task.priority }}</span>
    </div>
    <div class="task-actions">
      <select :value="task.status" aria-label="Task status" @change="emit('update', task.id, { status: $event.target.value })">
        <option value="todo">To do</option><option value="doing">Doing</option><option value="done">Done</option>
      </select>
      <button v-if="!editing" @click="beginEdit">Edit</button>
      <button class="danger" @click="emit('remove', task.id)">Delete</button>
    </div>
  </li>
</template>
