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
        this.firstPlayer = this.game.battles.length === 2 ? this.players[1] : this.players[0];
        this.activePlayer = this.firstPlayer;
        this.selectedCard = null;
        this.selectedAction = null;
        this.selectedTheater = null;
        this.winner = null;
        this.log = [];
        
        this.#shuffleCards(this.theaters);
        this.#shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);
        this.#loadEventListeners();

        UI.displayPlayersName(this.players);
        UI.displayTheaters(this.theaters);
        UI.displayCards(this.cards);

        console.log(game);
    }

    #shuffleCards(cards) {
        let currentIndex = cards.length;
        let randomIndex;
    
        while(currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
        }
    
        return cards;
    }

    #dealCards(players, shuffledCards) {
        shuffledCards.forEach((shuffledCard, index) => {
            if(index < 2) {
                if(index % 2 !== 0) {
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

    #performAction(selectedAction) {
        switch(selectedAction) {
            case "deploy":
                this.#deploy(this.selectedCard, this.selectedTheater);
            case "improvise":
                this.#improvise(this.selectedCard, this.selectedTheater);
                break;
            case "withdraw":
                this.#withdraw();
        }
    }

    #deploy(selectedCard, selectedTheater) {
        
    }

    #improvise(selectedCard, selectedTheater) {
        const selectedCardEl = document.querySelector(".selected");
        const playerColumnEl = this.activePlayer.id === "1" ? document.querySelector(`#${selectedTheater.name.toLowerCase()}-depot #player-one-column`) : document.querySelector(`#${selectedTheater.name.toLowerCase()}-depot #player-two-column`);

        selectedCardEl.classList.remove("selected");
        selectedCardEl.classList.add("facedown");
        selectedCardEl.firstChild.style.display = "none";
        selectedCardEl.lastChild.style.display = "block";
        playerColumnEl.append(selectedCardEl);
        
        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== selectedCard);
        selectedCard.facedown = true;

        if(this.activePlayer.id === "1") {
            UI.deployButtonEl.disabled = true;
            UI.improviseButtonEl.disabled = true;
            UI.descriptionEl.innerHTML = "";

            selectedTheater.playerOneCards.push(selectedCard);

            if(selectedTheater.playerOneCards.length > 1) {
                selectedTheater.playerOneCards.slice(-2)[0].covered = true;
            }

            selectedTheater.playerOneCardsTotal += 2;

        } else {
            selectedTheater.playerTwoCards.push(selectedCard);

            if(selectedTheater.playerTwoCards.length > 1) {
                selectedTheater.playerTwoCards.slice(-2)[0].covered = true;
            }

            selectedTheater.playerTwoCardsTotal += 2;
        }
        this.log.push(new Log(this.activePlayer.name, selectedCard, selectedTheater, `${this.selectedAction.charAt(0).toUpperCase()}${this.selectedAction.slice(1)}`));
        
        this.selectedCard = null;
        this.selectedAction = null;
        this.selectedTheater = null;

        if(this.#areAllCardsPlayed()) {
            this.#endBattle();
        } else {
            this.#endturn();
        }
    }

    #withdraw() {
        
    }

    #endturn() {
        this.activePlayer = this.#changeActivePlayer(this.activePlayer);
        
        if(this.activePlayer.id === "2") {
            const selection = this.activePlayer.makeSelection(this.theaters);

            this.selectedCard = selection.selectedCard;
            this.selectedAction = selection.selectedAction;
            this.selectedTheater = selection.selectedTheater;

            setTimeout(() => {
                this.#performAction(this.selectedAction);
            }, 0);
        }
    }

    #areAllCardsPlayed() {
        return this.players[0].hand.length === 0 && this.players[1].hand.length === 0 ? true : false;
    }

    #endBattle() {
        this.#determineWinner(this.theaters);

        UI.overlayEl.style.display = "flex";
        UI.nextBattleButtonEl.addEventListener("click", e => {
            UI.mainAreaEl.innerHTML = "";
            UI.overlayEl.style.display = "none";
            this.game.createBattle();
        });
    }

    #determineWinner(theaters) {
        let theatersControlledByPlayerOne = 0;
        let theatersControlledByPlayerTwo = 0;

        theaters.forEach(theater => {
            if(theater.playerOneCardsTotal === theater.playerTwoCardsTotal) {
                if(this.firstPlayer === this.players[0]) {
                    theatersControlledByPlayerOne++;
                } else {
                    theatersControlledByPlayerTwo++;
                }
            } else if(theater.playerOneCardsTotal > theater.playerTwoCardsTotal) {
                theatersControlledByPlayerOne++;
            } else {
                theatersControlledByPlayerTwo++;
            }
        });

        if(theatersControlledByPlayerOne > theatersControlledByPlayerTwo) {
            this.winner = this.players[0];
        } else {
            this.winner = this.players[1];
        }
    }

    rotateCards(theaters) {

    }

    #changeActivePlayer(activePlayer) {
        switch(activePlayer.id) {
            case "1":
                return this.activePlayer = this.players[1];
            case "2":
                return this.activePlayer = this.players[0];
        }
    }

    #loadEventListeners() {
        UI.mainAreaEl.addEventListener("click", e => {
            if(e.target.classList.contains("theater")) {
                this.selectedTheater = this.theaters.find(theater => theater.id === e.target.id);
                this.#performAction(this.selectedAction);
            }
        });

        UI.playerOneHandEl.addEventListener("click", e => {
            this.selectedCard = this.activePlayer.hand.find(card => card.id === e.target.id);

            if(this.selectedCard.strength === 6) {
                UI.descriptionEl.innerHTML = `${this.selectedCard.tacticalAbility}`;
            } else {
                UI.descriptionEl.innerHTML = `${this.selectedCard.tacticalAbility} ${this.selectedCard.typeSymbol} – ${this.selectedCard.description}`;
            }
            
            Array.from(UI.playerOneHandEl.childNodes).forEach(cardEl => {
                if(cardEl.classList.contains("selected")) {
                    cardEl.classList.remove("selected");
                }
            });

            e.target.classList.add("selected");
            
            UI.deployButtonEl.disabled = false;
            UI.improviseButtonEl.disabled = false;
        });
        
        UI.deployButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
        UI.improviseButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
        UI.withdrawButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
    }
}