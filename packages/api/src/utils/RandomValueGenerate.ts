export function generateRandomNumber(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

export function generateCode(digits = 6) {
  const base = Math.pow(10, digits - 1)

  return Math.floor(base + Math.random() * 9 * base)
}
