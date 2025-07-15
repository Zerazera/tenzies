import DialogBox, {type DialogBoxPropsButtons} from "./DialogBox"

type GameOverDialogBoxProps = {
    closeModalFn: () => void,
    resetGameFn: () => void
}

export default function GameOverDialogBox({closeModalFn, resetGameFn}: GameOverDialogBoxProps) {
    const buttons: DialogBoxPropsButtons[] = [
        {
            caption: "New Game",
            onClick: resetGameFn
        },
        {
            caption: "Close",
            onClick: closeModalFn
        }
    ]

    return (
        <DialogBox 
            title="Game Over"
            mainText="You win!"
            buttons={buttons}
            closeModalFn={closeModalFn}
        />
    )
}