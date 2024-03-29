import React from 'react'
import styled from 'styled-components'

const StyledFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  max-width: 80rem;
  margin: auto;
`

const Credits = styled.span`
  color: #757575;
`

const Link = styled.a`
  color: #757575;
`

export function Footer() {
  return (
    <StyledFooter>
      <Credits>
        Made with 🎈 in{' '}
        <Link
          href="https://twitter.com/josiahyeow"
          rel="noreferrer"
          target="_blank"
        >
          Melbourne AU
        </Link>
      </Credits>
      <Link
        href="https://mojiparty.notion.site/Terms-of-Service-3537ad45bcc04ab4be9962a73eec645f"
        rel="noreferrer"
        target="_blank"
      >
        Terms of service
      </Link>
    </StyledFooter>
  )
}
