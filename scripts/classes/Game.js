import { CONFIG } from "../data/CONFIG.js";
import { THEATERS } from "../data/THEATERS.js";
import { CARDS } from "../data/CARDS.js";
import Player from "./Player.js";
import Bot from "./Bot.js";
import Theater from "./Theater.js";
import Card from "./Card.js";
import Battle from "./Battle.js";
import UI from "./UI.js";

export default class Game {
    static id = 1;

    constructor(app) {
        this.id = (Game.id++).toString();
        this.players = [];
        this.theaters = [];
        this.cards = [];
        this.battles = [];
        this.winningCondition = undefined;

        this.#initializeGame(app);
    }

    #initializeGame(app) {
        this.#createPlayer(app.playerName);
        this.#createBot(app.botName);
        this.#createTheaters(THEATERS);
        this.#createCards(CARDS);
        this.#setGameMode(app.gameMode);
        this.#determineStartingPlayer(this.players);
        this.#addEventListeners();
        this.#createBattle();
    }

    #determineStartingPlayer(players) {
        const randomNumber = Math.floor(Math.random() * 2);

        switch(randomNumber) {
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

    #createPlayer(playerName) {
        this.players.push(new Player(playerName));
    }
    
    #createBot(botName) {
        this.players.push(new Bot(botName));
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
                this.winningCondition = 3;
                UI.withdrawButtonEl.remove();
                break;
            case "Normal":
                this.winningCondition = 12;
                break;
        }
    }

    #addEventListeners() {
        UI.nextBattleButtonEl.addEventListener("click", () => {
            UI.clearUI();
            this.#createBattle();
        });
    }

    #createBattle() {
        this.battles.push(new Battle(this));
        UI.nextBattleButtonEl.disabled = true;
    }
}
