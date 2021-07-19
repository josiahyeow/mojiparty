import React from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import emoji from '../../utils/emoji'
import { Box, H2, Link } from '../Styled/Styled'

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`

const DonateLink = styled(Link)`
  color: #26272a;
  background-color: #00b9fe;
  &:hover {
    background-color: #fff;
    color: #fa596e;
    border: #00b9fe 3px solid;
  }
  width: 100%;
`

const Donate = () => {
  return (
    <Box>
      <H2> {emoji('❤️')} Support Mojiparty</H2>
      <Links>
        <DonateLink
          href="https://ko-fi.com/mojiparty"
          target="blank"
          onClick={() =>
            ReactGA.event({
              category: 'Links',
              action: 'Clicked donate',
            })
          }
        >
          {emoji('☕️')} Donate
        </DonateLink>
      </Links>
    </Box>
  )
}

export default Donate
