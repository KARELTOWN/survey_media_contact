let db = null
export default function indexDBTransaction() {
  function initDB(tableList) {
    return new Promise((resolve, reject) => {
      const record_events_connection = indexedDB.open('survey_mc', 1)

      record_events_connection.onupgradeneeded = function () {
        db = record_events_connection.result
        for (const table of tableList) {
          if (!db.objectStoreNames.contains(table)) {
            db.createObjectStore(table)
          }
        }
      }

      record_events_connection.onerror = () => {
        reject(record_events_connection.error)
      }

      record_events_connection.onsuccess = () => {
        db = record_events_connection.result
        db.onversionchange = () => {
          db.close()
          alert('Database is outdated, please reload the page.')
        }
        resolve('Database initialized successfully')
      }

      record_events_connection.onblocked = () => {
        console.warn('Database open blocked by another connection.')
      }
    })
  }

  const getAllEvents = (table, account_id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, 'readonly')
      const store = transaction.objectStore(table)
      const request = store.openCursor()

      const events_data = []

      request.onsuccess = function (event) {
        const cursor = event.target.result
        if (cursor) {
          const value = cursor.value
          const key = cursor.key
          let keyParts = key.split('@')
          if (Array.isArray(keyParts) && keyParts.length == 2) {
            if (keyParts[1] === account_id) {
              events_data.push({ key: cursor.key, value: value })
            }
          }
          cursor.continue()
        } else {
          resolve(events_data)
        }
      }

      request.onerror = function () {
        reject(request.error)
      }
    })
  }

  const getEvents = (table, key) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, 'readonly')
      const store = transaction.objectStore(table)
      const request = store.get(key)

      request.onsuccess = function () {
        resolve(request.result || null)
      }

      request.onerror = function () {
        reject(request.error)
      }
    })
  }

  const saveEvents = (table, key, data) => {
    return new Promise((resolve, reject) => {
      if (!data) {
        return resolve('Nothing to save') // rien à enregistrer, on résout quand même
      }
      console.log('Saving to IndexedDB')

      const transaction = db.transaction(table, 'readwrite')
      const store = transaction.objectStore(table)
      const request = store.put(data, key)

      request.onsuccess = () => {
        resolve('Events saved successfully')
      }

      request.onerror = () => {
        console.error('Error saving events:', request.error)
        reject(request.error)
      }
    })
  }

  const deleteEventByKey = (table, key) => {
    return new Promise((resolve, reject) => {
      if (!key) {
        return resolve('Nothing to delete') // rien à supprimer
      }

      const transaction = db.transaction(table, 'readwrite')
      const store = transaction.objectStore(table)

      const request = store.delete(key)

      request.onsuccess = () => {
        resolve('Events delete')
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }
  return { initDB, deleteEventByKey, getEvents, saveEvents, getAllEvents }
}
