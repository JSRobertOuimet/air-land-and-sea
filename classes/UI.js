export default class UI {
    constructor() {

    }

    static createElement(element) {
        return document.createElement(`${element}`);
    }

    static displayElement(element, target) {
        return target.appendChild(element);
    }
}