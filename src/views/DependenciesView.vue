<script setup>
import { computed, reactive, ref } from 'vue';
import { useCollection } from '../composables/useCollection.js';
import { collectionStats, exportRecords, filterRecords } from '../collection-utils.js';

const schema = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'task', label: 'Task', type: 'string' },
  { key: 'lag', label: 'Lag', type: 'number' },
  { key: 'resolved', label: 'Resolved', type: 'boolean' },
];
const { records, create, update, remove, archive, restore, clearArchived, duplicate, importJson } = useCollection('dependencies', schema);
const draft = reactive({ name: '', task: '', lag: 0, resolved: false });
const query = ref('');
const sort = ref('newest');
const showArchived = ref(false);
const error = ref('');
const stats = computed(() => collectionStats(records.value));
const visible = computed(() => filterRecords(records.value, { query: query.value, sort: sort.value, archived: showArchived.value }));

function addRecord() {
  try {
    create(draft);
    error.value = '';
    Object.assign(draft, { name: '', task: '', lag: 0, resolved: false });
  } catch (cause) { error.value = cause.message; }
}

function editName(record) {
  const name = prompt('New name', record.name);
  if (name?.trim()) update(record.id, { name: name.trim() });
}

async function loadFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try { importJson(await file.text()); error.value = ''; }
  catch (cause) { error.value = cause.message; }
  event.target.value = '';
}
</script>

<template>
  <section class="collection-view">
    <header class="collection-header">
      <div><p class="eyebrow">Workspace</p><h2>Dependencies</h2></div>
      <span class="count">{{ stats.active }} active · {{ stats.archived }} archived</span>
    </header>
    <form class="collection-form" @submit.prevent="addRecord">
      <label>Name <input type="text" v-model="draft.name" required /></label>
      <label>Task <input type="text" v-model="draft.task"  /></label>
      <label>Lag <input type="number" min="0" v-model.number="draft.lag"  /></label>
      <label>Resolved <input type="checkbox" v-model="draft.resolved"  /></label>
      <button type="submit">Create</button>
    </form>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <div class="collection-toolbar">
      <input v-model="query" placeholder="Search dependencies" aria-label="Search records" />
      <select v-model="sort" aria-label="Sort"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="name">Name</option></select>
      <label><input v-model="showArchived" type="checkbox" /> Archived</label>
      <button @click="exportRecords(records, 'dependencies')">Export</button>
      <label class="import">Import <input type="file" accept="application/json" @change="loadFile" /></label>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Task</th><th>Lag</th><th>Resolved</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="record in visible" :key="record.id">
        <td>{{ record.name }}</td>
        <td>{{ record.task }}</td>
        <td>{{ record.lag }}</td>
        <td>{{ record.resolved }}</td>
          <td class="row-actions">
            <button @click="editName(record)">Edit</button>
            <button @click="duplicate(record.id)">Copy</button>
            <button v-if="record.archived" @click="restore(record.id)">Restore</button>
            <button v-else @click="archive(record.id)">Archive</button>
            <button @click="remove(record.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table></div>
    <p v-if="!visible.length" class="empty">No matching records.</p>
    <footer><span>{{ visible.length }} shown</span><button @click="clearArchived">Clear archived</button></footer>
  </section>
</template>
