import './style.css'
import NumberCard from './components/NumberCard'
import GameBoard from './components/GameBoard';
import ScoreBoard from "./components/ScoreBoard";
import PopupMenu from "./components/PopupMenu";
import Game from "./Game";

customElements.define("popup-menu", PopupMenu);
customElements.define("game-board", GameBoard);
customElements.define("number-card", NumberCard);
customElements.define("score-board", ScoreBoard);
customElements.define("game-app", Game);