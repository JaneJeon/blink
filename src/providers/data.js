import simpleRestProvider from 'ra-data-simple-rest'

// Provide no base URL, because both the frontend and the backend should live in the same host.
export default simpleRestProvider('/api')
