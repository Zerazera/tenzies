import styled from "@emotion/styled"

export default styled.button`
    border: 1px solid brown;
    background-color: tan;
    color: brown;
    font-size: 1.3rem;
    cursor: pointer;
    padding: 10px;

    &:active {
        background-color: brown;
        color: tan;
    }
`