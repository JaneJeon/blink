import * as redux from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Shortener from './shortener'

describe('Shortener component', () => {
  beforeEach(() => {
    fetch.resetMocks()
    const spy = jest.spyOn(redux, 'useDispatch')
    spy.mockReturnValue(() => {})
  })

  test('Shorten with no hash/button activation', async () => {
    const HASH = 'foobar'
    fetch.once(JSON.stringify({ shortenedUrl: `shortened.com/${HASH}` }))

    render(<Shortener />)
    userEvent.click(screen.getByTestId('open-button'))

    // Buttons should be disabled until url is pasted
    // expect(screen.getByTestId('shorten-button')).toBeDisabled()
    expect(screen.getByTestId('copy-button')).toBeDisabled()

    userEvent.type(screen.getByTestId('originalUrl-field'), 'nodejs.org')

    // Shorten button should be enabled but not the copy button
    expect(screen.getByTestId('shorten-button')).toBeEnabled()
    expect(screen.getByTestId('copy-button')).toBeDisabled()

    userEvent.click(screen.getByTestId('shorten-button'))

    // Disable shorten button while it's awaiting request
    expect(screen.getByTestId('shorten-button')).toBeDisabled()

    await screen.findByPlaceholderText(HASH)

    expect(screen.getByTestId('copy-button')).toBeEnabled()
    // expect(screen.getByTestId('copy-clipboard')).toHaveValue()
  })

  test('Shorten with custom hash', async () => {
    const HASH = 'foobar'
    const CUSTOM_HASH = 'asdfjkl'
    fetch.once(
      JSON.stringify({
        shortenedUrl: `shortened.com/${HASH}`,
        brandedUrl: `shortened.com/${CUSTOM_HASH}`
      })
    )

    render(<Shortener />)
    userEvent.click(screen.getByTestId('open-button'))

    userEvent.type(screen.getByTestId('originalUrl-field'), 'nodejs.org')
    userEvent.type(screen.getByTestId('hash-field'), CUSTOM_HASH)
    userEvent.click(screen.getByTestId('shorten-button'))

    await screen.findByDisplayValue(CUSTOM_HASH)
  })

  test('Handle errors', async () => {
    fetch.mockRejectOnce(new Error('Error Message!'))

    render(<Shortener />)
    userEvent.click(screen.getByTestId('open-button'))

    userEvent.type(screen.getByTestId('originalUrl-field'), 'nodejs.org')
    userEvent.click(screen.getByTestId('shorten-button'))

    await screen.findByText('Error Message!')

    expect(screen.getByTestId('copy-button')).toBeDisabled()
  })
})
