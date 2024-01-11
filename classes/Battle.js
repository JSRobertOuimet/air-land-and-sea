import UI from "./UI.js";

export default class Battle {
    static id = 1;

    constructor(theaters, cards, players) {
        this.id = (Battle.id++).toString();
        this.theaters = theaters;
        this.cards = cards;
        this.dealtCards = [];
        this.discardedCards = [];
        this.players = players;
        this.activePlayer = this.players[0];
        this.selectedTheater = null;
        this.selectedCard = null;
        this.selectedAction = null;
        this.elements = UI.getElements();
        
        this.#shuffleCards(this.theaters);
        this.#displayTheaters(this.theaters);
                
        this.#shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);
        this.#displayCards(this.dealtCards);

        this.#loadEventListeners();
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
            if(index < 12) {
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
        const playerOneCardsEl = document.querySelector(`#theater-container-${selectedTheater.name.toLowerCase()} #player-one-cards`);
        const selectedCardEl = document.querySelector(".selected");

        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== selectedCard);
        
        if(this.activePlayer.id === "1") {
            selectedTheater.playerOneCards.push(selectedCard);
            selectedCardEl.style.display = "none";
            playerOneCardsEl.append(selectedCardEl);
            selectedCardEl.style.display = "block";
            selectedCardEl.classList.remove("selected");
        } else {
            selectedTheater.playerTwoCards.push(selectedCard);
        }

        console.log(`${this.activePlayer.name} played a card facedown (${this.selectedCard.tacticalAbility}) in the ${this.selectedTheater.name} theater.`)
        this.#endturn();
    }

    #withdraw() {
        
    }

    #endturn() {
        this.activePlayer.id === "1" ? this.activePlayer = this.players[1] : this.activePlayer = this.activePlayer[0];
        this.selectedCard = null;
        this.selectedTheater = null;
        this.selectedAction = null;
    }

    rotateCards(shuffledTheaters) {

    }

    #displayTheaters(shuffledTheaters) {
        const theatersEl = this.elements.theatersEl;

        shuffledTheaters.forEach(theater => {
            const theaterContainerEl = UI.createElement("div");
            const theaterEl = UI.createElement("div");
            const nameEl = UI.createElement("div");
            const playerOneCardsEl = UI.createElement("div");
            const playerTwoCardsEl = UI.createElement("div");

            theaterContainerEl.setAttribute("id", `theater-container-${theater.name.toLowerCase()}`);

            theaterEl.setAttribute("id", theater.id);
            theaterEl.classList.add("theater");

            nameEl.innerHTML = `&ndash;${theater.name}&ndash;`;
            nameEl.classList.add("name");

            switch(theater.name) {
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

            playerOneCardsEl.setAttribute("id", "player-one-cards");
            playerTwoCardsEl.setAttribute("id", "player-two-cards");

            theaterContainerEl.append(playerTwoCardsEl);
            theaterContainerEl.append(theaterEl);
            theaterContainerEl.append(playerOneCardsEl);
            theaterEl.append(nameEl);

            UI.displayElement(theaterContainerEl, theatersEl);
        });
    }

    #displayCards(dealtCards) {
        const playerOneHandEl = this.elements.playerOneHandEl;
        const playerTwoHandEl = this.elements.playerTwoHandEl;

        dealtCards.forEach((card, index) => {
            const cardEl = UI.createElement("div");
            const strengthEl = UI.createElement("div");
            const tacticalAbilityEl = UI.createElement("div");

            cardEl.setAttribute("id", card.id);
            cardEl.classList.add("card");

            strengthEl.innerHTML = card.strength;
            strengthEl.classList.add("strength");

            tacticalAbilityEl.classList.add("tactical-ability");
            tacticalAbilityEl.innerHTML = card.tacticalAbility;

            switch(card.theater) {
                case "Air":
                    cardEl.classList.add("air");
                    break;
                case "Land":
                    cardEl.classList.add("land");
                    break;
                case "Sea":
                    cardEl.classList.add("sea");
                    break;
            }
            
            cardEl.append(strengthEl, tacticalAbilityEl);
            
            if(index % 2 !== 0) {
                UI.displayElement(cardEl, playerOneHandEl);
            } else {
                UI.displayElement(cardEl, playerTwoHandEl);
            }
        });
    }
    
    #loadEventListeners() {
        const theatersEl = this.elements.theatersEl;
        const handEl = this.elements.handEl;
        const deployButtonEl = this.elements.deployButtonEl;
        const improviseButtonEl = this.elements.improviseButtonEl;
        const withdrawButtonEl = this.elements.withdrawButtonEl;

        theatersEl.addEventListener("click", e => {
            if(e.target.classList.contains("theater")) {
                this.selectedTheater = this.theaters.find(theater => theater.id === e.target.id);
                this.#performAction(this.selectedAction, e.target);
            }
        });

        handEl.addEventListener("click", e => {
            if(e.target.classList.contains("card")) {
                this.selectedCard = this.activePlayer.hand.find(card => card.id === e.target.id);
                this.elements.descriptionEl.innerHTML = this.selectedCard.description;
                
                Array.from(this.elements.handEl.children).forEach(cardEl => {
                    if(cardEl.classList.contains("selected")) {
                        cardEl.classList.remove("selected");
                    }
                });

                e.target.classList.add("selected");
                
                deployButtonEl.disabled = false;
                improviseButtonEl.disabled = false;
            }
        });
        
        deployButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
        improviseButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
        withdrawButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
    }
}