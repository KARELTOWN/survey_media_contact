import indexDBTransaction from '@/utils/indexDB'
import { toRaw } from 'vue'
const { getEvents, saveEvents } = indexDBTransaction()

export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return JSON.parse(data || 'null')
}

export const setIndexDBStorage = async (key: string, value: any) => {
  try {
    await saveEvents('survey_mc_forms', key, JSON.parse(JSON.stringify(toRaw(value))))
  } catch (err) {
    console.error('IndexedDB save failed ❌', err)
  }
}
export const getIndexDBStorage = async (key: string) => {
  try {
    return await getEvents('survey_mc_forms', key)
  } catch (err) {
    console.error('IndexedDB get failed ❌', err)
  }
}
