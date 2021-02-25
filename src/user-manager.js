import { UserManager, Log } from 'oidc-client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
Log.logger = console

export const userManager = new UserManager({
  authority: process.env.REACT_APP_OIDC_ISSUER,
  client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
  redirect_uri: `${window.location.origin}/app/login`,
  post_logout_redirect_uri: `${window.location.origin}/app/login`,
  response_type: 'code',
  scope: 'openid profile',
  automaticSilentRenew: true,
  revokeAccessTokenOnSignout: true
})

const USER_KEY = 'lynx-user'
export const getUser = () => {
  const user = JSON.parse(sessionStorage.getItem(USER_KEY) || '{}')
  return isEmpty(user) ? false : user
}
export const setUser = user => {
  if (!user || isEmpty(user)) sessionStorage.removeItem(USER_KEY)
  else {
    sessionStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: user.sub,
        role: get(user, process.env.REACT_APP_USER_ROLE),
        fullName: get(user, process.env.REACT_APP_USER_NAME_FIELD),
        token: user.id_token
        // TODO: avatar support? maybe?
      })
    )
  }
}

userManager.events.addUserLoaded(setUser)
userManager.events.addUserSignedOut(setUser)
userManager.events.addAccessTokenExpired(() => {
  // eslint-disable-next-line no-console
  console.log('Access token expired')
  setUser()
})

// Inject the OIDC id token JWT on every request
export const injectAuthHeaders = headers => {
  if (!headers) headers = new Headers({ Accept: 'application/json' })

  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${getUser().token}`)

  return headers
}
