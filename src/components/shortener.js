import { Fragment, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import pick from 'lodash/pick'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import FileCopyIcon from '@material-ui/icons/FileCopy'

const RequestStateEnum = Object.freeze({
  READY: 0,
  WAITING: 1
})

export default function LinkShortener() {
  const [open, setOpen] = useState(false)
  const [requestState, setRequestState] = useState(RequestStateEnum.READY)
  const [link, setLink] = useState({
    hash: '',
    originalUrl: '',
    shortenedUrl: '',
    brandedUrl: ''
  })
  const [error, setError] = useState('')
  // TODO: form validation
  // TODO: logic about whether you're allowed to set/change hash

  async function shortenLink(e) {
    e.preventDefault()
    if (requestState !== RequestStateEnum.READY) return

    setRequestState(RequestStateEnum.WAITING)
    const linkBody = link.hash
      ? pick(link, ['originalUrl', 'hash'])
      : pick(link, ['originalUrl'])

    try {
      const result = await fetch('/api/links', {
        method: 'POST',
        body: JSON.stringify(linkBody)
      })
      const { shortenedUrl, brandedUrl } = await result.json()

      setLink({ ...link, shortenedUrl, brandedUrl })
      setError('')
    } catch (err) {
      const errText = await err.text()
      const { message } = JSON.parse(errText) // see app.js for error format
      setError(message)
    } finally {
      setRequestState(RequestStateEnum.READY)
    }
  }

  return (
    <Fragment>
      <IconButton
        aria-label="add"
        color="primary"
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
        fullWidth="60vw"
      >
        <DialogTitle id="form-dialog-title">Shorten Link</DialogTitle>

        <DialogContent>
          <form onSubmit={shortenLink}>
            <TextField
              autoFocus
              label="Paste link to shorten"
              placeholder="example.com"
              onChange={originalUrl => setLink({ ...link, originalUrl })}
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="shorten"
                    color="primary"
                    disabled={requestState !== RequestStateEnum.READY}
                    type="submit"
                  >
                    <SearchIcon />
                  </IconButton>
                )
              }}
            ></TextField>
            <TextField
              label="Custom URL"
              placeholder="awesome-link"
              onChange={hash => setLink({ ...link, hash })}
              error={!!error}
              // TODO: clean up this fucking hack
              style={{ marginTop: '2rem', paddingBottom: '1rem' }}
              InputProps={{
                startAdornment: (
                  <p style={{ display: 'inline' }}>
                    {process.env.REACT_APP_BASE_URL}/
                  </p>
                ),
                endAdornment: (
                  <CopyToClipboard text={link.brandedUrl || link.shortenedUrl}>
                    <IconButton
                      aria-label="copy link"
                      color="secondary"
                      disabled={requestState !== RequestStateEnum.WAITING}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </CopyToClipboard>
                )
              }}
            ></TextField>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
