import React, { useState } from 'react'
import styled from 'styled-components'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import emoji from '../../utils/emoji'
import { Input } from '../Styled/Styled'
import { getRandom } from '../../utils/random'

const Container = styled.div`
  position: relative;
`

const Emoji = styled.div`
  width: 2.5rem;
  font-size: 2rem;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 6px;
  background-color: #ffffff;
  border: #dde2e6 2px solid;
  &:hover {
    border: #050509 2px solid;
  }
  &:focus {
    background-color: #ffffff;
  }
  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;
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

export const getRandomPlayerEmoji = () => getRandom(DEFAULT_PLAYER_EMOJIS)

const EmojiPicker = ({ playerEmoji, setPlayerEmoji }) => {
  const [selectEmojiOpen, setSelectEmojiOpen] = useState(false)

  return (
    <Container>
      <Emoji onClick={() => setSelectEmojiOpen(true)}>
        {emoji(playerEmoji)}
      </Emoji>
      {selectEmojiOpen && (
        <Picker
          title="Pick your emoji"
          emoji="thinking_face"
          color={'#000000'}
          useButton={true}
          set={'twitter'}
          onSelect={(emoji) => {
            setPlayerEmoji(emoji.native)
            setSelectEmojiOpen(false)
          }}
          style={{
            position: 'absolute',
            zIndex: '999',
          }}
        />
      )}
    </Container>
  )
}

export default EmojiPicker
