import Game from "./Game.js";
import UI from "./UI.js";

export default class App {
    constructor(playerName, gameMode) {
        this.playerName = playerName;
        this.gameMode = gameMode;
        this.games = [];

        this.#initializeApp();
    }

    #initializeApp() {
        this.#addEventListners();
        this.#createGame();
    }

    #addEventListners() {
        UI.nextGameButtonEl.addEventListener("click", () => {
            UI.clearUI();
            this.#createGame();
        });
    }

    #createGame() {
        this.games.push(new Game(this));
    }
}