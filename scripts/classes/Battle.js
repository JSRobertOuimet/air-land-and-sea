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
        this.startingPlayer = null;
        this.activePlayer = null;
        this.selectedCard = null;
        this.selectedAction = null;
        this.selectedTheater = null;
        this.winner = null;
        this.log = [];

        this.#shuffleCards(this.theaters);
        this.#shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);
        this.#loadEventListeners();
        this.#determineStartingPlayer();
        
        UI.displayPlayersName(this.players);
        UI.displayTheaters(this.theaters);
        UI.displayCards(this.cards);

        console.clear();
        console.log(this.id);
        console.log("Starting Player: ", this.startingPlayer);
        console.log("Active Player: ", this.activePlayer);

        if(this.startingPlayer instanceof Bot) {
            this.#playTurn();
        }
    }

    #determineStartingPlayer() {
        if (this.id === "1" || this.id === "3") {
            this.startingPlayer = this.players[0];
        } else {
            this.startingPlayer = this.players[1];
        }

        this.activePlayer = this.startingPlayer;
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

    #dealCards(players, shuffledCards) {
        shuffledCards.forEach((shuffledCard, index) => {
            if (index < 4) {
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

    rotateTheaters(theaters) {}

    #performAction(selectedAction) {
        switch (selectedAction) {
            case "deploy":
                this.#deploy(this.selectedCard, this.selectedTheater);
                break;
            case "improvise":
                this.#improvise(this.activePlayer, this.selectedCard, this.selectedTheater);
                this.log.push(new Log(this.activePlayer.name, this.selectedCard, this.selectedTheater, `${this.selectedAction.charAt(0).toUpperCase()}${this.selectedAction.slice(1)}`));
                this.#endTurn();
                break;
            case "withdraw":
                this.#withdraw();
                break;
        }
    }

    #deploy(selectedCard, selectedTheater) {}

    #improvise(activePlayer, selectedCard, selectedTheater) {
        let selectedCardEl = document.querySelector(".selected");
        let playerColumnEl =
            activePlayer instanceof Player
                ? document.querySelector(`#${selectedTheater.name.toLowerCase()}-depot #player-one-column`)
                : document.querySelector(`#${selectedTheater.name.toLowerCase()}-depot #player-two-column`);

        selectedCardEl.classList.remove("selected");
        selectedCardEl.classList.add("facedown");
        selectedCardEl.firstChild.style.display = "none";
        selectedCardEl.lastChild.style.display = "block";
        playerColumnEl.append(selectedCardEl);

        activePlayer.hand = activePlayer.hand.filter(card => card !== selectedCard);
        selectedCard.facedown = true;

        if (activePlayer.id === "1") {
            UI.deployButtonEl.disabled = true;
            UI.improviseButtonEl.disabled = true;
            UI.descriptionEl.innerHTML = "";

            selectedTheater.playerOneCards.push(selectedCard);

            if (selectedTheater.playerOneCards.length > 1) {
                selectedTheater.playerOneCards.slice(-2)[0].covered = true;
            }

            selectedTheater.playerOneCardsTotal += 2;
        } else {
            selectedTheater.playerTwoCards.push(selectedCard);

            if (selectedTheater.playerTwoCards.length > 1) {
                selectedTheater.playerTwoCards.slice(-2)[0].covered = true;
            }

            selectedTheater.playerTwoCardsTotal += 2;
        }

        playerColumnEl = null;
    }

    #withdraw() {}

    #endTurn() {
        debugger;
        this.selectedCard = null;
        this.selectedAction = null;
        this.selectedTheater = null;
        if(this.log.length === 4) {
            this.#endBattle();
        } else {
            switch (this.activePlayer.id) {
                case "1":
                    this.activePlayer = this.players[1];
                    this.#playTurn();
                    break;
                case "2":
                    this.activePlayer = this.players[0];
                    break;
            }
        }
    }

    #endBattle() {
        this.#determineWinner(this.theaters);
        this.#removeEventListeners();
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

    #playTurn() {
        this.selectedCard = this.activePlayer.selectCard();
        this.selectedAction = this.activePlayer.selectAction();
        this.selectedTheater = this.activePlayer.selectTheater(this.theaters);
        this.#performAction(this.selectedAction);
    }

    #loadEventListeners() {
        UI.playerOneHandEl.addEventListener("click", this.#handleCardSelection.bind(this));
        UI.deployButtonEl.addEventListener("click", this.#handleActionSelection.bind(this));
        UI.improviseButtonEl.addEventListener("click", this.#handleActionSelection.bind(this));
        UI.withdrawButtonEl.addEventListener("click", this.#handleActionSelection.bind(this));
        UI.mainAreaEl.addEventListener("click", this.#handleTheaterSelection.bind(this));
        UI.nextBattleButtonEl.addEventListener("click", this.#handleBattleCreation.bind(this));
    }

    #removeEventListeners() {
        UI.playerOneHandEl.removeEventListener("click", this.#handleCardSelection);
        UI.deployButtonEl.removeEventListener("click", this.#handleActionSelection);
        UI.improviseButtonEl.removeEventListener("click", this.#handleActionSelection);
        UI.withdrawButtonEl.removeEventListener("click", this.#handleActionSelection);
        UI.mainAreaEl.removeEventListener("click", this.#handleTheaterSelection);
        UI.nextBattleButtonEl.removeEventListener("click", this.#handleBattleCreation);
    }

    #handleCardSelection(e) {
        debugger;
        console.log(this);

        this.selectedCard = this.activePlayer.hand.find(card => card.id === e.target.id);

        Array.from(UI.playerOneHandEl.childNodes).forEach(cardEl => {
            if (cardEl.classList.contains("selected")) {
                cardEl.classList.remove("selected");
            }
        });

        e.target.classList.add("selected");

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
        this.game.createBattle();
    }
}
