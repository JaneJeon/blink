export default function LoginPage() {
  window.location.href = process.env.REACT_APP_BASE_URL + '/auth/login'

  return <div>Redirecting...</div>
}
