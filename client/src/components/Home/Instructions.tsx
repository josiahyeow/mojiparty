import React from 'react'
import styled from 'styled-components'
import emoji from '../../utils/emoji'
import { Box, H2 } from '../Styled/Styled'

const InstructionSet = styled(Box)`
  background-color: #fff;
  display: grid;
  grid-gap: 1rem;
  border: none;
`

const InstructionLine = styled.span``

const Instructions = () => {
  return (
    <Box>
      <H2>{emoji('📖')} How to Play</H2>
      <InstructionSet>
        <strong>Start:</strong>
        <InstructionLine>
          {emoji('👑')} You can host a party by <strong>creating a room</strong>
          , then invite your friends to join you!
        </InstructionLine>
        <InstructionLine>
          {emoji('🥳')} Or, you can attend your friend’s party by{' '}
          <strong>joining a room</strong>.
        </InstructionLine>
        <strong>Setup:</strong>
        <InstructionLine>
          {emoji('🤔')} Pick the <strong>game mode</strong> you want to play.
        </InstructionLine>
        <InstructionLine>
          {emoji('📚')} Pick the <strong>categories</strong> of emoji codes you
          want to decipher.
        </InstructionLine>
        <strong>Play:</strong>
        <InstructionLine>
          {emoji('💬')} When the game starts, be the first player to{' '}
          <strong>decipher the emojis</strong>.
        </InstructionLine>
        <InstructionLine>
          {emoji('🙅')} If you get stuck, press the <strong>pass button</strong>{' '}
          - if the majority passes, the emoji code will be skipped.
        </InstructionLine>
        <InstructionLine>
          {emoji('🏆')} May the best emoji guesser <strong>win!</strong>
        </InstructionLine>
      </InstructionSet>
    </Box>
  )
}

export default Instructions
