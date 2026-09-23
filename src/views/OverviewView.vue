<script setup>
import { computed, onMounted, ref } from 'vue';
import { views } from './index.js';

const collections = ref([]);
const search = ref('');
const sort = ref('count');

function refresh() {
  collections.value = Object.keys(views)
    .filter(name => name !== 'overview')
    .map(name => {
      let records = [];
      try { records = JSON.parse(localStorage.getItem(`workspace:${name}:v1`) || '[]'); }
      catch { records = []; }
      return {
        name,
        label: views[name].label,
        count: records.length,
        active: records.filter(item => !item.archived).length,
        archived: records.filter(item => item.archived).length,
        recent: records.reduce((latest, item) => item.updatedAt > latest ? item.updatedAt : latest, ''),
      };
    });
}
onMounted(refresh);
const total = computed(() => collections.value.reduce((sum, item) => sum + item.count, 0));
const active = computed(() => collections.value.reduce((sum, item) => sum + item.active, 0));
const populated = computed(() => collections.value.filter(item => item.count > 0).length);
const visible = computed(() => {
  const needle = search.value.toLowerCase().trim();
  const items = collections.value.filter(item => item.label.toLowerCase().includes(needle));
  return [...items].sort((a, b) => sort.value === 'name'
    ? a.label.localeCompare(b.label)
    : b.count - a.count || a.label.localeCompare(b.label));
});
</script>
<template>
  <section class="overview">
    <header><div><p class="eyebrow">Workspace</p><h2>Overview</h2></div><button @click="refresh">Refresh</button></header>
    <div class="overview-stats">
      <article><strong>{{ total }}</strong><span>Total records</span></article>
      <article><strong>{{ active }}</strong><span>Active records</span></article>
      <article><strong>{{ populated }}</strong><span>Populated sections</span></article>
      <article><strong>{{ collections.length }}</strong><span>Sections</span></article>
    </div>
    <div class="overview-controls">
      <input v-model="search" placeholder="Find a section" aria-label="Find a section" />
      <select v-model="sort" aria-label="Sort sections"><option value="count">Most records</option><option value="name">Name</option></select>
    </div>
    <div class="overview-grid">
      <article v-for="section in visible" :key="section.name">
        <h3>{{ section.label }}</h3>
        <p><strong>{{ section.count }}</strong> records</p>
        <p>{{ section.active }} active · {{ section.archived }} archived</p>
        <small v-if="section.recent">Last updated {{ new Date(section.recent).toLocaleDateString() }}</small>
        <small v-else>No updates yet</small>
      </article>
    </div>
    <p v-if="!visible.length" class="empty">No matching sections.</p>
  </section>
</template>
