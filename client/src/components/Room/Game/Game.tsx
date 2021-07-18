import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Grid, Left, Middle } from '../../Styled/Styled'
import PlayerList from '../PlayerList/PlayerList'
import EmojiSet from '../EmojiSet/EmojiSet'
import Chat from '../Chat/Chat'
import GameControls from '../GameControls/GameControls'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'

const GameSidebar = styled(Left)`
  grid-template-rows: 0.1fr auto;
  @media (max-width: 600px) {
    // display: none;
  }
`

const GameOver = styled(Middle)`
  grid-template-rows: 0.1fr auto;
`

const Game = () => {
  const { activeGame } = useContext(RoomContext) as RoomContextProps

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [])

  return (
    <Grid>
      <GameSidebar>
        <GameControls inGame={true} />
        {activeGame.winners ? (
          <Chat inGame={false} />
        ) : (
          <PlayerList inGame={true} />
        )}
      </GameSidebar>

      {activeGame.winners ? (
        <GameOver>
          <EmojiSet gameEnd={true} />
          <PlayerList inGame={true} />
        </GameOver>
      ) : (
        <Middle>
          <EmojiSet gameEnd={false} />
          <Chat inGame={true} />
        </Middle>
      )}
    </Grid>
  )
}

export default Game
