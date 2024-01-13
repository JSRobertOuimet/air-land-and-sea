export default class UI {
    constructor() {

    }

    static getElements() {
        return {
            mainAreaEl: document.querySelector("#main-area"),
            playerOneHandEl: document.querySelector("#player-one .hand"),
            playerTwoHandEl: document.querySelector("#player-two .hand"),
            deployButtonEl: document.querySelector("#deploy"),
            improviseButtonEl: document.querySelector("#improvise"),
            withdrawButtonEl: document.querySelector("#withdraw"),
            handEl: document.querySelector("#player-one .hand"),
            descriptionEl: document.querySelector("#description"),
            playerOneNameEl: document.querySelector("#player-one-name"),
            playerTwoNameEl: document.querySelector("#player-two-name")
        }
    }

    static createElement(element) {
        return document.createElement(`${element}`);
    }
}