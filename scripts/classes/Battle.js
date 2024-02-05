import { CONFIG } from "../data/CONFIG.js";
import Player from "./Player.js";
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
        this.startingPlayer = this.#getStartingPlayer();
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
        this.#shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);

        UI.displayTheaters(this.theaters);
        UI.displayCards(this.cards);
        UI.displayPlayersName(this.players);

        Log.startingPlayer(this.startingPlayer);
        Log.activePlayer(this.activePlayer);

        console.log(this);

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
                this.selectedCard = await this.#makingCardSelection();
                this.selectedAction = await this.#makingActionSelection();
                this.selectedTheater = await this.#makingTheaterSelection();
            } else {
                this.selectedCard = this.activePlayer.selectCard();
                this.selectedAction = this.activePlayer.selectAction();
                this.selectedTheater = this.activePlayer.selectTheater(this.theaters);
            }
            this.#performAction(this.selectedAction);
            this.log.push(
                new Log(
                    this.activePlayer.name,
                    this.selectedCard,
                    `${this.selectedAction.charAt(0).toUpperCase()}${this.selectedAction.slice(1)}`,
                    this.selectedTheater
                )
            );
            this.#endTurn();
            this.#runBattle();
        }
    }

    #makingCardSelection() {
        return new Promise(resolve => {
            document.querySelectorAll("#player-one .card").forEach(playerOneCardEl => {
                playerOneCardEl.addEventListener("click", e => resolve(this.#handleCardSelection(e)));
            });
        });
    }

    #handleCardSelection(e) {
        if (e.currentTarget.classList.contains("card")) {
            const selectedCard = this.activePlayer.hand.find(card => card.id === e.currentTarget.id);

            Array.from(UI.playerOneHandEl.childNodes).forEach(cardEl => {
                if (cardEl.classList.contains("selected")) {
                    cardEl.classList.remove("selected");
                }
            });

            selectedCard.strength === 6
                ? (UI.descriptionEl.innerHTML = `${selectedCard.tacticalAbility}`)
                : (UI.descriptionEl.innerHTML = `${selectedCard.tacticalAbility} ${selectedCard.typeSymbol} – ${selectedCard.description}`);
            e.currentTarget.classList.add("selected");
            UI.deployButtonEl.disabled = false;
            UI.improviseButtonEl.disabled = false;

            return selectedCard;
        }
    }

    #makingActionSelection() {
        return new Promise(resolve => {
            UI.improviseButtonEl.addEventListener("click", e => resolve(this.#handleActionSelection(e)));
            UI.deployButtonEl.addEventListener("click", e => resolve(this.#handleActionSelection(e)));
        });
    }

    #handleActionSelection(e) {
        return e.target.id;
    }

    #makingTheaterSelection() {
        return new Promise(resolve => {
            UI.mainAreaEl.addEventListener("click", e => resolve(this.#handleTheaterSelection(e)));
        });
    }

    #handleTheaterSelection(e) {
        if (e.target.classList.contains("theater")) {
            return this.theaters.find(theater => theater.id === e.target.id);
        }
    }

    #endBattle() {
        this.battleWinner = this.#determineBattleWinner(this.theaters);

        if (this.players[0].victoryPoints === 3 || this.players[1].victoryPoints === 3) {
            UI.overlayEl.style.display = "flex";
            UI.battleWinnerEl.style.display = "none";
            UI.gameWinnerEl.style.display = "flex";
            UI.gameWinnerEl.innerHTML = `${this.battleWinner.name} won the game!`;
            UI.nextGameButtonEl.style.display = "block";
            UI.nextGameButtonEl.disabled = false;
            UI.nextBattleButtonEl.remove();
        } else {
            UI.overlayEl.style.display = "flex";
            UI.battleWinnerEl.innerHTML = `${this.battleWinner.name} won the battle!`;
            UI.nextBattleButtonEl.disabled = false;
        }
    }

    #getStartingPlayer() {
        return this.game.battles.length % 2 !== 0 ? this.players[1] : this.players[0];
    }

    #getActivePlayer() {
        return this.players.find(player => player.active);
    }

    #switchActivePlayer() {
        this.players.forEach(player => {
            player.active = player.active === true ? false : true;
        });

        this.activePlayer = this.#getActivePlayer();
        Log.activePlayer(this.activePlayer);
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

    #deploy() {
        const selectedCardEl = document.querySelector(".selected");
        const playerColumnEl =
            this.activePlayer instanceof Player
                ? document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot #player-one-column`)
                : document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot #player-two-column`);

        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== this.selectedCard);

        if (this.activePlayer instanceof Player) {
            UI.deployButtonEl.disabled = true;
            UI.improviseButtonEl.disabled = true;
            UI.descriptionEl.innerHTML = "";

            this.selectedTheater.playerOneCards.push(this.selectedCard);

            if (this.selectedTheater.playerOneCards.length > 1) {
                this.selectedTheater.playerOneCards.slice(-2)[0].covered = true;
            }

            this.selectedTheater.playerOneCardsTotal += this.selectedCard.strength;
        } else {
            this.selectedTheater.playerTwoCards.push(this.selectedCard);

            if (this.selectedTheater.playerTwoCards.length > 1) {
                this.selectedTheater.playerTwoCards.slice(-2)[0].covered = true;
            }

            this.selectedTheater.playerTwoCardsTotal += this.selectedCard.strength;
        }

        playerColumnEl.append(selectedCardEl);
        selectedCardEl.classList.remove("selected");
    }

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

    #determineBattleWinner(theaters) {
        let theatersControlledByPlayerOne = 0;
        let theatersControlledByPlayerTwo = 0;
        let battleWinner;

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
            battleWinner = this.players[0];
            this.players[0].victoryPoints++;
        } else {
            battleWinner = this.players[1];
            this.players[1].victoryPoints++;
        }

        return battleWinner;
    }
}
