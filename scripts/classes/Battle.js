import { CONFIG } from "../data/CONFIG.js";
import Game from "./Game.js";
import Player from "./Player.js";
import Bot from "./Bot.js";
import Log from "./Log.js";
import UI from "./UI.js";

export default class Battle {
    static id = 1;

    constructor(game) {
        this.id = (Battle.id++).toString();
        this.game = game;
        this.players = game.players;
        this.theaters = game.theaters;
        this.cards = game.cards;
        this.dealtCards = [];
        this.discardedCards = [];
        this.startingPlayer = this.getStartingPlayer();
        this.turns = CONFIG.cardsInHand;
        this.selectedCard = null;
        this.selectedAction = "";
        this.selectedTheater = null;
        this.winner = null;
        this.log = [];

        this.#initializeBattle();

        // console.clear();
        // console.log(this);
        // console.log("Starting Player: ", this.getStartingPlayer());
        // console.log("Active Player: ", this.getActivePlayer());
    }

    #initializeBattle() {
        this.game.shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);
        this.game.render(this.players, this.theaters, this.cards);
        this.#loadEventListeners();

        if (this.startingPlayer instanceof Bot) {
            this.play();
        }
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

    #loadEventListeners() {
        UI.playerOneHandEl.addEventListener("click", this.#handleCardSelection.bind(this));
        UI.deployButtonEl.addEventListener("click", this.#handleActionSelection.bind(this));
        UI.improviseButtonEl.addEventListener("click", this.#handleActionSelection.bind(this));
        UI.withdrawButtonEl.addEventListener("click", this.#handleActionSelection.bind(this));
        UI.mainAreaEl.addEventListener("click", this.#handleTheaterSelection.bind(this));
        UI.nextBattleButtonEl.addEventListener("click", this.#handleBattleCreation.bind(this));
    }

    #handleCardSelection(e) {
        this.selectedCard = this.getActivePlayer().hand.find(card => card.id === e.target.id);

        Array.from(UI.playerOneHandEl.childNodes).forEach(cardEl => {
            if (cardEl.classList.contains("selected")) {
                cardEl.classList.remove("selected");
            }
        });

        e.target.classList.add("selected");

        if (e.target.classList.contains("card")) {
            this.selectedCard = this.getActivePlayer().hand.find(card => card.id === e.target.id);

            Array.from(UI.playerOneHandEl.childNodes).forEach(cardEl => {
                if (cardEl.classList.contains("selected")) {
                    cardEl.classList.remove("selected");
                }
            });

            e.target.classList.add("selected");
        }

        if (e.target.classList.contains("strength")) {
            this.selectedCard = this.getActivePlayer().hand.find(
                card => card.id === e.target.parentNode.parentNode.id
            );

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

    #handleActionSelection(e) {
        this.selectedAction = e.target.id;
    }

    #handleTheaterSelection(e) {
        if (e.target.classList.contains("theater")) {
            this.selectedTheater = this.theaters.find(theater => theater.id === e.target.id);
            this.#performAction(this.selectedAction);
        }
    }

    #handleBattleCreation() {
        UI.mainAreaEl.innerHTML = "";
        UI.overlayEl.style.display = "none";
        this.game.createBattle(this.game);
    }

    getStartingPlayer() {
        return this.id === "1" || this.id === "3" ? this.players[0] : this.players[1];
    }

    getActivePlayer() {
        return this.players.find(player => player.active);
    }

    switchActivePlayer() {
        this.players.forEach(player => {
            player.active = player.active === true ? false : true;
        });
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

    play() {
        const activePlayer = this.getActivePlayer();

        this.selectedCard = activePlayer.selectCard();
        this.selectedAction = activePlayer.selectAction();
        this.selectedTheater = activePlayer.selectTheater(this.theaters);
        this.#performAction(this.selectedAction);
    }

    #deploy() {}

    #improvise() {
        const activePlayer = this.getActivePlayer();
        const selectedCardEl = document.querySelector(".selected");
        const playerColumnEl =
            activePlayer instanceof Player
                ? document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot #player-one-column`)
                : document.querySelector(`#${this.selectedTheater.name.toLowerCase()}-depot #player-two-column`);

        activePlayer.hand = activePlayer.hand.filter(card => card !== this.selectedCard);
        this.selectedCard.facedown = true;

        if (activePlayer instanceof Player) {
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

        this.log.push(new Log(activePlayer.name, this.selectedCard, this.selectedTheater, `${this.selectedAction.charAt(0).toUpperCase()}${this.selectedAction.slice(1)}`));
        this.#endTurn();
    }

    #withdraw() {
        console.log("Clicked!");
    }

    #endTurn() {
        const activePlayer = this.getActivePlayer();

        console.log(activePlayer.name);

        this.selectedCard = null;
        this.selectedAction = "";
        this.selectedTheater = null;

        if(activePlayer instanceof Player) {
            this.turns--;
            console.log(this.turns);

            if(this.turns === 0) {
                this.#endBattle();
            } else {
                this.switchActivePlayer();
                this.play();
            }
        }
        
        if(activePlayer instanceof Bot) {
            this.turns--;
            console.log(this.turns);

            if(this.turns === 0) {
                this.#endBattle();
            } else {
                this.switchActivePlayer();
                // How to stop the execution?
            }
        }
    }

    #endBattle() {
        this.#determineWinner(this.theaters);
        UI.overlayEl.style.display = "flex";
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