export const maskCPFCNPJ = (value: string): string => {
  value = value.replace(/\D/g, '')

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
  }

  return value
}

export const maskCPF = (value: string): string => {
  return value
    .slice(0, 14)
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export const maskCNPJ = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function maskPhone(value: string) {
  const match = value.replace(/\D/g, '').match(/^(\d{2})(\d{5})(\d{4})$/)

  if (!match) return null

  return `(${match[1]}) ${match[2]}-${match[3]}`
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

export const maskCurrency = (value: string): string => {
  return (Number(value.replace(/\D/g, '')) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export const unMaskCurrency = (value: string | number): number => {
  return typeof value === 'number'
    ? value
    : Number(value.replace(/\D/g, '')) / 100
}

export function unMaskCpf(string: string) {
  return string.replace(/[^\d]/g, '')
}
