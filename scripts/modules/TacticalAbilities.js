import Player from "../classes/Player.js";
import UI from "./UI.js";
import { getAdjacentTheaters, getCoveredCards, getAllCards } from "./utils.js";

const TacticalAbilities = {
    coverFire: function (parameters) {
        const { activePlayer, theaters, selectedTheater } = parameters;
        const coveredCards = getCoveredCards(activePlayer, selectedTheater);

        coveredCards.forEach(coveredCard => {
            coveredCard.overwrittenDeployStrength = true;
            coveredCard.overwrittenImproviseStrength = true;
            UI.displayCardOverwrittenStrength(coveredCard);
        });

        UI.displayPlayerTotal(theaters);
    },

    escalation: function (parameters) {
        const { activePlayer, theaters } = parameters;
        const playerCards = getAllCards(activePlayer, theaters);

        playerCards.forEach(facedownCard => {
            facedownCard.overwrittenImproviseStrength = true;
            UI.displayCardOverwrittenStrength(facedownCard);
        });

        UI.displayPlayerTotal(theaters);
    },

    support: function (parameters) {
        const { activePlayer, theaters, selectedTheater } = parameters;
        const adjacentTheaters = getAdjacentTheaters(theaters, selectedTheater);

        adjacentTheaters.forEach(adjacentTheater => {
            if (activePlayer instanceof Player) {
                adjacentTheater.playerBonus.push(3);
            } else {
                adjacentTheater.botBonus.push(3);
            }
        });

        UI.displayPlayerTotal(theaters);
    },
};

export default TacticalAbilities;
