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

    get playerTwoScore() {
        return this._playerTwoTotal;
    }

    set playerTwoScore(value) {
        this._playerTwoTotal = value;
    }

    get playerTwoBonus() {
        return this._playerTwoBonus;
    }

    set playerTwoBonus(value) {
        this._playerTwoBonus = value;
    }

    calculatePlayerTotal(playerID) {
        const cardStrength = card => (card.facedown ? card.improviseStrength : card.deployStrength);
        const cardPoints = this.#getCardsForPlayer(playerID).map(cardStrength);
        const subtotal = cardPoints.reduce((sum, point) => sum + point, 0);
        const additionalPoints = this.#getAdditionalPointsForPlayer(playerID);
        const total =
            playerID === "1"
                ? (this.playerOneTotal = subtotal + additionalPoints.reduce((sum, point) => sum + point, 0))
                : (this.playerTwoScore = subtotal + additionalPoints.reduce((sum, point) => sum + point, 0));

        return total;
    }

    calculatePlayerSubtotal(playerID) {
        const cardStrength = card => (card.facedown ? card.improviseStrength : card.deployStrength);
        const cardPoints = this.#getCardsForPlayer(playerID).map(cardStrength);

        return cardPoints.reduce((sum, point) => sum + point, 0);
    }

    calculatePlayerBonus(playerID) {
        return playerID === "1"
            ? this.playerOneBonus.reduce((sum, point) => sum + point, 0)
            : this.playerTwoBonus.reduce((sum, point) => sum + point, 0);
    }

    #getCardsForPlayer(playerID) {
        return playerID === "1" ? this.playerOneCards : this.playerTwoCards;
    }

    #getAdditionalPointsForPlayer(playerID) {
        return playerID === "1" ? this.playerOneBonus : this.playerTwoBonus;
    }
}
