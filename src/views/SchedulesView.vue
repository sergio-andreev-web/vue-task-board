<script setup>
import { computed, reactive, ref } from 'vue';
import { useCollection } from '../composables/useCollection.js';
import { collectionStats, exportRecords, filterRecords } from '../collection-utils.js';

const schema = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'timezone', label: 'Timezone', type: 'string' },
  { key: 'hours', label: 'Hours', type: 'number' },
  { key: 'active', label: 'Active', type: 'boolean' },
];
const { records, create, update, remove, archive, restore, clearArchived, duplicate, importJson } = useCollection('schedules', schema);
const draft = reactive({ name: '', timezone: '', hours: 0, active: false });
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
    Object.assign(draft, { name: '', timezone: '', hours: 0, active: false });
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
      <div><p class="eyebrow">Workspace</p><h2>Schedules</h2></div>
      <span class="count">{{ stats.active }} active · {{ stats.archived }} archived</span>
    </header>
    <form class="collection-form" @submit.prevent="addRecord">
      <label>Name <input type="text" v-model="draft.name" required /></label>
      <label>Timezone <input type="text" v-model="draft.timezone"  /></label>
      <label>Hours <input type="number" min="0" v-model.number="draft.hours"  /></label>
      <label>Active <input type="checkbox" v-model="draft.active"  /></label>
      <button type="submit">Create</button>
    </form>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <div class="collection-toolbar">
      <input v-model="query" placeholder="Search schedules" aria-label="Search records" />
      <select v-model="sort" aria-label="Sort"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="name">Name</option></select>
      <label><input v-model="showArchived" type="checkbox" /> Archived</label>
      <button @click="exportRecords(records, 'schedules')">Export</button>
      <label class="import">Import <input type="file" accept="application/json" @change="loadFile" /></label>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Timezone</th><th>Hours</th><th>Active</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="record in visible" :key="record.id">
        <td>{{ record.name }}</td>
        <td>{{ record.timezone }}</td>
        <td>{{ record.hours }}</td>
        <td>{{ record.active }}</td>
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
