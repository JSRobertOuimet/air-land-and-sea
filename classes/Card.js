export default class Card {
    static id = 1;

    constructor(card) {
        this.id = (Card.id++).toString();
        this.theater = card.theater;
        this.strength = card.strength;
        this.tacticalAbility = card.tacticalAbility;
        this.type = card.type;
        this.typeSymbol = card.typeSymbol;
        this.description = card.description;
        this.facedown = false;
        this.covered = false;
    }
}