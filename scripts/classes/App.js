import Game from "./Game.js";
import UI from "./UI.js";

export default class App {
    constructor(options) {
        const { playerName, gameMode } = options;

        this._playerName = playerName;
        this._gameMode = gameMode;
        this._games = [];

        this.#initializeApp();
    }

    get playerName() {
        return this._playerName;
    }

    set playerName(value) {
        this._playerName = value;
    }

    get gameMode() {
        return this._gameMode;
    }

    set gameMode(value) {
        this._gameMode = value;
    }

    get games() {
        return this._games;
    }

    set games(value) {
        this._games = value;
    }

    #initializeApp() {
        this.#addEventListners();
        this.#createGame();
    }

    #addEventListners() {
        UI.nextGameButtonEl.addEventListener("click", () => {
            UI.clearForNextBattle();
            this.#createGame();
        });
    }

    #createGame() {
        this.games.push(new Game(this));
    }
}
