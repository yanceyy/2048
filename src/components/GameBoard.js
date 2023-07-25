export default class GameBoard extends HTMLElement {
    size = 4;
    cardSize = 100;
    padding = 10;
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.cards = new Map();
    }

    static get observedAttributes() {
        return ["size", "card-size", "padding"];
    }

    attributeChangedCallback(name, _, newValue) {
        if (name === "size") {
            this.size = Number.parseInt(newValue);
        } else if (name === "card-size") {
            this.cardSize = Number.parseInt(newValue);
        } else if (name === "padding") {
            this.padding = Number.parseInt(newValue);
        }
    }

    reset() {
        this.cards = new Map();
        this.touchBoard.innerHTML = "";
    }

    insertCard(id, position) {
        const numberCard = document.createElement("number-card");
        const realPosition = {
            x: this.padding + (this.cardSize + this.padding) * position.x,
            y: this.padding + (this.cardSize + this.padding) * position.y,
        };

        numberCard.setAttribute("position", JSON.stringify(realPosition));
        numberCard.setAttribute("number-value", 2);
        numberCard.setAttribute("card-size", this.cardSize);
        numberCard.setAttribute("id", id);

        this.cards.set(id, numberCard);
        this.touchBoard.appendChild(numberCard);
    }

    render(state, values, mergedNodes, addedNodes) {
        this.touchBoard.querySelectorAll(".need-to-remove").forEach((node) => {
            this.touchBoard.removeChild(node);
        });

        state.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                const id = state[rowIndex][colIndex];
                if (id === 0) return;
                if (this.cards.has(id)) {
                    const card = this.cards.get(id);
                    card.setAttribute(
                        "position",
                        JSON.stringify({
                            x:
                                this.padding +
                                (this.cardSize + this.padding) * colIndex,
                            y:
                                this.padding +
                                (this.cardSize + this.padding) * rowIndex,
                        })
                    );
                    card.setAttribute("number-value", values.get(id));
                    card.removeAttribute("bigger");
                    if (addedNodes.has(id)) {
                        card.setAttribute("bigger", true);
                    }
                    return;
                }
            });
        });

        [...this.touchBoard.children].forEach((node) => {
            const id = Number.parseInt(node.getAttribute("id"));
            if (mergedNodes.has(id)) {
                const merged = this.cards.get(mergedNodes.get(id));
                node.setAttribute("position", merged.getAttribute("position"));
                node.classList.add("need-to-remove");
            }
        });
    }

    connectedCallback() {
        const pixelSize =
            this.size * this.cardSize + this.padding * (this.size + 1);
        this.shadowRoot.innerHTML = `
        <div class="view">
            <div class="board">
            </div>
            <div class="touch-board">
            </div>
        </div>
        <style>
            *{
                box-sizing: border-box;
            }

            .view{
                --board-width: ${pixelSize}px;
                --board-height: ${pixelSize}px;
                width: var(--board-width);
                height: var(--board-height);
                position: relative;
            }

            .touch-board {
                width: var(--board-width);
                height: var(--board-height);
                position: absolute;
                top: 0;
                left: 0;
            }

            .board {
                position: absolute;
                top: 0;
                left: 0;
                background-color: var(--background-color, #aaa);
                width: var(--board-width);
                height: var(--board-height);
                border-radius: var(--radius-medium);
                display: grid;
                grid-template-columns: repeat(${this.size}, 1fr);
                gap:10px;
                padding:var(--padding-small);
            }

            .slot {
                background-color: #ccc;
                border-radius: 2px;
            }

            .need-to-remove{
              position: absolute;
              z-index: 0;
            }
        </style>
    `;

        const board = this.shadowRoot.querySelector(".board");

        for (let i = 0; i < this.size * this.size; i++) {
            const slot = document.createElement("div");
            slot.classList.add("slot");
            board.appendChild(slot);
        }

        this.touchBoard = this.shadowRoot.querySelector(".touch-board");
    }
}
