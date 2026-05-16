<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Dimensions analytiques" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-5 flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        <button v-for="tab in tabs" :key="tab.key" type="button" :class="tabClass(tab.key)" @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
        <form class="rounded-lg border border-gray-200 p-4" @submit.prevent="submit">
          <h2 class="mb-4 text-base font-semibold text-gray-800">
            {{ editId ? 'Modifier' : 'Ajouter' }} {{ currentTitle }}
          </h2>

          <div class="space-y-4">
            <div v-if="['modules', 'sessions'].includes(activeTab)">
              <label class="mb-1 block text-sm font-medium text-gray-700">Formation</label>
              <select v-model="form.formation_id" class="form-field">
                <option value="">Selectionner une formation</option>
                <option v-for="formation in formations" :key="formation._id" :value="formation._id">
                  {{ formation.nom }}
                </option>
              </select>
            </div>

            <div v-if="activeTab === 'chapters'">
              <label class="mb-1 block text-sm font-medium text-gray-700">Module</label>
              <select v-model="form.module_id" class="form-field">
                <option value="">Selectionner un module</option>
                <option v-for="module in modules" :key="module._id" :value="module._id">
                  {{ module.nom }} <span v-if="module.formation_id">- {{ module.formation_id.nom }}</span>
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">{{ nameLabel }}</label>
              <input v-model="form.nom" type="text" class="form-field" :placeholder="namePlaceholder" />
            </div>

            <div v-if="activeTab === 'formations'">
              <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="form.description" rows="4" class="form-field" placeholder="Description courte"></textarea>
            </div>

            <div v-if="activeTab === 'trainers'">
              <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input v-model="form.email" type="email" class="form-field" placeholder="email@exemple.com" />
            </div>

            <div v-if="activeTab === 'sessions'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Date debut</label>
                <input v-model="form.date_debut" type="date" class="form-field" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Date fin</label>
                <input v-model="form.date_fin" type="date" class="form-field" />
              </div>
            </div>
          </div>

          <div class="mt-5 flex gap-2">
            <button type="submit" class="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
              {{ editId ? 'Modifier' : 'Ajouter' }}
            </button>
            <button v-if="editId" type="button" class="rounded border px-4 py-2 text-sm" @click="resetForm">
              Annuler
            </button>
          </div>
        </form>

        <div class="overflow-hidden rounded-lg border border-gray-200">
          <div class="border-b border-gray-100 bg-gray-50 px-4 py-3">
            <h2 class="text-sm font-semibold text-gray-700">{{ listTitle }}</h2>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-if="currentItems.length === 0" class="p-6 text-sm text-gray-500">
              Aucun element pour le moment.
            </div>
            <div v-for="item in currentItems" :key="item._id" class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div class="font-medium text-gray-800">{{ displayName(item) }}</div>
                <div class="mt-1 text-sm text-gray-500">{{ displayMeta(item) }}</div>
              </div>
              <div class="flex gap-2">
                <button class="rounded border px-3 py-1.5 text-sm" @click="editItem(item)">Modifier</button>
                <button class="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600" @click="removeItem(item)">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { analyticsDimensionStore } from '@/stores/analyticsDimension/analyticsDimensionStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref, watch } from 'vue'

const store = analyticsDimensionStore()
const { formations, modules, chapters, trainers, sessions } = storeToRefs(store)

const tabs = [
  { key: 'formations', label: 'Formations' },
  { key: 'modules', label: 'Modules' },
  { key: 'chapters', label: 'Chapitres' },
  { key: 'trainers', label: 'Formateurs' },
  { key: 'sessions', label: 'Sessions' },
]

const activeTab = ref('formations')
const editId = ref(null)
const form = reactive({
  nom: '',
  description: '',
  email: '',
  formation_id: '',
  module_id: '',
  date_debut: '',
  date_fin: '',
})

onMounted(() => store.getDimensions())

watch(activeTab, resetForm)

const currentTitle = computed(() => tabs.find((tab) => tab.key === activeTab.value)?.label.toLowerCase())
const listTitle = computed(() => `Liste des ${currentTitle.value}`)
const currentItems = computed(() => {
  const map = { formations, modules, chapters, trainers, sessions }
  return map[activeTab.value].value
})
const nameLabel = computed(() => (activeTab.value === 'sessions' ? 'Libelle' : 'Nom'))
const namePlaceholder = computed(() => {
  const placeholders = {
    formations: 'JavaScript Avance',
    modules: 'Docker',
    chapters: 'Volumes et reseaux',
    trainers: 'Jean Dupont',
    sessions: 'Mars 2026 - Octobre 2026',
  }
  return placeholders[activeTab.value]
})

function tabClass(tab) {
  return activeTab.value === tab
    ? 'rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-600'
    : 'rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-50'
}

function resetForm() {
  editId.value = null
  form.nom = ''
  form.description = ''
  form.email = ''
  form.formation_id = ''
  form.module_id = ''
  form.date_debut = ''
  form.date_fin = ''
}

function payload() {
  if (activeTab.value === 'formations') return { nom: form.nom, description: form.description }
  if (activeTab.value === 'modules') return { nom: form.nom, formation_id: form.formation_id }
  if (activeTab.value === 'chapters') return { nom: form.nom, module_id: form.module_id }
  if (activeTab.value === 'trainers') return { nom: form.nom, email: form.email }
  return {
    libelle: form.nom,
    formation_id: form.formation_id,
    date_debut: form.date_debut,
    date_fin: form.date_fin,
  }
}

async function submit() {
  const ok = await store.saveDimension(activeTab.value, payload(), editId.value)
  if (ok) resetForm()
}

function editItem(item) {
  editId.value = item._id
  form.nom = item.nom || item.libelle || ''
  form.description = item.description || ''
  form.email = item.email || ''
  form.formation_id = item.formation_id?._id || item.formation_id || ''
  form.module_id = item.module_id?._id || item.module_id || ''
  form.date_debut = item.date_debut ? item.date_debut.slice(0, 10) : ''
  form.date_fin = item.date_fin ? item.date_fin.slice(0, 10) : ''
}

function removeItem(item) {
  store.deleteDimension(activeTab.value, item._id)
}

function displayName(item) {
  return item.nom || item.libelle
}

function displayMeta(item) {
  if (activeTab.value === 'formations') return item.description || 'Formation'
  if (activeTab.value === 'modules') return item.formation_id?.nom || 'Module'
  if (activeTab.value === 'chapters') return item.module_id?.formation_id?.nom ? `${item.module_id.formation_id.nom} / ${item.module_id.nom}` : item.module_id?.nom || 'Chapitre'
  if (activeTab.value === 'trainers') return item.email || 'Formateur'
  return item.formation_id?.nom ? `${item.formation_id.nom} - ${formatDate(item.date_debut)} au ${formatDate(item.date_fin)}` : 'Session'
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString('fr-FR') : ''
}
</script>

<style scoped>
.form-field {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: transparent;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
}

.form-field:focus {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgb(248 113 113 / 0.12);
}
</style>
