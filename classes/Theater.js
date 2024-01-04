export default class Theater {
    static id = 1;

    constructor(name) {
        this.id = Theater.id++;
        this.name = name;
        this.playerOneCards = [];
        this.playerTwoCards = [];
    }
}