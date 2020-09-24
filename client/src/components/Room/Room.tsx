import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import emoji from '../../utils/emoji'
import { Box } from '../Styled/Styled'
import socket from '../../utils/socket'
import { getRoomData } from '../../utils/api'
import Lobby from './Lobby/Lobby'
import Game from './Game/Game'
import TooBigDialog from './TooBigDialog/TooBigDialog'

const Error = styled(Box)`
  background-color: #ffe0e4;
  margin: 1rem 0rem;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
`

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  max-width: 80em;
`

const Room = ({ roomName, player }) => {
  const history = useHistory()
  const [playerId, setPlayerId] = useState('')
  const [activeGame, setActiveGame] = useState(false)
  const [name, setName] = useState()
  const [players, setPlayers] = useState({})
  const [settings, setSettings] = useState()
  const [error, setError] = useState(false)

  useEffect(() => {
    ;(async () => {
      const response = await getRoomData(roomName)
      const data = await response.json()
      if (response.ok) {
        setName(data.room.name)
        setPlayers(data.room.players)
        setSettings(data.room.settings)
        if (data.room.game) {
          setActiveGame(data.room.game)
        }
        socket.emit('new-player', roomName, player)
      } else {
        history.push(`/`)
      }
    })()
    socket.on('joined-room', (playerId) => setPlayerId(playerId))
    socket.on('room-disconnected', async ({ error }) => {
      ReactGA.event({
        category: 'Room',
        action: 'Error occurred',
        nonInteraction: true,
      })
      setError(true)
      setTimeout(() => history.push(`/`), 3000)
    })
    // In game listeners
    socket.on('room-update', ({ players, game, settings }) => {
      setPlayers(players)
      setActiveGame(game)
      setSettings(settings)
    })
    return () => {
      ReactGA.event({
        category: 'Room',
        action: 'Left room',
        nonInteraction: true,
      })
      socket.emit('player-left', roomName, player)
    }
  }, [roomName, player])

  return (
    <>
      <TopBar>
        <TooBigDialog />
      </TopBar>
      {error && (
        <Error>
          {emoji('🤕🔌')} We've lost connection to the game. Taking you back
          home...
        </Error>
      )}
      {name && players && settings ? (
        activeGame ? (
          <Game
            roomName={name}
            playerId={playerId}
            players={players}
            activeGame={activeGame}
          />
        ) : (
          <Lobby
            roomName={name}
            playerId={playerId}
            players={players}
            settings={settings}
          />
        )
      ) : (
        <div>Loading room...</div>
      )}
    </>
  )
}

export default Room
