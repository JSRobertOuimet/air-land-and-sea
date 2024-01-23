import Theater from "./Theater.js";
import Card from "./Card.js";
import Battle from "./Battle.js";

export default class Game {
    static id = 1;

    constructor() {
        this.id = (Game.id++).toString();
        this.players = [];
        this.theaters = [];
        this.cards = [];
        this.battles = [];
    }

    createPlayers(players) {
        this.players.push(...players);
    }

    createTheaters(theaters) {
        theaters.forEach(theater => this.theaters.push(new Theater(theater)));
    }

    createCards(cards) {
        cards.forEach(card => this.cards.push(new Card(card)));
    }

    createBattle() {
        this.battles.push(new Battle(this));
        console.log(this.battles);
    }

    shuffleCards(cards) {
        let currentIndex = cards.length;
        let randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
        }

        return cards;
    }

    rotateTheaters(theaters) {
        const lastTheater = theaters.pop();

        this.theaters.unshift(lastTheater);
    }
}