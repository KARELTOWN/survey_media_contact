export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = (error) => reject(error)
  })
}

export const convertObjectUrlToBase64 = async (url) => {
  const response = await fetch(url)
  const blob = await response.blob()
  let base64 = await convertToBase64(blob)
  return base64
}

export const convertToTempURL = (data) => {
  return URL.createObjectURL(data)
}

export const getMimeType = (base64String) => {
  const match = base64String.match(/^data:(.+);base64,/)
  return match ? match[1] : null
}

export const getFileCategory = (file) => {
  const type = file.type

  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type === 'application/pdf') return 'pdf'
  if (type.includes('word')) return 'word'
  if (type.includes('excel')) return 'excel'
  if (type.includes('presentation')) return 'powerpoint'

  return 'other'
}

export const getFileCategoryFromMime = (mime) => {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf') return 'pdf'
  if (mime.includes('word')) return 'word'
  if (mime.includes('excel')) return 'excel'
  if (mime.includes('presentation')) return 'powerpoint'

  return 'other'
}

export function base64ToTempUrl(base64) {
  // Remove the prefix if present
  const [prefix, data] = base64.split(',')
  const mimeMatch = prefix.match(/data:(.*);base64/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream'

  const byteCharacters = atob(data)
  const byteArrays = []

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i))
  }

  const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType })
  return URL.createObjectURL(blob)
}

export function isFileSizeAllowed(file, maxMB = 10) {
  const maxBytes = maxMB * 1024 * 1024
  return file.size <= maxBytes
}

export const getFileType = (file) => {
  // file doit être en base 64
  let mimetype = getMimeType(file)
  if (mimetype !== null) {
    return getFileCategoryFromMime(mimetype)
  }
  return null
}
