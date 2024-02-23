export default class Card {
    static id = 1;

    constructor(card) {
        this.id = (Card.id++).toString();
        this.theater = card.theater;
        this.deployStrength = card.deployStrength;
        this.improviseStrength = card.improviseStrength;
        this.tacticalAbility = card.tacticalAbility;
        this.type = card.type;
        this.typeSymbol = card.typeSymbol;
        this.description = card.description;
        this._facedown = false;
        this._covered = false;
    }

    get facedown() {
        return this._facedown;
    }

    set facedown(value) {
        this._facedown = value;
    }

    get covered() {
        return this._covered;
    }

    set covered(value) {
        this._covered = value;
    }

    flipCard() {
        this.facedown === true ? this.facedown = false : this.facedown = true;
    }
}