import App from "./classes/App.js";
import UI from "./classes/UI.js";

const playerName = "Franklin D. Roosevelt";
const app = new App(playerName);

app.createGame();

UI.nextGameButtonEl.addEventListener("click", () => {
    UI.overlayEl.style.display = "none";
    UI.mainAreaEl.innerHTML = "";
    UI.playerOneHandEl.innerHTML = "";
    UI.playerTwoHandEl.innerHTML = "";
    app.createGame();
});