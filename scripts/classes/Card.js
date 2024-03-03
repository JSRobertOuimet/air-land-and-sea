export default class Card {
    static id = 1;

    constructor(card) {
        this.id = (Card.id++).toString();
        this._theater = card.theater;
        this._deployStrength = card.deployStrength;
        this._overwrittenDeployStrength = false;
        this._improviseStrength = card.improviseStrength;
        this._overwrittenImproviseStrength = false;
        this._tacticalAbility = card.tacticalAbility;
        this._type = card.type;
        this._typeSymbol = card.typeSymbol;
        this._description = card.description;
        this._facedown = false;
        this._covered = false;
    }

    get theater() {
        return this._theater;
    }

    set theater(value) {
        this._theater = value;
    }

    get deployStrength() {
        return this._overwrittenDeployStrength ? 4 : this._deployStrength;
    }

    set deployStrength(value) {
        this._deployStrength = value;
    }

    get improviseStrength() {
        return this._overwrittenImproviseStrength ? 4 : this._improviseStrength;
    }

    set improviseStrength(value) {
        this._improviseStrength = value;
    }

    get overwrittenDeployStrength() {
        return this._overwrittenDeployStrength;
    }

    set overwrittenDeployStrength(value) {
        this._overwrittenDeployStrength = value;
    }

    get overwrittenImproviseStrength() {
        return this._overwrittenImproviseStrength;
    }

    set overwrittenImproviseStrength(value) {
        this._overwrittenImproviseStrength = value;
    }

    get tacticalAbility() {
        return this._tacticalAbility;
    }

    set tacticalAbility(value) {
        this._tacticalAbility = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get typeSymbol() {
        return this._typeSymbol;
    }

    set typeSymbol(value) {
        this._typeSymbol = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
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
        this.facedown = !this.facedown;
    }
}
