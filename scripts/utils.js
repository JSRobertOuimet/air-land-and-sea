import Player from "./classes/Player.js";

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

export function getCoveredCards(activePlayer, selectedTheater) {
    const playerCards = activePlayer instanceof Player ? selectedTheater.playerCards : selectedTheater.botCards;
    const coveredCards = playerCards.filter(card => card.covered);

    return coveredCards;
}

export function getFacedownCards(activePlayer, theaters) {
    const playerCards = activePlayer instanceof Player ? "playerCards" : "botCards";
    let facedownCards = [];

    theaters.forEach(theater => {
        facedownCards.push(...theater[playerCards].filter(playerCard => playerCard.facedown));
    });

    return facedownCards;
}

export function getAllCardsInTheater(activePlayer, theaters) {
    let allcardsInTheater = [];

    if (activePlayer === null) {
        theaters.forEach(theater => {
            allcardsInTheater.push(...theater.playerCards, ...theater.botCards);
        });
    } else {
        const playerCards = activePlayer instanceof Player ? "playerCards" : "botCards";

        theaters.forEach(theater => {
            allcardsInTheater.push(...theater[playerCards]);
        });
    }

    return allcardsInTheater;
}

export function getAllCards(activePlayer, theaters) {
    const cardsInHand = activePlayer.hand;
    const cardsInTheater = getAllCardsInTheater(activePlayer, theaters);

    return [...cardsInHand, ...cardsInTheater];
}
