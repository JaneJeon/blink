import simpleRestProvider from 'ra-data-simple-rest'
import { fetchUtils } from 'react-admin'
import { injectAuthHeaders } from '../user-manager'

const fetchJson = (url, options = {}) => {
  options.headers = injectAuthHeaders(options.headers)
  return fetchUtils.fetchJson(url, options)
}

// Provide no base URL, because both the frontend and the backend should live in the same host.
export default simpleRestProvider('/api', fetchJson)
