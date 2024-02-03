import Player from "./Player.js";

export default class Log {
    static playerStyles = "padding: 2px; color: white; background-color: red;";
    static botStyles = "padding: 2px; color: white; background-color: blue;";
    static gameStyles = "padding: 2px; color: white; background-color: green;";

    constructor(activePlayer, selectedCard, selectedAction, selectedTheater) {
        this.activePlayer = activePlayer;
        this.selectedCard = selectedCard;
        this.selectedAction = selectedAction;
        this.selectedTheater = selectedTheater;
        this.time = new Date().toLocaleTimeString();
    }

    get playerStyles() {
        return this.playerStyles;
    }

    set playerStyles(value) {
        return this.playerStyles;
    }

    get botStyles() {
        return this.botStyles;
    }

    set botStyles(value) {
        return this.botStyles;
    }

    static startingPlayer(startingPlayer) {
        const symbol = startingPlayer instanceof Player ? "🧑🏻" : "🤖";
        const styles = startingPlayer instanceof Player ? Log.playerStyles : Log.botStyles;
    
        console.clear();
        console.log(`Starting: %c${symbol} ${startingPlayer.name}`, styles);
    }

    static activePlayer(activePlayer) {
        const symbol = activePlayer instanceof Player ? "🧑🏻" : "🤖";
        const styles = activePlayer instanceof Player ? Log.playerStyles : Log.botStyles;

        console.log(`Active: %c${symbol} ${activePlayer.name}`, styles);
    }

    static selectedCard(selectedCard) {
        console.log(`Card: %c🎲 ${selectedCard.strength} ${selectedCard.tacticalAbility}`, this.gameStyles);
    }

    static selectedAction(selectedAction) {
        console.log(`Action: %c🎲 ${selectedAction.charAt(0).toUpperCase()}${selectedAction.slice(1)}`, this.gameStyles);
    }

    static selectedTheater(selectedTheater) {
        console.log(`Theater: %c🎲 ${selectedTheater.name}`, this.gameStyles);
    }
}