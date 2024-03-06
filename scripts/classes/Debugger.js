import Log from "./Log.js";

export default class Debugger {
    static playerStyles = "padding: 2px; color: white; background-color: red;";
    static botStyles = "padding: 2px; color: white; background-color: blue;";
    static gameStyles = "padding: 2px; color: white; background-color: green;";

    constructor() {}

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

    get gameStyles() {
        return this.gameStyles;
    }

    set gameStyles(value) {
        return this.gameStyles;
    }

    static startingBattle(id) {
        console.log(`Battle: %c🎲 #${id}`, this.gameStyles);
    }

    static activePlayer(activePlayer) {
        const symbol = activePlayer instanceof Player ? "🧑🏻" : "🤖";
        const styles = activePlayer instanceof Player ? Log.playerStyles : Log.botStyles;

        console.log(`Active player: %c${symbol} ${activePlayer.name}`, styles);
    }

    static selectedCard(selectedCard) {
        console.log(`Selected card: %c🎲 ${selectedCard.deployStrength} ${selectedCard.tacticalAbility}`, this.gameStyles);
    }

    static selectedAction(selectedAction) {
        console.log(`Selected action: %c🎲 ${selectedAction.charAt(0).toUpperCase()}${selectedAction.slice(1)}`, this.gameStyles);
    }

    static selectedTheater(selectedTheater) {
        console.log(`Selected theater: %c🎲 ${selectedTheater.name}`, this.gameStyles);
    }

    static outlineCard(cardID, cardContainerEl) {
        switch (cardID) {
            case "1":
            case "5":
            case "10":
            case "14":
                cardContainerEl.classList.add("testing");
                break;
        }
    }

    static forceDeploy(selectedCard) {
        let randomNumber;

        switch (selectedCard.id) {
            case "1":
            case "5":
            case "10":
            case "14":
                randomNumber = 0;
                break;
            default:
                randomNumber = Math.floor(Math.random() * 2);
        }

        return randomNumber;
    }
}
