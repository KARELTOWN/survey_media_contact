<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue"
import { surveyStore } from "@/stores/survey/surveyStore";
import { storeToRefs } from "pinia";
import { errorNotify, infoNotify, successNotify } from "@/utils/notification";
import { convertToBase64, convertToTempURL, getFileCategory, isFileSizeAllowed } from "@/utils/file";
import { configStore } from '@/stores/config/config.js';
const config_store = configStore()
const { themeProperties } = storeToRefs(config_store)
import validator from 'validator'

import { useRoute, useRouter } from "vue-router";
import SurveyFormHeader from "../header/SurveyFormHeader.vue";
import { defaultFileImg } from "@/utils/survey";
import { getSurveyCookie, setSurveyCookie } from "@/composables/cookie";
import { flatpickrConfig, flatpickrTimeOnlyConfig } from "@/utils/format";
import FileViewer from "@/components/viewer/FileViewer.vue";
import moment from "moment";
import ResponseDropzone from "../../dropzone/ResponseDropzone.vue";
import countries from "world-countries";

const previewMode = ref(false)

const openViewer = ref(false)
const fileToOpen = ref('')

const openFile = (file_base_64) => {
  openViewer.value = true
  fileToOpen.value = file_base_64
}

const closeFileViewer = () => {
  fileToOpen.value = ''
  openViewer.value = false
}

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


// const handleFile = async (event, question_id) => {
//   // event.target.files
//   filesList.value[question_id] = []
//   let files = event.target.files
//   answers.value[question_id] = []
//   for (const e of files) {

//     let type = getFileCategory(e)
//     if (filesAcceptTypes.value[question_id].includes(type)) {
//       if (isFileSizeAllowed(e, filesSize.value[question_id])) {
//         let file = ''
//         let img = ''
//         if (type == "image") {
//           file = await convertToBase64(e)
//           img = file
//         }
//         else {
//           file = await convertToBase64(e)
//           img = defaultFileImg
//         }
//         filesList.value[question_id].push({ name: e.name, img: img })
//         answers.value[question_id].push(file)
//       }
//       else {
//         infoNotify("La taille du fichier" + e.name + "est trop grande")
//       }
//     }
//     else {
//       infoNotify("Le format du fichier" + e.name + "n'est pas autorisé")
//     }
//   }
//   const input = document.getElementById(`file_input_${question_id}`)
//   if (input) {
//     input.value = "" // reset le champ
//   }
// }


// DROPZONE FILE HANDLE
const handleFile = (data) => {
  if (data.question_id && data.question_id !== undefined) {
    if (formSurvey.value.multiple_submission === false || 
    (formSurvey.value.multiple_submission === true && 
    (!Array.isArray(filesList.value[data.question_id]) || 
    !Array.isArray(answers.value[data.question_id])))) {
      filesList.value[data.question_id] = []
      answers.value[data.question_id] = []
    }
    filesList.value[data.question_id].push({ name: data.file.name, img: data.file.dataURL || defaultFileImg })
    answers.value[data.question_id].push(data.filename)
  }
}

const deleteFile = (index, question_id) => {
  filesList.value[question_id].splice(index, 1)
  answers.value[question_id].splice(index, 1)
}

// Réponses de l’utilisateur (lié à v-model sur chaque champ)
const answers = ref([])
const participant = ref({
  lastname: '',
  firstname: '',
  phone_country: 'CI',
  phone_country_code: '+225',
  phone_number: '',
})

const countryOptions = computed(() => countries
  .filter((country) => country.idd?.root)
  .map((country) => {
    const suffix = country.idd.suffixes?.[0] || ''
    return {
      code: country.cca2,
      name: country.translations?.fra?.common || country.name.common,
      dialCode: `${country.idd.root}${suffix}`,
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name)))

const selectPhoneCountry = (countryCode) => {
  const country = countryOptions.value.find((item) => item.code === countryCode)
  participant.value.phone_country = country?.code || 'CI'
  participant.value.phone_country_code = country?.dialCode || '+225'
}

const participantPayload = computed(() => ({
  lastname: participant.value.lastname,
  firstname: participant.value.firstname,
  phone: {
    country: participant.value.phone_country,
    country_code: participant.value.phone_country_code,
    number: participant.value.phone_number.replace(/\D/g, ''),
    full_number: participant.value.phone_number ? `${participant.value.phone_country_code}${participant.value.phone_number.replace(/\D/g, '')}` : '',
  },
}))

const isPhoneNumberValid = () => {
  const number = participant.value.phone_number.replace(/\D/g, '')
  if (!number) return false
  const fullNumber = `${participant.value.phone_country_code}${number}`
  return validator.isMobilePhone(fullNumber, 'any', { strictMode: false }) || (number.length >= 6 && number.length <= 15)
}

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

  if (formSurvey.value.response_mode === 'identified') {
    if (!participant.value.lastname || !participant.value.firstname) {
      formErrors.value.__participant = 'Le nom et le prénom sont requis.'
      isValid = false
    }
    if (!participant.value.phone_number) {
      formErrors.value.__participant = 'Le numéro de téléphone est requis.'
      isValid = false
    }
    else if (!isPhoneNumberValid()) {
      formErrors.value.__participant = 'Numéro de téléphone invalide.'
      isValid = false
    }
  } else if (formSurvey.value.response_mode === 'semi_anonymous') {
    if (participant.value.phone_number && !isPhoneNumberValid()) {
      formErrors.value.__participant = 'Numéro de téléphone invalide.'
      isValid = false
    }
  }

  for (const question of formSurvey.value.questions) {
    if (question.type_field === 'email') continue
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
        case "range":
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

        case "email":
          if (answer === "" || answer === null || answer === undefined) {
            formErrors.value[question.question_id] = `La réponse est requise.`
            isValid = false
          }
          if (!validator.isEmail(answer)) {
            formErrors.value[question.question_id] = `Une adresse email est attendue.`
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
        case "range":
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
  try {
    if (disabledBtn.value) return
    const isValid = validateForm()
    if (isValid === true) {
      if (previewMode.value === true) {
        return
      }
      else if (previewMode.value === false && publish.value === true) {
        infoNotify('Enregistrement en cours')
        disabledBtn.value = true
        await saveSurveyResponse(answers.value, route.params.id, participantPayload.value)
        if (surveySuccess.value === true) {
          if (formSurvey.value.multiple_submission === false) {
            setSurveyCookie(route.params.id)
          }
          // disabledBtn.value = false
          router.push({ name: 'Response-Send' })
        }
        else {
          disabledBtn.value = false
        }
      }
    }
  }
  catch (err) {
    throw err
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
    } else if ((q.type_field === 'range') && answers.value[q.question_id] === undefined) {
      answers.value[q.question_id] = q.field_params?.min ?? 1
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

    await getSurveyForm(route.params.id)
    if (liveFormSurvey.value?.publish === false) {
      publish.value = false
      return
    }
    else {
      publish.value = true
    }
    formSurvey.value = liveFormSurvey.value
    formSurvey.value.capture_mail = false
    formSurvey.value.questions = formSurvey.value.questions.filter((question) => question.type_field !== 'email')
    if (formSurvey.value?.theme) {
      themeProperties.value = formSurvey.value?.theme
    }
    previewModeData()
    if (route.query.print === '1') {
      setTimeout(() => window.print(), 800)
    }
  }
})

watchEffect(() => {
  if (formSurvey.value.multiple_submission === false) {
    cookieExist.value = getSurveyCookie(route.params.id)
    if (cookieExist.value === true) {
      return
    }
  }
})

const canResponseToForm = computed(() => {
  const start_date = moment(formSurvey.value.start_date)
  const end_date = moment(formSurvey.value.end_date)
  const today = moment()
  if (today.isBefore(start_date) || today.isAfter(end_date)) {
    return false
  }
  return true
})

const formWidthMap = {
  narrow: '42rem',
  medium: '56rem',
  wide: '72rem',
  full: 'calc(100% - 2rem)',
}

const formShellStyle = computed(() => ({
  maxWidth: formWidthMap[themeProperties.value?.form_width || 'medium'],
  marginLeft: themeProperties.value?.form_alignment === 'left' ? '1rem' : 'auto',
  marginRight: themeProperties.value?.form_alignment === 'left' ? 'auto' : 'auto',
}))

const questionSpacingClass = computed(() => {
  if (themeProperties.value?.form_spacing === 'compact') return 'mb-4'
  if (themeProperties.value?.form_spacing === 'comfortable') return 'mb-8'
  return 'mb-6'
})

const hasFooterContact = computed(() => Boolean(
  themeProperties.value?.show_footer_contact &&
  (
    themeProperties.value?.footer_contact_name ||
    themeProperties.value?.footer_contact_email ||
    themeProperties.value?.footer_contact_phone ||
    themeProperties.value?.footer_contact_address ||
    themeProperties.value?.footer_contact_hours
  )
))

const submitButtonStyle = computed(() => ({
  backgroundColor: themeProperties.value?.header_bg_color || '#dc2626',
  color: themeProperties.value?.header_text_color || '#ffffff',
  opacity: disabledBtn.value ? 0.75 : 1,
  cursor: disabledBtn.value ? 'not-allowed' : 'pointer',
}))

</script>

<template>
  <div class="shadow pb-5 min-h-screen" :style="{
    backgroundColor: themeProperties?.global_bg_color || themeProperties?.container_bg_color,
    backgroundImage: themeProperties?.container_bg_img ? `url(${themeProperties.container_bg_img})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }">
    <div class="mb-4">
      <SurveyFormHeader :preview-mode="previewMode" />
    </div>
    <div class="p-6 bg-gray-50 rounded-xl shadow-md mt-5"
      :style="formShellStyle"
      v-if="(previewMode === true) || (previewMode === false && cookieExist === false && publish === true && canResponseToForm)">
      <!-- ✅ En-tête du formulaire -->
      <img v-if="themeProperties?.banner_url" :src="themeProperties.banner_url"
        class="mb-6 h-56 w-full rounded-xl object-cover" />
      <h1 class="text-2xl font-bold mb-2">{{ formSurvey.title }}</h1>
      <p class="text-gray-600 mb-6">{{ formSurvey.description }}</p>

      <div v-if="formSurvey.response_mode === 'identified' || formSurvey.response_mode === 'semi_anonymous'"
        class="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 class="mb-3 text-base font-semibold text-gray-800">Informations du répondant</h2>
        <div class="grid gap-3 md:grid-cols-2">
          <input v-if="formSurvey.response_mode === 'identified'" v-model="participant.lastname" type="text" class="w-full rounded-lg border p-2"
            :placeholder="formSurvey.response_mode === 'identified' ? 'Nom *' : 'Nom'" />
          <input v-if="formSurvey.response_mode === 'identified'" v-model="participant.firstname" type="text" class="w-full rounded-lg border p-2"
            :placeholder="formSurvey.response_mode === 'identified' ? 'Prénom *' : 'Prénom'" />
          <div class="flex overflow-hidden rounded-lg border bg-white md:col-span-2">
            <select v-model="participant.phone_country" @change="selectPhoneCountry(participant.phone_country)"
              class="w-44 border-0 border-r bg-white px-3 py-2 text-sm focus:outline-none">
              <option v-for="country in countryOptions" :key="country.code" :value="country.code">
                {{ country.name }} {{ country.dialCode }}
              </option>
            </select>
            <input v-model="participant.phone_number" type="tel" class="min-w-0 flex-1 border-0 p-2 focus:outline-none"
              :placeholder="formSurvey.response_mode === 'identified' ? 'Téléphone *' : 'Téléphone facultatif'" />
          </div>
        </div>
        <p v-if="formErrors.__participant" class="mt-2 text-sm text-red-500">{{ formErrors.__participant }}</p>
      </div>

      <!-- ✅ Liste des questions -->
      <div v-for="question in formSurvey.questions.filter((item) => item.type_field !== 'email')" :key="question.question_id" :class="questionSpacingClass">
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

        <input v-if="question.type_field === 'email' && displayField(question.condition)" type="text"
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
            <img v-if="opt.img" :src="opt.img" @click="openFile(opt.img)"
              class="w-16 h-16 rounded ml-2 cursor-pointer" />
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
            <img v-if="opt.img" :src="opt.img" @click="openFile(opt.img)"
              class="w-16 h-16 rounded ml-2 cursor-pointer" />
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
          <!-- <input type="file" :multiple="question.field_params?.multiple"
          :accept="filesAcceptInputAttributes[question.question_id]" @change="handleFile($event, question.question_id)"
          :id="`file_input_${question.question_id}`" class="block w-full text-sm text-gray-500 border rounded-lg p-2" /> -->
          <ResponseDropzone upload-url="/file/response/tmp_upload" :multiple="question.field_params?.multiple"
            :accepted-files="filesAcceptInputAttributes[question.question_id]"
            :max-size="filesSize[question.question_id]" :question_id="question.question_id" @after-upload="handleFile"
            :class="{ 'pointer-events-none': previewMode === true }" />
          <div>
            <div v-if="filesList[question.question_id]?.length > 0"
              class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              <div v-for="(file, fIndex) in filesList[question.question_id]" :key="fIndex" class="mt-4 relative">
                <img :src="file.img" @click="openFile(answers[question.question_id][fIndex])" alt="Prévisualisation"
                  class="w-48 h-48 object-cover rounded cursor-pointer" />
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
          v-model="answers[question.question_id]" :config="flatpickrConfig()" placeholder="Date"
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

        <div v-else-if="question.type_field === 'range' && displayField(question.condition)"
          class="rounded-xl border border-gray-200 p-4">
          <div class="mb-3 flex items-center justify-between text-sm text-gray-500">
            <span>{{ question.field_params?.min_label || question.field_params?.min }}</span>
            <span>{{ question.field_params?.max_label || question.field_params?.max }}</span>
          </div>
          <input type="range" v-model="answers[question.question_id]" :min="question.field_params?.min"
            :max="question.field_params?.max" :step="question.field_params?.step || 1"
            class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200" />
          <div class="mt-3 text-center">
            <span class="rounded-full bg-red-50 px-4 py-1 text-sm font-semibold text-red-600">
              {{ answers[question.question_id] ?? question.field_params?.min }}
            </span>
          </div>
        </div>

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
          <img :src="question.img" @click="openFile(question.img)"
            class="rounded-lg max-h-100 max-w-[100%] object-contain cursor-pointer" />
        </div>

        <p v-if="formErrors[question.question_id]" class="text-red-500 text-sm mt-1">
          {{ formErrors[question.question_id] }}
        </p>
      </div>

      <!-- ✅ Bouton de soumission -->
      <button v-if="previewMode === false" @click="saveForm" :aria-disabled="disabledBtn"
        class="mt-6 rounded-lg px-6 py-2 font-semibold shadow-sm transition hover:brightness-95" :style="submitButtonStyle">
        {{ disabledBtn == true ? 'En cours' : 'Soumettre' }}
      </button>

      <footer v-if="themeProperties?.footer_text || hasFooterContact || themeProperties?.footer_links?.length"
        class="mt-8 space-y-3 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
        <p v-if="themeProperties?.footer_text">{{ themeProperties.footer_text }}</p>
        <div v-if="hasFooterContact" class="mx-auto max-w-2xl rounded-xl bg-white/80 p-4 text-sm">
          <div v-if="themeProperties?.footer_contact_name" class="font-semibold text-gray-700">
            {{ themeProperties.footer_contact_name }}
          </div>
          <div class="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a v-if="themeProperties?.footer_contact_email" :href="`mailto:${themeProperties.footer_contact_email}`">
              {{ themeProperties.footer_contact_email }}
            </a>
            <a v-if="themeProperties?.footer_contact_phone" :href="`tel:${themeProperties.footer_contact_phone}`">
              {{ themeProperties.footer_contact_phone }}
            </a>
          </div>
          <div v-if="themeProperties?.footer_contact_address" class="mt-1">{{ themeProperties.footer_contact_address }}</div>
          <div v-if="themeProperties?.footer_contact_hours" class="mt-1">{{ themeProperties.footer_contact_hours }}</div>
        </div>
        <div v-if="themeProperties?.footer_links?.length" class="flex flex-wrap justify-center gap-3">
          <a v-for="(link, index) in themeProperties.footer_links" :key="index" :href="link.url" target="_blank"
            rel="noopener noreferrer" class="font-medium text-blue-600 hover:underline">
            {{ link.label || link.url }}
          </a>
        </div>
      </footer>
    </div>

    <div v-if="!canResponseToForm" class="py-5 text-center">
      <h2 class="text-2xl font-bold mb-2">Vous ne pouvez pas accéder à ce formulaire</h2>
    </div>
    <div v-else-if="cookieExist === true && formSurvey.multiple_submission === false" class="text-center py-5">
      <h2 class="text-xl font-bold mb-2">Vous avez déjà soumis cette enquête</h2>
    </div>
  </div>


  <FileViewer :open="openViewer" :file="fileToOpen" @close="closeFileViewer" />

</template>
