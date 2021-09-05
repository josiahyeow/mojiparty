import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import Room from '../Room'
import RoomProvider from '../../providers/RoomProvider'

const RoomEntry = (props: any) => {
  const { roomName } = useParams<{ roomName: string }>()
  const playerName = props.location?.state?.playerName
  const playerEmoji = props.location?.state?.playerEmoji
  const roomPassword = props.location?.state?.roomPassword
  const player = { name: playerName, emoji: playerEmoji }
  const room = { name: roomName, password: roomPassword }

  if (roomName === 'secret-party') {
    const secretRoom = localStorage.getItem('secret-party')

    if (secretRoom) {
      const { room, player } = JSON.parse(secretRoom)
      return (
        <RoomProvider player={player} room={room}>
          <Room />
        </RoomProvider>
      )
    }
  }

  if (playerName && playerEmoji) {
    return (
      <RoomProvider player={player} room={room}>
        <Room />
      </RoomProvider>
    )
  } else {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { room: roomName, roomPassword },
        }}
      />
    )
  }
}

export default RoomEntry
