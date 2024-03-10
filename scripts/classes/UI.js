import { CONFIG } from "../data/CONFIG.js";
import Player from "./Player.js";
import Debugger from "./Debugger.js";

export default class UI {
    static scoreEl = document.querySelector("#score");
    static battleNumberEl = document.querySelector("#battle-number");
    static mainAreaEl = document.querySelector("#main-area");
    static actionBarEl = document.querySelector("#action-bar");
    static actionButtonEls = document.querySelectorAll("#action-bar button");
    static deployButtonEl = document.querySelector("#deploy");
    static improviseButtonEl = document.querySelector("#improvise");
    static descriptionEl = document.querySelector("#description");
    static playerHandEl = document.querySelector("#player .hand");
    static playerNameEl = document.querySelector("#player .name");
    static botHandEl = document.querySelector("#bot .hand");
    static botNameEl = document.querySelector("#bot .name");

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

            UI.mainAreaEl.append(depotEl);
        });
    }

    static displayPlayerTotal(theaters) {
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
                    UI.playerHandEl.append(cardContainerEl);
                    cardContainerEl.lastChild.style.display = "none";
                } else {
                    UI.botHandEl.append(cardContainerEl);
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

    static discard(selectedCardEl, targetEl) {
        selectedCardEl.classList.remove("selected");

        if (targetEl.id === "discard-pile") {
            selectedCardEl.classList.add("discarded");
        }

        targetEl.append(selectedCardEl);
    }

    static displayPlayersName(players) {
        UI.playerNameEl.textContent = `${players[0].name} (You)`;
        UI.botNameEl.textContent = players[1].name;
    }

    static markActivePlayer(activePlayer) {
        if (activePlayer instanceof Player) {
            UI.playerNameEl.classList.add("active");
            UI.botNameEl.classList.remove("active");
        } else {
            UI.playerNameEl.classList.remove("active");
            UI.botNameEl.classList.add("active");
        }
    }

    static displayWithdrawButton() {
        const withdrawButtonEl = document.createElement("button");

        withdrawButtonEl.setAttribute("id", "withdraw");
        withdrawButtonEl.classList.add("button");
        withdrawButtonEl.textContent = "Withdraw";

        UI.actionBarEl.append(withdrawButtonEl);
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

    static displayBattleEndOverlay(game, battleWinner) {
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
    }

    static displayGameEndOverlay(app, gameWinner) {
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
    }

    static clearForNextBattle() {
        document.querySelector("#overlay").remove();

        UI.scoreEl.textContent = "";
        UI.mainAreaEl.textContent = "";
        UI.playerHandEl.textContent = "";
        UI.botHandEl.textContent = "";
    }
}
