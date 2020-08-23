import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.4fr 1fr auto;
  grid-gap: 1rem;
`

export const Left = styled.div`
  grid-column: 1;
  grid-template-rows: 0.1fr auto 0.1fr;
  display: grid;
  grid-gap: 1rem;
`

export const Middle = styled.div`
  grid-column: 2;
  display: grid;
  grid-gap: 1rem;
`

export const Right = styled.div`
  grid-column: 3;
`

export const Box = styled.div`
  background: #f1f4f7;
  padding: 1rem;
  border-radius: 6px;
`

export const H2 = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-style: italic;
`

export const H3 = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-style: italic;
  margin-top: 0;
`
export const H4 = styled.h4`
  font-family: 'Poppins', sans-serif;
  margin-top: 0;
`
export const Button = styled.button`
  padding: 1rem;
  border-radius: 6px;
  border: none;
  background-color: #050509;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  border: #f1f4f7 2px solid;

  &:hover {
    background-color: #fff;
    border: #050509 2px solid;
    color: #050509;
  }
  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;
`
export const Input = styled.input`
  flex-grow: 1;
  padding: 1rem;
  border-radius: 6px;
  background-color: #ffffff;
  border: #dde2e6 2px solid;
  &:hover {
    border: #050509 2px solid;
  }
  &:focus {
    background-color: #ffffff;
  }
  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;
`
export const Label = styled.label`
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
`
