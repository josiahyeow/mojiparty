import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Countdown from 'react-countdown'
import { Box, H3 } from '../../Styled/Styled'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const ScoreLimit = styled.span``

const Category = styled.span`
  text-align: center;
  font-weight: bold;
  padding: 0.2rem 0.4rem;
  margin: 0rem 0.5rem;
  background: #ffffff;
  border-radius: 6px;
  margin-bottom: 1rem;
`

const CategoryName = styled.span``

const Set = styled.span`
  text-align: center;
  font-weight: bold;
  padding: 2rem;
  font-size: 3rem;
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(11, 37, 105, 0.04),
    0px 1px 0px rgba(11, 37, 105, 0.04);
  border-radius: 6px;
`

const StyledCountdown = styled(Set)`
  font-size: 3rem;
`

const EmojiSet = ({ category, emojiSet, scoreLimit, lastEvent }) => {
  const [counter, setCounter] = useState(1)
  useEffect(() => {
    setCounter((counter) => counter + 1)
  }, [lastEvent])
  const renderer = ({ completed }) => {
    if (completed) {
      return <Set>{emojiSet}</Set>
    } else {
      if (
        lastEvent.type === 'correct' ||
        lastEvent.type === 'pass' ||
        lastEvent.type === 'start'
      ) {
        return (
          <StyledCountdown>
            {lastEvent.type === 'correct' &&
              `${lastEvent.emoji} ${lastEvent.name} guessed it!`}
            {lastEvent.type === 'pass' && `🙅 Emojiset passed`}
            {lastEvent.type === 'start' && `🏁 Game start!`}
          </StyledCountdown>
        )
      } else {
        return <Set>{emojiSet}</Set>
      }
    }
  }

  return (
    <Box>
      <Header>
        <H3>
          Category
          <Category>
            <CategoryName>{category}</CategoryName>
          </Category>
        </H3>
        <ScoreLimit>First to {scoreLimit} points</ScoreLimit>
      </Header>
      <Container>
        <Countdown date={Date.now() + 1000} renderer={renderer} key={counter} />
      </Container>
    </Box>
  )
}

export default EmojiSet
