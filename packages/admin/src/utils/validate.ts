const invalidCpfs = [
  '00000000000',
  '11111111111',
  '22222222222',
  '33333333333',
  '44444444444',
  '55555555555',
  '66666666666',
  '77777777777',
  '88888888888',
  '99999999999'
]

export function validCpf(cpf: string) {
  cpf = cpf.replace(/\D/g, '')

  if (!cpf || cpf.length !== 11 || invalidCpfs.includes(cpf)) {
    return false
  }

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) remainder = 0

  if (remainder !== parseInt(cpf.substring(9, 10))) return false

  sum = 0

  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) remainder = 0

  if (remainder !== parseInt(cpf.substring(10, 11))) return false

  return true
}

const invalidCnpjs = [
  '00000000000000',
  '11111111111111',
  '22222222222222',
  '33333333333333',
  '44444444444444',
  '55555555555555',
  '66666666666666',
  '77777777777777',
  '88888888888888',
  '99999999999999'
]

export function validCnpj(cnpj: string) {
  cnpj = cnpj.replace(/\D/g, '')

  if (!cnpj || cnpj.length !== 14 || invalidCnpjs.includes(cnpj)) {
    return false
  }

  let size = cnpj.length - 2

  const digits = cnpj.substring(size)
  let number = cnpj.substring(0, size)

  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += Number(number.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  if (result !== Number(digits.charAt(0))) return false

  size = size + 1
  number = cnpj.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += Number(number.charAt(size - i)) * pos--

    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return result === Number(digits.charAt(1))
}
