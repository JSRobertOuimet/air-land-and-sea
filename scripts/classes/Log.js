import Player from "./Player.js";

export default class Log {
    constructor(activePlayer, selectedCard, selectedAction, selectedTheater) {
        this.activePlayer = activePlayer;
        this.selectedCard = selectedCard;
        this.selectedAction = selectedAction;
        this.selectedTheater = selectedTheater;
        this.time = new Date().toLocaleTimeString();
    }
}