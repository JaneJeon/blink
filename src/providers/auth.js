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
    if (status === 401) {
      setUser()
      return Promise.reject()
    }
    return Promise.resolve()
  },
  checkAuth: async () => {
    if (getUser()) return
    const resp = await fetch('/api/user')
    if (!resp.ok) throw new Error('Unauthorized!')

    const user = await resp.json()
    setUser(user)
  },
  logout: () => {
    setUser()
    return Promise.resolve()
  },
  getIdentity: () => {
    const user = getUser()
    if (!user) return Promise.reject()
    else return Promise.resolve({ id: user.id, fullName: user.name })
  },
  getPermissions: params => Promise.resolve() // TODO:
}

export default authProvider
