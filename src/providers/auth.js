/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable prefer-promise-reject-errors */
export default {
  // authentication
  checkError: ({ status }) => {
    return status === 401 || status === 403
      ? Promise.reject()
      : Promise.resolve()
  },
  logout: () => {
    window.location.href = '/logout'
  },
  getIdentity: async () => {
    return Promise.resolve()

    // eslint-disable-next-line no-unreachable
    const res = await fetch('/api/user')
    const data = await res.json()

    return {
      id: data.id,
      fullName: data.name
      //   avatar: 'TODO:'
    }
  },
  // authorization
  getPermissions: params => Promise.resolve(), // TODO:
  checkAuth: () => Promise.resolve()
}
