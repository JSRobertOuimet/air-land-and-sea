import UI from "../modules/UI.js";
import { getAllCardsInTheater } from "../modules/Utilities.js";

export default class Player {
    constructor(name) {
        this.id = "1";
        this.name = name;
        this.active = undefined;
        this.hand = [];
        this.victoryPoints = 0;
    }

    makingCardSelection() {
        return new Promise(resolve => {
            document.querySelectorAll("#player .card").forEach(playerCardEl => {
                playerCardEl.addEventListener("click", e => resolve(this.handleCardSelection(e)));
            });
        });
    }

    handleCardSelection(e) {
        if (e.currentTarget.classList.contains("card")) {
            const selectedCard = this.hand.find(card => card.id === e.currentTarget.id);

            document.querySelectorAll("#player .card").forEach(playerCardEl => {
                if (playerCardEl.classList.contains("selected")) playerCardEl.classList.remove("selected");
            });

            e.currentTarget.classList.add("selected");
            selectedCard.deployStrength === 6
                ? (UI.getElements().descriptionEl.textContent = `${selectedCard.tacticalAbility}`)
                : (UI.getElements().descriptionEl.textContent = `${selectedCard.tacticalAbility} ${selectedCard.typeSymbol} – ${selectedCard.description}`);

            UI.enableActions();

            return selectedCard;
        }
    }

    makingActionSelection() {
        return new Promise(resolve => {
            UI.getElements().actionButtonEls.forEach(actionButtonEl => {
                actionButtonEl.addEventListener("click", e => resolve(this.handleActionSelection(e)));
            });
        });
    }

    handleActionSelection(e) {
        return e.target.id;
    }

    makingTheaterSelection(activePlayer, selectedCard, selectedAction, theaters) {
        return new Promise(resolve => {
            const isAerodromeInTheater = getAllCardsInTheater(activePlayer, theaters).find(card => card.id === "4" && card.facedown === false);

            switch (selectedAction) {
                case "deploy":
                    if (isAerodromeInTheater && selectedCard.deployStrength <= 3) {
                        document.querySelectorAll(".theater").forEach(theaterEl => {
                            theaterEl.classList.add("highlighted");
                            theaterEl.addEventListener("click", e => resolve(this.handleTheaterSelection(e, theaters)));
                        });
                    } else {
                        let matchingTheaterEl;

                        document.querySelectorAll(".theater").forEach(theaterEl => {
                            if (theaterEl.classList[1] === selectedCard.theater.toLowerCase()) {
                                matchingTheaterEl = theaterEl;
                                matchingTheaterEl.classList.add("highlighted");
                            }
                        });

                        matchingTheaterEl.addEventListener("click", e => resolve(this.handleTheaterSelection(e, theaters)));
                    }

                    break;
                case "improvise":
                    document.querySelectorAll(".theater").forEach(theaterEl => {
                        theaterEl.classList.add("highlighted");
                        theaterEl.addEventListener("click", e => resolve(this.handleTheaterSelection(e, theaters)));
                    });
                    
                    break;
            }
        });
    }

    handleTheaterSelection(e, theaters) {
        if (e.currentTarget.classList.contains("theater")) {
            return theaters.find(theater => theater.id === e.currentTarget.id);
        }
    }
}
