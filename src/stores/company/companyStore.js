import { fetchGet, fetchPost, fetchPut } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { successNotify } from '@/utils/notification'
import companyValidator from '@/validator/company'
import Swal from 'sweetalert2'
import { removeLocalStorage, setLocalStorage } from '@/utils/storage'
const { validateCreate, validateUpdate } = companyValidator()

export const companyStore = defineStore('company-store', () => {
  const errors = ref({})
  const search_errors = ref({})
  const companies = ref([])
  const companySuccess = ref(false)
  const company = ref('')
  const openModal = ref(false)

  let selectCompany = ref('')

  const getCompanies = async () => {
    try {
      const result = await fetchGet(`company/get`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          companies.value = response.data
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const getCompany = async (company_id) => {
    try {
      const result = await fetchGet(`company/show/${company_id}`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          company.value = response.data
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const createCompany = async (data) => {
    try {
      companySuccess.value = false
      errors.value = {}
      const schemaProject = validateCreate()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPost(`company/create`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          companySuccess.value = true
          companies.value.unshift(response.data)
          successNotify('Société créé')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const updateCompany = async (data) => {
    try {
      companySuccess.value = false
      errors.value = {}
      const schemaProject = validateUpdate()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPut(`company/update/${data_result.company_id}`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        if (response?.data) {
          companySuccess.value = true
          let company_index = companies.value.findIndex(
            (item) => item._id === data_result.company_id,
          )
          companies.value[company_index] = response.data
          successNotify('Société modifiée')
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const switchAccount = (type, company = null) => {
    let account_name = type == 'enterprise' ? company?.denomination : 'personnel'
    Swal.fire({
      title: 'Changer de compte',
      text: `Voulez-vous basculer vers le compte ${account_name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, basculer !',
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (type == 'enterprise') {
          setLocalStorage('survey_mc_account_type', 'enterprise')
          setLocalStorage('survey_mc_account_id', company._id)
        } else {
          removeLocalStorage('survey_mc_account_type')
          removeLocalStorage('survey_mc_account_id')
        }

        window.location.href = '/'
      }
    })
  }

  return {
    createCompany,
    updateCompany,
    errors,
    companies,
    companySuccess,
    search_errors,
    selectCompany,
    getCompanies,
    getCompany,
    company,
    openModal,
    switchAccount,
  }
})
