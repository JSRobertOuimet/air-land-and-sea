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

export function getAllCards(theaters, activePlayer) {
    const cardsInHand = activePlayer.hand;
    const cardsInTheater = getAllCardsInTheater(theaters, activePlayer);

    return [...cardsInHand, ...cardsInTheater];
}

export function getAllCardsInTheater(theaters, player) {
    let allcardsInTheater = [];

    if (player === undefined) {
        theaters.forEach(theater => {
            allcardsInTheater.push(...theater.playerCards, ...theater.botCards);
        });
    } else {
        const cardsInTheater = player instanceof Player ? "playerCards" : "botCards";

        theaters.forEach(theater => {
            allcardsInTheater.push(...theater[cardsInTheater]);
        });
    }

    return allcardsInTheater;
}

export function isCardInTheater(cardId, theaters, player) {
    return getAllCardsInTheater(theaters, player).find(card => card.id === cardId && card.facedown === false);
}

export function getCoveredCards(selectedTheater, activePlayer) {
    const cardsInTheater = activePlayer instanceof Player ? selectedTheater.playerCards : selectedTheater.botCards;
    const coveredCards = cardsInTheater.filter(card => card.covered);

    return coveredCards;
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
