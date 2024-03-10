import { THEATERS } from "../data/THEATERS.js";
import { CARDS } from "../data/CARDS.js";
import Player from "./Player.js";
import Bot from "./Bot.js";
import Theater from "./Theater.js";
import Card from "./Card.js";
import Battle from "./Battle.js";
import UI from "../UI.js";

export default class Game {
    static id = 1;

    #botNames = [
        "Franklin D. Roosevelt",
        "Winston Churchill",
        "Charles de Gaulle",
        "Theodore Roosevelt",
        "Harry S. Truman",
        "Dwight D. Eisenhower",
        "John F. Kennedy",
        "George V",
        "George VI",
    ];

    constructor(app) {
        this.id = (Game.id++).toString();
        this.app = app;
        this.players = [];
        this.theaters = [];
        this.cards = [];
        this.battles = [];
        this.winningScore = undefined;

        this.#initializeGame(app);
    }

    get botNames() {
        return this.#botNames;
    }

    set botNames(value) {
        this.#botNames = value;
    }

    #initializeGame(app) {
        this.#createPlayer(app.playerName);
        this.#createBot(this.#getBotName());
        this.#createTheaters(THEATERS);
        this.#createCards(CARDS);
        this.#setGameMode(app.gameMode);
        this.#determineStartingPlayer(this.players);
        this.createBattle();
    }

    #createPlayer(playerName) {
        this.players.push(new Player(playerName));
    }

    #createBot(botName) {
        this.players.push(new Bot(botName));
    }

    #getBotName() {
        const randomIndex = Math.floor(Math.random() * this.botNames.length);

        return this.botNames[randomIndex];
    }

    #createTheaters(theaters) {
        theaters.forEach(theater => this.theaters.push(new Theater(theater)));
    }

    #createCards(cards) {
        cards.forEach(card => this.cards.push(new Card(card)));
    }

    #setGameMode(gameMode) {
        switch (gameMode) {
            case "Beginner":
                this.winningScore = 3;
                break;
            case "Normal":
                this.winningScore = 12;
                UI.displayWithdrawButton();
                break;
        }
    }

    #determineStartingPlayer(players) {
        const randomNumber = Math.floor(Math.random() * 2);

        switch (randomNumber) {
            case 0:
                players[0].active = true;
                players[1].active = false;
                break;
            case 1:
                players[0].active = false;
                players[1].active = true;
                break;
        }
    }

    createBattle() {
        this.battles.push(new Battle(this));
    }

    getActivePlayer() {
        const activePlayer = this.players.find(player => player.active);

        UI.markActivePlayer(activePlayer);

        return activePlayer;
    }

    isGameWon() {
        return this.players[0].victoryPoints === this.winningScore || this.players[1].victoryPoints === this.winningScore;
    }
}
