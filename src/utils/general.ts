export const copyInClipInBoard = (data) => {
  navigator.clipboard.writeText(data)
}
export const socialShareLinks = {
  linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url=',
  whatsapp: 'https://api.whatsapp.com/send?text=',
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
  mail: 'mailto:?subject=',
}