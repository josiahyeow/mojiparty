import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import Countdown from 'react-countdown'
import socket from '../../../utils/socket'
import emoji from '../../../utils/emoji'
import { Box } from '../../Styled/Styled'
import Hint from './Hint/Hint'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'
import { Timer } from '../Game/Timer'

const Container = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 13em;
`

const Category = styled.span`
  text-align: center;
  padding: 0.2rem 0.4rem;
  margin: 0rem 1rem;
  margin-bottom: 1rem;
`

const SetContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 6px;
  padding: 1em;
  min-width: 26em;
  border: #050509 3px solid;
  box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1);
  @media (max-width: 600px) {
    min-width: fit-content;
  }
`

const Set = styled.span`
  text-align: center;
  font-size: 3rem;
`

const StyledCountdown = styled(Set)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  min-height: 3em;
`

const MessageText = styled.span`
  margin: 0em 1em;
`

const BlankEmojiSetText = styled.span`
  text-align: center;
  line-height: 3.5em;
`

const TimerHint = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`

const Round = styled(Box)`
  background-color: #fff;
  white-space: pre;
  justify-self: center;
  min-width: 3em;
  margin-bottom: 1em;
  text-align: center;
  font-weight: bold;
  background-color: #f1f4f7;
  margin-right: 1em;
`

const Message = ({ icon, message }) => (
  <>
    {emoji(`${icon}`)}
    <MessageText>{message}</MessageText>
    {emoji(`${icon}`)}
  </>
)

const EmojiSet = ({ gameEnd }) => {
  const {
    player,
    players,
    activeGame: {
      currentEmojiSet,
      previousEmojiSet,
      lastEvent,
      drawer = false,
      round,
    },
    settings: { rounds, timer },
  } = useContext(RoomContext) as RoomContextProps
  const [counter, setCounter] = useState(1)
  const [mojiSet, setMojiSet] = useState(currentEmojiSet.emojiSet)
  const isDrawer = player?.id === drawer
  const hasGuessed =
    players && player?.id ? players[player?.id]?.guessed : false

  useEffect(() => {
    setCounter((counter) => counter + 1)
  }, [lastEvent])

  useEffect(() => {
    socket.on('new-game-emoji', (updated) => setMojiSet(updated))
    setMojiSet(currentEmojiSet.emojiSet)
  }, [currentEmojiSet.emojiSet])

  const emojiSetElement = (
    <>
      <TimerHint>
        {rounds > 0 && (
          <Round>
            {round} / {rounds}
          </Round>
        )}
        <Hint
          value={
            isDrawer || hasGuessed
              ? currentEmojiSet.answer
              : currentEmojiSet.hint
          }
          noUpdate={isDrawer || hasGuessed}
          guessed={hasGuessed}
        />
        {timer > 0 && <Timer />}
      </TimerHint>
      <SetContainer>
        <Category>
          What <strong>{currentEmojiSet.category}</strong> is this?
        </Category>
        {mojiSet ? (
          <Set>{emoji(mojiSet)}</Set>
        ) : (
          <BlankEmojiSetText>The drawer is thinking...</BlankEmojiSetText>
        )}
      </SetContainer>
    </>
  )

  const gameOverElement = (
    <SetContainer>
      <StyledCountdown>
        <Message
          icon={`🏆${lastEvent.emoji}`}
          message={`${lastEvent.name} won!`}
        />
      </StyledCountdown>
    </SetContainer>
  )

  const renderer = ({ completed, seconds }) => {
    if (completed) {
      if (gameEnd) {
        return gameOverElement
      } else {
        return emojiSetElement
      }
    } else {
      if (
        lastEvent.type === 'correct' ||
        lastEvent.type === 'pass' ||
        lastEvent.type === 'start' ||
        lastEvent.type === 'round-end'
      ) {
        return (
          <>
            {previousEmojiSet.answer && (
              <Hint
                value={previousEmojiSet.answer}
                noUpdate={drawer}
                guessed={hasGuessed}
              />
            )}
            <SetContainer
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
            >
              <StyledCountdown>
                {lastEvent.type === 'correct' && (
                  <Message
                    icon={lastEvent.emoji}
                    message={`${lastEvent.name} guessed it!`}
                  />
                )}
                {lastEvent.type === 'pass' && (
                  <Message icon={'🙅'} message={`Emojiset passed`} />
                )}
                {lastEvent.type === 'start' && (
                  <Message icon={'🏁'} message={seconds} />
                )}
                {lastEvent.type === 'round-end' && (
                  <Message
                    icon={lastEvent.emoji}
                    message={`${lastEvent.name} is in the lead!`}
                  />
                )}
              </StyledCountdown>
            </SetContainer>
          </>
        )
      } else {
        if (gameEnd) {
          return gameOverElement
        } else {
          return emojiSetElement
        }
      }
    }
  }

  return (
    <Container>
      {lastEvent.type === 'updateEmojiSet' ? (
        emojiSetElement
      ) : (
        <Countdown date={Date.now() + 3000} renderer={renderer} key={counter} />
      )}
    </Container>
  )
}

export default EmojiSet
