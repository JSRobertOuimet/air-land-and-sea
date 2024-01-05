import Theater from "./Theater.js";
import Card from "./Card.js";
import Battle from "./Battle.js";
import UI from "./UI.js";

export default class Game {
    constructor(playerOne, playerTwo) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.battles = [];

        const theaterBoards = [
            new Theater("Air"),
            new Theater("Land"),
            new Theater("Sea")
        ];
        const cards = [
            new Card("Air", 1, "Support", "Ongoing", "You gain +3 strength in each adjacent theater."),
            new Card("Air", 2, "Air Drop", "Instant", "The next time you play a card, you may play it to a non-matching theater."),
            new Card("Air", 3, "Maneuver", "Instant", "Flip an uncovered card in an adjacent theater."),
            new Card("Air", 4, "Aerodrome", "Ongoing", "You may play cards of strength 3 or less to non-matching theaters."),
            new Card("Air", 5, "Containment", "Ongoing", "If any player plays a facedown card, destroy that card."),
            new Card("Air", 6, "Heavy Bombers", "", ""),
            new Card("Land", 1, "Reinforce", "Instant", "Draw 1 card and play it facedown to an adjacent theater."),
            new Card("Land", 2, "Ambush", "Instant", "Flip any uncovered card."),
            new Card("Land", 3, "Maneuver", "Instant", "Flip and uncovered card in an adjacent theater."),
            new Card("Land", 4, "Cover Fire", "Ongoing", "All cards covered by this card are now strength 4."),
            new Card("Land", 5, "Disrupt", "Instant", "Starting with you, both players choose and flip 1 of their uncovered cards."),
            new Card("Land", 6, "Heavy Tanks", "", ""),
            new Card("Sea", 1, "Transport", "Instant", "You may move 1 of your cards to a different theater."),
            new Card("Sea", 2, "Escalation", "Ongoing", "All of your facedown cards are now strength 4."),
            new Card("Sea", 3, "Maneuver", "Instant", "Flip an uncovered card in an adjacent theater."),
            new Card("Sea", 4, "Redeploy", "Instant", "You may return 1 of your facedown cards to your hand. If you do, play a card."),
            new Card("Sea", 5, "Blockade", "Ongoing", "If any player plays a card to an adjacent theater occupied by at least 3 other cards, destroy that card."),
            new Card("Sea", 6, "Super Battleship", "", "")
        ];

        const ui = new UI();

        console.log(`${playerOne.name} (Player ${playerOne.id}) joined the game.`);
        console.log(`${playerTwo.name} (Player ${playerTwo.id}) joined the game.`);

        this.battles.push(new Battle(playerOne, playerTwo, theaterBoards, cards, ui));
    }
}