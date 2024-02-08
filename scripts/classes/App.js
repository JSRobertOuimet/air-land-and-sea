import Game from "./Game.js";
import UI from "./UI.js";

export default class App {
    constructor(options) {
        this.playerName = options.playerName;
        this.botName = options.botName;
        this.gameMode = options.gameMode;
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