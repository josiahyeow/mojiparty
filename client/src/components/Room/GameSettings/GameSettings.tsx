import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { Box, H3, Label, Select } from '../../Styled/Styled'
import socket from '../../../utils/socket'
import emoji from '../../../utils/emoji'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'

type Category = {
  name: string
  icon: string
  include: boolean
  weight: number
}

type Categories = {
  [key: string]: Category
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
`

const CategorySelector = styled(Box)`
  border: none;
  background-color: #f1f4f7;
`

const Category = styled.div`
  margin-bottom: 0.5rem;
  &:last-child {
    margin-bottom: 0em;
  }
`

const CategoryCheckbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`

const CategoryLabel = styled.label<{ disabled: boolean }>`
  text-transform: capitalize;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const CategoryIcon = styled.span`
  margin-right: 0.5rem;
`

const CategoryName = styled.span`
  font-weight: bold;
`

const ModeSettings = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`

const ONLY_HOST_MESSAGE = 'Only the host can change the game settings'

const MAX_PLAYERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
const MAX_PLAYERS_EXPERIMENTAL = [24, 32, 64, 128]

const GameSettings = () => {
  const { room, settings, player, players } = useContext(
    RoomContext
  ) as RoomContextProps
  const [maxPlayers, setMaxPlayers] = useState(6)
  const scoreLimit = settings?.scoreLimit || 0
  const selectedCategories: Categories = settings?.selectedCategories || {}
  const rounds = settings?.rounds || 0
  const roundTimer = settings?.timer || -1
  const mode = settings?.mode || 'classic'
  const isHost = players ? players[player?.id]?.host : player?.host

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [settings, players])

  const GAME_MODES = [
    {
      name: 'Classic',
      value: 'classic',
      icon: '🕹️',
      description:
        'The first to guess the emoji, gets the point! Winner takes it all.',
    },
    {
      name: 'New',
      value: 'skribbl',
      icon: '🎮',
      description: 'The faster you guess, the more points you get!',
    },
    // { name: 'Custom', value: 'pictionary' },
  ]
  const SCORE_LIMITS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
  const ROUNDS = [5, 10, 15, 20, 30, 40, 50]
  const ROUND_TIMERS = [0, 15, 30, 60, 90, 120]

  const updateCategories = useCallback(
    (updatedCategories) => {
      ReactGA.event({
        category: 'Lobby',
        action: 'Updated setting',
        label: 'Categories',
      })
      socket.emit('update-setting', room.name, 'categories', updatedCategories)
    },
    [room.name]
  )

  const handleUpdateCategory = useCallback(
    (category) => {
      const newCategories = selectedCategories
      newCategories[category].include = !selectedCategories[category].include
      updateCategories(JSON.parse(JSON.stringify(newCategories)))
    },
    [selectedCategories, updateCategories]
  )

  const updateScoreLimit = useCallback(
    (newScoreLimit) => {
      ReactGA.event({
        category: 'Lobby',
        action: 'Updated setting',
        label: 'Score limit',
      })
      socket.emit('update-setting', room.name, 'scoreLimit', newScoreLimit)
    },
    [room.name]
  )

  const updateRounds = useCallback(
    (rounds) => {
      ReactGA.event({
        category: 'Lobby',
        action: 'Updated setting',
        label: 'Rounds',
      })
      socket.emit('update-setting', room.name, 'rounds', rounds)
    },
    [room.name]
  )

  const updateRoundTimer = useCallback(
    (newRoundTimer) => {
      ReactGA.event({
        category: 'Lobby',
        action: 'Updated setting',
        label: 'Round timer',
      })
      socket.emit('update-setting', room.name, 'timer', newRoundTimer)
    },
    [room.name]
  )

  const updateMode = useCallback(
    (mode) => {
      ReactGA.event({
        category: 'Lobby',
        action: 'Updated setting',
        label: 'Game mode',
      })
      socket.emit('update-setting', room.name, 'mode', mode)
    },
    [room.name]
  )

  return useMemo(
    () => (
      <Box>
        <Container>
          <H3>Game Settings</H3>
          <Label htmlFor="players-input">Max players</Label>
          <Select
            id="mode-input"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            disabled={!isHost}
            title={!isHost ? ONLY_HOST_MESSAGE : ''}
          >
            <optgroup label="Party">
              {MAX_PLAYERS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </optgroup>
            <optgroup label="Mega Party (Experimental)">
              {MAX_PLAYERS_EXPERIMENTAL.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </optgroup>
          </Select>
          <Label htmlFor="mode-input">Game mode</Label>
          {/* <Select
            id="mode-input"
            value={mode}
            onChange={(e) => updateMode(e.target.value)}
            disabled={!isHost}
            title={!isHost ? ONLY_HOST_MESSAGE : ''}
          >
            {GAME_MODES.map(({ name, value }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </Select> */}
          <CategorySelector>
            {GAME_MODES.map(({ name, value, icon, description }) => (
              <Category>
                <CategoryCheckbox
                  type="radio"
                  id={name}
                  name={name}
                  value={value}
                  checked={value === mode}
                  onChange={() => updateMode(value)}
                />
                <CategoryLabel
                  htmlFor={name}
                  disabled={!isHost}
                  title={description}
                >
                  <CategoryIcon>{emoji(icon)}</CategoryIcon>
                  <CategoryName>{name}</CategoryName>
                </CategoryLabel>
              </Category>
            ))}
          </CategorySelector>

          {mode === 'classic' && (
            <>
              {/* <Label htmlFor="scorelimit-input">Score Limit</Label> */}
              <Select
                id="scorelimit-input"
                value={scoreLimit}
                onChange={(e) => updateScoreLimit(e.target.value)}
                disabled={!isHost}
                title={!isHost ? ONLY_HOST_MESSAGE : ''}
              >
                {SCORE_LIMITS.map((scoreLimit) => (
                  <option key={scoreLimit} value={scoreLimit}>
                    {scoreLimit} points to win
                  </option>
                ))}
              </Select>
            </>
          )}
          {(mode === 'skribbl' || mode === 'pictionary') && (
            <ModeSettings>
              {/* <Label htmlFor="rounds-input">Rounds</Label> */}
              <Select
                id="rounds-input"
                value={rounds}
                onChange={(e) => updateRounds(e.target.value)}
                disabled={!isHost}
                title={!isHost ? ONLY_HOST_MESSAGE : ''}
              >
                {ROUNDS.map((rounds) => (
                  <option key={rounds} value={rounds}>
                    {rounds} rounds
                  </option>
                ))}
              </Select>
              {/* <Label htmlFor="roundTimer-input">Time per round (sec)</Label> */}
              <Select
                id="roundTimer-input"
                value={roundTimer}
                onChange={(e) => updateRoundTimer(e.target.value)}
                disabled={!isHost}
                title={!isHost ? ONLY_HOST_MESSAGE : ''}
              >
                {ROUND_TIMERS.map((roundTimer) => (
                  <option key={roundTimer} value={roundTimer}>
                    {roundTimer === 0 ? 'Unlimited' : roundTimer} sec each
                  </option>
                ))}
              </Select>
            </ModeSettings>
          )}
          <Label>Categories</Label>
          <CategorySelector>
            {Object.entries(selectedCategories)
              .sort((a, b) => a[1].weight - b[1].weight)
              .map(([category, value]) => (
                <Category key={category}>
                  <CategoryCheckbox
                    type="checkbox"
                    name={`${category}-checkbox`}
                    value={`${category}`}
                    checked={selectedCategories[category].include}
                    onChange={(event) =>
                      handleUpdateCategory(event.target.value)
                    }
                    disabled={!isHost}
                    title={!isHost ? ONLY_HOST_MESSAGE : ''}
                  />
                  <CategoryLabel
                    htmlFor={`${category}-checkbox`}
                    onClick={() => isHost && handleUpdateCategory(category)}
                    disabled={!isHost}
                    title={!isHost ? ONLY_HOST_MESSAGE : ''}
                  >
                    <CategoryIcon>
                      {emoji(selectedCategories[category].icon)}
                    </CategoryIcon>
                    <CategoryName>
                      {selectedCategories[category].name}
                    </CategoryName>
                  </CategoryLabel>
                </Category>
              ))}
          </CategorySelector>
        </Container>
      </Box>
    ),
    [
      SCORE_LIMITS,
      handleUpdateCategory,
      isHost,
      scoreLimit,
      selectedCategories,
      updateScoreLimit,
    ]
  )
}

export default GameSettings
