import Theater from "./Theater.js";
import Card from "./Card.js";

export default class Battle {
    constructor(playerOne, playerTwo, theaterBoards, cards) {
        this.theaters = this.#shuffleCards(theaterBoards);
        console.log(`🎲 The theater boards have been shuffled and appear in this order: ${this.theaters[0].name}, ${this.theaters[1].name}, and ${this.theaters[2].name}.`);

        this.cards = this.#shuffleCards(cards);
        this.#dealCards(this.cards, playerOne, playerTwo);
        console.log("🎲 The cards have been shuffled and dealt to both players.");
    }

    #shuffleCards(cards) {
        let currentIndex = cards.length;
        let randomIndex;
    
        while(currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
        }
    
        return cards;
    }

    #dealCards(cards, playerOne, playerTwo) {
        for(let i = 0; i < 12; i++) {
            if(i % 2 == 0) {
                playerOne.hand.push(cards[i]);
            } else {
                playerTwo.hand.push(cards[i]);
            }
        }
    }

    rotateCards(cards) {

    }
}