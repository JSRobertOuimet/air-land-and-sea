export default class UI {
    constructor() {

    }

    static getElements() {
        return {
            mainAreaEl: document.querySelector("#main-area"),
            discardedCardsEl: document.querySelector("#discarded-cards"),
            playerOneHandEl: document.querySelector("#player-one .hand"),
            playerTwoHandEl: document.querySelector("#player-two .hand"),
            deployButtonEl: document.querySelector("#deploy"),
            improviseButtonEl: document.querySelector("#improvise"),
            withdrawButtonEl: document.querySelector("#withdraw"),
            handEl: document.querySelector("#player-one .hand"),
            descriptionEl: document.querySelector("#description")
        }
    }

    static createElement(element) {
        return document.createElement(`${element}`);
    }
}