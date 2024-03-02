import Player from "./Player.js";
import UI from "./UI.js";

export default class TacticalAbility {
    constructor() {}

    static support(activePlayer, theaters, selectedTheater) {
        const adjacentTheaters = this.getAdjacentTheaters(theaters, selectedTheater);

        adjacentTheaters.forEach(adjacentTheater => {
            if (activePlayer instanceof Player) {
                adjacentTheater.playerOneBonus.push(3);
            } else {
                adjacentTheater.playerTwoBonus.push(3);
            }
        });

        UI.displayPlayerTotal(theaters);
    }

    static coverFire(activePlayer, theaters, selectedTheater) {
        const coveredCards = this.getCoveredCards(activePlayer, selectedTheater);

        coveredCards.forEach(coveredCard => {
            coveredCard.overwrittenStrength = true;
            UI.displayCardOverwrittenStrength(coveredCard);
        });

        UI.displayPlayerTotal(theaters);
    }

    static airDrop(activePlayer, theaters) {
        const facedownCards = this.getFacedownCards(activePlayer, theaters);

        facedownCards.forEach(facedownCard => {
            facedownCard.overwrittenStrength = true;
            UI.displayCardOverwrittenStrength(facedownCard);
        });

        UI.displayPlayerTotal(theaters);
    }

    static getAdjacentTheaters(theaters, selectedTheater) {
        const adjacentTheaters = [];
        const theaterIndex = theaters.findIndex(theater => theater.name === selectedTheater.name);

        switch (theaterIndex) {
            case 0:
            case 2:
                adjacentTheaters.push(theaters[1]);
                break;
            case 1:
                adjacentTheaters.push(theaters[0]);
                adjacentTheaters.push(theaters[2]);
                break;
        }

        return adjacentTheaters;
    }

    static getCoveredCards(activePlayer, selectedTheater) {
        const playerCards = activePlayer instanceof Player ? selectedTheater.playerOneCards : selectedTheater.playerTwoCards;

        return playerCards.filter(card => card.covered);
    }

    static getFacedownCards(activePlayer, theaters) {
        const playerCards = activePlayer instanceof Player ? "playerOneCards" : "playerTwoCards";
        let facedownCards = [];

        theaters.forEach(theater => {
            facedownCards.push(...theater[playerCards].filter(playerCard => playerCard.facedown));
        });

        return facedownCards;
    }
}
