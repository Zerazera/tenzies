import { useState, useRef } from "react"
import styled from "@emotion/styled"
import type { die } from "./types/die"
import Dice from "./components/Dice"
import GameOverDialogBox from "./components/GameOverDialogBox"
import HowToPlayModal from "./components/HowToPlayModal"
import Confetti from "react-confetti"
import { useWindow } from "./hooks/useWindow"
import { getRandomValue } from "./getRandomValue"

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: tan;
  color: brown;
`

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Title = styled.h1`
  @media screen and (height < 435px) {
    margin-block: 0.2em;
  }
`

const Main = styled.main`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

const Info = styled.section`
  display: flex;
  justify-content: space-between;
  width: 435px;
  font-size: 1.5rem;
  font-weight: bold;
  color: lightred;
  background-color: tan;
  padding: 10px;

  @media screen and (width < 435px) {
    width: 340px;
    font-size: 1.3rem;
  }
`

const Buttons = styled.footer`
  display: flex;
  gap: 10px;
`

const Button = styled.button`
  border: 1px solid brown;
  font-size: 2rem;
  padding: 5px;
  background-color: tan;
  cursor: pointer;
  color: brown;
  width: 200px;
  display: flex;
  justify-content: center;

  &:active {
    color: white;
    background-color: brown;
  }

  &:disabled {
    background-color: tan;
    color: #C4A484;
    cursor: not-allowed;
  }

  @media screen and (width < 435px) {
    font-size: 1.5rem;
    width: 150px;
  }
`

const TimeDisplay = styled.span`
  display: inline-block;
  width: 60px;

  @media screen and (width < 435px) {
    width: 54px;
  }
`

export default function App() {
  const initialDice: () => die[] = () => Array(10).fill(null).map((_, i) => ({id: i, value: getRandomValue(), isHeld: false, isChanged: false}))
  const [dice, setDice] = useState(() => initialDice())
  const [rollCount, setRollCount] = useState(0)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const timerIntervalRef = useRef(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const {windowInnerWidth, windowInnerHeight} = useWindow()
  const [isGameOverDialogBoxShown, setIsGameOverDialogBoxShown] = useState(false)
  const [wasGameOverDialogBoxShown, setWasGameOverDialogBoxShown] = useState(false)
  const [isHowToPlayModalShown, setIsHowToPlayModalShown] = useState(false)

  const timerMinutes = ("" + Math.floor(secondsElapsed / 60)).padStart(2, '0')
  const timerSeconds = ("" + Math.floor(secondsElapsed % 60)).padStart(2, '0')

  const isWon = dice.every(({value, isHeld}) => isHeld && value === dice[0].value)

  const getMaxHeldValue = () => {
    const heldValues = dice.filter(({isHeld}) => isHeld).map(({value}) => value)

    const heldValuesCounts: Record<string, number> = {}
    heldValues.forEach(value => value in heldValuesCounts ? heldValuesCounts[value]++ : heldValuesCounts[value] = 1)

    const maxHeldValueCount = Object.values(heldValuesCounts).reduce((x, y) => x > y ? x : y, -1)
    const maxHeldValues = Object.keys(heldValuesCounts).filter(countKey => heldValuesCounts[countKey] === maxHeldValueCount)
    const maxHeldValue =  maxHeldValues.length === 1 ? +maxHeldValues[0] : -1;

    const distinctHeldValues = new Set(Object.values(heldValuesCounts)).size

    return {
      maxHeldValue,
      areAllHeldValuesAtMax: distinctHeldValues === 1
    }
  }
  
  const {maxHeldValue, areAllHeldValuesAtMax} = getMaxHeldValue()
  const atLeastOneDieIsNotChangedOrHeld = dice.some(({isChanged, isHeld}) => !isChanged && !isHeld)

  const rollDice = () => {
    if (atLeastOneDieIsNotChangedOrHeld) {
      setRollCount(prev => prev + 1)
      setDice(prev => prev.map(die => die.isHeld || die.isChanged ? {...die} : {...die, value: getRandomValue(), isChanged: true}))
    }
  }
  
  const toggleDiceHold = (id: number) => !isWon && setDice(prev => prev.map(die => id === die.id ? {...die, isHeld: !die.isHeld} : {...die}))
  const setIsChangedToFalse = (id: number) => setDice(prev => prev.map(die => die.id === id ? {...die, isChanged: false} : {...die}))

  const resetGame = () => {
    setDice(initialDice())
    setRollCount(0)
    setSecondsElapsed(0)
    setIsGameOverDialogBoxShown(false)
    setWasGameOverDialogBoxShown(false)
  }

  if (!isWon && !isHowToPlayModalShown && !isGameActive) {
    setIsGameActive(true)
    timerIntervalRef.current = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000)

  } else if ((isWon || isHowToPlayModalShown) && isGameActive) {
    setIsGameActive(false)
    clearInterval(timerIntervalRef.current)
  }

  if (isWon && !isGameOverDialogBoxShown && !wasGameOverDialogBoxShown) {    
    setTimeout(() => {
      setIsGameOverDialogBoxShown(true)
      setWasGameOverDialogBoxShown(true)
    }, 1000)
  }

  return (
    <Body>
      {
        isWon && 
        <Confetti 
          width={windowInnerWidth}
          height={windowInnerHeight}
        />
      }
      {
        isGameOverDialogBoxShown && 
        <GameOverDialogBox 
          closeModalFn={() => setIsGameOverDialogBoxShown(false)}
          resetGameFn={resetGame}
        />
      }
      {
        isHowToPlayModalShown &&
        <HowToPlayModal
          closeModalFn={() => setIsHowToPlayModalShown(false)}
        />
      }
      <Header>
        <Title>Tenzies</Title>
      </Header>
      <Main>
        <Info>
          <div>Rolls: {rollCount}</div>
          <div>Time elapsed: <TimeDisplay>{`${timerMinutes}:${timerSeconds}`}</TimeDisplay></div>
        </Info>
        <Dice 
          dice={dice} 
          toggleDiceHold={toggleDiceHold} 
          setIsChangedToFalse={setIsChangedToFalse} 
          isWon={isWon} 
          maxHeldValue={maxHeldValue}
          areAllHeldValuesAtMax={areAllHeldValuesAtMax}
        />        
        <Buttons>
          <Button 
            onClick={(!isWon && rollDice) || resetGame} 
            disabled={!atLeastOneDieIsNotChangedOrHeld && !isWon}
          >
            {!isWon && "Roll dice" || "New game"}
          </Button>
          <Button 
            onClick={() => setIsHowToPlayModalShown(true)}
          >
            How to play
          </Button>
        </Buttons>
      </Main>      
    </Body>
  ) 
}