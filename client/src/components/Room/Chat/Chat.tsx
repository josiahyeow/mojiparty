import { motion } from 'framer-motion'
import { escape } from 'html-escaper'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import emoji from '../../../utils/emoji'
import socket from '../../../utils/socket'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'
import { Box, Button, Input } from '../../Styled/Styled'
import EmojiChat from './EmojiChat'

const Wrapper = styled.div`
  @media (max-width: 600px) {
    // position: fixed;
    // bottom: 0;
    // width: 100vw;
    // height: fit-content;
    // margin: -1rem;
  }
`
const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 1rem;
  height: 100%;
  @media (max-width: 600px) {
    display: flex;
    flex-wrap: wrap;
  }
`
const SendContainer = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  @media (max-width: 600px) {
    display: flex;
    flex-wrap: wrap;
  }
`
const Messages = styled.div<{ short: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${({ short }) => (short ? '5em' : '20em')};
  overflow-x: hidden;
  @media (max-width: 600px) {
    height: 3em;
  }
`

const MessageInput = styled(Input)`
  -webkit-appearance: none;
  &:invalid {
    box-shadow: none;
  }
`

const Scroll = styled.div`
  overflow: auto;
  background-color: #fff;
  border-radius: 6px;
  padding: 1rem;
  @media (max-width: 600px) {
    width: 100%;
    padding: 0rem 0.5rem;
  }
`

const Message = styled(motion.div)`
  margin: 0.5rem 0rem;
  display: flex;
  align-items: center;
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
  @media (max-width: 600px) {
    justify-content: flex-start;
    flex-direction: row-reverse;
    width: 100%;
  }
`

const Spacer = styled.div`
  width: 0.5rem;
`

const Donate = styled.a`
  text-decoration: none;
  color: #474747;
  background-color: #f1f4f7;
  text-decoration: underline;
  font-weight: bold;

  &:hover {
    color: #8a4b38;
  }
  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;
`

const Email = styled.a`
  color: #474747;
`

const Chat = ({ inGame }) => {
  const { room, settings, player, players, activeGame } = useContext(
    RoomContext
  ) as RoomContextProps
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([] as any[])
  const [passed, setPassed] = useState(player?.pass ? player.pass : false)

  const isHost = players ? players[player?.id]?.host : player?.host

  const guessed = player && players ? players[player.id]?.guessed : false

  const isDrawer = player?.id && player?.id === activeGame?.drawer

  const noChat = settings?.chat === false && !isHost && !inGame

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
                  {emoji(escape(message.text))}
                </Bubble>
              )}
            </Message>
          )
      ),
    [messages]
  )

  return (
    <Wrapper>
      <Box>
        <Container>
          <Scroll id="messages">
            <Messages short={isDrawer}>
              <WelcomeMessages />
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
                disabled={passed || isDrawer || noChat}
                title={
                  passed ? `You can't guess an emojiset you've passed` : ''
                }
                placeholder={
                  isHost
                    ? 'Send / for a list of commands'
                    : noChat
                    ? 'Chat disabled when over 50 players'
                    : ''
                }
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
    </Wrapper>
  )
}

const WelcomeMessages = () => {
  return (
    <>
      <Message>
        <Player>{emoji('🧑🏻‍💻')}</Player>
        <Bubble>Hello {emoji('👋')} Thanks for coming to the party!</Bubble>
      </Message>
      <Message>
        <Player>{emoji('🧑🏻‍💻')}</Player>
        <Bubble>
          I am actively developing improvements. Email me at{' '}
          <Email href="mailto:josiahyeow.dev@gmail.com">
            josiahyeow.dev@gmail.com
          </Email>{' '}
          if you have any feature requests/questions.
        </Bubble>
      </Message>
      <Message>
        <Player>{emoji('🧑🏻‍💻')}</Player>
        <Bubble>
          If you're having a good time, please help me out with server costs by{' '}
          <Donate
            href="https://ko-fi.com/mojiparty"
            target="_blank"
            onClick={() => {
              ReactGA.event({
                category: 'Lobby',
                action: 'Clicked donate',
              })
            }}
          >
            donating
          </Donate>{' '}
          so we can keep the party alive! {emoji('🥳')}
        </Bubble>
      </Message>
    </>
  )
}

export default Chat
