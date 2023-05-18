export const maskCurrency = (value: string | number): string => {
  const money =
    typeof value === 'string' ? Number(value.replace(/\D/g, '')) / 100 : value

  return money.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export const unMaskCurrency = (value: string): number => {
  return typeof value === 'number'
    ? value
    : Number(value.replace(/\D/g, '')) / 100
}

export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const maskCEP = (value: string): string => {
  return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})+?$/, '$1-$2')
}

export const maskCNPJ = (v: string): string => {
  v = v.replace(/\D/g, '')

  v = v.replace(/^(\d{2})(\d)/, '$1.$2')
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2')
  v = v.replace(/(\d{4})(\d)/, '$1-$2')

  return v
}

export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})(\d)/, '$1-$2')
}
