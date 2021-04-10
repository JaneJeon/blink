import { useMemo } from 'react'
import { Admin, Resource, Layout, AppBar } from 'react-admin'
import { createBrowserHistory } from 'history'

import { createMuiTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import LinkIcon from '@material-ui/icons/Link'
import PeopleIcon from '@material-ui/icons/People'
import blue from '@material-ui/core/colors/blue'
import indigo from '@material-ui/core/colors/indigo'

import Loginpage from './pages/login-page'
import Shortener from './components/shortener'
import authProvider from './providers/auth'
import dataProvider from './providers/data'
import * as link from './resources/link'
import * as user from './resources/user'

import './App.css'

const CustomAppBar = props => {
  return (
    <AppBar {...props}>
      <span style={{ flex: 1 }} />
      <Shortener />
    </AppBar>
  )
}
const CustomLayout = props => <Layout {...props} appBar={CustomAppBar} />

// browser history (rendering on / instead of /#/)
const history = createBrowserHistory({ basename: '/app' })

export default function App() {
  // theme that changes to dark mode according to system settings
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: prefersDarkMode ? blue : indigo
        }
      }),
    [prefersDarkMode]
  )

  return (
    <Admin
      title="Blink Portal"
      loginPage={Loginpage}
      authProvider={authProvider}
      dataProvider={dataProvider}
      theme={theme}
      history={history}
      layout={CustomLayout}
    >
      {permissions => [
        <Resource
          name="links"
          options={{ label: 'Links' }}
          icon={LinkIcon}
          list={permissions.can('read', 'Link') ? link.List : null}
          show={permissions.can('read', 'Link') ? link.Show : null}
          edit={permissions.can('update', 'Link') ? link.Edit : null}
        />,
        <Resource
          name="users"
          options={{ label: 'Users' }}
          icon={PeopleIcon}
          list={permissions.can('read', 'User') ? user.List : null}
          show={permissions.can('read', 'User') ? user.Show : null}
          edit={permissions.can('update', 'User') ? user.Edit : null}
        />
      ]}
    </Admin>
  )
}
