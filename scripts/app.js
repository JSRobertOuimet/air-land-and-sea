import Bot from "./classes/Bot.js";
import Game from "./classes/Game.js";
import Battle from "./classes/Battle.js";

const playerName = "Franklin D. Roosevelt";
const game = new Game(playerName);

for(let b = 1; b <= 3; b++) {
    const battle = game.battles.at(-1);

    if (battle.getStartingPlayer() instanceof Bot) {
        battle.play();
    }
    
    if (battle.turns === 0) {
        battle.endBattle();
    } else {
        battle.switchActivePlayer();
    
        if (battle.getActivePlayer() instanceof Bot) {
            battle.play();
        }
    }
}