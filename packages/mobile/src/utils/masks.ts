import { dateFormat } from './DateFormat'

export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})(\d)/, '$1-$2')
}

export const maskCEP = (value: string): string => {
  return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})+?$/, '$1-$2')
}

export const maskDate = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1')
}

export const maskCurrency = (value: number): string => {
  return new Intl.NumberFormat('default', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function getFormattedDate(dateIso: string) {
  const date = new Date(dateIso)

  const now = new Date()

  const diff = Math.floor((date - now) / (1000 * 60 * 60 * 24))

  if (diff > 30) {
    return dateFormat(date)
  }

  if (diff > 0) {
    return diff === 1 ? 'Resta um dia' : `Restam ${diff} dias.`
  }

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return 'É hoje.'
  }

  return ''
}

export function remainingHours(date: string) {
  const currentDate = new Date()
  const inputDate = new Date(date)

  // Calcule a diferença entre a data atual e a data fornecida em milissegundos
  const diffInMs = inputDate.getTime() - currentDate.getTime()

  // Calcule as horas e minutos a partir da diferença em milissegundos
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)) - diffInDays * 24

  if (!diffInDays) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60)) - diffInHours * 60

    return `${diffInHours}h${diffInMinutes.toString().padStart(2, '0')}m`
  }

  // Formate a saída desejada usando o Moment.js
  return `${diffInDays}d${diffInHours}h`
}

export function percentageFormatter(value: string) {
  return `${(parseFloat(value) * 100).toFixed(0)}%`
}
