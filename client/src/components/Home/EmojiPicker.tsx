import React, { useState } from 'react'
import styled from 'styled-components'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import emoji from '../../utils/emoji'
import { getRandom } from '../../utils/random'

const Container = styled.div`
  position: relative;
`

const Emoji = styled.div`
  padding-right: 0.05em;
  padding-top: 0.05em;
`

const EmojiInput = styled.div`
  text-align: center;
  width: 2.5rem;
  font-size: 2rem;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 6px;
  background-color: #f1f4f7;
  border: #050509 3px solid;
  cursor: pointer;
  &:hover {
    border: #ffcc4d 3px solid;
  }
  &:focus {
    background-color: #ffffff;
  }
  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;
  z-index: 1;
`

const Backdrop = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 0;
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
      <EmojiInput onClick={() => setSelectEmojiOpen(true)} data-testid="emoji">
        <Emoji>{emoji(playerEmoji)}</Emoji>
      </EmojiInput>
      {selectEmojiOpen && (
        <>
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
          <Backdrop onClick={() => setSelectEmojiOpen(false)} />
        </>
      )}
    </Container>
  )
}

export default EmojiPicker
