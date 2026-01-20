import indexDBTransaction from '@/utils/indexDB'
import { toRaw } from 'vue'
const { getEvents, saveEvents, deleteEventByKey, getAllEvents } = indexDBTransaction()

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}
export const getLocalStorage = (key) => {
  const data = localStorage.getItem(key)
  return JSON.parse(data || 'null')
}

export const setIndexDBStorage = async (key, value) => {
  try {
    await saveEvents('survey_mc_forms', key, JSON.parse(JSON.stringify(toRaw(value))))
  } catch (err) {
    console.error('IndexedDB save failed ❌', err)
  }
}
export const getIndexDBStorage = async (key) => {
  try {
    return await getEvents('survey_mc_forms', key)
  } catch (err) {
    console.error('IndexedDB get failed ❌', err)
  }
}

export const getAllDataInDBStorage = async (account_id) => {
  try {
    return await getAllEvents('survey_mc_forms', account_id)
  } catch (err) {
    console.error('IndexedDB get failed ❌', err)
  }
}

export const deleteIndexDBStorage = async (key) => {
  try {
    return await deleteEventByKey('survey_mc_forms', key)
  } catch (err) {
    console.error('IndexedDB delete failed ❌', err)
  }
}
