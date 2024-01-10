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

        this.#endturn();
    }

    #withdraw() {
        
    }

    #endturn() {
        this.activePlayer.id === "1" ? this.activePlayer = this.players[1] : this.activePlayer = this.activePlayer[0];
    }

    rotateCards(shuffledTheaters) {

    }

    #displayTheaters(shuffledTheaters) {
        const theatersEl = document.querySelector("#theaters");

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
        const playerOneHandEl = document.querySelector("#player-one .hand");
        const playerTwoHandEl = document.querySelector("#player-two .hand");

        dealtCards.forEach((card, index) => {
            const cardEl = UI.createElement("div");
            const strengthEl = UI.createElement("div");
            const tacticalAbilityEl = UI.createElement("div");
            const descriptionEl = UI.createElement("small");

            cardEl.setAttribute("id", card.id);
            cardEl.classList.add("card");

            strengthEl.innerHTML = card.strength;
            strengthEl.classList.add("strength");

            tacticalAbilityEl.classList.add("tactical-ability");
            tacticalAbilityEl.innerHTML = card.tacticalAbility;
            
            descriptionEl.innerHTML = card.description;
            descriptionEl.classList.add("description");

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
            
            cardEl.append(strengthEl, tacticalAbilityEl, descriptionEl);
            
            if(index % 2 !== 0) {
                UI.displayElement(cardEl, playerOneHandEl);
            } else {
                UI.displayElement(cardEl, playerTwoHandEl);
            }
        });
    }
    
    #loadEventListeners() {
        const theatersEl = document.querySelector("#theaters");
        const handEl = document.querySelector("#player-one .hand");
        const deployButtonEl = document.querySelector("#deploy");
        const improviseButtonEl = document.querySelector("#improvise");
        const withdrawButtonEl = document.querySelector("#withdraw");

        theatersEl.addEventListener("click", e => {
            if(e.target.classList.contains("theater")) {
                this.selectedTheater = this.theaters.find(theater => theater.id === e.target.id);
                this.#performAction(this.selectedAction, e.target);
            }
        });

        handEl.addEventListener("click", e => {
            if(e.target.classList.contains("card")) {
                this.selectedCard = this.activePlayer.hand.find(card => card.id === e.target.id);
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