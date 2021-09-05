import React, { useState, useContext } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import emoji from '.././../../utils/emoji'
import { H3, Box, Button } from '../../Styled/Styled'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'
import copy from 'copy-to-clipboard'

const Details = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 1em;
`

const Address = styled.div`
  display: grid;
  grid-gap: 1em;
`

const RoomDetails = () => {
  const { room, player } = useContext(RoomContext) as RoomContextProps
  const [copySuccess, setCopySuccess] = useState('💌 Invite to party')
  const [isPartyNameHidden, setIsPartyNameHidden] = useState(false)

  async function copyToClipboard(e) {
    ReactGA.event({
      category: 'Lobby',
      action: 'Copy room URL',
    })

    copy(`${window.location.origin}/${room.name}`)

    setCopySuccess('✅ Link copied!')
    await new Promise((resolve) => setTimeout(() => resolve(true), 2000))
    setCopySuccess('📋 Invite')
  }

  function hidePartyName() {
    ReactGA.event({
      category: 'Lobby',
      action: 'Hide party name',
    })

    if (isPartyNameHidden) {
      window.history.pushState('room', 'mojiparty', room.name)
      localStorage.removeItem('secret-party')
      setIsPartyNameHidden(false)
      return
    }

    localStorage.setItem('secret-party', JSON.stringify({ room, player }))
    window.history.pushState('room', 'mojiparty', '/secret-party')
    setIsPartyNameHidden(true)
  }

  return (
    <Box>
      <H3>Party controls</H3>
      <Details>
        <Address>
          <Button onClick={copyToClipboard}>{emoji(copySuccess)}</Button>
          <Button onClick={hidePartyName}>
            {isPartyNameHidden
              ? emoji('🧐 Show party name')
              : emoji('🤫 Hide party name')}
          </Button>
        </Address>
      </Details>
    </Box>
  )
}

export default RoomDetails
