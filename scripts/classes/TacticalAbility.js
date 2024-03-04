import Player from "./Player.js";
import UI from "./UI.js";
import { getAdjacentTheaters, getCoveredCards, getAllCards } from "../utils.js";

export default class TacticalAbility {
    constructor() {}

    static support(parameters) {
        const { activePlayer, theaters, selectedTheater } = parameters;
        const adjacentTheaters = getAdjacentTheaters(theaters, selectedTheater);

        adjacentTheaters.forEach(adjacentTheater => {
            if (activePlayer instanceof Player) {
                adjacentTheater.playerOneBonus.push(3);
            } else {
                adjacentTheater.playerTwoBonus.push(3);
            }
        });

        UI.displayPlayerTotal(theaters);
    }

    static coverFire(parameters) {
        const { activePlayer, theaters, selectedTheater } = parameters;
        const coveredCards = getCoveredCards(activePlayer, selectedTheater);

        coveredCards.forEach(coveredCard => {
            coveredCard.overwrittenDeployStrength = true;
            coveredCard.overwrittenImproviseStrength = true;
            UI.displayCardOverwrittenStrength(coveredCard);
        });

        UI.displayPlayerTotal(theaters);
    }

    static escalation(parameters) {
        const { activePlayer, theaters } = parameters;
        const playerCards = getAllCards(activePlayer, theaters);

        playerCards.forEach(facedownCard => {
            facedownCard.overwrittenImproviseStrength = true;
            UI.displayCardOverwrittenStrength(facedownCard);
        });

        UI.displayPlayerTotal(theaters);
    }
}
