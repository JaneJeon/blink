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
      return Promise.reject()
    }
    return Promise.resolve()
  },
  checkAuth: async () => {
    if (getUser()) return
    const resp = await fetch('/api/user')
    const user = await resp.json()
    setUser(user)
  },
  logout: () => {
    setUser()
    return Promise.resolve()
  },
  // getIdentity: () => {
  //   const user = getUser()
  //   return user
  //     ? Promise.resolve({ id: user.id, fullName: user.name })
  //     : Promise.reject()
  // },
  getPermissions: params => Promise.resolve() // TODO:
}

export default authProvider
