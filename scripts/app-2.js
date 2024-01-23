import Game from "./classes/Game.js";
import { THEATERS } from "./data/THEATERS.js";
import { CARDS } from "./data/CARDS.js";
import Player from "./classes/Player.js";
import Bot from "./classes/Bot.js";
import Log from "./classes/Log.js";
import UI from "./classes/UI.js";

const game = new Game();

game.createPlayers([new Player("Franklin D. Roosevelt"), new Bot()]);
game.createTheaters(game.shuffleCards(THEATERS));
game.createCards(game.shuffleCards(CARDS));
game.createBattle();

