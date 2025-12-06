export function useValidationRules() {
  const emailRules = [(value: string) => {
    const regex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/g
    if (value.match(regex)) {
      return true
    }

    return 'Invalid email address.'
  }]

  const passwordRules = [(value: string) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if (value.match(regex)) {
      return true
    }

    return 'Password does not meet the required rules.'
  }]

  const nameRules = [(value: string) => {
    const regex = /^\w+$/
    if (value.match(regex) && value.length >= 4) {
      return true
    }

    return 'Name must be at least 4 characters long and contain only letters, numbers, and underscores.'
  }]

  return {
    emailRules,
    passwordRules,
    nameRules,
  }
}
