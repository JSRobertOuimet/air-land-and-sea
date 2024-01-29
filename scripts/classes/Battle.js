import { CONFIG } from "../data/CONFIG.js";
import Player from "./Player.js";
import Log from "./Log.js";
import UI from "./UI.js";

export default class Battle {
    static id = 1;

    #dealtCards = [];
    #discardedCards = [];
    #winner = null;
    #log = [];

    constructor(game) {
        this.id = (Battle.id++).toString();
        this.game = game;
        this.players = game.players;
        this.theaters = game.theaters;
        this.cards = game.cards;
        this.selectedCard = null;
        this.selectedAction = "";
        this.selectedTheater = null;
        this.startingPlayer = this.#getStartingPlayer();
        this.activePlayer = this.#getActivePlayer();
        this.turns = CONFIG.cardsInHand;

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

    // get selectedCard() {
    //     return this.selectedCard;
    // }

    // set selectedCard(value) {
    //     this.selectedCard = value;
    // }

    // get selectedAction() {
    //     return this.selectedAction;
    // }

    // set selectedAction(value) {
    //     this.selectedAction = value;
    // }

    // get selectedTheater() {
    //     return this.selectedTheater;
    // }

    // set selectedTheater(value) {
    //     this.selectedTheater = value;
    // }

    get winner() {
        return this.#winner;
    }

    set winner(value) {
        this.#winner = value;
    }

    get log() {
        return this.#log;
    }

    set log(value) {
        this.#log = value;
    }

    #initializeBattle() {
        this.game.shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);
        this.game.render(this.players, this.theaters, this.cards);
        Log.logStartingPlayer(this.startingPlayer);
        Log.logActivePlayer(this.activePlayer);
        this.#runBattle();
    }

    #dealCards(players, shuffledCards) {
        shuffledCards.forEach((shuffledCard, index) => {
            if (index < CONFIG.cardsInHand) {
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

        this.turns = this.dealtCards.length;
    }

    async #runBattle() {
        if (this.turns === 0) {
            this.#endBattle();
        } else {
            if (this.activePlayer instanceof Player) {
                await this.#makingCardSelection();
                await this.#makingActionSelection();
                await this.#makingTheaterSelection();
                this.#performAction(this.selectedAction);
                this.#endTurn();
            } else {
                this.#makeSelections();
                this.#performAction(this.selectedAction);
                this.#endTurn();
            }
            this.#runBattle();
        }
    }

    async #makingCardSelection() {
        return new Promise((resolve, reject) => {
            UI.playerOneHandEl.addEventListener("click", e => resolve(this.#handleCardSelection(e)));
        });
    }

    #handleCardSelection(e) {
        if (e.target.classList.contains("card")) {
            this.selectedCard = this.activePlayer.hand.find(card => card.id === e.target.id);

            Array.from(UI.playerOneHandEl.childNodes).forEach(cardEl => {
                if (cardEl.classList.contains("selected")) {
                    cardEl.classList.remove("selected");
                }
            });

            e.target.classList.add("selected");
        }

        if (e.target.classList.contains("strength")) {
            this.selectedCard = this.activePlayer.hand.find(card => card.id === e.target.parentNode.parentNode.id);

            Array.from(UI.playerOneHandEl.childNodes).forEach(cardEl => {
                if (cardEl.classList.contains("selected")) {
                    cardEl.classList.remove("selected");
                }
            });

            e.target.parentNode.parentNode.classList.add("selected");
        }

        if (this.selectedCard.strength === 6) {
            UI.descriptionEl.innerHTML = `${this.selectedCard.tacticalAbility}`;
        } else {
            UI.descriptionEl.innerHTML = `${this.selectedCard.tacticalAbility} ${this.selectedCard.typeSymbol} – ${this.selectedCard.description}`;
        }

        UI.deployButtonEl.disabled = false;
        UI.improviseButtonEl.disabled = false;
    }

    async #makingActionSelection() {
        return new Promise((resolve, reject) => {
            UI.improviseButtonEl.addEventListener("click", e => resolve(this.#handleActionSelection(e)));
        });
    }

    #handleActionSelection(e) {
        this.selectedAction = e.target.id;
    }

    async #makingTheaterSelection() {
        return new Promise((resolve, reject) => {
            UI.mainAreaEl.addEventListener("click", e => resolve(this.#handleTheaterSelection(e)));
        });
    }

    #handleTheaterSelection(e) {
        if (e.target.classList.contains("theater")) {
            this.selectedTheater = this.theaters.find(theater => theater.id === e.target.id);
        }
    }

    #endBattle() {
        this.#determineWinner(this.theaters);
        UI.overlayEl.style.display = "flex";
        UI.nextBattleButtonEl.addEventListener("click", this.#handleBattleCreation.bind(this));
    }

    #handleBattleCreation() {
        UI.mainAreaEl.innerHTML = "";
        UI.overlayEl.style.display = "none";
        this.game.createBattle(this.game);
    }

    #getStartingPlayer() {
        return this.id === "2" ? this.players[1] : this.players[0];
    }

    #getActivePlayer() {
        return this.players.find(player => player.active);
    }

    #switchActivePlayer() {
        this.players.forEach(player => {
            player.active = player.active === true ? false : true;
        });

        this.activePlayer = this.#getActivePlayer();
        Log.logActivePlayer(this.activePlayer);
    }

    #performAction(selectedAction) {
        switch (selectedAction) {
            case "deploy":
                this.#deploy();
                break;
            case "improvise":
                this.#improvise();
                break;
            case "withdraw":
                this.#withdraw();
                break;
            default:
                break;
        }
    }

    #deploy() {}

    #improvise() {
        const selectedCardEl = document.querySelector(".selected");
        const playerColumnEl =
            this.activePlayer instanceof Player
                ? document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot #player-one-column`)
                : document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot #player-two-column`);

        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== this.selectedCard);
        this.selectedCard.facedown = true;

        if (this.activePlayer instanceof Player) {
            selectedCardEl.classList.add("facedown");
            selectedCardEl.firstChild.style.display = "none";
            selectedCardEl.lastChild.style.display = "block";

            UI.deployButtonEl.disabled = true;
            UI.improviseButtonEl.disabled = true;
            UI.descriptionEl.innerHTML = "";

            this.selectedTheater.playerOneCards.push(this.selectedCard);

            if (this.selectedTheater.playerOneCards.length > 1) {
                this.selectedTheater.playerOneCards.slice(-2)[0].covered = true;
            }

            this.selectedTheater.playerOneCardsTotal += 2;
        } else {
            this.selectedTheater.playerTwoCards.push(this.selectedCard);

            if (this.selectedTheater.playerTwoCards.length > 1) {
                this.selectedTheater.playerTwoCards.slice(-2)[0].covered = true;
            }

            this.selectedTheater.playerTwoCardsTotal += 2;
        }

        playerColumnEl.append(selectedCardEl);
        selectedCardEl.classList.remove("selected");

        this.log.push(
            new Log(
                this.activePlayer.name,
                this.selectedCard,
                this.selectedTheater,
                `${this.selectedAction.charAt(0).toUpperCase()}${this.selectedAction.slice(1)}`
            )
        );
    }

    #withdraw() {}

    #endTurn() {
        this.selectedCard = null;
        this.selectedAction = "";
        this.selectedTheater = null;
        this.turns--;

        if (this.turns > 0) {
            this.#switchActivePlayer();
        }
    }

    #makeSelections() {
        this.selectedCard = this.activePlayer.selectCard();
        this.selectedAction = this.activePlayer.selectAction();
        this.selectedTheater = this.activePlayer.selectTheater(this.theaters);
    }

    #determineWinner(theaters) {
        let theatersControlledByPlayerOne = 0;
        let theatersControlledByPlayerTwo = 0;

        theaters.forEach(theater => {
            if (theater.playerOneCardsTotal === theater.playerTwoCardsTotal) {
                if (this.startingPlayer === this.players[0]) {
                    theatersControlledByPlayerOne++;
                } else {
                    theatersControlledByPlayerTwo++;
                }
            } else if (theater.playerOneCardsTotal > theater.playerTwoCardsTotal) {
                theatersControlledByPlayerOne++;
            } else {
                theatersControlledByPlayerTwo++;
            }
        });

        if (theatersControlledByPlayerOne > theatersControlledByPlayerTwo) {
            this.winner = this.players[0];
        } else {
            this.winner = this.players[1];
        }
    }
}
