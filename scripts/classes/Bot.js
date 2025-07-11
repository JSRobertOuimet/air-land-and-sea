import { getRandomTheater, getRandomAction, getRandomCard, isCardInTheater } from "../modules/Utilities.js";

export default class Bot {
    constructor(name) {
        this.id = "2";
        this.name = name;
        this.active = undefined;
        this.hand = [];
        this.victoryPoints = 0;
    }

    selectCard() {
        const selectedCard = getRandomCard(this.hand);

        document.querySelectorAll("#bot .card").forEach(cardEl => {
            if (cardEl.id === selectedCard.id) {
                cardEl.classList.add("selected");
            }
        });

        return selectedCard;
    }

    selectAction(selectedCard) {
        return getRandomAction(selectedCard);
    }

    selectTheater(activePlayer, selectedCard, selectedAction, theaters) {
        let selectedTheater;

        switch (selectedAction) {
            case "deploy":
                const isAerodromeInTheater = isCardInTheater("4", theaters, activePlayer);

                if (isAerodromeInTheater && selectedCard.deployStrength <= 3) {
                    selectedTheater = getRandomTheater(theaters);
                } else {
                    theaters.forEach(theater => {
                        if (theater.name === selectedCard.theater) {
                            selectedTheater = theater;
                        }
                    });
                }
                break;
            case "improvise":
                selectedTheater = getRandomTheater(theaters);
                break;
        }

        return selectedTheater;
    }
}
