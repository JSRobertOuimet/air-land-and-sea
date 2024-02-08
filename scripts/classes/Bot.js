import Log from "./Log.js";
import UI from "./UI.js";

export default class Bot {
    constructor(name) {
        this.id = "2"
        this.name = name;
        this.active = undefined;
        this.hand = [];
        this.victoryPoints = 0;
    }

    selectCard() {
        const selectedCard = this.hand[Math.floor(Math.random() * this.hand.length)];

        Array.from(UI.playerTwoHandEl.childNodes).forEach(cardEl => {
            if(cardEl.id === selectedCard.id) {
                cardEl.classList.add("selected");
            }
        });

        return selectedCard;
    }

    selectAction() {
        return "improvise";
    }

    selectTheater(theaters) {
        const selectedTheater = theaters[Math.floor(Math.random() * theaters.length)];

        return selectedTheater;
    }
}