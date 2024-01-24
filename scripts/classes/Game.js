import { THEATERS } from "../data/THEATERS.js";
import { CARDS } from "../data/CARDS.js";
import Player from "./Player.js";
import Bot from "./Bot.js";
import Theater from "./Theater.js";
import Card from "./Card.js";
import Battle from "./Battle.js";

export default class Game {
    static id = 1;

    constructor(playerName) {
        this.id = (Game.id++).toString();
        this.players = [new Bot()];
        this.theaters = [];
        this.cards = [];
        this.battles = [];

        this.#initializeGame(playerName);
        this.createBattle(this);
    }
    
    #initializeGame(playerName) {
        this.#createPlayer(playerName);
        this.#createTheaters(THEATERS);
        this.#createCards(CARDS);
        this.shuffleCards(this.theaters);
    }

    #createPlayer(playerName) {
        this.players.unshift(new Player(playerName));
    }

    #createTheaters(theaters) {
        theaters.forEach(theater => this.theaters.push(new Theater(theater)));
    }

    #createCards(cards) {
        cards.forEach(card => this.cards.push(new Card(card)));
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

    createBattle(game) {
        this.battles.push(new Battle(game));
    }

    #rotateTheaters(theaters) {
        const lastTheater = theaters.pop();

        this.theaters.unshift(lastTheater);
    }
}