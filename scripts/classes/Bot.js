import UI from "./UI.js";

export default class Bot {    
    constructor() {
        this.id = "2";
        this.name = "Bot";
        this.hand = [];
        this.victoryPoints = 0;
    }

    #selectCard(hand) {
        const selectedCard = hand[Math.floor(Math.random() * hand.length)];

        UI.playerTwoHandEl.childNodes.forEach(cardEl => {
            if(cardEl.id === selectedCard.id) {
                cardEl.classList.add("selected");
            }
        });

        return selectedCard;
    }

    #selectAction() {
        return "improvise";
    }

    #selectTheater(theaters) {
        return theaters[Math.floor(Math.random() * theaters.length)];
    }

    play(theaters) {
        return {
            selectedCard: this.#selectCard(this.hand),
            selectedAction: this.#selectAction(),
            selectedTheater: this.#selectTheater(theaters)
        }
    }
}