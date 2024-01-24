import UI from "./UI.js";

export default class Bot {
    constructor() {
        this.id = "2";
        this.name = "Bot";
        this.active = false;
        this.hand = [];
    }

    selectCard() {
        return this.hand[Math.floor(Math.random() * this.hand.length)];
    }

    selectAction() {
        return "improvise";
    }

    selectTheater(theaters) {
        return theaters[Math.floor(Math.random() * theaters.length)];
    }
}