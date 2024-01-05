export default class Card {
    static id = 1;

    constructor(theater, strength, tacticalAbility, type, description) {
        this.id = Card.id++;
        this.theater = theater;
        this.strength = strength;
        this.tacticalAbility = tacticalAbility;
        this.type = type;
        this.description = description;
        this.facedown = false;
        this.covered = false;
    }
}