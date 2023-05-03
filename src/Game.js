import StateManager from "./StateManager.js";

export default class Game extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.size = 4;
    this.stateManager = new StateManager(4);
  }

  addInitialCards() {
    this.gameBoard.insertCard(
      ...this.stateManager.generateRandomIdAndPosition()
    );
    this.gameBoard.insertCard(
      ...this.stateManager.generateRandomIdAndPosition()
    );
    this.scoreBoard.setAttribute("score", this.stateManager.score);
  }

  init() {
    // Add two initial cards on the board
    this.addInitialCards();

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp": {
          if (!this.stateManager.moveUp()) return;
          break;
        }
        case "ArrowDown": {
          if (!this.stateManager.moveDown()) return;
          break;
        }
        case "ArrowLeft": {
          if (!this.stateManager.moveLeft()) return;
          break;
        }
        case "ArrowRight": {
          if (!this.stateManager.moveRight()) return;
          break;
        }default: {
          return;
        }
      }

      this.gameBoard.insertCard(
        ...this.stateManager.generateRandomIdAndPosition()
      );

      this.gameBoard.render(
        this.stateManager.state,
        this.stateManager.values,
        this.stateManager.mergedNode,
        this.stateManager.addedNode
      );

      this.scoreBoard.setAttribute("score", this.stateManager.score);

      if (this.stateManager.isGameOver()) {
        this.gameOver.show();
      }
    });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        header{
          display: flex;
          margin-bottom: 20px;
          justify-content: space-between;
        }
        header h1{
          display: block;
          width: var(--card-size);
          height: var(--card-size);
          background-color: var(--background-color-2048);
          border-radius: var(--radius-medium);
          color: var(--font-white);
          display: grid;
          place-items: center;
        }
        .describe{
          margin: var(--margin-small);
          font-size: var(--font-small);
        }
        .container{
          margin: 20px;
        }

        .menu{
          width: var(--card-size);
          height: calc(var(--card-size) / 3);
          color: var(--font-white);
          background-color: var(--background-color-16);
          border:none;
          border-radius: 5px;
          margin-top:var(--margin-small);
          cursor: pointer;
        }

      </style>
      <popup-menu id="menu" title="menu">
        <button class="menu-item">KEEP GOING</button>
        <button class="menu-item new-game">NEW GAME</button>
      </popup-menu>

      <popup-menu id="gameOver" title="Game Over">
        <button class="menu-item new-game">NEW GAME</button>
      </popup-menu>

      <div class="container">
      <header>
        <h1 id="game-title">2048</h1>
        <div class="controller">
          <theme-changer></theme-changer>
        </div>
        <div class="controller">
          <score-board aria-labelledby="game-title" role="status"></score-board>
          <button class="menu">Menu</button>
        </div>
      </header>
      <p class="describe">
        Join the numbers and get to the <strong>2048</strong> tile!
      </p>
      <game-board size="${this.size}" aria-labelledby="game-title" role="grid"></game-board>
      <p class="describe">
      Play the game with arrow keys (↑, ↓, ←, →)
    </p>
    </div>
    `;

    this.scoreBoard = this.shadowRoot.querySelector("score-board");
    this.gameBoard = this.shadowRoot.querySelector("game-board");
    this.popMenu = this.shadowRoot.querySelector("#menu");
    this.newGame = this.shadowRoot.querySelectorAll(".new-game");
    this.gameOver = this.shadowRoot.querySelector("#gameOver");

    this.shadowRoot.querySelector(".menu").addEventListener("click", () => {
      this.popMenu.show();
    });

    this.newGame.forEach((button) =>
      button.addEventListener("click", () => {
        this.gameBoard.reset();
        this.stateManager.reset();
        this.addInitialCards();
      })
    );

    this.init();
  }
}
