import { CONFIG } from "../data/CONFIG.js";
import Player from "./Player.js";
import Debugger from "./Debugger.js";

const elements = {};

const UI = {
    getElements: function () {
        if (!elements.element) {
            elements.scoreEl = document.querySelector("#score");
            elements.mainAreaEl = document.querySelector("#main-area");
            elements.actionBarEl = document.querySelector("#action-bar");
            elements.actionButtonEls = document.querySelectorAll("#action-bar button");
            elements.deployButtonEl = document.querySelector("#deploy");
            elements.improviseButtonEl = document.querySelector("#improvise");
            elements.descriptionEl = document.querySelector("#description");
            elements.playerHandEl = document.querySelector("#player .hand");
            elements.playerNameEl = document.querySelector("#player .name");
            elements.botHandEl = document.querySelector("#bot .hand");
            elements.botNameEl = document.querySelector("#bot .name");
        }

        return elements;
    },

    displayScore: function (battleID, players) {
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

        UI.getElements().scoreEl.append(battleNumberEl, playerScoreContainerEl, botScoreContainerEl);
    },

    displayTheaters: function (shuffledTheaters) {
        shuffledTheaters.forEach(theater => {
            const depotEl = document.createElement("div");
            const theaterContainerEl = document.createElement("div");
            const theaterEl = document.createElement("div");
            const nameEl = document.createElement("div");
            const playerColumnEl = document.createElement("div");
            const botColumnEl = document.createElement("div");
            const playerSubtotalEl = document.createElement("div");
            const playerBonusEl = document.createElement("div");
            const playerTotalEl = document.createElement("div");
            const botSubtotalEl = document.createElement("div");
            const botBonusEl = document.createElement("div");
            const botTotalEl = document.createElement("div");

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

            playerColumnEl.classList.add("column", "player-column");
            playerSubtotalEl.classList.add("subtotal");
            playerBonusEl.classList.add("bonus");
            playerTotalEl.classList.add("player-total");
            botColumnEl.classList.add("column", "bot-column");
            botSubtotalEl.classList.add("subtotal");
            botBonusEl.classList.add("bonus");
            botTotalEl.classList.add("bot-total");

            theaterEl.append(nameEl);
            theaterContainerEl.append(theaterEl);

            playerTotalEl.append(playerSubtotalEl, playerBonusEl);
            botTotalEl.append(botSubtotalEl, botBonusEl);

            depotEl.append(botColumnEl);
            depotEl.append(botTotalEl);
            depotEl.append(theaterContainerEl);
            depotEl.append(playerTotalEl);
            depotEl.append(playerColumnEl);

            UI.getElements().mainAreaEl.append(depotEl);
        });
    },

    displayPlayerTotal: function (theaters) {
        theaters.forEach(theater => {
            const playerSubtotalEl = document.querySelector(`#${theater.name.toLowerCase()}-depot .player-total .subtotal`);
            const playerBonusEl = document.querySelector(`#${theater.name.toLowerCase()}-depot .player-total .bonus`);
            const botSubtotalEl = document.querySelector(`#${theater.name.toLowerCase()}-depot .bot-total .subtotal`);
            const botBonusEl = document.querySelector(`#${theater.name.toLowerCase()}-depot .bot-total .bonus`);

            playerSubtotalEl.textContent = theater.calculatePlayerSubtotal("1");
            playerBonusEl.textContent = theater.playerBonus.length > 0 ? `(+${theater.calculatePlayerBonus("1")})` : "";
            botSubtotalEl.textContent = theater.calculatePlayerSubtotal("2");
            botBonusEl.textContent = theater.botBonus.length > 0 ? `(+${theater.calculatePlayerBonus("2")})` : "";
        });
    },

    removeHighlights: function (highlightedTheaterEls) {
        highlightedTheaterEls.forEach(highlightedTheaterEl => {
            highlightedTheaterEl.classList.remove("highlighted");
        });
    },

    displayCards: function (cards) {
        const discardPileEl = document.createElement("div");

        discardPileEl.setAttribute("id", "discard-pile");
        discardPileEl.classList.add("depot");
        UI.getElements().mainAreaEl.append(discardPileEl);

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
                    UI.getElements().playerHandEl.append(cardContainerEl);
                    cardContainerEl.lastChild.style.display = "none";
                } else {
                    UI.getElements().botHandEl.append(cardContainerEl);
                    cardContainerEl.classList.add("facedown");
                    cardContainerEl.firstChild.style.display = "none";
                }
            } else {
                discardPileEl.append(cardContainerEl);
                cardContainerEl.classList.add("facedown", "discarded");
                cardContainerEl.firstChild.style.display = "none";
            }

            Debugger.outlineCard(card.id, cardContainerEl);
        });
    },

    displayCardOverwrittenStrength: function (card) {
        document.querySelectorAll(".card").forEach(cardEl => {
            if (cardEl.id === card.id) {
                cardEl.children[0].textContent = card.deployStrength;
                cardEl.children[1].textContent = card.improviseStrength;
            }
        });
    },

    enableTooltip: function (selectedCardEl, card) {
        selectedCardEl.addEventListener("mouseenter", this.showTooltip.bind(null, selectedCardEl, card));
        selectedCardEl.addEventListener("mouseleave", this.hideTooltip);
    },

    showTooltip: function (selectedCardEl, card) {
        const tooltipEl = document.createElement("div");

        tooltipEl.style.top = `${selectedCardEl.getBoundingClientRect().bottom}px`;
        tooltipEl.style.left = `${selectedCardEl.getBoundingClientRect().right}px`;
        tooltipEl.classList.add("tooltip");
        card.deployStrength === 6
            ? (tooltipEl.textContent = `${card.tacticalAbility}`)
            : (tooltipEl.textContent = `${card.tacticalAbility} ${card.typeSymbol} – ${card.description}`);

        document.body.append(tooltipEl);
    },

    hideTooltip: function () {
        const tooltipEl = document.querySelector(".tooltip");

        tooltipEl.remove();
    },

    flipCard: function (selectedCardEl) {
        if (selectedCardEl.classList.contains("facedown")) {
            selectedCardEl.classList.remove("facedown");
            selectedCardEl.firstChild.style.display = "block";
            selectedCardEl.lastChild.style.display = "none";
        } else {
            selectedCardEl.classList.add("facedown");
            selectedCardEl.firstChild.style.display = "none";
            selectedCardEl.lastChild.style.display = "block";
        }
    },

    discard: function (selectedCardEl, targetEl) {
        selectedCardEl.classList.remove("selected");

        if (targetEl.id === "discard-pile") {
            selectedCardEl.classList.add("discarded");
        }

        targetEl.append(selectedCardEl);
    },

    displayPlayersName: function (players) {
        UI.getElements().playerNameEl.textContent = `${players[0].name} (You)`;
        UI.getElements().botNameEl.textContent = players[1].name;
    },

    markActivePlayer: function (activePlayer) {
        if (activePlayer instanceof Player) {
            UI.getElements().playerNameEl.classList.add("active");
            UI.getElements().botNameEl.classList.remove("active");
        } else {
            UI.getElements().playerNameEl.classList.remove("active");
            UI.getElements().botNameEl.classList.add("active");
        }
    },

    displayWithdrawButton: function () {
        const withdrawButtonEl = document.createElement("button");

        withdrawButtonEl.setAttribute("id", "withdraw");
        withdrawButtonEl.classList.add("button");
        withdrawButtonEl.textContent = "Withdraw";

        UI.getElements().actionBarEl.append(withdrawButtonEl);
    },

    enableActions: function () {
        UI.getElements().deployButtonEl.disabled = false;
        UI.getElements().improviseButtonEl.disabled = false;
    },

    disableActions: function () {
        UI.getElements().deployButtonEl.disabled = true;
        UI.getElements().improviseButtonEl.disabled = true;
    },

    clearDescription: function () {
        UI.getElements().descriptionEl.textContent = "";
    },

    displayBattleEndOverlay: function (game, battleWinner) {
        const overlayEl = document.createElement("div");
        const battleWinnerEl = document.createElement("div");
        const nextBattleButtonEl = document.createElement("button");

        overlayEl.setAttribute("id", "overlay");
        battleWinnerEl.setAttribute("id", "battle-winner");
        battleWinnerEl.textContent = `${battleWinner.name} won the battle!`;
        nextBattleButtonEl.setAttribute("id", "next-battle");
        nextBattleButtonEl.classList.add("button");
        nextBattleButtonEl.textContent = "Next Battle";

        nextBattleButtonEl.addEventListener("click", () => {
            UI.clearForNextBattle();
            game.createBattle();
        });

        overlayEl.append(battleWinnerEl, nextBattleButtonEl);
        document.body.append(overlayEl);
    },

    displayGameEndOverlay: function (app, gameWinner) {
        const overlayEl = document.createElement("div");
        const gameWinnerEl = document.createElement("div");
        const nextGameButtonEl = document.createElement("button");

        overlayEl.setAttribute("id", "overlay");
        gameWinnerEl.setAttribute("id", "game-winner");
        gameWinnerEl.textContent = `${gameWinner.name} won the game!`;
        nextGameButtonEl.setAttribute("id", "next-game");
        nextGameButtonEl.classList.add("button");
        nextGameButtonEl.textContent = "Next Game";

        nextGameButtonEl.addEventListener("click", () => {
            UI.clearForNextBattle();
            app.createGame();
        });

        overlayEl.append(gameWinnerEl, nextGameButtonEl);
        document.body.append(overlayEl);
    },

    clearForNextBattle: function () {
        document.querySelector("#overlay").remove();

        UI.getElements().scoreEl.textContent = "";
        UI.getElements().mainAreaEl.textContent = "";
        UI.getElements().playerHandEl.textContent = "";
        UI.getElements().botHandEl.textContent = "";
    },
};

export default UI;
