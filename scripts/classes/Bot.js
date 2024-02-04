import Log from "./Log.js";
import UI from "./UI.js";

export default class Bot {
    constructor() {
        this.id = "2"
        this.name = "Bot";
        this.active = false;
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

        Log.selectedCard(selectedCard);

        return selectedCard;
    }

    selectAction() {
        Log.selectedAction("Improvise");
        return "improvise";
    }

    selectTheater(theaters) {
        const selectedTheater = theaters[Math.floor(Math.random() * theaters.length)];
        Log.selectedTheater(selectedTheater);

        return selectedTheater;
    }
}