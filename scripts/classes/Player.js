export default class Player {
    static id = 1;
    
    constructor(name) {
        this.id = (Player.id++).toString();
        this.name = name;
        this.hand = [];
        this.victoryPoints = 0;
    }
}