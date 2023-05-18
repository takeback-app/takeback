import moment from 'moment'

export const dateFormat = (date: string) => {
  return Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
    .format(new Date(date))
    .replace(/ de /gi, ' ')
    .replace('.', '')
    .toUpperCase()
}

export const onlyDateFormat = (date: string) => {
  return Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium'
  })
    .format(new Date(date))
    .replace(/ de /gi, ' ')
    .replace('.', '')
    .toUpperCase()
}

export const dateFormatSimple = (dateString: string, withHours = false) => {
  const date = new Date(dateString)

  const yesterday = moment().subtract(1, 'day').toDate()

  if (date.getFullYear() !== new Date().getFullYear()) {
    return Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })
      .format(date)
      .replace(/ de /gi, ' ')
      .replace('.', '')
  }

  if (date > yesterday) {
    const text = moment(date).calendar().split(' ')[0]

    if (!withHours) return text

    const hours = Intl.DateTimeFormat('pt-BR', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)

    return `${text} • ${hours}`
  }

  return Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    day: '2-digit'
  })
    .format(date)
    .replace(/ de /gi, ' ')
    .replace('.', '')
}
