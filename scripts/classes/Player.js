

export default class Player {
    static id = 1;
    
    constructor(name) {
        this.id = (Player.id++).toString();
        this.name = name;
        this.hand = [];
        this.victoryPoints = 0;
    }

    #selectCard(hand) {
        return card;
    }

    #selectTheater(theater) {
        return theater;
    }

    #selectAction() {
        return "improvise";
    }

    play(selectedCard, selectedTheater, selectedAction) {
        console.log("Bot is playing.");
    }
}