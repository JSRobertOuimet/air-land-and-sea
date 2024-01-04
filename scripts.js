class UI {
    constructor() {

    }

    createElement(element) {
        return document.createElement(`${element}`);
    }

    displayElement(element, target) {
        return target.appendChild(element);
    }
}

const theaterBoardsEl = document.querySelector("#theater-boards");

this.theaters.forEach(theater => {
    const theaterEl = ui.createElement("img");

    theaterEl.setAttribute("src", `./images/theater-${theater.name}.jpg`);
    theaterEl.style.width = "300px";

    ui.displayElement(theaterEl, theaterBoardsEl);
});