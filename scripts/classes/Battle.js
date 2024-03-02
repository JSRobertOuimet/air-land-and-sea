import { CONFIG } from "../data/CONFIG.js";
import Player from "./Player.js";
import TacticalAbility from "./TacticalAbility.js";
import Log from "./Log.js";
import UI from "./UI.js";

export default class Battle {
    static id = 1;

    #dealtCards = [];
    #discardedCards = [];
    #battleWinner = null;
    #log = [];

    constructor(game) {
        this.id = game.id === "1" ? (Battle.id++).toString() : "1";
        this.game = game;
        this.players = game.players;
        this.theaters = game.theaters;
        this.cards = game.cards;
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
            theater.playerOneCards = [];
            theater.playerOneBonus = [];
            theater.playerOneTotal = 0;
            theater.playerTwoCards = [];
            theater.playerTwoBonus = [];
            theater.playerTwoTotal = 0;
        });
    }

    #resetStateForCards(cards) {
        cards.forEach(card => {
            card.overwrittenStrength = false;
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
                UI.markActivePlayer(this.activePlayer);
                this.selectedCard = await this.activePlayer.makingCardSelection();
                this.selectedAction = await this.activePlayer.makingActionSelection();
                this.selectedTheater = await this.activePlayer.makingTheaterSelection(this.selectedCard, this.selectedAction, this.theaters);
            } else {
                UI.markActivePlayer(this.activePlayer);
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
            UI.displayGameEndOverlay(this.battleWinner);
        } else {
            UI.displayBattleEndOverlay(this.battleWinner);
        }
    }

    #switchActivePlayer() {
        this.players.forEach(player => {
            player.active = !player.active;
        });

        this.activePlayer = this.game.getActivePlayer();
    }

    #performAction(selectedAction) {
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

        this.log.push(new Log(this.activePlayer.name, this.selectedCard, this.selectedAction, this.selectedTheater, this.players, this.theaters));
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
        let theatersControlledByPlayerOne = 0;
        let theatersControlledByPlayerTwo = 0;
        let battleWinner;

        theaters.forEach(theater => {
            if (theater.playerOneTotal === theater.playerTwoTotal) {
                if (this.startingPlayer === this.players[0]) {
                    theatersControlledByPlayerOne++;
                } else {
                    theatersControlledByPlayerTwo++;
                }
            } else if (theater.playerOneTotal > theater.playerTwoTotal) {
                theatersControlledByPlayerOne++;
            } else {
                theatersControlledByPlayerTwo++;
            }
        });

        if (theatersControlledByPlayerOne > theatersControlledByPlayerTwo) {
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
                ? document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot .player-one-column`)
                : document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot .player-two-column`);

        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== this.selectedCard);

        if (this.activePlayer instanceof Player) {
            this.selectedTheater.playerOneCards.push(this.selectedCard);

            if (this.selectedTheater.playerOneCards.length > 1) {
                this.selectedTheater.playerOneCards.at(-2).covered = true;
            }

            this.selectedTheater.calculatePlayerTotal("1");

            UI.removeHighlights(highlightedTheaterEls);
            UI.disableActions();
            UI.clearDescription();
        } else {
            this.selectedTheater.playerTwoCards.push(this.selectedCard);

            if (this.selectedTheater.playerTwoCards.length > 1) {
                this.selectedTheater.playerTwoCards.at(-2).covered = true;
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
                TacticalAbility.support(parameters);
                break;
            case "10":
                TacticalAbility.coverFire(parameters);
                break;
            case "14":
                TacticalAbility.escalation(parameters);
                break;
        }
    }

    #improvise() {
        const selectedCardEl = document.querySelector(".selected");
        const highlightedTheaterEls = document.querySelectorAll(".highlighted");
        const playerColumnEl =
            this.activePlayer instanceof Player
                ? document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot .player-one-column`)
                : document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot .player-two-column`);

        if (this.activePlayer instanceof Player) {
            this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== this.selectedCard);
            this.selectedCard.flipCard();
            this.selectedTheater.playerOneCards.push(this.selectedCard);

            if (this.selectedTheater.playerOneCards.length > 1) {
                this.selectedTheater.playerOneCards.at(-2).covered = true;
            }

            this.selectedTheater.calculatePlayerTotal("1");

            UI.removeHighlights(highlightedTheaterEls);
            UI.flipCard(selectedCardEl);
            UI.disableActions();
            UI.clearDescription();
        } else {
            this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== this.selectedCard);
            this.selectedCard.flipCard();
            this.selectedTheater.playerTwoCards.push(this.selectedCard);

            if (this.selectedTheater.playerTwoCards.length > 1) {
                this.selectedTheater.playerTwoCards.at(-2).covered = true;
            }

            this.selectedTheater.calculatePlayerTotal("2");
        }

        UI.discard(selectedCardEl, playerColumnEl);
        UI.displayPlayerTotal(this.theaters);
    }

    #withdraw() {}
}
