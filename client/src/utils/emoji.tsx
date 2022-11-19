import React from 'react'
import styled from 'styled-components'
import twemoji from 'twemoji'

const TwemojiSpan = styled.span`
  img.emoji {
    height: 1em;
    width: 1em;
    margin: 0 0.1em 0 0.1em;
    vertical-align: -0.1em;
  }
`

export default function emoji(emojis: string) {
  return (
    <TwemojiSpan
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(emojis, {
          folder: 'svg',
          ext: '.svg',
        }),
      }}
    />
  )
}
