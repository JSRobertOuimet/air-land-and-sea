import { CONFIG } from "../data/CONFIG.js";
import Player from "./Player.js";
import UI from "../modules/UI.js";
import Log from "./Log.js";
import TacticalAbilities from "../modules/TacticalAbilities.js";
import { getAllCardsInTheater } from "../modules/Utilities.js";

export default class Battle {
    static id = 1;

    #dealtCards = [];
    #discardedCards = [];
    #battleWinner = null;
    #log = [];

    constructor(game) {
        const { id, app, players, theaters, cards } = game;

        this.id = id === "1" ? (Battle.id++).toString() : "1";
        this.app = app;
        this.game = game;
        this.players = players;
        this.theaters = theaters;
        this.cards = cards;
        this._selectedCard = null;
        this._selectedAction = "";
        this._selectedTheater = null;
        this.startingPlayer = this.game.getActivePlayer();
        this.activePlayer = this.startingPlayer;
        this.turns = CONFIG.cardsDealt;

        this.#initializeBattle();
    }

    get dealtCards() {
        return this.#dealtCards;
    }

    set dealtCards(value) {
        this.#dealtCards = value;
    }

    get discardedCards() {
        return this.#discardedCards;
    }

    set discardedCards(value) {
        this.#discardedCards = value;
    }

    get battleWinner() {
        return this.#battleWinner;
    }

    set battleWinner(value) {
        this.#battleWinner = value;
    }

    get log() {
        return this.#log;
    }

    set log(value) {
        this.#log = value;
    }

    get selectedCard() {
        return this._selectedCard;
    }

    set selectedCard(value) {
        this._selectedCard = value;
    }

    get selectedAction() {
        return this._selectedAction;
    }

    set selectedAction(value) {
        this._selectedAction = value;
    }

    get selectedTheater() {
        return this._selectedTheater;
    }

    set selectedTheater(value) {
        this._selectedTheater = value;
    }

    #initializeBattle() {
        this.id === "1" ? this.#shuffleCards(this.theaters) : this.#rotateTheaters(this.theaters);
        this.#resetStateForTheaters(this.theaters);
        this.#resetStateForCards(this.cards);
        this.#shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);

        UI.displayScore(this.id, this.players);
        UI.displayTheaters(this.theaters);
        UI.displayPlayerTotal(this.theaters);
        UI.displayCards(this.cards);
        UI.displayPlayersName(this.players);

        this.#runBattle();
    }

    #shuffleCards(cards) {
        let currentIndex = cards.length;
        let randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
        }

        return cards;
    }

    #rotateTheaters(theaters) {
        this.theaters.unshift(theaters.pop());
    }

    #resetStateForTheaters(theaters) {
        theaters.forEach(theater => {
            theater.playerCards = [];
            theater.playerBonus = [];
            theater.playerTotal = 0;
            theater.botCards = [];
            theater.botBonus = [];
            theater.botTotal = 0;
        });
    }

    #resetStateForCards(cards) {
        cards.forEach(card => {
            card.overwrittenDeployStrength = false;
            card.overwrittenImproviseStrength = false;
            card.facedown = false;
            card.covered = false;
        });
    }

    #dealCards(players, shuffledCards) {
        shuffledCards.forEach((shuffledCard, index) => {
            if (index < CONFIG.cardsDealt) {
                if (index % 2 !== 0) {
                    players[0].hand.push(shuffledCard);
                } else {
                    players[1].hand.push(shuffledCard);
                }
                this.dealtCards.push(shuffledCard);
            } else {
                this.discardedCards.push(shuffledCard);
            }
        });
    }

    async #runBattle() {
        if (this.turns === 0) {
            this.#endBattle();
        } else {
            if (this.activePlayer instanceof Player) {
                this.selectedCard = await this.activePlayer.makingCardSelection();
                this.selectedAction = await this.activePlayer.makingActionSelection();
                this.selectedTheater = await this.activePlayer.makingTheaterSelection(this.selectedCard, this.selectedAction, this.theaters);
            } else {
                this.selectedCard = this.activePlayer.selectCard();
                this.selectedAction = this.activePlayer.selectAction(this.selectedCard);
                this.selectedTheater = this.activePlayer.selectTheater(this.selectedCard, this.selectedAction, this.theaters);
            }
            this.#performAction(this.selectedAction);
            this.#endTurn();
            this.#runBattle();
        }
    }

    #endBattle() {
        this.battleWinner = this.#determineBattleWinner(this.theaters);

        if (this.game.isGameWon()) {
            UI.displayGameEndOverlay(this.app, this.battleWinner);
        } else {
            UI.displayBattleEndOverlay(this.game, this.battleWinner);
        }
    }

    #switchActivePlayer() {
        this.players.forEach(player => {
            player.active = !player.active;
        });

        this.activePlayer = this.game.getActivePlayer();
    }

    #performAction(selectedAction) {
        const parameters = {
            activePlayerName: this.activePlayer.name,
            selectedAction: this.selectedCard,
            selectedAction: this.selectedAction,
            selectTheater: this.selectedTheater,
            players: this.players,
            theaters: this.theaters,
        };

        switch (selectedAction) {
            case "deploy":
                this.#deploy();
                this.#resolveTacticalAbility();
                break;
            case "improvise":
                this.#improvise();
                break;
            case "withdraw":
                this.#withdraw();
                break;
        }

        this.log.push(new Log(parameters));
    }

    #endTurn() {
        console.clear();
        console.log(this.log);

        this.selectedCard = null;
        this.selectedAction = "";
        this.selectedTheater = null;
        this.turns--;

        if (this.turns > 0) {
            this.#switchActivePlayer();
        }
    }

    #determineBattleWinner(theaters) {
        let theatersControlledByPlayer = 0;
        let theatersControlledByBot = 0;
        let battleWinner;

        theaters.forEach(theater => {
            if (theater.playerTotal === theater.botTotal) {
                if (this.startingPlayer === this.players[0]) {
                    theatersControlledByPlayer++;
                } else {
                    theatersControlledByBot++;
                }
            } else if (theater.playerTotal > theater.botTotal) {
                theatersControlledByPlayer++;
            } else {
                theatersControlledByBot++;
            }
        });

        if (theatersControlledByPlayer > theatersControlledByBot) {
            battleWinner = this.players[0];
            this.players[0].victoryPoints++;
        } else {
            battleWinner = this.players[1];
            this.players[1].victoryPoints++;
        }

        return battleWinner;
    }

    #deploy() {
        const selectedCardEl = document.querySelector(".selected");
        const highlightedTheaterEls = document.querySelectorAll(".highlighted");
        const playerColumnEl =
            this.activePlayer instanceof Player
                ? document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot .player-column`)
                : document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot .bot-column`);

        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== this.selectedCard);

        if (this.activePlayer instanceof Player) {
            this.selectedTheater.playerCards.push(this.selectedCard);

            if (this.selectedTheater.playerCards.length > 1) {
                this.selectedTheater.playerCards.at(-2).covered = true;
            }

            this.selectedTheater.calculatePlayerTotal("1");

            UI.removeHighlights(highlightedTheaterEls);
            UI.disableActions();
            UI.clearDescription();
        } else {
            this.selectedTheater.botCards.push(this.selectedCard);

            if (this.selectedTheater.botCards.length > 1) {
                this.selectedTheater.botCards.at(-2).covered = true;
            }

            this.selectedTheater.calculatePlayerTotal("2");

            UI.flipCard(selectedCardEl);
            UI.displayPlayerTotal(this.theaters);
        }

        UI.discard(selectedCardEl, playerColumnEl);
        UI.enableTooltip(selectedCardEl, this.selectedCard);
        UI.displayPlayerTotal(this.theaters);
    }

    #resolveTacticalAbility() {
        const parameters = {
            activePlayer: this.activePlayer,
            theaters: this.theaters,
            selectedTheater: this.selectedTheater,
        };

        switch (this.selectedCard.id) {
            case "1":
                TacticalAbilities.support(parameters);
                break;
            case "10":
                TacticalAbilities.coverFire(parameters);
                break;
            case "14":
                TacticalAbilities.escalation(parameters);
                break;
        }
    }

    #improvise() {
        const selectedCardEl = document.querySelector(".selected");
        const highlightedTheaterEls = document.querySelectorAll(".highlighted");
        const playerColumnEl =
            this.activePlayer instanceof Player
                ? document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot .player-column`)
                : document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot .bot-column`);
        const isContainmentInTheater = getAllCardsInTheater(null, this.theaters).find(card => card.id === "5" && card.facedown === false);

        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== this.selectedCard);
        this.selectedCard.flipCard();

        if (this.activePlayer instanceof Player) {
            if (isContainmentInTheater) {
                const discardPileEl = document.querySelector("#discard-pile");

                this.#discardedCards.push(this.selectedCard);

                UI.removeHighlights(highlightedTheaterEls);
                UI.flipCard(selectedCardEl);
                UI.disableActions();
                UI.clearDescription();
                UI.discard(selectedCardEl, discardPileEl);

                return;
            }

            this.selectedTheater.playerCards.push(this.selectedCard);

            if (this.selectedTheater.playerCards.length > 1) {
                this.selectedTheater.playerCards.at(-2).covered = true;
            }

            this.selectedTheater.calculatePlayerTotal("1");

            UI.removeHighlights(highlightedTheaterEls);
            UI.flipCard(selectedCardEl);
            UI.disableActions();
            UI.clearDescription();
            UI.discard(selectedCardEl, playerColumnEl);
        } else {
            if (isContainmentInTheater) {
                const discardPileEl = document.querySelector("#discard-pile");

                this.#discardedCards.push(this.selectedCard);

                UI.discard(selectedCardEl, discardPileEl);

                return;
            }

            this.selectedTheater.botCards.push(this.selectedCard);

            if (this.selectedTheater.botCards.length > 1) {
                this.selectedTheater.botCards.at(-2).covered = true;
            }

            this.selectedTheater.calculatePlayerTotal("2");

            UI.discard(selectedCardEl, playerColumnEl);
        }

        UI.displayPlayerTotal(this.theaters);
    }

    #withdraw() {}
}
