// The SSO login page
import React from 'react'
import { Login } from 'react-admin'
import Button from '@material-ui/core/Button'

const LoginForm = () => {
  return (
    <Button variant="contained" color="primary" href="/login">
      Log in with SSO
    </Button>
  )
}

export default function LoginPage(props) {
  return <Login children={<LoginForm />} {...props} />
}
