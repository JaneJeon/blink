import { useState } from 'react'
import { useNotify } from 'react-admin'
import { withStyles, createStyles } from '@material-ui/core/styles'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { userManager } from '../user-manager'

const styles = ({ spacing }) =>
  createStyles({
    button: {
      width: '100%'
    },
    icon: {
      marginRight: spacing(1)
    }
  })

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const notify = useNotify()

  if (window.location.href.indexOf('?') >= 0) {
    setIsLoading(true)
    userManager
      .signinRedirectCallback()
      .then(() => {
        window.location.href = '/app'
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err)
        notify('Something went wrong during login. Please try again.')
      })
  }

  return (
    <CardActions>
      <Button
        variant="raised"
        type="submit"
        color="primary"
        onClick={async () => {
          await userManager.signinRedirect()
        }}
        disabled={isLoading}
      >
        {isLoading && <CircularProgress size={18} thickness={2} />}
        Login With SSO
      </Button>
    </CardActions>
  )
}

export default withStyles(styles)(LoginForm)
