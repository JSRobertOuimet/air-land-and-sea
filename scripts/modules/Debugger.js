import Player from "../classes/Player.js";

const Debugger = {
    playerStyles: "padding: 2px; color: white; background-color: red;",
    botStyles: "padding: 2px; color: white; background-color: blue;",
    gameStyles: "padding: 2px; color: white; background-color: green;",

    startingBattle: function (id) {
        console.log(`Battle: %c🎲 #${id}`, this.gameStyles);
    },

    activePlayer: function (activePlayer) {
        const symbol = activePlayer instanceof Player ? "🧑🏻" : "🤖";
        const styles = activePlayer instanceof Player ? this.playerStyles : this.botStyles;

        console.log(`Active player: %c${symbol} ${activePlayer.name}`, styles);
    },

    selectedCard: function (selectedCard) {
        console.log(`Selected card: %c🎲 ${selectedCard.deployStrength} ${selectedCard.tacticalAbility}`, this.gameStyles);
    },

    selectedAction: function (selectedAction) {
        console.log(`Selected action: %c🎲 ${selectedAction.charAt(0).toUpperCase()}${selectedAction.slice(1)}`, this.gameStyles);
    },

    selectedTheater: function (selectedTheater) {
        console.log(`Selected theater: %c🎲 ${selectedTheater.name}`, this.gameStyles);
    },

    outlineCard: function (cardId, cardContainerEl) {
        switch (cardId) {
            case "1":
            case "4":
            case "5":
            case "10":
            case "14":
                cardContainerEl.classList.add("testing");
                break;
        }
    },
};

export default Debugger;
