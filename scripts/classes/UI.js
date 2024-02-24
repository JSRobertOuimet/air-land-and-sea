import { CONFIG } from "../data/CONFIG.js";
import Player from "./Player.js";

export default class UI {
    static scoreEl = document.querySelector("#score");
    static battleNumberEl = document.querySelector("#battle-number");
    static mainAreaEl = document.querySelector("#main-area");
    static playerOneHandEl = document.querySelector("#player-one .hand");
    static playerTwoHandEl = document.querySelector("#player-two .hand");
    static actionButtonEls = document.querySelectorAll("#action-bar button");
    static deployButtonEl = document.querySelector("#deploy");
    static improviseButtonEl = document.querySelector("#improvise");
    static withdrawButtonEl = document.querySelector("#withdraw");
    static descriptionEl = document.querySelector("#description");
    static playerOneNameEl = document.querySelector("#player-one .name");
    static playerTwoNameEl = document.querySelector("#player-two .name");
    static overlayEl = document.querySelector("#overlay");
    static battleWinnerEl = document.querySelector("#battle-winner");
    static gameWinnerEl = document.querySelector("#game-winner");
    static nextBattleButtonEl = document.querySelector("#next-battle");
    static nextGameButtonEl = document.querySelector("#next-game");

    constructor() {}

    static displayScore(battleID, players) {
        const battleNumberEl = document.createElement("div");
        const playerScoreContainerEl = document.createElement("div");
        const playerNameEl = document.createElement("div");
        const playerScoreEl = document.createElement("div");
        const botScoreContainerEl = document.createElement("div");
        const botNameEl = document.createElement("div");
        const botScoreEl = document.createElement("div");

        battleNumberEl.setAttribute("id", "battle-number");
        battleNumberEl.innerHTML = `Battle #${battleID}`;

        playerScoreContainerEl.setAttribute("id", "player-score");
        playerNameEl.innerHTML = `${players[0].name} (You)`;
        playerScoreEl.innerHTML = `${players[0].victoryPoints}`;
        playerScoreContainerEl.append(playerNameEl, playerScoreEl);

        botScoreContainerEl.setAttribute("id", "bot-score");
        botNameEl.innerHTML = `${players[1].name}`;
        botScoreEl.innerHTML = `${players[1].victoryPoints}`;
        botScoreContainerEl.append(botNameEl, botScoreEl);

        UI.scoreEl.append(battleNumberEl, playerScoreContainerEl, botScoreContainerEl);
    }

    static displayTheaters(shuffledTheaters) {
        shuffledTheaters.forEach(theater => {
            const depotEl = document.createElement("div");
            const theaterContainerEl = document.createElement("div");
            const theaterEl = document.createElement("div");
            const nameEl = document.createElement("div");
            const playerOneColumnEl = document.createElement("div");
            const playerTwoColumnEl = document.createElement("div");
            const playerOneScoreEl = document.createElement("div");
            const playerTwoScoreEl = document.createElement("div");

            depotEl.setAttribute("id", `${theater.name}-depot`);
            depotEl.classList.add("depot");

            theaterContainerEl.classList.add("theater-container");
            theaterEl.setAttribute("id", theater.id);
            theaterEl.classList.add("theater");

            nameEl.innerHTML = `&ndash;${this.capitalizeFirstLetter(theater.name)}&ndash;`;
            nameEl.classList.add("name");

            switch (theater.name) {
                case "air":
                    theaterEl.classList.add("air");
                    break;
                case "land":
                    theaterEl.classList.add("land");
                    break;
                case "sea":
                    theaterEl.classList.add("sea");
                    break;
            }

            playerOneColumnEl.classList.add("column", "player-one-column");
            playerOneScoreEl.classList.add("player-one-score");
            playerTwoColumnEl.classList.add("column", "player-two-column");
            playerTwoScoreEl.classList.add("player-two-score");

            theaterEl.append(nameEl);
            theaterContainerEl.append(theaterEl);

            depotEl.append(playerTwoColumnEl);
            depotEl.append(playerTwoScoreEl);
            depotEl.append(theaterContainerEl);
            depotEl.append(playerOneScoreEl);
            depotEl.append(playerOneColumnEl);

            UI.mainAreaEl.append(depotEl);
        });
    }

    static updateScoreForTheaters(theaters) {
        theaters.forEach(theater => {
            const theaterName = theater.name;
            const playerOneScoreEl = document.querySelector(`#${theaterName}-depot .player-one-score`);
            const playerTwoScoreEl = document.querySelector(`#${theaterName}-depot .player-two-score`);

            playerOneScoreEl.innerHTML = theater.playerOneCardsTotal;
            playerTwoScoreEl.innerHTML = theater.playerTwoCardsTotal;
        });
    }

    static displayCards(cards) {
        const discardPileEl = document.createElement("div");

        discardPileEl.setAttribute("id", "discard-pile");
        discardPileEl.classList.add("depot");
        UI.mainAreaEl.append(discardPileEl);

        cards.forEach((card, index) => {
            const cardContainerEl = document.createElement("div");
            const cardFrontEl = document.createElement("div");
            const cardBackEl = document.createElement("div");
            const strengthEl = document.createElement("div");
            const defaultValueEl = document.createElement("div");

            cardContainerEl.setAttribute("id", card.id);
            cardContainerEl.classList.add("card");

            switch (card.theater) {
                case "air":
                    cardContainerEl.classList.add("air");
                    break;
                case "land":
                    cardContainerEl.classList.add("land");
                    break;
                case "sea":
                    cardContainerEl.classList.add("sea");
                    break;
            }

            cardFrontEl.classList.add("front");
            strengthEl.innerHTML = card.deployStrength;
            strengthEl.classList.add("strength");

            cardBackEl.classList.add("back");
            defaultValueEl.innerHTML = card.improviseStrength;
            defaultValueEl.classList.add("defaut-value");

            cardFrontEl.append(strengthEl);
            cardBackEl.append(defaultValueEl);
            cardContainerEl.append(cardFrontEl, cardBackEl);

            if (index < CONFIG.cardsDealt) {
                if (index % 2 !== 0) {
                    UI.playerOneHandEl.append(cardContainerEl);
                    cardContainerEl.lastChild.style.display = "none";
                } else {
                    UI.playerTwoHandEl.append(cardContainerEl);
                    cardContainerEl.classList.add("facedown");
                    cardContainerEl.firstChild.style.display = "none";
                }
            } else {
                discardPileEl.append(cardContainerEl);
                cardContainerEl.classList.add("facedown", "discarded");
                cardContainerEl.firstChild.style.display = "none";
            }
        });
    }

    static enableTooltip(selectedCardEl, card) {
        selectedCardEl.addEventListener("mouseenter", this.showTooltip.bind(null, card));
        selectedCardEl.addEventListener("mouseleave", this.hideTooltip);
    }

    static showTooltip(card, e) {
        const tooltipEl = document.createElement("div");

        tooltipEl.style.top = `${e.clientY}px`;
        tooltipEl.style.left = `${e.clientX}px`;
        tooltipEl.classList.add("tooltip");
        tooltipEl.innerHTML = `${card.tacticalAbility} – ${card.description}`;

        document.body.append(tooltipEl);
    }

    static hideTooltip() {
        const tooltipEl = document.querySelector(".tooltip");

        tooltipEl.remove();
    }

    static flipCard(selectedCardEl) {
        if (selectedCardEl.classList.contains("facedown")) {
            selectedCardEl.classList.remove("facedown");
            selectedCardEl.firstChild.style.display = "block";
            selectedCardEl.lastChild.style.display = "none";
        } else {
            selectedCardEl.classList.add("facedown");
            selectedCardEl.firstChild.style.display = "none";
            selectedCardEl.lastChild.style.display = "block";
        }
    }

    static discard(selectedCardEl, playerColumnEl) {
        selectedCardEl.classList.remove("selected");
        playerColumnEl.append(selectedCardEl);
    }

    static displayPlayersName(players) {
        UI.playerOneNameEl.innerHTML = `${players[0].name} (You)`;
        UI.playerTwoNameEl.innerHTML = players[1].name;
    }

    static markActivePlayer(activePlayer) {
        if (activePlayer instanceof Player) {
            UI.playerOneNameEl.classList.add("active");
            UI.playerTwoNameEl.classList.remove("active");
        } else {
            UI.playerOneNameEl.classList.remove("active");
            UI.playerTwoNameEl.classList.add("active");
        }
    }

    static enableActions() {
        UI.deployButtonEl.disabled = false;
        UI.improviseButtonEl.disabled = false;
    }

    static disableActions() {
        UI.deployButtonEl.disabled = true;
        UI.improviseButtonEl.disabled = true;
    }

    static clearDescription() {
        UI.descriptionEl.innerHTML = "";
    }

    static displayBattleEndOverlay(battleWinner) {
        UI.overlayEl.style.display = "flex";
        UI.battleWinnerEl.innerHTML = `${battleWinner.name} won the battle!`;
        UI.nextBattleButtonEl.disabled = false;
    }

    static displayGameEndOverlay(gameWinner) {
        UI.overlayEl.style.display = "flex";
        UI.battleWinnerEl.style.display = "none";
        UI.gameWinnerEl.style.display = "flex";
        UI.gameWinnerEl.innerHTML = `${gameWinner.name} won the game!`;
        UI.nextGameButtonEl.style.display = "block";
        UI.nextGameButtonEl.disabled = false;
        UI.nextBattleButtonEl.remove();
    }

    static clearForNextBattle() {
        UI.overlayEl.style.display = "none";
        UI.scoreEl.innerHTML = "";
        UI.mainAreaEl.innerHTML = "";
        UI.playerOneHandEl.innerHTML = "";
        UI.playerTwoHandEl.innerHTML = "";
    }

    static capitalizeFirstLetter(word) {
        return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    }
}
