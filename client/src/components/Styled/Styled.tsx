import styled from 'styled-components'
import { motion } from 'framer-motion'
import React from 'react'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  grid-gap: 1rem;

  @media (max-width: 816px) {
    grid-template-columns: auto;
  }
`

export const Left = styled.div`
  grid-column: 1;
  grid-template-rows: 0.1fr auto 0.1fr;
  display: grid;
  grid-gap: 1rem;
  height: fit-content;
  @media (max-width: 816px) {
    grid-row: 1;
  }
`

export const Middle = styled.div`
  grid-column: 2;
  display: grid;
  grid-gap: 1rem;
  grid-template-rows: 0.1fr auto;
  @media (max-width: 816px) {
    grid-column: 1;
    grid-row: 2;
    margin-top: 1rem;
  }
`

export const Box = styled.div`
  background: #fff;
  padding: 1rem;
  border: #050509 3px solid;
  border-radius: 6px;
  height: fit-content;
`

export const MotionBox = styled(motion.div)`
  background: #f1f4f7;
  padding: 1rem;
  border-radius: 6px;
`

export const H2 = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-style: italic;
  margin-top: 0px;
  margin-bottom: 0.2em;
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
  font-size: 100%;
  padding: 1rem;
  border-radius: 6px;
  border: none;
  background-color: #050509;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  border: #050509 3px solid;

  &:focus,
  &:hover {
    background-color: #fff;
    border: #050509 3px solid;

    color: #050509;
  }

  &:disabled {
    background-color: #636363;
    color: #fff;
    border: #636363 3px solid;
    cursor: not-allowed;
  }

  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;
`
export const Input = styled.input`
  font-size: 100%;
  flex-grow: 1;
  padding: 1rem;
  border-radius: 6px;
  background-color: #f1f4f7;
  border: #f1f4f7 3px solid;
  &:hover,
  &:focus {
    border: #050509 3px solid;
  }
  &:focus {
    background-color: #ffffff;
  }
  &:disabled {
    background-color: #dde2e6;
    border: #dde2e6 3px solid;
    cursor: not-allowed;
  }
  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;
`
export const Label = styled.label`
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
`

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  &:after {
    content: ' ▾';
    font-weight: 600;
    font-size: 1rem;
    top: 18px;
    right: 16px;
    position: absolute;
  }
`

export const StyledSelect = styled.select`
  font-size: 100%;
  flex-grow: 1;
  padding: 1rem;
  border-radius: 6px;
  background-color: #f1f4f7;
  border: #f1f4f7 3px solid;
  -moz-appearance: none; /* Firefox */
  -webkit-appearance: none; /* Safari and Chrome */
  appearance: none;
  width: 100%;
  padding-right: 1rem;
  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;
`
export const Link = styled.a`
  color: #050509;
  border-radius: 6px;
  border: #050509 3px solid;
  font-weight: bold;
  text-decoration: none;
  padding: 1em;
  margin: 1em;
  min-width: 6em;
  text-align: center;
`

export const Select = ({ ...props }) => (
  <SelectWrapper>
    <StyledSelect {...props} />
  </SelectWrapper>
)
