export default class Theater {
    constructor(theater) {
        this.id = theater.id;
        this.name = theater.name;
        this._playerCards = [];
        this._playerBonus = [];
        this._playerTotal = 0;
        this._botCards = [];
        this._botBonus = [];
        this._botTotal = 0;
    }

    get playerCards() {
        return this._playerCards;
    }

    set playerCards(value) {
        this._playerCards = value;
    }

    get playerTotal() {
        return this._playerTotal;
    }

    set playerTotal(value) {
        this._playerTotal = value;
    }

    get playerBonus() {
        return this._playerBonus;
    }

    set playerBonus(value) {
        this._playerBonus = value;
    }

    get botCards() {
        return this._botCards;
    }

    set botCards(value) {
        this._botCards = value;
    }

    get botTotal() {
        return this._botTotal;
    }

    set botTotal(value) {
        this._botTotal = value;
    }

    get botBonus() {
        return this._botBonus;
    }

    set botBonus(value) {
        this._botBonus = value;
    }

    calculatePlayerTotal(playerId) {
        const totalProperty = playerId === "1" ? "playerTotal" : "botTotal";

        this[totalProperty] = this.calculatePlayerSubtotal(playerId) + this.calculatePlayerBonus(playerId);
    }

    calculatePlayerSubtotal(playerId) {
        const cardStrength = card => (card.facedown ? card.improviseStrength : card.deployStrength);
        const cardPoints = this.getCardsInTheater(playerId).map(cardStrength);

        return cardPoints.reduce((sum, point) => sum + point, 0);
    }

    calculatePlayerBonus(playerId) {
        return playerId === "1" ? this.playerBonus.reduce((sum, point) => sum + point, 0) : this.botBonus.reduce((sum, point) => sum + point, 0);
    }

    getCardsInTheater(playerId) {
        return playerId === "1" ? this.playerCards : this.botCards;
    }
}
