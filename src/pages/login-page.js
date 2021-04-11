import { useMemo, useRef, useEffect } from 'react'
import classnames from 'classnames'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme, makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import LockIcon from '@material-ui/icons/Lock'

const useStyles = makeStyles(
  theme => ({
    main: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      height: '1px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundImage:
        'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)'
    },
    card: {
      minWidth: 300,
      minHeight: 200,
      marginTop: '6em'
    },
    avatar: {
      margin: '1em',
      display: 'flex',
      justifyContent: 'center'
    },
    icon: {
      backgroundColor: theme.palette.secondary[500]
    },
    button: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 70
    }
  }),
  { name: 'RaLogin' }
)

export default function LoginPage({ theme, className }) {
  const backgroundImage = 'https://source.unsplash.com/random/1920x1080/daily'

  const classes = useStyles({ theme })
  const muiTheme = useMemo(() => createMuiTheme(theme), [theme])
  let backgroundImageLoaded = false
  const containerRef = useRef()

  const updateBackgroundImage = () => {
    if (!backgroundImageLoaded && containerRef.current) {
      containerRef.current.style.backgroundImage = `url(${backgroundImage})`
      backgroundImageLoaded = true
    }
  }

  // Load background image asynchronously to speed up time to interactive
  const lazyLoadBackgroundImage = () => {
    if (backgroundImage) {
      const img = new Image()
      img.onload = updateBackgroundImage
      img.src = backgroundImage
    }
  }

  useEffect(() => {
    if (!backgroundImageLoaded) {
      lazyLoadBackgroundImage()
    }
  })

  return (
    <ThemeProvider theme={muiTheme}>
      <div className={classnames(classes.main, className)} ref={containerRef}>
        <Card className={classes.card}>
          <div className={classes.avatar}>
            <Avatar className={classes.icon}>
              <LockIcon />
            </Avatar>
          </div>
          <div className={classes.button}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                window.location.href =
                  process.env.REACT_APP_BASE_URL + '/auth/login'
              }}
            >
              Login with SSO
            </Button>
          </div>
        </Card>
      </div>
    </ThemeProvider>
  )
}
