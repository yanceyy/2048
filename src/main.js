import "./style.css";

import Game from "./Game";
import GameBoard from "./components/GameBoard";
import NumberCard from "./components/NumberCard";
import PopupMenu from "./components/PopupMenu";
import ScoreBoard from "./components/ScoreBoard";
import ThemeChanger from "./components/ThemeChanger";

customElements.define("popup-menu", PopupMenu);
customElements.define("game-board", GameBoard);
customElements.define("number-card", NumberCard);
customElements.define("score-board", ScoreBoard);
customElements.define("theme-changer", ThemeChanger);
customElements.define("game-app", Game);
