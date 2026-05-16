<template>
  <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <div class="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-sm font-semibold text-gray-800">Contexte analytique</h3>
        <p class="text-sm text-gray-500">Ces champs servent uniquement aux filtres, scores et analyses.</p>
      </div>
      <RouterLink to="/dimensions-analytiques" class="text-sm font-medium text-red-600 hover:text-red-700">
        Gerer
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label class="field-label">Formation</label>
        <select v-model="formationId" class="field-control" @change="selectFormation">
          <option value="">Choisir</option>
          <option v-for="formation in formations" :key="formation._id" :value="formation._id">
            {{ formation.nom }}
          </option>
        </select>
      </div>

      <div>
        <label class="field-label">Session</label>
        <select v-model="sessionId" class="field-control" @change="selectSession" :disabled="!formationId">
          <option value="">Choisir</option>
          <option v-for="session in filteredSessions" :key="session._id" :value="session._id">
            {{ session.libelle }}
          </option>
        </select>
      </div>

      <div>
        <label class="field-label">Module</label>
        <select v-model="moduleId" class="field-control" @change="selectModule" :disabled="!formationId">
          <option value="">Choisir</option>
          <option v-for="module in filteredModules" :key="module._id" :value="module._id">
            {{ module.nom }}
          </option>
        </select>
      </div>

      <div>
        <label class="field-label">Chapitre</label>
        <select v-model="chapterId" class="field-control" @change="selectChapter" :disabled="!moduleId">
          <option value="">Choisir</option>
          <option v-for="chapter in filteredChapters" :key="chapter._id" :value="chapter._id">
            {{ chapter.nom }}
          </option>
        </select>
      </div>

      <div class="md:col-span-2">
        <label class="field-label">Formateur</label>
        <select v-model="trainerId" class="field-control" @change="selectTrainer">
          <option value="">Choisir</option>
          <option v-for="trainer in trainers" :key="trainer._id" :value="trainer._id">
            {{ trainer.nom }}<template v-if="trainer.email"> - {{ trainer.email }}</template>
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { analyticsDimensionStore } from '@/stores/analyticsDimension/analyticsDimensionStore'
import { surveyStore } from '@/stores/survey/surveyStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

const dimensionStore = analyticsDimensionStore()
const survey = surveyStore()
const { formations, trainers } = storeToRefs(dimensionStore)
const { formSurvey } = storeToRefs(survey)

const formationId = ref('')
const moduleId = ref('')
const chapterId = ref('')
const trainerId = ref('')
const sessionId = ref('')

onMounted(async () => {
  await dimensionStore.getDimensions()
  hydrateSelection()
})

watch(
  () => formSurvey.value._id,
  () => hydrateSelection(),
)

const filteredModules = computed(() => dimensionStore.modulesByFormation(formationId.value))
const filteredChapters = computed(() => dimensionStore.chaptersByModule(moduleId.value))
const filteredSessions = computed(() => dimensionStore.sessionsByFormation(formationId.value))

function hydrateSelection() {
  formationId.value = formSurvey.value.formation?._id || formSurvey.value.formation_id?._id || formSurvey.value.formation_id || ''
  moduleId.value = formSurvey.value.module?._id || formSurvey.value.module_id?._id || formSurvey.value.module_id || ''
  chapterId.value = formSurvey.value.chapter?._id || formSurvey.value.chapter_id?._id || formSurvey.value.chapter_id || ''
  trainerId.value = formSurvey.value.trainer?._id || formSurvey.value.trainer_id?._id || formSurvey.value.trainer_id || ''
  sessionId.value = formSurvey.value.session?._id || formSurvey.value.session_id?._id || formSurvey.value.session_id || ''
}

function findById(items, id) {
  return items.find((item) => item._id === id) || null
}

function selectFormation() {
  formSurvey.value.formation = findById(formations.value, formationId.value)
  formSurvey.value.module = null
  formSurvey.value.chapter = null
  formSurvey.value.session = null
  moduleId.value = ''
  chapterId.value = ''
  sessionId.value = ''
}

function selectModule() {
  formSurvey.value.module = findById(filteredModules.value, moduleId.value)
  formSurvey.value.chapter = null
  chapterId.value = ''
}

function selectChapter() {
  formSurvey.value.chapter = findById(filteredChapters.value, chapterId.value)
}

function selectTrainer() {
  formSurvey.value.trainer = findById(trainers.value, trainerId.value)
}

function selectSession() {
  formSurvey.value.session = findById(filteredSessions.value, sessionId.value)
}
</script>

<style scoped>
.field-label {
  margin-bottom: 0.375rem;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.field-control {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
}

.field-control:focus {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgb(248 113 113 / 0.12);
}

.field-control:disabled {
  cursor: not-allowed;
  background: #f3f4f6;
  color: #9ca3af;
}
</style>
