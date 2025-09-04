export const api: string = import.meta.env.VITE_API_URL
export const getToken = () => {
  const survey_mc_token = localStorage.getItem('survey_mc_token')
  const data = survey_mc_token !== null ? JSON.parse(survey_mc_token) : null
  return data?.token
}
interface BodyData {
  [key: string]: unknown
}

export async function customFetch(path: string, options: RequestInit): Promise<Response> {
  const response = await fetch(`${api}/${path}`, options)
  if (response.status === 401) {
    localStorage.removeItem('survey_mc_token')
    window.location.href = '/signin'
  }

  return response
}

export const fetchPost = async (path: string, body: BodyData): Promise<Response> => {
  return customFetch(`${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
}

export const fetchGet = async (path: string): Promise<Response> => {
  return customFetch(`${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
  })
}

export const fetchPut = async (path: string, body: BodyData): Promise<Response> => {
  return customFetch(`${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
}

export const fetchPatch = async (path: string, body: BodyData): Promise<Response> => {
  return customFetch(`${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
}

export const fetchDestroy = async (path: string): Promise<Response> => {
  return customFetch(`${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
  })
}
