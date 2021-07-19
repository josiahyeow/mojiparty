import React, { useContext, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import emoji from '../../utils/emoji'
import { MotionBox } from '../Styled/Styled'
import Lobby from './Lobby/Lobby'
import Game from './Game/Game'
import TooBigDialog from './TooBigDialog/TooBigDialog'
import { RoomContext, RoomContextProps } from '../providers/RoomProvider'

const Message = styled(MotionBox)`
  background-color: #e0fff8;
  margin: 1rem 0rem;
  padding: 1rem;
  text-align: center;
`

const Error = styled(MotionBox)`
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

const Room = () => {
  const { error, room, player, players, activeGame } = useContext(
    RoomContext
  ) as RoomContextProps

  const isHost = players ? players[player?.id]?.host : player?.host

  useEffect(() => {
    if (error === 'disconnected') {
      window.location.reload()
    }
  }, [error])

  const inGameHostMessage = useMemo(() => {
    if (isHost) {
      return (
        <Message
          animate={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0, opacity: 0 }}
        >
          {emoji('👑')} You are the <strong>game host</strong>. You can return
          everyone <strong>back to the lobby</strong> if needed. If you leave, a
          new host will be assigned.
          {emoji('👑')}
        </Message>
      )
    }
  }, [isHost])

  const lobbyHostMessage = useMemo(() => {
    if (isHost) {
      return (
        <Message
          animate={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0, opacity: 0 }}
        >
          {emoji('👑')} You are the <strong>game host</strong>. You can{' '}
          <strong>change the game settings</strong> and{' '}
          <strong>start the game</strong>. If you leave, a new host will be
          assigned.{emoji('👑')}
        </Message>
      )
    }
  }, [isHost])

  return (
    <>
      <TopBar>
        {/* {useMemo(
          () => (
            <TooBigDialog />
          ),
          []
        )} */}
      </TopBar>
      {error && <Error>{error}</Error>}
      {room.name ? (
        activeGame ? (
          <>
            {inGameHostMessage}
            <Game />
          </>
        ) : (
          <>
            {lobbyHostMessage}
            <Lobby />
          </>
        )
      ) : (
        <div>Loading room...</div>
      )}
    </>
  )
}

export default Room
