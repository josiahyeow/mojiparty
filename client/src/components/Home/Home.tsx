import React from 'react'
import styled from 'styled-components'
import { Grid, Left, Middle } from '../Styled/Styled'
import EnterRoom from './EnterRoom'
import Instructions from './Instructions'
import Socials from './Socials'
import Contact from './Contact'
import Suggestions from './Suggestions'
import Notice from './Notice'
import Donate from './Donate'

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
        <Socials />
      </Left>
      <Middle>
        <Instructions />
        <Donate />
        <LinksGrid>
          <Contact />
          <Suggestions />
        </LinksGrid>
        <Notice />
      </Middle>
    </Grid>
  )
}

export default Home
