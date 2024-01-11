import Player from "./Player.js";
import Theater from "./Theater.js";
import Card from "./Card.js";
import Battle from "./Battle.js";

export default class Game {
    static id = 1;
    static theaters = ["Air", "Land", "Sea"];
    static cards = [
        {"theater": "Air", "strength": 1, "tacticalAbility": "Support", "type": "Ongoing", "description": "You gain +3 strength in each adjacent theater."},
        {"theater": "Air", "strength": 2, "tacticalAbility": "Air Drop", "type": "Instant", "description": "The next time you play a card, you may play it to a non-matching theater."},
        {"theater": "Air", "strength": 3, "tacticalAbility": "Maneuver", "type": "Instant", "description": "Flip an uncovered card in an adjacent theater."},
        {"theater": "Air", "strength": 4, "tacticalAbility": "Aerodrome", "type": "Ongoing", "description": "You may play cards of strength 3 or less to non-matching theaters."},
        {"theater": "Air", "strength": 5, "tacticalAbility": "Containment", "type": "Ongoing", "description": "If any player plays a facedown card, destroy that card."},
        {"theater": "Air", "strength": 6, "tacticalAbility": "Heavy Bombers", "type": "N/A", "description": "N/A"},
        {"theater": "Land", "strength": 1, "tacticalAbility": "Reinforce", "type": "Instant", "description": "Draw 1 card and play it facedown to an adjacent theater."},
        {"theater": "Land", "strength": 2, "tacticalAbility": "Ambush", "type": "Instant", "description": "Flip any uncovered card."},
        {"theater": "Land", "strength": 3, "tacticalAbility": "Maneuver", "type": "Instant", "description": "Flip and uncovered card in an adjacent theater."},
        {"theater": "Land", "strength": 4, "tacticalAbility": "Cover Fire", "type": "Ongoing", "description": "All cards covered by this card are now strength 4."},
        {"theater": "Land", "strength": 5, "tacticalAbility": "Disrupt", "type": "Instant", "description": "Starting with you, both players choose and flip 1 of their uncovered cards."},
        {"theater": "Land", "strength": 6, "tacticalAbility": "Heavy Tanks", "type": "N/A", "description": "N/A"},
        {"theater": "Sea", "strength": 1, "tacticalAbility": "Transport", "type": "Instant", "description": "You may move 1 of your cards to a different theater."},
        {"theater": "Sea", "strength": 2, "tacticalAbility": "Escalation", "type": "Ongoing", "description": "All of your facedown cards are now strength 4."},
        {"theater": "Sea", "strength": 3, "tacticalAbility": "Maneuver", "type": "Instant", "description": "Flip an uncovered card in an adjacent theater."},
        {"theater": "Sea", "strength": 4, "tacticalAbility": "Redeploy", "type": "Instant", "description": "You may return 1 of your facedown cards to your hand. If you do, play a card."},
        {"theater": "Sea", "strength": 5, "tacticalAbility": "Blockade", "type": "Ongoing", "description": "If any player plays a card to an adjacent theater occupied by at least 3 other cards, destroy that card."},
        {"theater": "Sea", "strength": 6, "tacticalAbility": "Super Battleship", "type": "N/A", "description": "N/A"}
];

    constructor() {
        this.id = (Game.id++).toString();
        this.theaters = [];
        this.cards = [];
        this.players = [];
        this.battles = [];

        this.#initializeGame(Game.theaters, Game.cards);
    }

    #initializeGame(theaters, cards) {
        this.#createTheaters(theaters);
        this.#createCards(cards);
    }

    #createTheaters(theaters) {
        theaters.forEach(theater => this.theaters.push(new Theater(theater)));
    }

    #createCards(cards) {
        cards.forEach(card => this.cards.push(new Card(card)));
    }
    
    createPlayer(name) {
        this.players.push(new Player(name));
    }

    createBattle() {
        this.battles.push(new Battle(this.theaters, this.cards, this.players));
    }
}