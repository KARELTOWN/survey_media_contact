import { fetchGet, fetchPost } from '@/composables/request'
import { handleAppError, handleCatchError } from '@/utils/handleAppError'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import userValidator from '@/validator/user'
import { successNotify } from '@/utils/notification'
import { removeLocalStorage } from '@/utils/storage'
const { validateInviteUser } = userValidator()
export const userStore = defineStore('user-store', () => {
  const errors = ref({})
  const search_errors = ref({})
  const users = ref([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(15)
  const totalPages = ref(0)
  const userSuccess = ref(false)
  const search_form = reactive({
    search: '',
    start_date: '',
    end_date: '',
    status: '',
  })
  const directions = ref([])
  const fonctions = ref([])
  const roles = ref([])

  const selectUser = ref('')
  const openModal = ref(false)

  const updatePagination = (action) => {
    if (action === 'add') {
      total.value += 1
    } else {
      total.value -= 1
    }
    totalPages.value = Math.ceil(total.value / limit.value)
  }

  const getUsers = async () => {
    try {
      const result = await fetchGet(`users/get?limit=${limit.value}&page=${page.value}`)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          users.value = response.data.users
          total.value = response.data.total
          page.value = response.data.page
          limit.value = response.data.limit
          totalPages.value = response.data.totalPages
          console.log('response.data', response.data)
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const acceptInvitation = async (data) => {
    try {
      errors.value = {}
      userSuccess.value = false
      const result = await fetchPost(`users/accept_invitation`, data)
      const response = await handleAppError(result)

      if (response.status === false) {
        userSuccess.value = true
        successNotify('Invitation acceptée')
      } else {
        if (response.errors) {
          errors.value = response.errors
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const retireUserFromCompany = async (data) => {
    try {
      errors.value = {}
      userSuccess.value = false
      const result = await fetchPost(`users/retire_user_from_company`, data)
      const response = await handleAppError(result)
      if (response.status === false) {
        userSuccess.value = true
        successNotify('Status changé')
        let index = users.value.findIndex((item) => item._id === data.user_company)
        users.value.splice(index, 1)
        updatePagination('add')
        console.log('DSFSFFSFSF')
                console.log('DSFSFFSFSF', response?.data)

        if (response?.data && response?.data?.self === true) {
          removeLocalStorage('survey_mc_account_type')
          removeLocalStorage('survey_mc_account_id')
          window.location.href = '/'
        }
      } else {
        if (response.errors) {
          errors.value = response.errors
        }
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  const filterUsers = async (data) => {
    try {
      search_errors.value = {}
      const result = await fetchPost(`users/filter?limit=${limit.value}&page=${page.value}`, data)
      const response = await handleAppError(result)
      if (response.status === false) {
        if (response?.data) {
          users.value = response.data.users
          total.value = response.data.total
          page.value = response.data.page
          limit.value = response.data.limit
          totalPages.value = response.data.totalPages
        }
      } else {
        if (response.errors) {
          search_errors.value = response.errors
        }
      }
    } catch (err) {
      handleCatchError(err)
    }
  }

  const inviteUser = async (data) => {
    try {
      userSuccess.value = false
      errors.value = {}
      const schemaProject = validateInviteUser()
      const data_result = await schemaProject.validate(data, { abortEarly: false })
      const result = await fetchPost(`users/add_company`, data_result)
      const response = await handleAppError(result)
      if (response.status === true) {
        if (response.errors) {
          errors.value = response.errors
        }
      } else {
        userSuccess.value = true
        successNotify('Invitation envoyée')
      }
    } catch (err) {
      const result = handleCatchError(err)
      if (result) {
        errors.value = result
      }
    }
  }

  return {
    inviteUser,
    getUsers,
    errors,
    users,
    total,
    page,
    limit,
    totalPages,
    userSuccess,
    filterUsers,
    search_errors,
    search_form,
    selectUser,
    openModal,
    retireUserFromCompany,
    directions,
    fonctions,
    roles,
    acceptInvitation,
  }
})
