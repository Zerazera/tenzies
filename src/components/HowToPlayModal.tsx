import styled from "@emotion/styled"
import Modal from "./Modal"

const StyledHowToPlayModal = styled.div`
    width: 600px;
    background-color: rgba(150, 75, 0, 1);
    color: tan;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media screen and (width < 600px) {
        width: 99%;
    }
`

const Header = styled.header`
    display: flex;
    justify-content: center;
`

const UnorderedList = styled.ul`
    margin-top: 5px;
    font-size: 1.2rem;
    padding-inline-start: 20px;

    li {
        list-style-type: "- ";
        margin-bottom: 5px;
    }

    @media screen and (width < 435px) {
        font-size: 1.1rem;
    }
`

const ColorSpan =styled.span<{$color: string}>`
  color: ${({$color}) => $color};
  font-weight: bold;
`

type HowToPlayModalProps = {
    closeModalFn: () => void
}

export default function HowToPlayModal({closeModalFn}: HowToPlayModalProps) {
    return (
        <Modal closeModalFn={closeModalFn}>
            <StyledHowToPlayModal>
                <Header>
                    <h2>How to Play</h2>
                </Header>
                <UnorderedList>
                    <li>Roll the dice.</li>
                    <li>Click on a die to hold its value between rolls.</li>
                    <li>You win when all dice are held and the same value.</li>
                    <li>When all held dice are the same value, the held dice will be <ColorSpan $color="grey">grey</ColorSpan>.</li>
                    <li>When the held dice have values that are not the same:
                        <UnorderedList>
                            <li>The majority held value will be highlighted in <ColorSpan $color="lightgreen">green</ColorSpan>.</li>
                            <li>Remaining held values will be highlighted in <ColorSpan $color="#FF8488">red</ColorSpan>.</li>
                        </UnorderedList>
                    </li>
                </UnorderedList>
            </StyledHowToPlayModal>
        </Modal>
    )
}