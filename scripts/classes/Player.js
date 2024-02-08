export default class Player {   
    constructor(name) {
        this.id = "1";
        this.name = name;
        this.active = undefined;
        this.hand = [];
        this.victoryPoints = 0;
    }
}