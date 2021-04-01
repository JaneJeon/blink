const getUser = () => {
  const str = localStorage.getItem('user')
  return !str || str === '{}' ? null : JSON.parse(str)
}
const setUser = user => {
  if (!user) localStorage.removeItem('user')
  else localStorage.setItem('user', JSON.stringify(user))
}

/* eslint-disable prefer-promise-reject-errors */
const authProvider = {
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      setUser()
      return Promise.reject({ redirectTo: '/auth/login' }) // TODO: make sure this redirects to backend
    }
    return Promise.resolve()
  },
  checkAuth: () =>
    getUser()
      ? Promise.resolve()
      : Promise.reject({ redirectTo: '/auth/login' }),
  logout: () => {
    setUser()
    return Promise.resolve()
  },
  getIdentity: () => {
    const { id, name: fullName } = getUser()
    return Promise.resolve({ id, fullName })
  },
  getPermissions: params => Promise.resolve() // TODO:
}

export default authProvider
