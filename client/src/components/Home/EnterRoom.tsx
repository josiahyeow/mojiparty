import React, { useState } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { create, roomExists } from '../../utils/api'
import { Box, Label, Input, Button, H2 } from '../Styled/Styled'
import EmojiPicker, { getRandomPlayerEmoji } from './EmojiPicker'

const Form = styled.form`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
`

const Player = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const Error = styled(Box)`
  border: none;
  background-color: #ffe0e4;
`

const EnterRoom: React.FC<{ room?: string; password?: string }> = ({
  room,
  password,
}) => {
  const history = useHistory()
  const [playerName, setPlayerName] = useState('')
  const [playerEmoji, setPlayerEmoji] = useState(getRandomPlayerEmoji())
  const [roomName, setRoomName] = useState(room || '')
  const [roomPassword, setRoomPassword] = useState(password || '')
  const [error, setError] = useState('')

  const handleSubmit = (action: 'create' | 'join') => {
    if (!playerName || !roomName) {
      setError('Please enter both your player and room name')
    } else {
      if (action === 'create') handlecreate()
      if (action === 'join') handleJoinRoom()
    }
  }

  const handlecreate = async () => {
    if (roomName.match(/[!@#$%^&*()-+_=/]/)) {
      setError(`Room name can't contain symbols`)
      return false
    }
    if (roomName.length > 16) {
      setError(`Room name can't be longer than 16 characters`)
      return false
    }
    const response = await create(roomName as string, roomPassword as string)
    ReactGA.event({
      category: 'Room',
      action: 'Created room',
    })
    if (response.ok) {
      handleJoinRoom(false)
    } else {
      setError(`Room ${roomName} already exists. Please choose another name.`)
    }
  }

  const handleJoinRoom = async (checkIfExist: boolean = true) => {
    if (playerName.length > 10) {
      setError(`Please choose a name that's less than 10 characters`)
      return false
    }
    let response
    if (checkIfExist) {
      response = await roomExists(roomName as string, roomPassword as string)
      ReactGA.event({
        category: 'Room',
        action: 'Joined room',
      })
    } else {
      response = { ok: true }
    }
    if (response.ok) {
      history.push(`/${roomName}`, {
        playerName,
        playerEmoji,
        roomPassword,
      })
    } else {
      if (response.status === 401) {
        setError(`Incorrect password for room ${roomName}`)
      }
      if (response.status === 404) {
        setError(`Could not find room ${roomName}`)
      }
    }
  }

  return (
    <Box>
      <Form>
        <H2>Play now</H2>
        {error && <Error>{error}</Error>}
        <Label htmlFor="playername-input">Player</Label>
        <Player>
          <EmojiPicker
            playerEmoji={playerEmoji}
            setPlayerEmoji={setPlayerEmoji}
          />
          <Input
            id="playername-input"
            value={playerName}
            placeholder="Enter your name"
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </Player>

        <Label htmlFor="roomname-input">Room</Label>
        <Input
          id="roomname-input"
          value={roomName}
          placeholder="Enter room name"
          onChange={(event) => setRoomName(event.target.value)}
        ></Input>
        {!room && (
          <Button
            id="create-room-button"
            type="button"
            onClick={() => handleSubmit('create')}
          >
            Create Room
          </Button>
        )}
        <Button
          id="join-room-button"
          type="button"
          onClick={() => handleSubmit('join')}
        >
          Join Room
        </Button>
      </Form>
    </Box>
  )
}

export default EnterRoom
