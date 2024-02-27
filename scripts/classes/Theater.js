import Player from "./Player.js";

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

    calculatePlayerScore(player) {
        debugger;
        let points = [];
        let subtotal = 0;

        switch (player) {
            case "playerOne":
                if (this.playerOneCards.length === 0) return 0;

                this.playerOneCards.forEach(playerOneCard => {
                    if (playerOneCard.facedown) {
                        points.push(playerOneCard.improviseStrength);
                    } else {
                        points.push(playerOneCard.deployStrength);
                    }
                });

                subtotal = this.#calculateSubtotal(points);

                return this.playerOneAdditionalPoints.reduce((accumulator, current) => accumulator + current, subtotal);
            case "playerTwo":
                if (this.playerTwoCards.length === 0) return 0;

                this.playerTwoCards.forEach(playerTwoCard => {
                    if (playerTwoCard.facedown) {
                        points.push(playerTwoCard.improviseStrength);
                    } else {
                        points.push(playerTwoCard.deployStrength);
                    }
                });

                subtotal = this.#calculateSubtotal(points);

                return this.playerTwoAdditionalPoints.reduce((accumulator, current) => accumulator + current, subtotal);
        }
    }

    #calculateSubtotal(points) {
        return points.reduce((accumulator, current) => accumulator + current, 0);
    }
}
