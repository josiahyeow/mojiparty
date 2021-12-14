import React, { useState } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { create, roomExists } from '../../utils/api'
import { Box, Label, Input, Button, H2 } from '../Styled/Styled'
import EmojiPicker, { getRandomPlayerEmoji } from './EmojiPicker'
import emoji from '../../utils/emoji'

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
      setError('Please enter both your player and party name')
    } else {
      if (action === 'create') handlecreate()
      if (action === 'join') handleJoinRoom()
    }
  }

  const handlecreate = async () => {
    if (roomName.match(/[!@#$%^&*()-+_=/]/)) {
      setError(`Party name can't contain symbols`)
      return false
    }
    if (roomName.length > 16) {
      setError(`Party name can't be longer than 16 characters`)
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
      handleJoinRoom()
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
        setError(`Could not find party ${roomName}`)
      }
    }
  }

  return (
    <Box>
      <Form>
        <H2>Play now</H2>
        {error && <Error>{error}</Error>}
        <Label htmlFor="playername-input">{emoji('🥳')} Player</Label>
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

        <Label htmlFor="roomname-input">{emoji('🎉')} Party name</Label>
        <Input
          id="roomname-input"
          value={roomName}
          placeholder="Enter party name"
          onChange={(event) => setRoomName(event.target.value)}
        ></Input>
        <Button
          id="create-room-button"
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            handleSubmit('create')
          }}
        >
          Join {!room && 'or Start'} Party
        </Button>
      </Form>
    </Box>
  )
}

export default EnterRoom
