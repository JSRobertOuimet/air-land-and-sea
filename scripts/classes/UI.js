import { CONFIG } from "../data/CONFIG.js";

export default class UI {
    static mainAreaEl = document.querySelector("#main-area");
    static columnEls = document.querySelectorAll(".column");
    static playerOneHandEl = document.querySelector("#player-one .hand");
    static playerOneCardEls = document.querySelectorAll("#player-one .card");
    static playerTwoHandEl = document.querySelector("#player-two .hand");
    static deployButtonEl = document.querySelector("#deploy");
    static improviseButtonEl = document.querySelector("#improvise");
    static withdrawButtonEl = document.querySelector("#withdraw");
    static descriptionEl = document.querySelector("#description");
    static playerOneNameEl = document.querySelector("#player-one-name");
    static playerTwoNameEl = document.querySelector("#player-two-name");
    static overlayEl = document.querySelector("#overlay");
    static battleWinnerEl = document.querySelector("#battle-winner");
    static nextBattleButtonEl = document.querySelector("#next-battle");

    constructor() {
        
    }

    static displayTheaters(shuffledTheaters) {
        shuffledTheaters.forEach(theater => {
            const depotEl = document.createElement("div");
            const theaterContainerEl = document.createElement("div");
            const theaterEl = document.createElement("div");
            const nameEl = document.createElement("div");
            const playerOneColumnEl = document.createElement("div");
            const playerTwoColumnEl = document.createElement("div");

            depotEl.setAttribute("id", `${theater.name.toLowerCase()}-depot`);
            depotEl.classList.add("depot");

            theaterContainerEl.classList.add("theater-container");
            theaterEl.setAttribute("id", theater.id);
            theaterEl.classList.add("theater");

            nameEl.innerHTML = `&ndash;${theater.name}&ndash;`;
            nameEl.classList.add("name");

            switch (theater.name) {
                case "Air":
                    theaterEl.classList.add("air");
                    break;
                case "Land":
                    theaterEl.classList.add("land");
                    break;
                case "Sea":
                    theaterEl.classList.add("sea");
                    break;
            }

            playerOneColumnEl.setAttribute("id", "player-one-column");
            playerOneColumnEl.classList.add("column");
            playerTwoColumnEl.setAttribute("id", "player-two-column");
            playerTwoColumnEl.classList.add("column");

            theaterEl.append(nameEl);
            theaterContainerEl.append(theaterEl);

            depotEl.append(playerTwoColumnEl);
            depotEl.append(theaterContainerEl);
            depotEl.append(playerOneColumnEl);

            UI.mainAreaEl.append(depotEl);
        });
    }

    static displayCards(cards) {
        const discardedCardsEl = document.createElement("div");

        discardedCardsEl.setAttribute("id", "discarded-cards");
        discardedCardsEl.classList.add("depot");
        UI.mainAreaEl.append(discardedCardsEl);

        cards.forEach((card, index) => {
            const cardContainerEl = document.createElement("div");
            const cardFrontEl = document.createElement("div");
            const cardBackEl = document.createElement("div");
            const strengthEl = document.createElement("div");
            const tacticalAbilityEl = document.createElement("div");
            const defaultValueEl = document.createElement("div");

            cardContainerEl.setAttribute("id", card.id);
            cardContainerEl.classList.add("card");

            if (card.strength === 6) {
                cardContainerEl.setAttribute("data-description", `${card.tacticalAbility}`);
            } else {
                cardContainerEl.setAttribute(
                    "data-description",
                    `${card.tacticalAbility} ${card.typeSymbol} – ${card.description}`
                );
            }

            switch (card.theater) {
                case "Air":
                    cardContainerEl.classList.add("air");
                    break;
                case "Land":
                    cardContainerEl.classList.add("land");
                    break;
                case "Sea":
                    cardContainerEl.classList.add("sea");
                    break;
            }

            cardFrontEl.classList.add("front");
            strengthEl.innerHTML = card.strength;
            strengthEl.classList.add("strength");
            tacticalAbilityEl.innerHTML = card.tacticalAbility;
            tacticalAbilityEl.classList.add("tactical-ability");

            cardBackEl.classList.add("back");
            defaultValueEl.innerHTML = "2";
            defaultValueEl.classList.add("defaut-value");

            cardFrontEl.append(strengthEl);
            cardBackEl.append(defaultValueEl);
            cardContainerEl.append(cardFrontEl, cardBackEl);

            if (index < CONFIG.cardsInHand) {
                if (index % 2 !== 0) {
                    UI.playerOneHandEl.append(cardContainerEl);
                    cardContainerEl.lastChild.style.display = "none";
                } else {
                    UI.playerTwoHandEl.append(cardContainerEl);
                    cardContainerEl.classList.add("facedown");
                    cardContainerEl.firstChild.style.display = "none";
                }
            } else {
                discardedCardsEl.append(cardContainerEl);
                cardContainerEl.classList.add("facedown", "discarded");
                cardContainerEl.firstChild.style.display = "none";
            }
        });
    }

    static displayPlayersName(players) {
        UI.playerOneNameEl.innerHTML = players[0].name;
        UI.playerTwoNameEl.innerHTML = players[1].name;
    }
}
