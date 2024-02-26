export default class Log {
    constructor(activePlayer, selectedCard, selectedAction, selectedTheater, players, theaters) {
        this.activePlayer = activePlayer;
        this.selectedCard = selectedCard;
        this.selectedAction = selectedAction;
        this.selectedTheater = selectedTheater;
        this.time = new Date().toLocaleTimeString();
        this.players = players;
        this.theaters = theaters;
    }
}
