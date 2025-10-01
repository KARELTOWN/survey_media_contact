import moment from 'moment'
import { French } from 'flatpickr/dist/l10n/fr.js'
export const formatTimestampToDate = (data) => {
  if (data) {
    return moment(data).format('DD-MM-YYYY HH:mm:ss')
  }
  return ''
}
export const formatTO_DMY = (data) => {
  if (data) {
    return moment(data).format('DD-MM-YYYY')
  }
  return ''
}
export const flatpickrConfig = (option) => {
  return {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'l j F Y',
    locale: French,
    wrap: true,
    ...option,
  }
}

export const flatpickrTimeOnlyConfig = {
  enableTime: true,
  noCalendar: true,
  dateFormat: 'H:i',
  time_24hr: true,
  altInput: true,
  altFormat: 'H:i',
  locale: French,
  wrap: true,
}
