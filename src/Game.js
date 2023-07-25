import StateManager from "./StateManager.js";

export default class Game extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.Config = {
            boardSize: 4,
            CardSize: 70,
        };
        this.stateManager = new StateManager(this.Config.boardSize);
    }

    addInitialCards() {
        const [id1, position1] =
            this.stateManager.generateRandomIdAndPosition();
        const [id2, position2] =
            this.stateManager.generateRandomIdAndPosition();
        this.gameBoard.insertCard(id1, position1);
        this.gameBoard.insertCard(id2, position2);
        this.scoreBoard.setAttribute("score", this.stateManager.score);
    }

    // Touch event on mobile
    handleTouch(e) {
        let initialX = e.touches[0].clientX;
        let initialY = e.touches[0].clientY;
        document.addEventListener("touchend", moveEnd);

        function moveEnd(e) {
            document.removeEventListener("touchend", moveEnd);

            let currentX = e.changedTouches[0].clientX;
            let currentY = e.changedTouches[0].clientY;

            let diffX = initialX - currentX;
            let diffY = initialY - currentY;

            if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) return;

            let event;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                // sliding horizontally
                if (diffX > 0) {
                    // swiped left
                    event = new KeyboardEvent("keydown", {
                        key: "ArrowLeft",
                    });
                } else {
                    // swiped right
                    event = new KeyboardEvent("keydown", {
                        key: "ArrowRight",
                    });
                }
            } else {
                // sliding vertically
                if (diffY > 0) {
                    // swiped up
                    event = new KeyboardEvent("keydown", {
                        key: "ArrowUp",
                    });
                } else {
                    // swiped down
                    event = new KeyboardEvent("keydown", {
                        key: "ArrowDown",
                    });
                }
            }
            window.dispatchEvent(event);
        }
    }

    // Keyboard event on desktop
    handleKeyDown = (e) => {
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
            default: {
                return;
            }
        }

        const [id, position] = this.stateManager.generateRandomIdAndPosition();
        this.gameBoard.insertCard(id, position);
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
    };

    handleMenuClick = () => {
        this.popMenu.show();
    };

    handleNewGameClick = () => {
        this.gameBoard.reset();
        this.stateManager.reset();
        this.addInitialCards();
    };

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
        .gameBoard-container{
          display: flex;
          justify-content: center;
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
        <button class="menu-button">KEEP GOING</button>
        <button class="menu-button new-game">NEW GAME</button>
      </popup-menu>

      <popup-menu id="gameOver" title="Game Over">
        <button class="menu-button new-game">NEW GAME</button>
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
      <div class="gameBoard-container">
        <game-board size="${this.Config.boardSize}" card-size=${this.Config.CardSize}  aria-labelledby="game-title" role="grid"></game-board>
      </div>
      <p class="describe">
      Play the game with arrow keys (↑, ↓, ←, →) or swipe on mobile.
      </p>
    </div>
    `;

        this.scoreBoard = this.shadowRoot.querySelector("score-board");
        this.gameBoard = this.shadowRoot.querySelector("game-board");
        this.popMenu = this.shadowRoot.querySelector("#menu");
        this.newGame = this.shadowRoot.querySelectorAll(".new-game");
        this.gameOver = this.shadowRoot.querySelector("#gameOver");

        this.shadowRoot
            .querySelector(".menu")
            .addEventListener("click", this.handleMenuClick);

        this.newGame.forEach((button) =>
            button.addEventListener("click", this.handleNewGameClick)
        );

        window.addEventListener("keydown", this.handleKeyDown);
        this.gameBoard.addEventListener("touchstart", this.handleTouch);

        // prevent dragging on mobile
        window.addEventListener("touchmove", (e) => e.preventDefault(), {
            passive: false,
        });

        this.addInitialCards();
    }
}
