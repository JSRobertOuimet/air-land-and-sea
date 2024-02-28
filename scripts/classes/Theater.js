export default class Theater {
    static id = 1;

    constructor(name) {
        this.id = (Theater.id++).toString();
        this.name = name;
        this.playerOneCards = [];
        this.playerOneBonus = [];
        this.playerOneScore = 0;
        this.playerTwoCards = [];
        this.playerTwoBonus = [];
        this.playerTwoScore = 0;
    }

    calculatePlayerScore(playerID) {
        const cardStrength = card => (card.facedown ? card.improviseStrength : card.deployStrength);
        const cardPoints = this.#getCardsForPlayer(playerID).map(cardStrength);
        const subtotal = cardPoints.reduce((sum, point) => sum + point, 0);
        const additionalPoints = this.#getAdditionalPointsForPlayer(playerID);
        const total =
            playerID === "1"
                ? (this.playerOneScore = subtotal + additionalPoints.reduce((sum, point) => sum + point, 0))
                : (this.playerTwoScore = subtotal + additionalPoints.reduce((sum, point) => sum + point, 0));

        return total;
    }

    #getCardsForPlayer(playerID) {
        return playerID === "1" ? this.playerOneCards : this.playerTwoCards;
    }

    #getAdditionalPointsForPlayer(playerID) {
        return playerID === "1" ? this.playerOneBonus : this.playerTwoBonus;
    }
}
