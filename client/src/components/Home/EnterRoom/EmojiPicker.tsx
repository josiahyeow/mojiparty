import React, { useState } from 'react'
import styled from 'styled-components'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

const Container = styled.div``

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  width: 2.5rem;
  font-size: 2rem;
  margin-right: 0.5rem;
  text-align: center;
  cursor: pointer;
  caret-color: transparent;
  border: #ffffff 1px solid;
  &:hover {
    border: #d5d5d5 1px solid;
  }
  transition: border-color 0.5s ease;
`

const DEFAULT_PLAYER_EMOJIS = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '😊',
  '😇',
  '🙂',
  '🙃',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😛',
  '😝',
  '😜',
  '🤪',
  '😝',
  '🤑',
  '🤗',
  '🤭',
  '🤫',
  '🤔',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '😶',
  '😏',
  '😒',
  '🙄',
  '😬',
  '🤥',
  '😌',
]

export const getRandomPlayerEmoji = () =>
  DEFAULT_PLAYER_EMOJIS[
    Math.floor(Math.random() * Math.floor(DEFAULT_PLAYER_EMOJIS.length))
  ]

const EmojiPicker = ({ playerEmoji, setPlayerEmoji }) => {
  const [selectEmojiOpen, setSelectEmojiOpen] = useState(false)

  return (
    <Container>
      <Input
        id="playeremoji-input"
        value={playerEmoji}
        placeholder="Pick emoji"
        onFocus={() => setSelectEmojiOpen(true)}
        readOnly
      />
      {selectEmojiOpen && (
        <Picker
          title="Pick your emoji"
          emoji="thinking_face"
          color={'#000000'}
          useButton={true}
          onSelect={(emoji) => {
            setPlayerEmoji(emoji.native)
            setSelectEmojiOpen(false)
          }}
          style={{
            position: 'absolute',
            left: '15%',
            top: '10%',
            zIndex: '999',
          }}
        />
      )}
    </Container>
  )
}

export default EmojiPicker
