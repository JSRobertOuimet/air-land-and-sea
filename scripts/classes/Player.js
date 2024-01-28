export default class Player {   
    #id = "1";
    
    constructor(name) {
        this.name = name;
        this.active = true;
        this.hand = [];
    }
}