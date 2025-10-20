import { removeLocalStorage } from '@/utils/storage'

export const api = import.meta.env.VITE_API_URL
export const getToken = () => {
  const survey_mc_token = localStorage.getItem('survey_mc_token')
  const data = survey_mc_token !== null ? JSON.parse(survey_mc_token) : null
  return data?.token
}

export const get_account_type = () => {
  const account_type = localStorage.getItem('survey_mc_account_type')
  return account_type !== null ? JSON.parse(account_type) : 'personal'
}

export const get_account_id = () => {
  const account_id = localStorage.getItem('survey_mc_account_id')
  return account_id !== null ? JSON.parse(account_id) : ''
}

export async function customFetch(path, options) {
  const response = await fetch(`${api}/${path}`, options)
  if (response.status === 401) {
    removeLocalStorage('survey_mc_token')
    removeLocalStorage('survey_mc_account_type')
    removeLocalStorage('survey_mc_account_id')
    window.location.href = '/signin'
  }

  return response
}

export const fetchPost = async (path, body)=> {
  return customFetch(`${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'x-account-type': get_account_type(),
      'x-account-id': get_account_id(),
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
}
export const fetchGet = async (path) => {
  return customFetch(`${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'x-account-type': get_account_type(),
      'x-account-id': get_account_id(),
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
  })
}

export const fetchPut = async (path, body) => {
  return customFetch(`${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'x-account-type': get_account_type(),
      'x-account-id': get_account_id(),
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
}

export const fetchPatch = async (path, body) => {
  return customFetch(`${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'x-account-type': get_account_type(),
      'x-account-id': get_account_id(),
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
}

export const fetchDestroy = async (path) => {
  return customFetch(`${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'x-account-type': get_account_type(),
      'x-account-id': get_account_id(),
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
  })
}


export const fetchPutWithFile = async (path, body) => {
  return customFetch(`${path}`, {
    method: 'PUT',
    headers: {
      'x-account-type': get_account_type(),
      'x-account-id': get_account_id(),
      Authorization: `Bearer ${getToken()}`,
    },
    body: body,
  })
}