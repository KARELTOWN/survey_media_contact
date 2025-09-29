<template>
  <Modal v-if="isOpen">
    <template #body>
      <div
        class="no-scrollbar relative max-h-[550px] w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h5 class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
          {{ selectCompany ? 'Modifier la société' : 'Ajouter une société' }}
        </h5>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-5">

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div class="sm:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Dénomination <span class="text-danger">*</span>
                </label>
                <input type="text" v-model="form.denomination"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800  placeholder:text-gray-400 " />
                <p v-if="errors.denomination" class="text-red-500">{{ errors.denomination }}</p>
              </div>

              <div class="sm:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Logo <span class="text-danger">*</span>
                </label>
                <input type="file" @change="handleFile($event)" accept="image/*"
                  class="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400" />
                <p v-if="errors.logo" class="text-red-500">{{ errors.logo }}</p>
                <p class="my-4" v-if="form.logo"><img :src="form.logo" class="object-contain w-16 h-16" /></p>
              </div>


              <div class="sm:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email <span class="text-danger">*</span>
                </label>
                <input type="email" v-model="form.email"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800  placeholder:text-gray-400 " />
                <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
              </div>

              <div class="sm:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Téléphone <span class="text-danger">*</span>
                </label>
                <input type="text" v-model="form.phone"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800  placeholder:text-gray-400 " />
                <p v-if="errors.phone" class="text-red-500">{{ errors.phone }}</p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Adresse <span class="text-danger">*</span>
                </label>
                <textarea v-model="form.adress"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800  placeholder:text-gray-400 "></textarea>
                <p v-if="errors.adress" class="text-red-500">{{ errors.adress }}</p>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Horaires d'ouvertures <span class="text-danger">*</span>
                </label>
                <textarea v-model="form.open_hours"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800  placeholder:text-gray-400 "></textarea>
                <p v-if="errors.open_hours" class="text-red-500">{{ errors.open_hours }}</p>
              </div>

            </div>

            <div class="">
              <button type="submit" :disabled="disabledBtn"
                class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                {{ selectCompany ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>

          </div>
        </form>

      </div>
    </template>
  </Modal>
</template>

<script setup>

import { ref, onMounted, watchEffect, reactive } from 'vue'
import Modal from '@/components/profile/Modal.vue'
import { storeToRefs } from "pinia";
import { convertToBase64, isFileSizeAllowed } from '@/utils/file';
import { companyStore } from '@/stores/company/companyStore';

const store = companyStore()
const { errors,
  companySuccess, selectCompany, company } = storeToRefs(store)
const { createCompany, updateCompany, getCompany } = store

const isOpen = ref(false)

const form = reactive({
  denomination: '',
  adress: '',
  phone: '',
  logo: '',
  open_hours: '',
  email: '',
  company_id: '',
})

const disabledBtn = ref(false)

const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const handleFile = async (event) => {
  if (acceptedImageTypes.includes(event.target.files[0].type)) {
    if (isFileSizeAllowed(event.target.files[0])) {
      const file = event.target.files[0]
      const file64 = await convertToBase64(file)
      form.logo = file64
    }
    else {
      infoNotify('Taille de fichier trop volumineux. Taille maximale acceptée: 10 MB')
    }
  } else {
    infoNotify('Type de fichier non supporté. Veuillez sélectionner une image (jpg, jpeg, png, gif).')
  }
}


const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['close'])

onMounted(async () => {

})

const getSelectCompany = async () => {
  if (selectCompany.value !== '') {
    await getCompany(selectCompany.value)
    if (company.value) {
      Object.keys(form).forEach((e) => {
        if (company.value[e] !== undefined) {
          form[e] = company.value[e]
        }
      })
      form.company_id = selectCompany.value
    }
  }
}

watchEffect(() => {
  if (props.open && props.open !== undefined) {
    isOpen.value = props.open
  }
  getSelectCompany()
})

const resetModalFields = () => {
  form.adress = ''
  form.company_id = ''
  form.denomination = ''
  form.email = ''
  form.logo = ''
  form.open_hours = ''
  form.phone = ''
}

const closeModal = () => {
  isOpen.value = false
  emits('close')
  resetModalFields()
}


const disableBtn = ref(false)

const handleSubmit = async () => {
  try {
    disableBtn.value = true
    if (selectCompany.value == '') {
      await createCompany(form)
      disableBtn.value = false
      if (companySuccess.value === true) {
        closeModal()
      }
      disabledBtn.value = false
    }
    else {
      await updateCompany(form)
      disabledBtn.value = false
      if (companySuccess.value === true) {
        closeModal()
      }
    }

  } catch (err) {
    console.log('Error', err)
    disabledBtn.value = false
  }
}
</script>
