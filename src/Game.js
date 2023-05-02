import StateManager from "./StateManager.js";

export default class Game extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.size = 4;
    this.stateManager = new StateManager(4);
  }

  addInitialCards() {
    this.gameBoard.insertCard(...this.stateManager.generateRandomNumber());
    this.gameBoard.insertCard(...this.stateManager.generateRandomNumber());
    this.scoreBoard.setAttribute("score", this.stateManager.score);
  }

  init() {
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
        }
      }

      this.gameBoard.insertCard(...this.stateManager.generateRandomNumber());
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
        *{
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
          width: 90px;
          height: 90px;
          background-color: #edc22e;
          border-radius: 10px;
          color: #fff;
          display: grid;
          place-items: center;
        }
        .describe{
          margin-bottom: 10px;
          font-size: 18px;
        }
        .container{
          margin: 20px;
        }

        .menu-item {
          padding: 8px 0;
          display: grid;
          place-items: center;
          cursor: pointer;
          border-bottom: 1px solid #f1f1f1;
          background-color: #776e65;
          color: #ffffff;
          font-size: 18px;
          font-weight: bold;
          height: 50px;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        .menu-item:last-child {
            border-bottom: none;
        }

        .menu-item:hover {
            background-color: #8f7a66;
        }

        button{
          width: 90px;
          height: 30px;
          color: #fff;
          background-color: #f59563;
          border:none;
          border-radius: 5px;
          margin-top:10px;
        }

      </style>
      <popup-menu id="menu" title="menu">
        <div class="menu-item">KEEP GOING</div>
        <div class="menu-item new-game">NEW GAME</div>
      </popup-menu>

      <popup-menu id="gameOver" title="Game Over">
        <div class="menu-item new-game">NEW GAME</div>
      </popup-menu>

      <div class="container">
      <header>
        <h1 id="game-title">2048</h1>
        <div class="controller">
          <score-board aria-labelledby="game-title" role="status"></score-board>
          <button>Menu</button>
        </div>
      </header>
      <p class="describe">
        Join the numbers and get to the <strong>2048</strong> tile!
      </p>
      <game-board size="${this.size}" aria-labelledby="game-title" role="grid"></game-board>
    </div>
    `;

    this.scoreBoard = this.shadowRoot.querySelector("score-board");
    this.gameBoard = this.shadowRoot.querySelector("game-board");
    this.popMenu = this.shadowRoot.querySelector("#menu");
    this.newGame = this.shadowRoot.querySelectorAll(".new-game");
    this.gameOver = this.shadowRoot.querySelector("#gameOver");

    this.shadowRoot.querySelector("button").addEventListener("click", () => {
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
