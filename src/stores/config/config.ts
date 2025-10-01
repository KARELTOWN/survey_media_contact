import { defineStore } from 'pinia'
import { successNotify } from '@/utils/notification'
import { ref } from 'vue'
import { fetchGet, fetchPost } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import configValidator from '@/validator/config'
const { validateHeaderConfig } = configValidator()

export const configStore = defineStore('config-store', () => {
  let errors = ref({})
  const config = ref({})
  const configSuccess = ref(false)
  const storeHeaderConfig = async (form) => {
    try {
      configSuccess.value = false
      errors.value = {}
      const schemaValidation = validateHeaderConfig()
      const data = await schemaValidation.validate(
        {
          ...form,
        },
        { abortEarly: false },
      )

      const result = await fetchPost(`config/update`, data)

      const response = (await handleAppError(result)) as {
        status: boolean
        data?: any
        errors: any
      }
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        configSuccess.value = true
        successNotify('Configuration sauvegardée')
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const getConfig = async () => {
    try {
      configSuccess.value = false
      const result = await fetchGet(`config/get`)

      const response = await handleAppError(result)

      if (response.status === false) {
        if (response?.data) {
          configSuccess.value = true
          config.value = response.data
        }
      } else {
        configSuccess.value = false
      }
    } catch (err) {
      configSuccess.value = false
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const getSurveyConfig = async (survey_id:any) => {
    try {
      configSuccess.value = false
      const result = await fetchGet(`config/survey_config/${survey_id}`)

      const response = await handleAppError(result)

      if (response.status === false) {
        if (response?.data) {
          configSuccess.value = true
          config.value = response.data
        }
      } else {
        configSuccess.value = false
      }
    } catch (err) {
      configSuccess.value = false
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  return {
    storeHeaderConfig,
    errors,
    configSuccess,
    getConfig,
    getSurveyConfig,
    config,
  }
})
