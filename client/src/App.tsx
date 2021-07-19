import React, { useEffect, useState, useRef } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import config from './config/config'
import Home from './components/Home/Home'
import RoomEntry from './components/Room/RoomEntry/RoomEntry'
import GlobalStyle from './components/Styled/GlobalStyle'
import { Footer } from './components/Footer/Footer'
// import socket from './utils/socket'

const Logo = styled.h1`
  font-size: 1em;
  margin: 0;
`

const LogoLink = styled(Link)`
  text-decoration: none !important;
`

const LogoImg = styled.img`
  width: 12em;
  height: auto;
`

const Grid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
  padding-bottom: 1rem;
  max-width: 80rem;
  margin: auto;
  padding: 1rem;
  @media (min-width: 600px) {
    padding: 2rem;
  }
`

const Header = styled.div`
  grid-row: 1;
  width: 100%;
  max-width: 80em;
  position: relative;
`

const Body = styled.div`
  grid-row: 2;
`

const EmojiHeader = styled.img`
  display: fixed;
  position: absolute;
  top: 0;
  right: 6%;
  max-width: 16.5em;
  z-index: -1;
  overflow: hidden;
  @media (max-width: 816px) {
    display: none;
  }
`

const Scale = styled.div<{ scale: number }>`
  transform: scale(${(props) => props.scale});
  transform-origin: top;
  overflow-y: hidden;
  height: fit-content;
  @media (max-width: 816px) {
    transform: scale(1);
  }
`

ReactGA.initialize(config.GA_TRACKING_ID)
ReactGA.pageview(window.location.pathname + window.location.search)

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

function App() {
  const content = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  function handleResize() {
    const { width, height } = getWindowDimensions()
    const minHeight = content.current && content.current.scrollHeight
    if (minHeight) {
      const scale = height < minHeight ? height / minHeight : 1
      setScale(scale)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
  }, [content])

  return (
    <>
      <GlobalStyle />
      <Scale ref={content} scale={scale}>
        <Grid>
          <Router>
            <Header>
              <Logo>
                <LogoLink to="/" title="Mojiparty">
                  <LogoImg
                    src="mojiparty-title-beta.png"
                    alt="Mojiparty Logo"
                  />
                </LogoLink>
                {/* <input
                type="button"
                value="kill rooms"
                onClick={() => socket.emit('kill-rooms')}
              /> */}
              </Logo>
              <EmojiHeader src="emoji-party.png" />
            </Header>
            <Body>
              <Route exact path="/" component={Home} />
              <Route path="/:roomName" component={RoomEntry} />
            </Body>
          </Router>
        </Grid>
        <Footer />
      </Scale>
    </>
  )
}

export default App
