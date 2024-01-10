export default class UI {
    constructor() {

    }

    static getElements() {
        return {
            theatersEl: document.querySelector("#theaters"),
            handEl: document.querySelector("#player-one .hand"),
            playerOneHandEl: document.querySelector("#player-one .hand"),
            playerTwoHandEl: document.querySelector("#player-two .hand"),
            deployButtonEl: document.querySelector("#deploy"),
            improviseButtonEl: document.querySelector("#improvise"),
            withdrawButtonEl: document.querySelector("#withdraw")
        }
    }

    static createElement(element) {
        return document.createElement(`${element}`);
    }

    static displayElement(element, target) {
        return target.appendChild(element);
    }
}