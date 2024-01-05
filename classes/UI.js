export default class UI {
    constructor() {

    }

    createElement(element) {
        return document.createElement(`${element}`);
    }

    displayElement(element, target) {
        return target.appendChild(element);
    }
}