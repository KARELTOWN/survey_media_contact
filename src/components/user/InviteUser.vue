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
          Inviter un collaborateur
        </h5>

        <form @submit.prevent="handleSubmit">
          <!-- Email -->
          <div class="my-2">
            <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Email<span class="text-error-500">*</span>
            </label>
            <input v-model="form.email" type="email" id="email" name="email" placeholder="Enter your email"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
            <p v-if="errors.email" style="color: red">{{ errors.email }}</p>
          </div>

          <!-- Role collaborateur -->
          <div class="sm:col-span-1 my-3">
            <label for="phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Role<span class="text-error-500">*</span>
            </label>
            <SimpleSelect :data="roles" label="" optionTextAttr="libelle" optionValueAttr="_id"
              @change="getRoleValue" />
            <p v-if="errors.role_id" style="color: red">{{ errors.role_id }}</p>
          </div>

          <div>
            <button type="submit" :disabled="disableBtn"
              class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
              Inviter à rejoindre
            </button>
          </div>

        </form>

      </div>
    </template>
  </Modal>
</template>

<script setup>

import { ref, onMounted, watchEffect, reactive } from 'vue'
import Modal from '@/components/profile/Modal.vue'
import { userStore } from "@/stores/user/userStore.js";
import { storeToRefs } from "pinia";
import SimpleSelect from '../forms/FormElements/SimpleSelect.vue';
import { roleStore } from '@/stores/user/roleStore.js';
const role_store = roleStore()
const store = userStore()
const { errors,
  userSuccess } = storeToRefs(store)
const { getRoles } = role_store
const { roles } = storeToRefs(role_store)
const { inviteUser } = store
const isOpen = ref(false)

const form = reactive({
  email: '',
  role_id: ''
})

const disableBtn = ref(false)

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['close'])

onMounted(() => {
  errors.value = {}
  getRoles()
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

const handleSubmit = async () => {
  try {
    disableBtn.value = true
    await inviteUser(form)
    disableBtn.value = false
    if (userSuccess.value === true) {
      closeModal()
    }
  } catch (err) {
    disableBtn.value = false
  }
}

const getRoleValue = (value) => {
  form.role_id = value
}

</script>