import React from 'react'
import { Admin, Resource, EditGuesser } from 'react-admin'
import { createBrowserHistory } from 'history'

import { createMuiTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import LinkIcon from '@material-ui/icons/Link'

import './App.css'

import LoginPage from './pages/SSOLogin'
import authProvider from './providers/auth'
import dataProvider from './providers/data'
import * as link from './resources/link'

// browser history (rendering on / instead of /#/)
const history = createBrowserHistory({ basename: '/app' })

export default function App() {
  // theme that changes to dark mode according to system settings
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light'
        }
      }),
    [prefersDarkMode]
  )

  return (
    <Admin
      title=""
      loginPage={LoginPage}
      authProvider={authProvider}
      dataProvider={dataProvider}
      theme={theme}
      history={history}
    >
      <Resource
        name="links"
        options={{ label: 'Links' }}
        icon={LinkIcon}
        list={link.List}
        show={link.Show}
        edit={EditGuesser}
      ></Resource>
    </Admin>
  )
}
