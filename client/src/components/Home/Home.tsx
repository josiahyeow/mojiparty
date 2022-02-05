import React from 'react'
import styled from 'styled-components'
import { Grid, Left, Middle } from '../Styled/Styled'
import Contact from './Contact'
import Donate from './Donate'
import EnterRoom from './EnterRoom'
import Instructions from './Instructions'
import Socials from './Socials'
import Suggestions from './Suggestions'

const LinksGrid = styled(Grid)`
  grid-template-columns: 0.5fr 0.5fr;
  @media (max-width: 1235px) {
    grid-template-columns: auto;
  }
`

const Home = (props: any) => {
  const room = props.location?.state?.room
  const password = props.location?.state?.roomPassword
  return (
    <Grid>
      <Left>
        <EnterRoom room={room} password={password} />
        <Donate />
        <Socials />
      </Left>
      <Middle>
        <Instructions />
        <LinksGrid>
          <Contact />
          <Suggestions />
        </LinksGrid>
      </Middle>
    </Grid>
  )
}

export default Home
