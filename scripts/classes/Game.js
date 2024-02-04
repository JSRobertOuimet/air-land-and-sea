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

    constructor(playerName) {
        this.id = (Game.id++).toString();
        this.players = [];
        this.theaters = [];
        this.cards = [];
        this.battles = [];

        this.#initializeGame(playerName);
    }
    
    #initializeGame(playerName) {
        this.#createPlayer(playerName);
        this.#createPlayer();
        this.#createTheaters(THEATERS);
        this.#createCards(CARDS);
        this.#addEventListeners();
        this.#createBattle();
    }

    #createPlayer(playerName) {
        if(playerName != undefined) {
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
            UI.overlayEl.style.display = "none";
            UI.mainAreaEl.innerHTML = "";
            UI.playerOneHandEl.innerHTML = "";
            UI.playerTwoHandEl.innerHTML = "";
            this.#createBattle();
        });
    }

    #createBattle() {
        this.battles.push(new Battle(this));
        UI.nextBattleButtonEl.disabled = true;
    }
}