import styled from "@emotion/styled"
import type { die } from "../types/die"
import Die from "./Die"

const StyledDice = styled.section`
    width: 435px;
    display: grid;
    grid-template: repeat(2, 4.9rem) / repeat(5, 4.9rem);
    justify-items: center;
    gap: 10px;

    @media screen and (width < 435px) {
        width: 312px;
        grid-template: repeat(2, 3.4rem) / repeat(5, 3.4rem);
    }
`

type DiceProps = {
    dice: die[],
    toggleDiceHold: (index: number) => void,
    setIsChangedToFalse: (index: number) => void,
    isWon: boolean,
    maxHeldValue: number,
    areAllHeldValuesAtMax: boolean
}

export default function Dice({dice, toggleDiceHold, setIsChangedToFalse, isWon, maxHeldValue, areAllHeldValuesAtMax}: DiceProps) {
    return (
        <StyledDice>
            {
                dice.map(die =>
                    <Die 
                        key={die.id} 
                        die={die} 
                        toggleDiceHold={() => toggleDiceHold(die.id)} 
                        setIsChangedToFalse={() => setIsChangedToFalse(die.id)} 
                        isWon={isWon} 
                        maxHeldValue={maxHeldValue}
                        areAllHeldValuesAtMax={areAllHeldValuesAtMax}
                    />
                )
            }
        </StyledDice>
    )
}