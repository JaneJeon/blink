// Do NOT touch this unless if you know EXACTLY what you're doing.
// This is where all of react-admin's skeletons are buried.
// Below lies a finnicky, un-testable, flaky mess (not of my own fault) forced upon by the react-admin gods...

import policies from '../policies'

const getUser = () => {
  const str = localStorage.getItem('user')
  return !str || str === '{}' ? null : JSON.parse(str)
}
const setUser = user => {
  if (!user) localStorage.removeItem('user')
  else localStorage.setItem('user', JSON.stringify(user))
}

const getOrSetUser = async () => {
  let user = getUser()
  if (user) return user

  const resp = await fetch('/api/user')
  if (!resp.ok) throw new Error('Unauthorized')

  user = await resp.json()
  setUser(user)

  return user
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
  checkAuth: async () => {},
  logout: () => {
    setUser()
    return Promise.resolve()
  },
  getIdentity: () => {
    const user = getUser()
    if (!user) return Promise.reject()
    else return Promise.resolve({ id: user.id, fullName: user.name })
  },
  getPermissions: async () => {
    const user = await getOrSetUser()
    return policies(user)
  }
}

export default authProvider
