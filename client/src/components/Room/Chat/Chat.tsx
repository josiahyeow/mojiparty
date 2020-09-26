import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import emoji from '../../../utils/emoji'
import { Box, Input, Button } from '../../Styled/Styled'
import socket from '../../../utils/socket'

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
const Messages = styled.div`
  display: flex;
  flex-direction: column;
  height: 17.53em;
  overflow-x: hidden;
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

const Chat = ({ roomName, inGame, answer, players }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([] as any[])
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    socket.on('new-chat-message', (message) =>
      setMessages((messages) => [...messages, message])
    )
  }, [])

  useEffect(() => {
    setPassed(false)
  }, [answer])

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
      socket.emit('send-game-message', roomName, message, answer)
    } else {
      ReactGA.event({
        category: 'Lobby',
        action: 'Sent chat message',
      })
      socket.emit('send-chat-message', roomName, message)
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
    socket.emit('pass-emojiset', roomName)
  }

  return (
    <Box>
      <Container>
        <Scroll id="messages">
          <Messages>
            {messages.map((message, index) => (
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
                ) : (
                  <Bubble>
                    <PlayerName>{message.player.name}:</PlayerName>
                    {emoji(message.text)}
                  </Bubble>
                )}
              </Message>
            ))}
            <Message ref={messagesEndRef} />
          </Messages>
        </Scroll>
        <SendContainer>
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            data-testid={'chat-message-input'}
            disabled={passed}
            title={passed ? `You can't guess an emojiset you've passed` : ''}
            required
          />
          <Buttons>
            <Button
              onClick={(event) => message && sendMessage(event)}
              data-testid={'chat-send-button'}
            >
              {emoji('💬')} {inGame ? 'Guess' : 'Send'}
            </Button>
            {inGame && (
              <>
                <Spacer />
                <Button
                  onClick={(event) => passEmojiSet(event)}
                  data-testid={'pass-emojiset-button'}
                  disabled={passed}
                >
                  {emoji('🙅')} {passed ? 'Passed' : 'Pass'}
                </Button>
              </>
            )}
          </Buttons>
        </SendContainer>
      </Container>
    </Box>
  )
}

export default Chat
