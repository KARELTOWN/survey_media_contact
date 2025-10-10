import { fetchGet } from '@/composables/request'
import { handleAppError } from '@/utils/handleAppError'
import { successNotify } from '@/utils/notification'
import { removeLocalStorage } from '@/utils/storage'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const authStore = defineStore('auth', () => {
  const router = useRouter()

  const deconnect = async () => {
    const result = await fetchGet('auth/deconnect')
    const response = await handleAppError(result)
    if (response.status === false) {
      removeLocalStorage('survey_mc_token')
      removeLocalStorage('survey_mc_account_type')
      removeLocalStorage('survey_mc_account_id')

      successNotify('Vous êtes déconnecté"')
      router.push({ path: '/signin' })
    }
  }
  return {
    deconnect,
  }
})
