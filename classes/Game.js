import Theater from "./Theater.js";
import Card from "./Card.js";
import Battle from "./Battle.js";

export default class Game {
    constructor(playerOne, playerTwo) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.battles = [];

        const theaterBoards = [
            new Theater("⛅️ Air"),
            new Theater("🏔 Land"),
            new Theater("🏝 Sea")
        ];
        const cards = [
            new Card("Air", 1, "Support"),
            new Card("Air", 2, "Air Drop"),
            new Card("Air", 3, "Maneuver"),
            new Card("Air", 4, "Aerodrome"),
            new Card("Air", 5, "Containment"),
            new Card("Air", 6, "Heavy Bombers"),
            new Card("Land", 1, "Reinforce"),
            new Card("Land", 2, "Ambush"),
            new Card("Land", 3, "Maneuver"),
            new Card("Land", 4, "Cover Fire"),
            new Card("Land", 5, "Disrupt"),
            new Card("Land", 6, "Heavy Tanks"),
            new Card("Sea", 1, "Transport"),
            new Card("Sea", 2, "Escalation"),
            new Card("Sea", 3, "Maneuver"),
            new Card("Sea", 4, "Redeploy"),
            new Card("Sea", 5, "Blockade"),
            new Card("Sea", 6, "Super Battleship")
        ];

        console.log(`${playerOne.name} (Player ${playerOne.id}) joined the game.`);
        console.log(`${playerTwo.name} (Player ${playerTwo.id}) joined the game.`);

        this.battles.push(new Battle(playerOne, playerTwo, theaterBoards, cards));
    }
}