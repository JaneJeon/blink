import { getUser } from '../user-manager'

/* eslint-disable prefer-promise-reject-errors */
const authProvider = {
  checkError: ({ status }) => {
    // eslint-disable-next-line no-console
    return status === 401 || status === 403
      ? Promise.reject() // TODO: why the FUCK does RA does not redirect to login on 401???
      : Promise.resolve()
  },
  checkAuth: () => (getUser() ? Promise.resolve() : Promise.reject()),
  // logout: () => {
  //   return userManager.signoutRedirect()
  // },
  // getIdentity: getUser,
  getPermissions: params => Promise.resolve() // TODO:
}

export default authProvider
