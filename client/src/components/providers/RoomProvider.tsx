import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import socket from '../../utils/socket'
import { getRoomData } from '../../utils/api'
import { useHistory } from 'react-router-dom'

export interface RoomContextProps {
  playerId: string
  player: any
  room: any
  activeGame: any
  players: any
  settings: any
  error: any
}

export const RoomContext = React.createContext({})

const RoomProvider = ({ player: playerData, room, children }) => {
  const history = useHistory()
  const [activeGame, setActiveGame] = useState()
  const [player, setPlayer] = useState()
  const [players, setPlayers] = useState({})
  const [settings, setSettings] = useState()
  const [error, setError] = useState('')

  const playerKicked = (players) => {
    return !Object.keys(players).find(
      (key) => players[key].name === playerData.name
    )
  }

  useEffect(() => {
    ;(async () => {
      const response = await getRoomData(room.name)
      const data = await response.json()
      if (response.ok) {
        setPlayers(data.room.players)
        setSettings(data.room.settings)
        if (data.room.game) {
          setActiveGame(data.room.game)
        }
        socket.emit('player-joined', {
          room: { name: room.name, password: room.password },
          player: playerData,
        })
      } else {
        history.push(`/`)
      }
    })()

    return () => {
      ReactGA.event({
        category: 'Room',
        action: 'Left room',
        nonInteraction: true,
      })
      socket.emit('player-left', room.name, playerData)
    }
  }, [])

  useEffect(() => {
    socket.on('joined-room', (createdPlayer) => {
      setPlayer(createdPlayer)
    })
    socket.on('room-disconnected', ({ error }) => {
      ReactGA.event({
        category: 'Room',
        action: 'Error occurred',
        nonInteraction: true,
      })
      console.error(error)
      setError(`disconnected`)
      // setTimeout(() => history.push(`/`), 3000)
    })
    socket.on('error-message', (error) => {
      console.error(error)
      setError(error)
    })
    // In game listeners
    socket.on('room-update', ({ players, game }) => {
      if (playerKicked(players)) {
        setError('You have been kicked from the game')
      } else {
        setPlayers(players)
        setActiveGame(game)
        setError('')
      }
    })

    socket.on('settings-update', (settings) => {
      setSettings(settings)
    })

    return () => {
      socket.removeEventListener('joined-room')
      socket.removeEventListener('room-disconnected')
      socket.removeEventListener('room-update')
    }
  }, [])

  return (
    <RoomContext.Provider
      value={{
        player,
        players,
        room,
        activeGame,
        settings,
        error,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export default RoomProvider
