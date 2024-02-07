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
        this.app = app;
        this.mode = app.gameMode;
        this.players = [];
        this.theaters = [];
        this.cards = [];
        this.battles = [];
        this.winningCondition = undefined;

        this.#initializeGame(app.playerName);
    }

    #initializeGame(playerName) {
        this.#createPlayer(playerName);
        this.#createPlayer();
        this.#createTheaters(THEATERS);
        this.#createCards(CARDS);
        this.#setGameMode();
        this.#addEventListeners();
        this.#createBattle();
    }

    #setGameMode() {
        switch (this.mode) {
            case "Beginner":
                this.winningCondition = 3;
                UI.withdrawButtonEl.remove();
                break;
            case "Normal":
                this.winningCondition = 12;
                break;
        }
    }

    #createPlayer(playerName) {
        if (playerName != undefined) {
            this.players.push(new Player(playerName));
        } else {
            this.players.push(new Bot());
        }
    }

    #createTheaters(theaters) {
        theaters.forEach(theater => this.theaters.push(new Theater(theater)));
    }

    #createCards(cards) {
        cards.forEach(card => this.cards.push(new Card(card)));
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
