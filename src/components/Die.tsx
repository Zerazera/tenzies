import styled from "@emotion/styled"
import { useState, useRef } from "react"
import { decode } from "html-entities"
import type { die } from "../types/die"
import { getRandomValue } from "../getRandomValue"

const StyledDie = styled.div<{$isHeld: boolean, $isMaxHeldValue: boolean, $areAllHeldValuesAtMax: boolean, $disabled: boolean}>`
    font-size: 7rem;
    cursor: ${({$disabled}) => $disabled ? 'not-allowed' : 'pointer'};
    border: none;
    color: black;
    background-color: ${({$isHeld, $isMaxHeldValue, $areAllHeldValuesAtMax}) => 
        $isHeld ? ($isMaxHeldValue ? ($areAllHeldValuesAtMax ? 'grey' : 'lightgreen') : '#FF8488') : 'white'};
    width: 100%;
    // height: 4.9rem;
    // width: 4.9rem;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    // &:disabled {
    //     cursor: not-allowed;
    // }

    @media screen and (width < 435px) {
        font-size: 5rem;
        // height: 3.4rem;
        // width: 3.4rem;
    }
`

const faces = ["&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"].map(x => decode(x))

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
            $disabled={isWon || isChanged}
        >
            {faces[(isRolling && rollValue || value) - 1]}
        </StyledDie>        
    )
}