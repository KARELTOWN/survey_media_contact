<!-- <template>
    <pre>{{ formSurvey }}</pre>
</template> -->
<script setup>
import { onMounted, ref, watch, watchEffect } from "vue"
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
import { errorNotify, infoNotify, successNotify } from "@/utils/notification";
import { convertToBase64, convertToTempURL, getFileCategory, isFileSizeAllowed } from "@/utils/file";
import { useRoute, useRouter } from "vue-router";
import SurveyFormHeader from "../header/SurveyFormHeader.vue";
import { defaultFileImg } from "@/utils/survey";
import { getSurveyCookie, setSurveyCookie } from "@/composables/cookie";
import { flatpickrConfig, flatpickrTimeOnlyConfig } from "@/utils/format";

const previewMode = ref(false)

const props = defineProps({
  preview: Boolean
})
const store = surveyStore()
const { formSurvey, liveFormSurvey, surveySuccess } = storeToRefs(store)

const { getSurveyForm, saveSurveyResponse } = store

const filesAcceptInputAttributes = ref([])
const filesSize = ref([])
const filesList = ref([])
const filesAcceptTypes = ref([])


const handleFile = async (event, question_id) => {
  // event.target.files
  filesList.value[question_id] = []
  let files = event.target.files
  answers.value[question_id] = []
  for (const e of files) {

    let type = getFileCategory(e)
    if (filesAcceptTypes.value[question_id].includes(type)) {
      if (isFileSizeAllowed(e, filesSize.value[question_id])) {
        let file = ''
        let img = ''
        if (type == "image") {
          file = await convertToBase64(e)
          img = file
        }
        else {
          file = await convertToBase64(e)
          img = defaultFileImg
        }
        filesList.value[question_id].push({ name: e.name, img: img })
        answers.value[question_id].push(file)
      }
      else {
        infoNotify("La taille du fichier" + e.name + "est trop grande")
      }
    }
    else {
      infoNotify("Le format du fichier" + e.name + "n'est pas autorisé")
    }
  }
  const input = document.getElementById(`file_input_${question_id}`)
  if (input) {
    input.value = "" // reset le champ
  }
}

const deleteFile = (index, question_id) => {
  filesList.value[question_id].splice(index, 1)
  answers.value[question_id].splice(index, 1)
}

// Réponses de l’utilisateur (lié à v-model sur chaque champ)
const answers = ref([])

const compare = (a, operator, b) => {
  switch (operator) {
    case '>': return a > b
    case '<': return a < b
    case '>=': return a >= b
    case '<=': return a <= b
    case '=': return a == b
    case '!=': return a != b
    default: throw new Error('Opérateur inconnu: ' + operator)
  }
}



const displayField = (condition) => {
  const operator = condition.operator
  const target = condition.target
  const display = condition.display
  const compareTo = condition.compareTo
  if (condition.operator && condition.target && condition.display) {
    if ([">=", '<=', '<', '>', '=', '!='].includes(operator) && compareTo) {
      if (compare(answers.value[target], operator, compareTo)) {
        return display == 'show' ? true : false
      }
    }
    else if (['vide'].includes(operator)) {
      if (answers.value[target]) {
        return false
      }
      else {
        return true
      }
    }
    else if (['rempli'].includes(operator)) {
      if (answers.value[target]) {
        return true
      }
      else {
        return false
      }
    }
  }
  else {
    return true
  }
}


const formErrors = ref({})

const validateForm = () => {
  formErrors.value = {}
  let isValid = true

  for (const question of formSurvey.value.questions) {
    // Si le champ est masqué par condition, on l'ignore
    if (!displayField(question.condition)) continue

    // Récupérer la réponse courante
    let answer = answers.value[question.question_id]

    // Vérifier uniquement si c'est requis
    if (question.required) {

      switch (question.type_field) {
        case "text":
        case "textarea":
          if (!answer || answer === "") {
            formErrors.value[question.question_id] = `La réponse est requise.`
            isValid = false
          }
          else if ((answer) && answer.length > question.field_params.maxlength) {
            formErrors.value[question.question_id] = `La réponse ne doit pas dépasser ${question.field_params.maxlength} caractères.`
            isValid = false
          }
          break
        case "number":
          if (answer === "" || answer === null || answer === undefined) {
            formErrors.value[question.question_id] = `La réponse est requise.`
            isValid = false
          }
          else if ((answer < question.field_params.min || answer > question.field_params.max)) {
            formErrors.value[question.question_id] = `La réponse doit être comprise entre ${question.field_params.min} et ${question.field_params.max}.`
            isValid = false
          }
          break

        case "date":
        case "hour":
        case "select":
        case "radio":
        case "review":
          if (answer === "" || answer === null || answer === undefined) {
            formErrors.value[question.question_id] = `La réponse est requise.`
            isValid = false
          }
          break

        case "checkbox":
          if (!Array.isArray(answer) || answer.length === 0) {
            formErrors.value[question.question_id] = `La réponse est requise.`
            isValid = false
          }
          break

        case "file":
          if (!filesList.value[question.question_id] || filesList.value[question.question_id].length === 0) {
            formErrors.value[question.question_id] = `La soumission d'un fichier est requise.`
            isValid = false
          }
          break
      }
    }
    else {
      switch (question.type_field) {
        case "text":
        case "textarea":
          if ((answer) && answer.length >= question.field_params.maxlength) {
            formErrors.value[question.question_id] = `La réponse ne doit pas dépasser ${question.field_params.maxlength} caractères.`
            isValid = false
          }
          break
        case "number":
          if (answer === "" || answer === null || answer === undefined) {
          }
          else if ((answer < question.field_params.min || answer > question.field_params.max)) {
            formErrors.value[question.question_id] = `La réponse doit être comprise entre ${question.field_params.min} et ${question.field_params.max}.`
            isValid = false
          }
          break
      }
    }
  }

  if (isValid === true && previewMode.value === true) {
    successNotify("Formulaire soumis. Merci pour votre participation")
  }
  return isValid
}

const router = useRouter()

const disabledBtn = ref(false)

const saveForm = async () => {
  const isValid = validateForm()
  if (isValid === true) {
    if (previewMode.value === true) {
      return
    }
    else if (previewMode.value === false && publish.value === true) {
      infoNotify('Enregistrement en cours')
      disabledBtn.value = true
      await saveSurveyResponse(answers.value, route.params.id)
      if (surveySuccess.value === true) {
        disabledBtn.value = false
        setSurveyCookie(route.params.id)
        router.push({ name: 'Response-Send' })
      }
      else {
        disabledBtn.value = false
      }
    }
  }
}

const previewModeData = () => {
  formSurvey.value.questions.forEach(q => {
    if ((q.type_field === 'radio') && q.field_params?.options) {
      const defaultOpt = q.field_params.options.find(o => o.default === true)
      if (defaultOpt) {
        answers.value[q.question_id] = defaultOpt.value
      }
    }
    else if ((q.type_field === 'checkbox') && q.field_params?.options) {
      answers.value[q.question_id] = q.field_params.options
        .filter(opt => opt.default === true)
        .map(opt => opt.value)
    }
    else if ((q.type_field === 'select') && q.field_params?.options) {
      const defaultOpt = q.field_params.options.find(o => o.default === true)
      if (defaultOpt) {
        answers.value[q.question_id] = defaultOpt.value
      }
    }
    else if ((q.type_field === 'file')) {
      filesAcceptTypes.value[q.question_id] = q.field_params?.accept.length > 0 ? q.field_params?.accept : ['image']
      const correspondant = {
        'image': 'image/*',
        'video': 'video/*',
        'pdf': 'application/pdf',
        'word': 'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'excel': 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'powerpoint': 'application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
      }
      filesSize.value[q.question_id] = q.field_params.max_size
      filesAcceptInputAttributes.value[q.question_id] = filesAcceptTypes.value[q.question_id].map(type => correspondant[type]).filter(Boolean).join(',')
    }
  })
}

const route = useRoute()

const publish = ref(false)

const cookieExist = ref(false)

watchEffect(async () => {
  if (props.preview === true) {
    previewMode.value = true
    previewModeData()
  }
  else if (props.preview === false) {
    previewMode.value = false
    formSurvey.value = {}
    cookieExist.value = getSurveyCookie(route.params.id)
    if (cookieExist.value === true) {
      return
    }
    formSurvey.value = {}
    await getSurveyForm(route.params.id)
    if (liveFormSurvey.value?.publish === false) {
      publish.value = false
      return
    }
    else {
      publish.value = true
    }
    formSurvey.value = liveFormSurvey.value
    previewModeData()
  }
})

</script>

<template>
  <div v-if="previewMode === false">
    <SurveyFormHeader />
  </div>
  <div class="max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md mt-5"
    v-if="(previewMode === true) || (previewMode === false && cookieExist === false && publish === true)">
    <!-- ✅ En-tête du formulaire -->
    <h1 class="text-2xl font-bold mb-2">{{ formSurvey.title }}</h1>
    <p class="text-gray-600 mb-6">{{ formSurvey.description }}</p>

    <!-- ✅ Liste des questions -->
    <div v-for="question in formSurvey.questions" :key="question.question_id" class="mb-6">
      <!-- Titre / label -->

      <label v-if="question.title && displayField(question.condition)" class="block font-semibold mb-2">
        {{ question.title }}
        <span v-if="question.required" class="text-red-500">*</span>
      </label>

      <!-- Champs dynamiques selon le type -->
      <!-- Texte court -->
      <input v-if="question.type_field === 'text' && displayField(question.condition)" type="text"
        v-model="answers[question.question_id]" :placeholder="question.field_params?.placeholder"
        :maxlength="question.field_params?.maxlength || 255" class="w-full border rounded-lg p-2" />

      <!-- Zone de texte -->
      <textarea v-else-if="question.type_field === 'textarea' && displayField(question.condition)"
        v-model="answers[question.question_id]" :rows="question.field_params?.rows || 3"
        class="w-full border rounded-lg p-2" :maxlength="question.field_params?.maxlength || 1000"
        :placeholder="question.field_params?.placeholder"></textarea>

      <!-- Boutons radio -->
      <div v-else-if="question.type_field === 'radio' && displayField(question.condition)" class="space-y-2">
        <label v-for="(opt, i) in question.field_params?.options" :key="i" class="flex items-center space-x-2">
          <input type="radio" :name="question.question_id" :value="opt.value" :checked="opt.default === true"
            v-model="answers[question.question_id]" />
          <span>{{ opt.value }}</span>
          <img v-if="opt.img" :src="opt.img" class="w-6 h-6 rounded ml-2" />
        </label>
      </div>

      <!-- Cases à cocher -->
      <div v-else-if="question.type_field === 'checkbox' && displayField(question.condition)" class="space-y-2">
        <div v-for="(opt, i) in question.field_params?.options" :key="i" class="flex items-center gap-4">
          <input type="checkbox" :value="opt.value" :id="`${opt.value}_${i}`" :name="`${opt.value}_${i}`"
            v-model="answers[question.question_id]" />
          <label class="flex items-center space-x-2">
            <span>{{ opt.value }}</span>
          </label>
          <img v-if="opt.img" :src="opt.img" class="w-6 h-6 rounded ml-2" />
        </div>

      </div>

      <div v-else-if="question.type_field === 'select' && displayField(question.condition)" class="space-y-2">
        <select name="" id="" v-model="answers[question.question_id]"
          class="text-gray-800 dark:text-white/90 dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
          <option :value="opt.value" :selected="opt.default" v-for="(opt, i) in question.field_params?.options"
            :key="i">{{ opt.value }}</option>
        </select>
      </div>

      <!-- Fichier -->
      <div v-else-if="question.type_field === 'file' && displayField(question.condition)">
        <pre class="bold">Types de fichiers : {{ question.field_params?.accept.length > 0 ? question.field_params?.accept.join(', ')
          : 'image' }}</pre>
        <input type="file" :multiple="question.field_params?.multiple"
          :accept="filesAcceptInputAttributes[question.question_id]" @change="handleFile($event, question.question_id)"
          :id="`file_input_${question.question_id}`" class="block w-full text-sm text-gray-500 border rounded-lg p-2" />
        <div>
          <div v-if="filesList[question.question_id]?.length > 0"
            class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            <div v-for="(file, fIndex) in filesList[question.question_id]" :key="fIndex" class="mt-4 relative">
              <img :src="file.img" alt="Prévisualisation" class="w-48 h-48 object-cover rounded" />
              <div class="text-muted font-bold">{{ file.name }}</div>
              <button @click="deleteFile(fIndex, question.question_id)"
                class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-red-500">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Date -->
      <flat-pickr v-else-if="question.type_field === 'date' && displayField(question.condition)"
        v-model="answers[question.question_id]" :config="flatpickrConfig" placeholder="Date"
        class="dark:bg-dark-900 h-11 appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      <!-- Heure -->
      <flat-pickr v-else-if="question.type_field === 'hour' && displayField(question.condition)"
        v-model="answers[question.question_id]" :config="flatpickrTimeOnlyConfig"
        class="dark:bg-dark-900 h-11 appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        placeholder="Heure" />

      <!-- Nombre -->
      <input v-else-if="question.type_field === 'number' && displayField(question.condition)" type="number"
        v-model="answers[question.question_id]" :min="question.field_params?.min" :max="question.field_params?.max"
        class="border rounded-lg p-2" />

      <!-- Avis / rating -->
      <div v-else-if="question.type_field === 'review' && displayField(question.condition)" class="flex space-x-2">
        <button v-for="n in parseInt(question.field_params?.rating)" :key="n" class="text-2xl"
          :class="answers[question.question_id] >= n ? 'text-yellow-400' : 'text-gray-300'"
          @click="answers[question.question_id] = n">
          ★
        </button>
      </div>

      <!-- Section -->
      <div v-else-if="question.category === 'title_description' && displayField(question.condition)" class="mt-4">
        <h2 class="text-xl font-bold">{{ question.title }}</h2>
        <p class="text-gray-600">{{ question.description }}</p>
      </div>

      <!-- Image -->
      <div v-else-if="question.category === 'image' && displayField(question.condition)" class="mt-4">
        <img :src="question.img" class="rounded-lg shadow-md max-h-64 object-contain" />
      </div>

      <p v-if="formErrors[question.question_id]" class="text-red-500 text-sm mt-1">
        {{ formErrors[question.question_id] }}
      </p>
    </div>

    <!-- ✅ Bouton de soumission -->
    <button @click="saveForm" class="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700" :disabled="disabledBtn">
      Soumettre
    </button>
  </div>
  <!-- <div v-if="publish === false">
    <h2 class="text-2xl font-bold mb-2">Vous ne pouvez pas accéder à ce formulaire</h2>
  </div> -->
  <div v-if="cookieExist === true" class="text-center mt-6">
    <h2 class="text-xl font-bold mb-2">Vous avez déjà soumis cette enquête</h2>
  </div>

</template>
