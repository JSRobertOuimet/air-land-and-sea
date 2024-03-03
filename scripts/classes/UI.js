import { CONFIG } from "../data/CONFIG.js";
import Player from "./Player.js";

export default class UI {
    static scoreEl = document.querySelector("#score");
    static battleNumberEl = document.querySelector("#battle-number");
    static mainAreaEl = document.querySelector("#main-area");
    static actionButtonEls = document.querySelectorAll("#action-bar button");
    static deployButtonEl = document.querySelector("#deploy");
    static improviseButtonEl = document.querySelector("#improvise");
    static withdrawButtonEl = document.querySelector("#withdraw");
    static descriptionEl = document.querySelector("#description");
    static playerOneHandEl = document.querySelector("#player-one .hand");
    static playerOneNameEl = document.querySelector("#player-one .name");
    static playerTwoHandEl = document.querySelector("#player-two .hand");
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
        battleNumberEl.textContent = `Battle #${battleID}`;

        playerScoreContainerEl.setAttribute("id", "player-score");
        playerNameEl.textContent = `${players[0].name} (You)`;
        playerScoreEl.textContent = `${players[0].victoryPoints}`;
        playerScoreContainerEl.append(playerNameEl, playerScoreEl);

        botScoreContainerEl.setAttribute("id", "bot-score");
        botNameEl.textContent = `${players[1].name}`;
        botScoreEl.textContent = `${players[1].victoryPoints}`;
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
            const playerOneSubtotalEl = document.createElement("div");
            const playerOneBonusEl = document.createElement("div");
            const playerOneTotalEl = document.createElement("div");
            const playerTwoSubtotalEl = document.createElement("div");
            const playerTwoBonusEl = document.createElement("div");
            const playerTwoTotalEl = document.createElement("div");

            depotEl.setAttribute("id", `${theater.name.toLowerCase()}-depot`);
            depotEl.classList.add("depot");

            theaterContainerEl.classList.add("theater-container");
            theaterEl.setAttribute("id", theater.id);
            theaterEl.classList.add("theater");

            nameEl.textContent = `–${theater.name}–`;
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

            playerOneColumnEl.classList.add("column", "player-one-column");
            playerOneSubtotalEl.classList.add("subtotal");
            playerOneBonusEl.classList.add("bonus");
            playerOneTotalEl.classList.add("player-one-total");
            playerTwoColumnEl.classList.add("column", "player-two-column");
            playerTwoSubtotalEl.classList.add("subtotal");
            playerTwoBonusEl.classList.add("bonus");
            playerTwoTotalEl.classList.add("player-two-total");

            theaterEl.append(nameEl);
            theaterContainerEl.append(theaterEl);

            playerOneTotalEl.append(playerOneSubtotalEl, playerOneBonusEl);
            playerTwoTotalEl.append(playerTwoSubtotalEl, playerTwoBonusEl);

            depotEl.append(playerTwoColumnEl);
            depotEl.append(playerTwoTotalEl);
            depotEl.append(theaterContainerEl);
            depotEl.append(playerOneTotalEl);
            depotEl.append(playerOneColumnEl);

            UI.mainAreaEl.append(depotEl);
        });
    }

    static displayPlayerTotal(theaters) {
        theaters.forEach(theater => {
            const playerOneSubtotalEl = document.querySelector(`#${theater.name.toLowerCase()}-depot .player-one-total .subtotal`);
            const playerOneBonusEl = document.querySelector(`#${theater.name.toLowerCase()}-depot .player-one-total .bonus`);
            const playerTwoSubtotalEl = document.querySelector(`#${theater.name.toLowerCase()}-depot .player-two-total .subtotal`);
            const playerTwoBonusEl = document.querySelector(`#${theater.name.toLowerCase()}-depot .player-two-total .bonus`);

            playerOneSubtotalEl.textContent = theater.calculatePlayerSubtotal("1");
            playerOneBonusEl.textContent = theater.playerOneBonus.length > 0 ? `(+${theater.calculatePlayerBonus("1")})` : "";
            playerTwoSubtotalEl.textContent = theater.calculatePlayerSubtotal("2");
            playerTwoBonusEl.textContent = theater.playerTwoBonus.length > 0 ? `(+${theater.calculatePlayerBonus("2")})` : "";
        });
    }

    static removeHighlights(highlightedTheaterEls) {
        highlightedTheaterEls.forEach(highlightedTheaterEl => {
            highlightedTheaterEl.classList.remove("highlighted");
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

            cardContainerEl.setAttribute("id", card.id);
            cardContainerEl.classList.add("card");

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
            cardFrontEl.textContent = card.deployStrength;
            cardBackEl.classList.add("back");
            cardBackEl.textContent = card.improviseStrength;
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

            switch (card.id) {
                case "1":
                case "10":
                case "14":
                    cardContainerEl.classList.add("testing");
                    break;
                default:
                    break;
            }
        });
    }

    static displayCardOverwrittenStrength(card) {
        document.querySelectorAll(".card").forEach(cardEl => {
            if (cardEl.id === card.id) {
                cardEl.children[0].textContent = card.deployStrength;
                cardEl.children[1].textContent = card.improviseStrength;
            }
        });
    }

    static enableTooltip(selectedCardEl, card) {
        selectedCardEl.addEventListener("mouseenter", this.showTooltip.bind(null, selectedCardEl, card));
        selectedCardEl.addEventListener("mouseleave", this.hideTooltip);
    }

    static showTooltip(selectedCardEl, card) {
        const tooltipEl = document.createElement("div");

        tooltipEl.style.top = `${selectedCardEl.getBoundingClientRect().bottom}px`;
        tooltipEl.style.left = `${selectedCardEl.getBoundingClientRect().right}px`;
        tooltipEl.classList.add("tooltip");
        card.deployStrength === 6
            ? (tooltipEl.textContent = `${card.tacticalAbility}`)
            : (tooltipEl.textContent = `${card.tacticalAbility} ${card.typeSymbol} – ${card.description}`);

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
        UI.playerOneNameEl.textContent = `${players[0].name} (You)`;
        UI.playerTwoNameEl.textContent = players[1].name;
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
        UI.descriptionEl.textContent = "";
    }

    static displayBattleEndOverlay(battleWinner) {
        UI.overlayEl.style.display = "flex";
        UI.battleWinnerEl.textContent = `${battleWinner.name} won the battle!`;
        UI.nextBattleButtonEl.disabled = false;
    }

    static displayGameEndOverlay(gameWinner) {
        UI.overlayEl.style.display = "flex";
        UI.battleWinnerEl.style.display = "none";
        UI.gameWinnerEl.style.display = "flex";
        UI.gameWinnerEl.textContent = `${gameWinner.name} won the game!`;
        UI.nextGameButtonEl.style.display = "block";
        UI.nextGameButtonEl.disabled = false;
        UI.nextBattleButtonEl.remove();
    }

    static clearForNextBattle() {
        UI.overlayEl.style.display = "none";
        UI.scoreEl.textContent = "";
        UI.mainAreaEl.textContent = "";
        UI.playerOneHandEl.textContent = "";
        UI.playerTwoHandEl.textContent = "";
    }
}
