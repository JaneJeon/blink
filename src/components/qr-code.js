import QRCode from 'qrcode'
import { useState } from 'react'

export default function QRCodeDisplay({ link, size = 300 }) {
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  if (link)
    QRCode.toDataURL(link)
      .then(setDataUrl)
      .catch(err => setError(err.message))

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (dataUrl)
    return <img src={dataUrl} alt="QR Code" width={size} height={size} />
  return <></>
}
