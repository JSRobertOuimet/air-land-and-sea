import Player from "./Player.js";
import UI from "./UI.js";

export default class Battle {
    static id = 1;

    constructor(theaters, cards, players) {
        this.id = (Battle.id++).toString();
        this.theaters = theaters;
        this.cards = cards;
        this.players = players;
        this.dealtCards = [];
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
        for(let i = 0; i < 12; i++) {
            if(i % 2 !== 0) {
                players[0].hand.push(shuffledCards[i]);
                this.dealtCards.push(shuffledCards[i]);
            } else {
                players[1].hand.push(shuffledCards[i]);
                this.dealtCards.push(shuffledCards[i]);
            }
        }
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
        this.activePlayer.hand = this.activePlayer.hand.filter(card => card !== selectedCard);
        
        if(this.activePlayer.id === "1") {
            selectedTheater.playerOneCards.push(selectedCard);
        } else {
            selectedTheater.playerTwoCards.push(selectedCard);
        }
    }

    #withdraw() {
        
    }

    rotateCards(shuffledTheaters) {

    }

    #displayTheaters(shuffledTheaters) {
        const theatersEl = document.querySelector("#theaters");

        shuffledTheaters.forEach(theater => {
            const theaterEl = UI.createElement("div");
            const nameEl = UI.createElement("div");

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

            theaterEl.append(nameEl);

            UI.displayElement(theaterEl, theatersEl);
        });
    }

    #displayCards(dealtCards) {
        const playerOneHandEl = document.querySelector("#player-one .hand");
        const playerTwoHandEl = document.querySelector("#player-two .hand");

        dealtCards.forEach((card, i) => {
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
            
            // descriptionEl.innerHTML = card.description;
            // descriptionEl.classList.add("description");

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
            
            if(i % 2 !== 0) {
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
                console.log(this.selectedTheater);
                this.#performAction(this.selectedAction);
            }
        });

        handEl.addEventListener("click", e => {
            if(e.target.classList.contains("card")) {
                this.selectedCard = this.activePlayer.hand.find(card => card.id === e.target.id);

                deployButtonEl.disabled = false;
                improviseButtonEl.disabled = false;
            }
        });
        
        deployButtonEl.addEventListener("click", this.#deploy.bind(this));
        improviseButtonEl.addEventListener("click", e => {
            this.selectedAction = e.target.id;
        });
        withdrawButtonEl.addEventListener("click", this.#withdraw.bind(this));
    }
}