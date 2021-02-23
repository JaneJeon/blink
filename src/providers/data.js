import simpleRestProvider from 'ra-data-simple-rest'
import { fetchUtils } from 'react-admin'
import { getUser } from '../user-manager'

// Inject the OIDC id token JWT on every request
const fetchJson = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' })
  }

  // add your own headers here
  options.headers.set('Authorization', `Bearer ${getUser().token}`)
  return fetchUtils.fetchJson(url, options)
}

// Provide no base URL, because both the frontend and the backend should live in the same host.
export default simpleRestProvider('/api', fetchJson)
