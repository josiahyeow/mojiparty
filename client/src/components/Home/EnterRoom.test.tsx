import { fireEvent, waitFor } from '@testing-library/dom'
import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { create, roomExists } from '../../utils/api'
import EnterRoom from './EnterRoom'

jest.mock('../../utils/api')

describe('EnterRoom', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('UI elements', () => {
    it('should show Player input field', () => {
      const { getByLabelText } = render(<EnterRoom />)
      expect(getByLabelText('Player'))
    })

    it('should show Room input field', () => {
      const { getByLabelText } = render(<EnterRoom />)
      expect(getByLabelText('Room'))
    })

    it('should show create room button', () => {
      const { getByText } = render(<EnterRoom />)
      expect(getByText('Create Room'))
    })

    it('should show join room button', () => {
      const { getByText } = render(<EnterRoom />)
      expect(getByText('Join Room'))
    })
  })

  it('should prefill room input and hide create room button if room is provided', () => {
    const { getByText, getByLabelText, queryByText } = render(
      <EnterRoom room={'foo'} />
    )
    expect(getByLabelText('Room')).toHaveValue('foo')
    expect(queryByText('Create Room')).toBeNull()
    expect(getByText('Join Room'))
  })

  it('should create new room and join it', async () => {
    ;(create as jest.Mock).mockResolvedValue({ ok: true })
    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <EnterRoom />
      </MemoryRouter>
    )

    await userEvent.type(getByLabelText('Player'), 'foo')
    await userEvent.type(getByLabelText('Room'), 'bar')
    userEvent.click(getByText('Create Room'))

    expect(create).toBeCalled()
    expect(roomExists).not.toBeCalled()
  })

  it('should join room', async () => {
    ;(roomExists as jest.Mock).mockResolvedValue({ ok: true })
    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <EnterRoom />
      </MemoryRouter>
    )
    await userEvent.type(getByLabelText('Player'), 'foo')
    await userEvent.type(getByLabelText('Room'), 'bar')
    fireEvent.click(getByText('Join Room'))
    expect(roomExists).toBeCalled()
  })

  describe('Error handling', () => {
    it('should show error message when player and/or Room is not filled in', () => {
      const { getByText } = render(<EnterRoom />)
      fireEvent.click(getByText('Create Room'))
      expect(getByText('Please enter both your player and room name'))
    })

    it('should show error message when creating a room that already exists', async () => {
      ;(create as jest.Mock).mockResolvedValue({ ok: false })
      const { getByText, getByLabelText } = render(
        <MemoryRouter>
          <EnterRoom />
        </MemoryRouter>
      )
      await act(async () => {
        await userEvent.type(getByLabelText('Player'), 'foo')
        await userEvent.type(getByLabelText('Room'), 'bar')
        fireEvent.click(getByText('Create Room'))
      })
      await waitFor(() =>
        expect(
          getByText('Room bar already exists. Please choose another name.')
        )
      )
    })

    it('should show error message when room to join doesnt exists', async () => {
      ;(roomExists as jest.Mock).mockResolvedValue({ ok: false, status: 404 })
      const { getByText, getByLabelText } = render(
        <MemoryRouter>
          <EnterRoom />
        </MemoryRouter>
      )
      await act(async () => {
        await userEvent.type(getByLabelText('Player'), 'foo')
        await userEvent.type(getByLabelText('Room'), 'bar')
        fireEvent.click(getByText('Join Room'))
      })
      await waitFor(() => expect(getByText('Could not find room bar')))
    })
  })
})
