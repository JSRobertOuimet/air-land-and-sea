import Player from "./Player.js";

export default class Log {
    static playerStyles = "padding: 2px; color: white; background-color: red;";
    static botStyles = "padding: 2px; color: white; background-color: blue;";

    constructor(activePlayer, selectedCard, selectedTheater, selectedAction) {
        this.activePlayer = activePlayer;
        this.selectedCard = selectedCard;
        this.selectedTheater = selectedTheater;
        this.selectedAction = selectedAction;
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

    static logStartingPlayer(startingPlayer) {
        const symbol = startingPlayer instanceof Player ? "🧑🏻" : "🤖";
        const styles = startingPlayer instanceof Player ? Log.playerStyles : Log.botStyles;
    
        console.clear();
        console.log(`Starting: %c${symbol} ${startingPlayer.name}`, styles);
    }

    static logActivePlayer(activePlayer) {
        const symbol = activePlayer instanceof Player ? "🧑🏻" : "🤖";
        const styles = activePlayer instanceof Player ? Log.playerStyles : Log.botStyles;

        console.log(`Active: %c${symbol} ${activePlayer.name}`, styles);
    }
}