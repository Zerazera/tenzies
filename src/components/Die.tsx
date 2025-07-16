import styled from "@emotion/styled"
import { useState, useRef } from "react"
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

const Pip = styled.div<{$isFilled: boolean}>`
    background-color: ${({$isFilled}) => $isFilled ? 'black' : 'rgba(0, 0, 0, 0)'};
    border-radius: 100px;
    width: 100%;
    aspect-ratio: 1 / 1;
`

const diePipLocations = [
    [4],
    [1, 7],
    [2, 4, 6],
    [0, 2, 6, 8],
    [0, 2, 4, 6, 8],
    [0, 2, 3, 5, 6, 8]
]

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
    const pipLocations = diePipLocations[faceValue - 1]

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
            {
                Array(9).fill(null).map((_, i) => 
                    <Pip 
                        key={i} 
                        $isFilled={pipLocations.includes(i)}                    
                    />
                )
            }
        </StyledDie>

    )
}