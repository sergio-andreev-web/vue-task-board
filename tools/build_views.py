from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
specs={
'Projects': [('name','string'),('owner','string'),('budget','number'),('active','boolean')],
'Teams': [('name','string'),('lead','string'),('capacity','number'),('active','boolean')],
'Boards': [('name','string'),('project','string'),('position','number'),('active','boolean')],
'Milestones': [('name','string'),('project','string'),('progress','number'),('done','boolean')],
'Sprints': [('name','string'),('project','string'),('velocity','number'),('active','boolean')],
'Releases': [('name','string'),('version','string'),('build','number'),('published','boolean')],
'Goals': [('name','string'),('team','string'),('target','number'),('done','boolean')],
'Labels': [('name','string'),('color','string'),('position','number'),('active','boolean')],
'Comments': [('name','string'),('author','string'),('reactions','number'),('pinned','boolean')],
'Attachments': [('name','string'),('url','string'),('size','number'),('active','boolean')],
'TimeEntries': [('name','string'),('user','string'),('minutes','number'),('billable','boolean')],
'Expenses': [('name','string'),('category','string'),('amount','number'),('approved','boolean')],
'Schedules': [('name','string'),('timezone','string'),('hours','number'),('active','boolean')],
'Reminders': [('name','string'),('user','string'),('delay','number'),('sent','boolean')],
'Notifications': [('name','string'),('channel','string'),('attempts','number'),('read','boolean')],
'Activities': [('name','string'),('actor','string'),('sequence','number'),('visible','boolean')],
'Webhooks': [('name','string'),('url','string'),('retries','number'),('active','boolean')],
'Integrations': [('name','string'),('provider','string'),('syncs','number'),('active','boolean')],
'Templates': [('name','string'),('description','string'),('uses','number'),('active','boolean')],
'Workflows': [('name','string'),('trigger','string'),('runs','number'),('enabled','boolean')],
'Dashboards': [('name','string'),('layout','string'),('widgets','number'),('public','boolean')],
'Widgets': [('name','string'),('kind','string'),('position','number'),('visible','boolean')],
'Folders': [('name','string'),('parent','string'),('position','number'),('public','boolean')],
'Links': [('name','string'),('url','string'),('clicks','number'),('active','boolean')],
'Contacts': [('name','string'),('email','string'),('touches','number'),('active','boolean')],
'Dependencies': [('name','string'),('task','string'),('lag','number'),('resolved','boolean')],
'SavedViews': [('name','string'),('query','string'),('uses','number'),('public','boolean')],
'Workspaces': [('name','string'),('owner','string'),('seats','number'),('active','boolean')],
'Invitations': [('name','string'),('email','string'),('attempts','number'),('accepted','boolean')],
'AuditLogs': [('name','string'),('action','string'),('sequence','number'),('visible','boolean')],
}
for title,fields in specs.items():
    key=title[0].lower()+title[1:]
    schema=',\n'.join(f"  {{ key: '{field}', label: '{field.replace('_',' ').title()}', type: '{kind}' }}" for field,kind in fields)
    defaults=', '.join(f"{field}: "+("false" if kind=='boolean' else "0" if kind=='number' else "''") for field,kind in fields)
    inputs='\n'.join(f'''      <label>{field.replace('_',' ').title()} <input {'type="checkbox"' if kind=='boolean' else 'type="number" min="0"' if kind=='number' else 'type="text"'} v-model{'.number' if kind=='number' else ''}="draft.{field}" {'required' if field=='name' else ''} /></label>''' for field,kind in fields)
    cells='\n'.join(f'        <td>{{{{ record.{field} }}}}</td>' for field,kind in fields)
    headers=''.join(f"<th>{field.replace('_',' ').title()}</th>" for field,kind in fields)
    content=f'''<script setup>
import {{ computed, reactive, ref }} from 'vue';
import {{ useCollection }} from '../composables/useCollection.js';
import {{ collectionStats, exportRecords, filterRecords }} from '../collection-utils.js';

const schema = [
{schema},
];
const {{ records, create, update, remove, archive, restore, clearArchived, duplicate, importJson }} = useCollection('{key}', schema);
const draft = reactive({{ {defaults} }});
const query = ref('');
const sort = ref('newest');
const showArchived = ref(false);
const error = ref('');
const stats = computed(() => collectionStats(records.value));
const visible = computed(() => filterRecords(records.value, {{ query: query.value, sort: sort.value, archived: showArchived.value }}));

function addRecord() {{
  try {{
    create(draft);
    error.value = '';
    Object.assign(draft, {{ {defaults} }});
  }} catch (cause) {{ error.value = cause.message; }}
}}

function editName(record) {{
  const name = prompt('New name', record.name);
  if (name?.trim()) update(record.id, {{ name: name.trim() }});
}}

async function loadFile(event) {{
  const file = event.target.files?.[0];
  if (!file) return;
  try {{ importJson(await file.text()); error.value = ''; }}
  catch (cause) {{ error.value = cause.message; }}
  event.target.value = '';
}}
</script>

<template>
  <section class="collection-view">
    <header class="collection-header">
      <div><p class="eyebrow">Workspace</p><h2>{title}</h2></div>
      <span class="count">{{{{ stats.active }}}} active · {{{{ stats.archived }}}} archived</span>
    </header>
    <form class="collection-form" @submit.prevent="addRecord">
{inputs}
      <button type="submit">Create</button>
    </form>
    <p v-if="error" class="error" role="alert">{{{{ error }}}}</p>
    <div class="collection-toolbar">
      <input v-model="query" placeholder="Search {title.lower()}" aria-label="Search records" />
      <select v-model="sort" aria-label="Sort"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="name">Name</option></select>
      <label><input v-model="showArchived" type="checkbox" /> Archived</label>
      <button @click="exportRecords(records, '{key}')">Export</button>
      <label class="import">Import <input type="file" accept="application/json" @change="loadFile" /></label>
    </div>
    <div class="table-wrap"><table>
      <thead><tr>{headers}<th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="record in visible" :key="record.id">
{cells}
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
    <footer><span>{{{{ visible.length }}}} shown</span><button @click="clearArchived">Clear archived</button></footer>
  </section>
</template>
'''
    (root/'src/views'/f'{title}View.vue').write_text(content)
imports='\n'.join(f"import {title}View from './{title}View.vue';" for title in specs)
entries=',\n'.join(f"  {title[0].lower()+title[1:]}: {{ label: '{title}', component: {title}View }}" for title in specs)
(root/'src/views/index.js').write_text(imports+'\n\nexport const views = {\n'+entries+'\n};\n')
print('Generated',len(specs),'views')
