export const getInitials = (fullName: string): string => {
  const [firstName, secondName] = fullName.split(' ')

  const firstInitial = firstName.substr(0, 1)
  const secondInitial = secondName?.substr(0, 1)

  const initials = `${firstInitial.toUpperCase()}${
    secondInitial !== undefined ? secondInitial.toUpperCase() : ''
  }`

  return initials
}
