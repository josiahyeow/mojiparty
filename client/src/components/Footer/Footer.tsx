import React from 'react'
import styled from 'styled-components'

const StyledFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  padding: 2rem;
`

const Link = styled.a`
  color: #757575;
`

export function Footer() {
  return (
    <StyledFooter>
      <div className="container">
        <div className="content has-text-centered">
          <p>
            <Link
              href="https://mojiparty.notion.site/Terms-of-Service-3537ad45bcc04ab4be9962a73eec645f"
              rel="noreferrer"
              target="_blank"
            >
              Terms of service
            </Link>
          </p>
        </div>
      </div>
    </StyledFooter>
  )
}
