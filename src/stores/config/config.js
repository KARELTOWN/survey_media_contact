import { defineStore, storeToRefs } from 'pinia'
import { successNotify } from '@/utils/notification'
import { reactive, ref } from 'vue'
import { fetchGet, fetchPost } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import configValidator from '@/validator/config'
import { surveyDefaultThemes } from '../../config/theme'
const { validateHeaderConfig } = configValidator()

export const configStore = defineStore('config-store', () => {
  let errors = ref({})
  const config = ref({})
  const configSuccess = ref(false)
  const defaultThemeProperties = {
    header_bg_color: '',
    container_bg_color: '',
    header_text_color: '',
    container_bg_img: '',
    logo_url: '',
    banner_url: '',
    footer_text: '',
    show_footer_contact: false,
    footer_contact_name: '',
    footer_contact_email: '',
    footer_contact_phone: '',
    footer_contact_address: '',
    footer_contact_hours: '',
    footer_links: [],
    form_width: 'medium',
    form_alignment: 'center',
    form_spacing: 'normal',
    global_bg_color: '',
  }
  const themeProperties = ref({ ...defaultThemeProperties })
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

      const response = await handleAppError(result)
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

  const getSurveyConfig = async (survey_id) => {
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

  const chooseTheme = (id) => {
    let theme = surveyDefaultThemes.find((e) => e.id === parseInt(id))
    if (theme !== undefined) {
      themeProperties.value = { ...defaultThemeProperties, ...theme }
    }
    return true
  }

  const setThemeProperties = (theme = {}) => {
    themeProperties.value = {
      ...defaultThemeProperties,
      ...themeProperties.value,
      ...theme,
    }
  }

  const updateThemeProperty = (key, value) => {
    themeProperties.value = {
      ...themeProperties.value,
      [key]: value,
    }
  }

  return {
    storeHeaderConfig,
    errors,
    configSuccess,
    getConfig,
    getSurveyConfig,
    config,
    themeProperties,
    chooseTheme,
    setThemeProperties,
    updateThemeProperty,
  }
})
