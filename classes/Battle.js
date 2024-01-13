import Log from "./Log.js";
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
        this.log = [];
        this.elements = UI.getElements();
        
        this.#displayPlayersName(this.players);

        this.#shuffleCards(this.theaters);
        this.#displayTheaters(this.theaters);
                
        this.#shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);
        this.#displayCards(this.cards);

        this.#loadEventListeners();

        console.log(this);
    }

    #displayPlayersName(players) {
        this.elements.playerOneNameEl.innerHTML = players[0].name;
        this.elements.playerTwoNameEl.innerHTML = players[1].name;
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
        const playerOneColumn = document.querySelector(`#${selectedTheater.name.toLowerCase()}-depot #player-one-column`);
        const selectedCardEl = document.querySelector(".selected");

        selectedCardEl.classList.remove("selected");
        selectedCardEl.classList.add("facedown");
        selectedCardEl.firstChild.style.display = "none";
        selectedCardEl.lastChild.style.display = "block";
        playerOneColumn.append(selectedCardEl);

        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== selectedCard);
        selectedCard.facedown = true;

        if(this.activePlayer.id === "1") {
            selectedTheater.playerOneCards.push(selectedCard);
            selectedTheater.playerOneCardsTotal += 2;
        } else {
            selectedTheater.playerTwoCards.push(selectedCard);
            selectedTheater.playerTwoCardsTotal += 2;
        }

        this.elements.deployButtonEl.disabled = true;
        this.elements.improviseButtonEl.disabled = true;
        this.elements.descriptionEl.innerHTML = "";

        this.log.push(new Log(this.activePlayer.name, selectedCard, selectedTheater, this.selectedAction));        
        // this.#endturn();
    }

    #withdraw() {
        
    }

    #endturn() {
        this.activePlayer = this.#changeActivePlayer(this.activePlayer);
        this.selectedCard = null;
        this.selectedTheater = null;
        this.selectedAction = null;
    }

    rotateCards(shuffledTheaters) {

    }

    #changeActivePlayer(activePlayer) {
        if(activePlayer.id === "1") {
            return this.activePlayer = this.players[1];
        } else {
            return this.activePlayer = this.players[0];
        }
    }

    #displayTheaters(shuffledTheaters) {        
        shuffledTheaters.forEach(theater => {
            const depotEl = UI.createElement("div");
            const theaterContainerEl = UI.createElement("div");
            const theaterEl = UI.createElement("div");
            const nameEl = UI.createElement("div");
            const playerOneColumnEl = UI.createElement("div");
            const playerTwoColumnEl = UI.createElement("div");

            depotEl.setAttribute("id", `${theater.name.toLowerCase()}-depot`);
            depotEl.classList.add("depot");

            theaterContainerEl.classList.add("theater-container");
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

            playerOneColumnEl.setAttribute("id", "player-one-column");
            playerOneColumnEl.classList.add("column");
            playerTwoColumnEl.setAttribute("id", "player-two-column");
            playerTwoColumnEl.classList.add("column");

            theaterEl.append(nameEl);
            theaterContainerEl.append(theaterEl);

            depotEl.append(playerTwoColumnEl);
            depotEl.append(theaterContainerEl);
            depotEl.append(playerOneColumnEl);

            this.elements.mainAreaEl.append(depotEl);
        });
    }

    #displayCards(cards) {
        const discardedCardsEl = UI.createElement("div");

        discardedCardsEl.setAttribute("id", "discarded-cards");
        discardedCardsEl.classList.add("depot");
        this.elements.mainAreaEl.append(discardedCardsEl);

        cards.forEach((card, index) => {
            const cardContainerEl = UI.createElement("div");
            const cardFrontEl = UI.createElement("div");
            const cardBackEl = UI.createElement("div");
            const strengthEl = UI.createElement("div");
            const tacticalAbilityEl = UI.createElement("div");
            const defaultValueEl = UI.createElement("div");
            
            cardContainerEl.setAttribute("id", card.id);
            cardContainerEl.classList.add("card");

            switch(card.theater) {
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
            strengthEl.innerHTML = card.strength;
            strengthEl.classList.add("strength");
            tacticalAbilityEl.innerHTML = card.tacticalAbility;
            tacticalAbilityEl.classList.add("tactical-ability");
            
            cardBackEl.classList.add("back");
            defaultValueEl.innerHTML = "2";
            defaultValueEl.classList.add("defaut-value");
            
            cardFrontEl.append(strengthEl);
            cardBackEl.append(defaultValueEl);
            cardContainerEl.append(cardFrontEl, cardBackEl);
            
            if(index < 12) {
                if(index % 2 !== 0) {
                    this.elements.playerOneHandEl.append(cardContainerEl);
                    cardContainerEl.lastChild.style.display = "none";
                } else {
                    this.elements.playerTwoHandEl.append(cardContainerEl);
                    cardContainerEl.classList.add("facedown");
                    cardContainerEl.firstChild.style.display = "none";
                }
            } else {
                discardedCardsEl.append(cardContainerEl);
                cardContainerEl.classList.add("facedown", "discarded");
                cardContainerEl.firstChild.style.display = "none";
            }
        });
    }
    
    #loadEventListeners() {
        this.elements.mainAreaEl.addEventListener("click", e => {
            if(e.target.classList.contains("theater")) {
                this.selectedTheater = this.theaters.find(theater => theater.id === e.target.id);
                this.#performAction(this.selectedAction, e.target);
            }
        });

        this.elements.handEl.addEventListener("click", e => {
            this.selectedCard = this.activePlayer.hand.find(card => card.id === e.target.id);

            if(this.selectedCard.strength === 6) {
                this.elements.descriptionEl.innerHTML = `${this.selectedCard.tacticalAbility}`;
            } else {
                this.elements.descriptionEl.innerHTML = `${this.selectedCard.tacticalAbility} ${this.selectedCard.typeSymbol} &ndash; ${this.selectedCard.description}`;
            }
            
            Array.from(this.elements.handEl.children).forEach(cardEl => {
                if(cardEl.classList.contains("selected")) {
                    cardEl.classList.remove("selected");
                }
            });

            e.target.classList.add("selected");
            
            this.elements.deployButtonEl.disabled = false;
            this.elements.improviseButtonEl.disabled = false;
        });
        
        this.elements.deployButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
        this.elements.improviseButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
        this.elements.withdrawButtonEl.addEventListener("click", e => this.selectedAction = e.target.id);
    }
}