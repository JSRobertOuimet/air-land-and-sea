export default class Battle {
    constructor(playerOne, playerTwo, theaterBoards, cards, ui) {
        this.theaters = this.#shuffleCards(theaterBoards);
        console.log(`${playerOne.name} has shuffled and dealt the theater boards.`);
        this.#displayTheaterBoards(ui, this.theaters);

        this.cards = this.#shuffleCards(cards);
        this.#dealCards(this.cards, playerOne, playerTwo);
        this.dealtCards = playerOne.hand.concat(playerTwo.hand);
        this.#displayCards(ui, this.dealtCards);
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

    #displayTheaterBoards(ui, theaters) {
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

    #displayCards(ui, cards) {
        const playerOne = document.querySelector("#player-one");
        const playerTwo = document.querySelector("#player-two");

        cards.forEach((card, i) => {
            const cardEl = ui.createElement("div");
            const strengthEl = ui.createElement("div");
            const tacticalAbilityEl = ui.createElement("div");
            const descriptionEl = ui.createElement("small");

            cardEl.setAttribute("id", card.id);
            cardEl.classList.add("card");
            cardEl.addEventListener("click", e => {
                // prompt("Deploy, improvise, or withdraw?");
            });

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
                ui.displayElement(cardEl, playerOne);
            } else {
                ui.displayElement(cardEl, playerTwo);
            }
        });
    }
}