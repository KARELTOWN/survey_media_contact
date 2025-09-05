export const convertToBase64 = (file: File | Blob): Promise<string>=> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = (error) => reject(error)
  })
}

export const convertObjectUrlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url)
  const blob = await response.blob()
  let base64 = await convertToBase64(blob)
  return base64
}


export const convertToTempURL = (data)=> {
  return URL.createObjectURL(data)
}