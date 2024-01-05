export default class Battle {
    constructor(playerOne, playerTwo, theaterBoards, cards, ui) {
        this.theaters = this.#shuffleCards(theaterBoards);
        console.log(`${playerOne.name} has shuffled and dealt the theater boards.`);
        this.#displayTheaterBoards(this.theaters, ui);

        this.cards = this.#shuffleCards(cards);
        this.#dealCards(this.cards, playerOne, playerTwo);
        this.dealtCards = playerOne.hand.concat(playerTwo.hand);
        this.#displayCards(this.dealtCards, ui);
        this.#addEventListener(this.dealtCards);
        console.log(`${playerOne.name} has shuffled and dealt the cards.`);
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

    #dealCards(cards, playerOne, playerTwo) {
        for(let i = 0; i < 12; i++) {
            if(i % 2 !== 0) {
                playerOne.hand.push(cards[i]);
            } else {
                playerTwo.hand.push(cards[i]);
            }
        }
    }

    rotateCards(cards) {

    }

    #displayTheaterBoards(theaters, ui) {
        const theaterBoardsEl = document.querySelector("#theater-boards");

        theaters.forEach(theater => {
            const theaterEl = ui.createElement("div");
            const nameEl = ui.createElement("div");

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

            ui.displayElement(theaterEl, theaterBoardsEl);
        });
    }

    #displayCards(cards, ui) {
        const playerOneEl = document.querySelector("#player-one");
        const playerTwoEl = document.querySelector("#player-two");

        cards.forEach((card, i) => {
            const cardEl = ui.createElement("div");
            const strengthEl = ui.createElement("div");
            const tacticalAbilityEl = ui.createElement("div");
            const descriptionEl = ui.createElement("small");

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
            
            if(i % 2 !== 0) {
                ui.displayElement(cardEl, playerOneEl);
            } else {
                ui.displayElement(cardEl, playerTwoEl);
            }
        });
    }

    #addEventListener() {
        const dealtCardsEl = document.querySelectorAll(".card");

        dealtCardsEl.forEach(dealtCardEl => {
            dealtCardEl.addEventListener("click", e => {
                const action = prompt("Deploy, improvise, or withdraw?");
    
                switch(action) {
                    case "Deploy":
                        playerOne.deploy();
                    case "Improvise":
                        playerOne.improvise(e.target, theaters[0]);
                    case "Withdraw":
                        playerOne.withdraw();
                }
            });
        });
    }
}