export const setSurveyCookie = (survey_id:string) => {
  let cookie = document.cookie.split('; ').find((item) => item.startsWith(`survey_mc_${survey_id}`))
  if (!cookie) {
    let date = new Date()
    date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * 365)
    document.cookie = `survey_mc_${survey_id}; expires=${date.toUTCString()}; SameSite=None; Secure`
  }
  return true
}

export const getSurveyCookie = (survey_id:string) => {
  let cookie = document.cookie.split('; ').find((item) => item.startsWith(`survey_mc_${survey_id}`))
  if (!cookie) {
    return false
  }
  return true
}
