import Debugger from "../Debugger.js";

export default class Bot {
    constructor(name) {
        this.id = "2";
        this.name = name;
        this.active = undefined;
        this.hand = [];
        this.victoryPoints = 0;
    }

    selectCard() {
        const selectedCard = this.hand[Math.floor(Math.random() * this.hand.length)];

        document.querySelectorAll("#bot .card").forEach(cardEl => {
            if (cardEl.id === selectedCard.id) {
                cardEl.classList.add("selected");
            }
        });

        return selectedCard;
    }

    selectAction(selectedCard) {
        let randomNumber = Debugger.forceDeploy(selectedCard);

        switch (randomNumber) {
            case 0:
                return "deploy";
            case 1:
                return "improvise";
        }
    }

    selectTheater(selectedCard, selectedAction, theaters) {
        let selectedTheater;

        switch (selectedAction) {
            case "deploy":
                theaters.forEach(theater => {
                    if (theater.name === selectedCard.theater) {
                        selectedTheater = theater;
                    }
                });
                break;
            case "improvise":
                selectedTheater = theaters[Math.floor(Math.random() * theaters.length)];
                break;
        }

        return selectedTheater;
    }
}
