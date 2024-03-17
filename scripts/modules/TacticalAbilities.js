import Player from "../classes/Player.js";
import UI from "./UI.js";
import { getAdjacentTheaters, getCoveredCards, getAllCards } from "./Utilities.js";

const TacticalAbilities = {
    coverFire: function (parameters) {
        const { players, activePlayer, theaters, selectedTheater } = parameters;
        const coveredCards = getCoveredCards(selectedTheater, activePlayer);

        coveredCards.forEach(coveredCard => {
            coveredCard.overwrittenDeployStrength = true;
            coveredCard.overwrittenImproviseStrength = true;
            UI.displayCardOverwrittenStrength(coveredCard);
        });

        UI.displayPlayerTotal(players, theaters);
    },

    escalation: function (parameters) {
        const { players, activePlayer, theaters } = parameters;
        const playerCards = getAllCards(theaters, activePlayer);

        playerCards.forEach(playerCard => {
            playerCard.overwrittenImproviseStrength = true;
            UI.displayCardOverwrittenStrength(playerCard);
        });

        UI.displayPlayerTotal(players, theaters);
    },

    support: function (parameters) {
        const { players, activePlayer, theaters, selectedTheater } = parameters;
        const adjacentTheaters = getAdjacentTheaters(theaters, selectedTheater);

        adjacentTheaters.forEach(adjacentTheater => {
            if (activePlayer instanceof Player) {
                adjacentTheater.playerBonus.push(3);
            } else {
                adjacentTheater.botBonus.push(3);
            }
        });

        UI.displayPlayerTotal(players, theaters);
    },
};

export default TacticalAbilities;
