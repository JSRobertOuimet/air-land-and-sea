export default class Card {
    static id = 1;

    constructor(type, strength, tacticalAbility) {
        this.id = Card.id++;
        this.type = type;
        this.strength = strength;
        this.tacticalAbility = tacticalAbility;
        this.facedown = false;
        this.covered = false;
    }
}