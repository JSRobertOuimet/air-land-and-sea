import UI from "./UI.js";

export default class Bot {
    #id = "2";

    constructor() {
        this.name = "Bot";
        this.active = false;
        this.hand = [];
    }

    selectCard() {
        const selectedCard = this.hand[Math.floor(Math.random() * this.hand.length)];

        UI.playerTwoHandEl.childNodes.forEach(cardEl => {
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
        return theaters[Math.floor(Math.random() * theaters.length)];
    }
}