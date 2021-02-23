import { Login } from 'react-admin'

import LoginForm from '../components/LoginForm'

const LoginPage = props => <Login {...props} children={<LoginForm />} />

export default LoginPage
