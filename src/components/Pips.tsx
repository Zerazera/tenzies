import styled from "@emotion/styled"

const Pip = styled.div<{$isFilled: boolean}>`
    --background-color: ${({$isFilled}) => $isFilled ? 'black' : 'rgba(0, 0, 0, 0)'};

    background-color: var(--background-color);
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

export default function Pips({faceValue}: {faceValue: number}) {
    const pipLocations = diePipLocations[faceValue - 1]
    let pipBitmask = 0

    pipLocations.forEach(pipLocation => pipBitmask |= 1 << pipLocation)

    return (
        <>
            {
                Array(9).fill(null).map((_, i) => 
                    <Pip 
                        key={i} 
                        $isFilled={!!(pipBitmask & 1 << i)}                    
                    />
                )
            }
        </>
    )
}