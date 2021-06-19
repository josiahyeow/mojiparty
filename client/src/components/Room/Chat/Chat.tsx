import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import EmojiChat from './EmojiChat'
import emoji from '../../../utils/emoji'
import { Box, Input, Button } from '../../Styled/Styled'
import socket from '../../../utils/socket'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 1rem;
  height: 100%;
`
const SendContainer = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
`
const Messages = styled.div<{ short: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${({ short }) => (short ? '5em' : '20em')};
  overflow-x: hidden;
`

const MessageInput = styled(Input)`
  &:invalid {
    box-shadow: none;
  }
`

const Scroll = styled.div`
  overflow: auto;
  background-color: #fff;
  border-radius: 6px;
  padding: 1rem;
`

const Message = styled(motion.div)`
  margin: 0.5rem 0rem;
`

const Player = styled.span``

const PlayerName = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`

const Bubble = styled.span`
  background-color: #f1f4f7;
  border-radius: 1em;
  padding: 0.25em 0.75em;
  margin-left: 0.5rem;
`

const SystemBubble = styled.span`
  margin-left: 0.5em;
  font-style: italic;
  color: #474747;
`

const CorrectBubble = styled(Bubble)`
  background-color: #b0ffde;
  border: #00ff94 1px solid;
`

const Buttons = styled.div`
  display: flex;
`

const Spacer = styled.div`
  width: 0.5rem;
`

const Chat = ({ inGame }) => {
  const { room, player, players, activeGame } = useContext(
    RoomContext
  ) as RoomContextProps
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([] as any[])
  const [passed, setPassed] = useState(player?.pass ? player.pass : false)

  const guessed = player && players ? players[player.id]?.guessed : false

  const isDrawer = player?.id === activeGame?.drawer

  useEffect(() => {
    socket.on('new-chat-message', (message) =>
      setMessages((messages) => [...messages, message])
    )
  }, [])

  useEffect(() => {
    setPassed(false)
  }, [activeGame?.currentEmojiSet])

  const messagesEndRef = useRef<HTMLDivElement>(document.createElement('div'))
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(scrollToBottom, [messages])

  const sendMessage = (event) => {
    event.preventDefault()

    if (inGame) {
      ReactGA.event({
        category: 'Game',
        action: 'Sent guess',
      })
      socket.emit('send-game-message', { roomName: room.name, guess: message })
    } else {
      ReactGA.event({
        category: 'Lobby',
        action: 'Sent chat message',
      })
      socket.emit('send-chat-message', { roomName: room.name, message })
    }
    setMessage('')
  }

  const passEmojiSet = (event) => {
    event.preventDefault()
    ReactGA.event({
      category: 'Game',
      action: 'Passed emojiset',
    })
    setPassed(true)
    socket.emit('pass-emojiset', room.name)
  }

  const messageBubbles = useMemo(
    () =>
      messages.slice(Math.max(messages.length - 10, 0)).map(
        (message, index) =>
          message.player && (
            <Message
              key={index}
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0.6, opacity: 0 }}
            >
              <Player>{emoji(message.player.emoji)}</Player>
              {message.correct ? (
                <CorrectBubble>
                  <PlayerName>{message.player.name}:</PlayerName>
                  {message.text} ✔
                </CorrectBubble>
              ) : message.system ? (
                <SystemBubble>{emoji(message.text)}</SystemBubble>
              ) : (
                <Bubble>
                  <PlayerName>{message.player.name}:</PlayerName>
                  {emoji(message.text)}
                </Bubble>
              )}
            </Message>
          )
      ),
    [messages]
  )

  return (
    <Box>
      <Container>
        <Scroll id="messages">
          <Messages short={isDrawer}>
            {messageBubbles}
            <Message ref={messagesEndRef} />
          </Messages>
        </Scroll>
        {isDrawer ? (
          <EmojiChat roomName={room.name} />
        ) : (
          <SendContainer>
            <MessageInput
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
              }}
              data-testid={'chat-message-input'}
              disabled={passed || isDrawer}
              title={passed ? `You can't guess an emojiset you've passed` : ''}
              placeholder={player?.host ? 'Send / for a list of commands' : ''}
              required
            />
            <Buttons>
              <Button
                onClick={(event) => message && sendMessage(event)}
                data-testid={'chat-send-button'}
                disabled={passed}
              >
                {emoji('💬')} {inGame && !guessed ? 'Guess' : 'Send'}
              </Button>
              {inGame && (
                <>
                  <Spacer />
                  <Button
                    onClick={(event) => passEmojiSet(event)}
                    data-testid={'pass-emojiset-button'}
                    disabled={passed || guessed}
                  >
                    {emoji('🙅')} {passed ? 'Passed' : 'Pass'}
                  </Button>
                </>
              )}
            </Buttons>
          </SendContainer>
        )}
      </Container>
    </Box>
  )
}

export default Chat
