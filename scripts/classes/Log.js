export default class Log {
    constructor(parameters) {
        const { activePlayerName, selectedCard, selectedAction, selectedTheater, players, theaters } = parameters;

        this.activePlayerName = activePlayerName;
        this.selectedCard = selectedCard;
        this.selectedAction = selectedAction;
        this.selectedTheater = selectedTheater;
        this.time = new Date().toLocaleTimeString();
        this.players = players;
        this.theaters = theaters;
    }
}
