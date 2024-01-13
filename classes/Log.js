export default class Log {
    constructor(activePlayer, selectedCard, selectedTheater, selectedAction) {
        this.activePlayer = activePlayer;
        this.selectedCard = selectedCard;
        this.selectedTheater = selectedTheater;
        this.selectedAction = selectedAction;
        this.time = new Date().toLocaleTimeString();
    }
}