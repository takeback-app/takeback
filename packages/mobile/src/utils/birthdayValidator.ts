import moment from 'moment'

export function isValidBirthDate(birthday: string) {
  const date = moment(birthday, 'DD/MM/YYYY')

  return (
    !date.isValid() ||
    moment().diff(date, 'years') < 14 ||
    date.isAfter(moment()) ||
    date.isBefore(moment().subtract(120, 'years'))
  )
}
