import React, { useContext } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { escape } from 'html-escaper'
import { Box, H3 } from '../../Styled/Styled'
import emoji from '../../../utils/emoji'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`

const Row = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  align-items: center;
`

const Ranking = styled.span`
  font-weight: bold;
  margin-right: 1rem;
`

const Players = styled.div<{ inGame: boolean }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: ${({ inGame }) =>
    inGame ? '1fr' : 'repeat(auto-fill,minmax(6rem, 1fr))'};
  max-height: 33.05em;
  overflow-y: ${({ inGame }) => (inGame ? 'auto' : 'hidden')};
  overflow-x: hidden;
`

const Player = styled(motion.div)<{ inGame: boolean; currentPlayer: boolean }>`
  ${({ inGame }) => inGame && 'flex-grow: 1'};
  display: flex;
  align-items: center;
  justify-content: ${({ inGame }) => (inGame ? 'space-between' : 'center')};
  flex-direction: ${({ inGame }) => (inGame ? 'row' : 'column')};
  padding: 0.5rem;
  margin: 0em 1em 1em 0em;
  background: #ffffff;
  border-radius: 6px;
  font-weight: bold;
  ${({ inGame }) => !inGame && 'min-height: 6em;'};
  min-width: 5rem;
  border: #050509 3px solid;
  box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1);
  ${({ currentPlayer }) =>
    currentPlayer &&
    'border: #ffcc4d 3px solid; box-shadow: 5px 5px 0px 0px rgba(255,204,77, 1);'};
`

const Emoji = styled.div`
  padding: 0.5rem;
  font-size: 2rem;
`

const Score = styled.div`
  background-color: #f1f4f7;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 6px;
`

const Name = styled.div`
  padding: 0.5rem;
  margin: 0 0.1em 0 0.1em;
`

const Host = styled.span``

const Pass = styled.span`
  font-weight: 400;
  color: #929292;
  margin-left: 0.5rem;
`

const PlayerList = ({ inGame }) => {
  const { player, players, activeGame } = useContext(
    RoomContext
  ) as RoomContextProps

  if (!players) {
    return <div>loading...</div>
  }

  const compare = (a, b) => {
    if (players[a].score > players[b].score) return -1
    if (players[b].score > players[a].score) return 1
    return 0
  }

  const playerList = Object.keys(players)
  const lotsOfPlayers = playerList.length > 20

  return (
    <Box>
      <Container>
        <H3>{inGame ? 'Leaderboard' : 'Players'}</H3>
        <Players inGame={inGame}>
          {/* <AnimatePresence> */}
          {lotsOfPlayers && activeGame?.top5
            ? activeGame.top5.map((leader, index) => (
                <PlayerRow
                  value={leader}
                  index={index}
                  inGame={inGame}
                  playerId={player?.id}
                  lotsOfPlayers={lotsOfPlayers}
                  activeGame={activeGame}
                />
              ))
            : playerList
                .sort(compare)
                .slice(Math.max(playerList.length - 20, 0))
                .map((key, index) => (
                  <PlayerRow
                    value={players[key]}
                    index={index}
                    inGame={inGame}
                    playerId={player?.id}
                    lotsOfPlayers={lotsOfPlayers}
                    activeGame={activeGame}
                  />
                ))}
          {lotsOfPlayers && (
            <Row>
              <Player inGame={inGame} currentPlayer={false}>
                +{playerList.length - 5}
              </Player>
            </Row>
          )}
          {/* </AnimatePresence> */}
        </Players>
      </Container>
    </Box>
  )
}

const PlayerRow = ({
  value,
  index,
  inGame,
  playerId,
  lotsOfPlayers,
  activeGame,
}) => (
  <Row key={value.id}>
    {inGame && <Ranking>#{index + 1}</Ranking>}

    <Player
      key={value.id}
      inGame={inGame}
      currentPlayer={value.id === playerId}
      animate={inGame || lotsOfPlayers ? undefined : { scale: 1, opacity: 1 }}
      initial={inGame || lotsOfPlayers ? undefined : { scale: 0, opacity: 0 }}
      exit={inGame || lotsOfPlayers ? undefined : { scale: 0, opacity: 0 }}
    >
      {!inGame && value.host && <Host>{emoji('👑')}</Host>}
      <Emoji>
        {value.pass
          ? emoji('🙅')
          : value.drawer
          ? emoji('✏')
          : emoji(value.emoji)}
      </Emoji>
      <Name>
        {escape(value.name)}
        {value.pass && <Pass>(Pass)</Pass>}
      </Name>
      {inGame && (
        <Score>
          {value.score.toFixed(0)}{' '}
          {activeGame.round ? null : `/${activeGame?.scoreLimit}`}
        </Score>
      )}
    </Player>
  </Row>
)

export default PlayerList
