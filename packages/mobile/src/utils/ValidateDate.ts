export function validateDate(date: string): boolean {
  const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/
  if (date.match(reg)) {
    return true
  } else {
    return false
  }
}
