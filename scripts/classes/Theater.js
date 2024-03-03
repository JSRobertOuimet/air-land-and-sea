export default class Theater {
    static id = 1;

    constructor(name) {
        this.id = (Theater.id++).toString();
        this.name = name;
        this._playerOneCards = [];
        this._playerOneBonus = [];
        this._playerOneTotal = 0;
        this._playerTwoCards = [];
        this._playerTwoBonus = [];
        this._playerTwoTotal = 0;
    }

    get playerOneCards() {
        return this._playerOneCards;
    }

    set playerOneCards(value) {
        this._playerOneCards = value;
    }

    get playerOneTotal() {
        return this._playerOneTotal;
    }

    set playerOneTotal(value) {
        this._playerOneTotal = value;
    }

    get playerOneBonus() {
        return this._playerOneBonus;
    }

    set playerOneBonus(value) {
        this._playerOneBonus = value;
    }

    get playerTwoCards() {
        return this._playerTwoCards;
    }

    set playerTwoCards(value) {
        this._playerTwoCards = value;
    }

    get playerTwoTotal() {
        return this._playerTwoTotal;
    }

    set playerTwoTotal(value) {
        this._playerTwoTotal = value;
    }

    get playerTwoBonus() {
        return this._playerTwoBonus;
    }

    set playerTwoBonus(value) {
        this._playerTwoBonus = value;
    }

    calculatePlayerTotal(playerID) {
        playerID === "1"
            ? (this.playerOneTotal = this.calculatePlayerSubtotal("1") + this.calculatePlayerBonus("1"))
            : (this.playerTwoTotal = this.calculatePlayerSubtotal("2") + this.calculatePlayerBonus("2"));
    }

    calculatePlayerSubtotal(playerID) {
        const cardStrength = card => (card.facedown ? card.improviseStrength : card.deployStrength);
        const cardPoints = this.getCardsInTheater(playerID).map(cardStrength);

        return cardPoints.reduce((sum, point) => sum + point, 0);
    }

    calculatePlayerBonus(playerID) {
        return playerID === "1"
            ? this.playerOneBonus.reduce((sum, point) => sum + point, 0)
            : this.playerTwoBonus.reduce((sum, point) => sum + point, 0);
    }

    getCardsInTheater(playerID) {
        return playerID === "1" ? this.playerOneCards : this.playerTwoCards;
    }
}
