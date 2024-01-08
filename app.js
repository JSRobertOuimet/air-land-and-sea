import Game from "./classes/Game.js";

const game = new Game();

// for(let player = 1; player <= 2; player++) {
//     const playerName = prompt("What’s your name?");

//     game.createPlayer(playerName);
// }

game.createPlayer("Allison");
game.createPlayer("Jean-Simon");

game.createBattle();

// console.log(game);
console.table(game.players[0].hand);
// console.table(game.players[1].hand);