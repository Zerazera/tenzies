import styled from "@emotion/styled"
import { useState, useRef } from "react"
import Pips from "./Pips"
import type { die } from "../types/die"
import { getRandomValue } from "../getRandomValue"

const StyledDie = styled.button<{$isHeld: boolean, $isMaxHeldValue: boolean, $areAllHeldValuesAtMax: boolean}>`
    cursor: 'pointer';
    border-radius: 5px;
    border: none;
    background-color: ${({$isHeld, $isMaxHeldValue, $areAllHeldValuesAtMax}) => 
        $isHeld ? ($isMaxHeldValue ? ($areAllHeldValuesAtMax ? 'grey' : 'lightgreen') : '#FF8488') : 'white'};
    aspect-ratio: 1 / 1;
    padding: 5px 10px;
    display: grid;
    grid-template: repeat(3, 1fr) / repeat(3, 1fr);
    gap: 3px;
    justify-items: center;
    align-items: center;

    &:disabled {
        cursor: not-allowed;
    }

    @media screen and (width < 435px) {
        gap: 1.5px;
        padding: 4px 8px;
    }
`

type DieProps = {
    die: die,
    toggleDiceHold: () => void,
    setIsChangedToFalse: () => void,
    isWon: boolean,
    maxHeldValue: number,
    areAllHeldValuesAtMax: boolean
}

export default function Die({die: {value, isHeld, isChanged}, toggleDiceHold, setIsChangedToFalse, maxHeldValue, isWon, areAllHeldValuesAtMax}: DieProps) {
    const [isRolling, setIsRolling] = useState(false)
    const [rollValue, setRollValue] = useState(() => getRandomValue())
    const intervalRef = useRef(0)
    const faceValue = isRolling && rollValue || value

    if (isChanged && !isRolling) {
        setIsRolling(true)
        intervalRef.current = setInterval(() => setRollValue(getRandomValue()), 100)
        setTimeout(() => {
            clearInterval(intervalRef.current)
            setIsChangedToFalse()
            setIsRolling(false)
        }, 500)
    }

    return (
        <StyledDie 
            $isHeld={isHeld} 
            $isMaxHeldValue={value === maxHeldValue} 
            $areAllHeldValuesAtMax={areAllHeldValuesAtMax} 
            onClick={toggleDiceHold} 
            disabled={isWon || isChanged}
        >
            <Pips faceValue={faceValue} />
        </StyledDie>

    )
}