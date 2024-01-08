import Player from "./Player.js";
import UI from "./UI.js";

export default class Battle {
    static id = 1;

    constructor(theaters, cards, players) {
        this.id = Battle.id++;
        this.theaters = theaters;
        this.cards = cards;
        this.players = players;
        this.dealtCards = [];
        this.activePlayer = this.players[0];
        
        this.#shuffleCards(this.theaters);
        
        this.#shuffleCards(this.cards);
        this.#dealCards(this.players, this.cards);

        this.#displayTheaters(this.theaters);
        this.#displayCards(this.dealtCards);

        this.#addEventListeners();
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

    rotateCards(shuffledTheaters) {

    }

    #displayTheaters(shuffledTheaters) {
        const theaterBoardsEl = document.querySelector("#theater-boards");

        shuffledTheaters.forEach(theater => {
            const theaterEl = UI.createElement("div");
            const nameEl = UI.createElement("div");

            theaterEl.classList.add("theater-board");

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

            UI.displayElement(theaterEl, theaterBoardsEl);
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
    
    #addEventListeners() {
        const dealtCardsEl = document.querySelectorAll(".card");
        const deployButtonEl = document.querySelector("#deploy");
        const improviseButtonEl = document.querySelector("#improvise");
        const withdrawButtonEl = document.querySelector("#withdraw");

        dealtCardsEl.forEach(dealtCardEl => {
            dealtCardEl.addEventListener("click", e => {
                deployButtonEl.disabled = false;
                improviseButtonEl.disabled = false;
            });
        });

        // deployButtonEl.addEventListener("click", Player.deploy(this.activePlayer, card, theater));
        // improviseButtonEl.addEventListener("click", Player.improvise(this.activePlayer, card, theater));
        // withdrawButtonEl.addEventListener("click", Player.withdraw());
    }
}