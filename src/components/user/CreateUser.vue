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
          {{ selectUser ? 'Modifier le Projet' : 'Ajouter un Projet' }}
        </h5>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-5">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <!-- First Name -->
              <div class="sm:col-span-1">
                <label for="fname" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Prénom<span class="text-error-500">*</span>
                </label>
                <input v-model="form.firstname" type="text" id="fname" name="fname" placeholder="Entrez votre prénom"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                <p v-if="errors.firstname" style="color: red">{{ errors.firstname }}</p>
              </div>

              <!-- Last Name -->
              <div class="sm:col-span-1">
                <label for="lname" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nom<span class="text-error-500">*</span>
                </label>
                <input v-model="form.lastname" type="text" id="lname" name="lname" placeholder="Entrez votre nom"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                <p v-if="errors.lastname" style="color: red">{{ errors.lastname }}</p>
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Email<span class="text-error-500">*</span>
              </label>
              <input v-model="form.email" type="email" id="email" name="email" placeholder="Enter your email"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              <p v-if="errors.email" style="color: red">{{ errors.email }}</p>
            </div>

            <!-- Country Code & Phone -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <!-- Country Code -->
              <div class="sm:col-span-1">
                <label for="countryCode" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Code Pays<span class="text-error-500">*</span>
                </label>
                <input v-model="form.code" type="text" id="countryCode" name="countryCode" placeholder="+229"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                <p v-if="errors.code" style="color: red">{{ errors.code }}</p>
              </div>

              <!-- Phone -->
              <div class="sm:col-span-1">
                <label for="phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Téléphone<span class="text-error-500">*</span>
                </label>
                <input v-model="form.phone" type="tel" id="phone" name="phone" placeholder="90001234"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                <p v-if="errors.phone" style="color: red">{{ errors.phone }}</p>
              </div>

              <!-- Role -->
              <div class="sm:col-span-1">
                <label for="phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Role<span class="text-error-500">*</span>
                </label>
                <SimpleSelect :data="roles" label="" optionTextAttr="libelle" optionValueAttr="_id"
                  @change="getRoleValue" />
                <p v-if="errors.role_id" style="color: red">{{ errors.role_id }}</p>
              </div>

              <!-- Direction -->
              <div class="sm:col-span-1">
                <label for="phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Direction<span class="text-error-500">*</span>
                </label>
                <SimpleSelect :data="directions" label="" optionTextAttr="libelle" optionValueAttr="_id"
                  @change="getDirectionValue" />
                <p v-if="errors.direction_id" style="color: red">{{ errors.direction_id }}</p>
              </div>

              <!-- Fonction -->
              <div class="sm:col-span-1">
                <label for="phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Fonction
                </label>
                <SimpleSelect :disabled="form.direction_id" :data="filterFonctions" label="" optionTextAttr="libelle"
                  optionValueAttr="_id" @change="getFonctionValue" />
                <p v-if="errors.fonction_id" style="color: red">{{ errors.fonction_id }}</p>
              </div>
            </div>

            <div>
              <button type="submit"
                class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                Créer un compte
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
import { userStore } from "@/stores/user/userStore";
import { storeToRefs } from "pinia";
import SimpleSelect from '../forms/FormElements/SimpleSelect.vue';
const store = userStore()
const { errors,
  userSuccess, selectUser, fonctions, roles, directions } = storeToRefs(store)
const { createUser, getUserAccountParams } = store
const isOpen = ref(false)

const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  code: '',
  phone: '',
  direction_id: '',
  fonction_id: null,
  role_id: ''
})

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['close'])

onMounted(() => {
  errors.value = {}
  getUserAccountParams()
})


watchEffect(() => {
  if (props.open && props.open !== undefined) {
    isOpen.value = props.open
  }
})

const closeModal = () => {
  isOpen.value = false
  emits('close')
  resetModalFields()
}

const resetModalFields = () => {
  form.code = ''
  form.direction_id = ''
  form.email = ''
  form.firstname = ''
  form.lastname = ''
  form.role_id = ''
  form.fonction_id = ''
}

const disableBtn = ref(false)

const handleSubmit = async () => {
  try {
    disableBtn.value = true
    if (selectUser.value == '') {
      await createUser(form)
      disableBtn.value = false
      if (userSuccess.value === true) {
        closeModal()
      }
    }

  } catch (err) {
    disableBtn.value = false
  }
}

const getRoleValue = (value) => {
  form.role_id = value
}

const getFonctionValue = (value) => {
  form.fonction_id = value
}

const filterFonctions = ref([])
const getDirectionValue = (value) => {
  form.direction_id = value
  form.fonction_id = ''
  filterFonctions.value = fonctions.value.filter((e) => e.direction_id === value)
}
</script>
