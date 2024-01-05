import Player from "./classes/Player.js";
import Game from "./classes/Game.js";

// GAME SETUP //
const playerOne = new Player("Allison");
const playerTwo = new Player("JS");
const game = new Game(playerOne, playerTwo);

// // BATTLE 1 //
// playerOne.improvise(playerOne.hand[0], game.battles[0].theaters[0]);
// playerTwo.improvise(playerTwo.hand[0], game.battles[0].theaters[0]);
// playerOne.improvise(playerOne.hand[0], game.battles[0].theaters[1]);
// playerTwo.improvise(playerTwo.hand[0], game.battles[0].theaters[1]);
// playerOne.improvise(playerOne.hand[0], game.battles[0].theaters[2]);
// playerTwo.improvise(playerTwo.hand[0], game.battles[0].theaters[2]);
// playerOne.improvise(playerOne.hand[0], game.battles[0].theaters[0]);
// playerTwo.improvise(playerTwo.hand[0], game.battles[0].theaters[0]);
// playerOne.improvise(playerOne.hand[0], game.battles[0].theaters[1]);
// playerTwo.improvise(playerTwo.hand[0], game.battles[0].theaters[1]);
// playerOne.improvise(playerOne.hand[0], game.battles[0].theaters[2]);
// playerTwo.improvise(playerTwo.hand[0], game.battles[0].theaters[2]);

// console.table(game.battles[0].theaters[0].playerOneCards);
// console.table(game.battles[0].theaters[0].playerTwoCards);
// console.table(game.battles[0].theaters[1].playerOneCards);
// console.table(game.battles[0].theaters[1].playerTwoCards);
// console.table(game.battles[0].theaters[2].playerOneCards);
// console.table(game.battles[0].theaters[2].playerTwoCards);