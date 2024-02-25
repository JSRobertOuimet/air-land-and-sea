export default class Theater {
    static id = 1;

    constructor(name) {
        this.id = (Theater.id++).toString();
        this.name = name;
        this.playerOneCards = [];
        this.playerOneCardsTotal = 0;
        this.playerTwoCards = [];
        this.playerTwoCardsTotal = 0;
    }
}
