import Game from "./Game.js";

export default class App {
    constructor(playerName) {
        this.playerName = playerName;
        this.games = [];
    }

    createGame() {
        this.games.push(new Game(this));
    }
}