export default class Theater {
    static id = 1;

    constructor(name) {
        this.id = (Theater.id++).toString();
        this.name = name;
        this.playerOneCards = [];
        this.playerOnePoints = 0;
        this.playerOneAdditionalPoints = [];
        this.playerTwoCards = [];
        this.playerTwoPoints = 0;
        this.playerTwoAdditionalPoints = [];
    }
}
