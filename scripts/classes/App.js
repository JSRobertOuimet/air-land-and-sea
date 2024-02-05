import Game from "./Game.js";
import UI from "./UI.js";

export default class App {
    constructor(playerName) {
        this.playerName = playerName;
        this.games = [];

        this.#initializeApp();
    }

    #initializeApp() {
        this.#addEventListners();
        this.#createGame();
    }

    #addEventListners() {
        UI.nextGameButtonEl.addEventListener("click", () => {
            UI.overlayEl.style.display = "none";
            UI.mainAreaEl.innerHTML = "";
            UI.playerOneHandEl.innerHTML = "";
            UI.playerTwoHandEl.innerHTML = "";
            this.#createGame();
        });
    }

    #createGame() {
        this.games.push(new Game(this));
    }
}