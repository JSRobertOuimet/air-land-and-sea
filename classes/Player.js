export default class Player {
    static id = 1;
    
    constructor(name) {
        this.id = Player.id++;
        this.name = name;
        this.isActive = this.id === 1 ? true : false;
        this.hand = [];
        this.victoryPoints = 0;
    }

    deploy(card, theater) {
        // Must validate if this card can be deployed on that theater.
    }

    improvise(card, theater) {
        this.hand = this.hand.filter(element => element.id !== card.id);
        card.facedown = true;

        if(this.id === 1) {
            theater.playerOneCards.push(card);

            if(theater.playerOneCards.length > 1) {
                theater.playerOneCards.slice(-2)[0].covered = true;
            }
        } else {
            theater.playerTwoCards.push(card);
            theater.playerTwoCards.slice(-2)[0].covered = true;
        }

        console.log(`${this.name} played a card facedown (${card.tacticalAbility}) in the ${theater.name} theater.`);
    }

    withdraw() {

    }
}