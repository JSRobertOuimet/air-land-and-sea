import Player from "../classes/Player.js";

export function getRandomTheater(theaters) {
    return theaters[Math.floor(Math.random() * theaters.length)];
}

export function getAdjacentTheaters(theaters, selectedTheater) {
    const adjacentTheaters = [];
    const theaterIndex = theaters.findIndex(theater => theater.name === selectedTheater.name);

    switch (theaterIndex) {
        case 0:
        case 2:
            adjacentTheaters.push(theaters[1]);
            break;
        case 1:
            adjacentTheaters.push(theaters[0]);
            adjacentTheaters.push(theaters[2]);
            break;
    }

    return adjacentTheaters;
}

export function getRandomCard(hand) {
    return hand[Math.floor(Math.random() * hand.length)];
}

export function getAllCards(activePlayer, theaters) {
    const cardsInHand = activePlayer.hand;
    const cardsInTheater = getAllCardsInTheater(activePlayer, theaters);

    return [...cardsInHand, ...cardsInTheater];
}

export function getAllCardsInTheater(activePlayer, theaters) {
    let allcardsInTheater = [];

    if (activePlayer === null) {
        theaters.forEach(theater => {
            allcardsInTheater.push(...theater.playerCards, ...theater.botCards);
        });
    } else {
        const cardsInTheater = activePlayer instanceof Player ? "playerCards" : "botCards";

        theaters.forEach(theater => {
            allcardsInTheater.push(...theater[cardsInTheater]);
        });
    }

    return allcardsInTheater;
}

export function isCardInTheater(cardID, activePlayer, theaters) {
    return getAllCardsInTheater(activePlayer, theaters).find(card => card.id === cardID && card.facedown === false);
}

export function getCoveredCards(activePlayer, selectedTheater) {
    const cardsInTheater = activePlayer instanceof Player ? selectedTheater.playerCards : selectedTheater.botCards;
    const coveredCards = cardsInTheater.filter(card => card.covered);

    return coveredCards;
}

export function getFacedownCards(activePlayer, theaters) {
    const cardsInTheater = activePlayer instanceof Player ? "playerCards" : "botCards";
    let facedownCards = [];

    theaters.forEach(theater => {
        facedownCards.push(...theater[cardsInTheater].filter(playerCard => playerCard.facedown));
    });

    return facedownCards;
}

export function getRandomAction(selectedCard) {
    const actions = ["deploy", "improvise"];

    switch (selectedCard.id) {
        case "1":
        case "4":
        case "5":
        case "10":
        case "14":
            return "deploy";
        default:
            return actions[Math.floor(Math.random() * actions.length)];
    }
}
