import QRCode from 'qrcode'
import { useState, useEffect } from 'react'

export default function QRCodeDisplay({ link }) {
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  // We can't just QRCode.toDataURL().then(setState).catch(setState)
  // because this component might be unmounted by then.
  useEffect(() => {
    let isMounted = true

    if (link)
      QRCode.toDataURL(link)
        .then(url => {
          if (isMounted) setDataUrl(url)
        })
        .catch(err => {
          if (isMounted) setError(err.message)
        })

    return () => {
      isMounted = false
    }
  }, [link])

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (dataUrl) return <img src={dataUrl} alt="QR Code" />
  return <></>
}
