export default class NumberCard extends HTMLElement {
  #attributes = {};

  static colors = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };

  static fontColors = {
    2: "#776e65",
    4: "#776e65",
    8: "#f9f6f2",
    16: "#f9f6f2",
    32: "#f9f6f2",
    64: "#f9f6f2",
    128: "#f9f6f2",
    256: "#f9f6f2",
    512: "#f9f6f2",
    1024: "#f9f6f2",
    2048: "#f9f6f2",
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["number-value", "position", "bigger"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "number-value") {
      this.#attributes.value = newValue;
    } else if (name === "position") {
      this.#attributes.position = JSON.parse(newValue);
    } else if (name === "bigger") {
      this.#attributes.bigger = newValue;
    }
    this.render();
  }

  render() {
    if (this.card) {
      this.card.textContent = this.#attributes.value;
      this.card.style.setProperty(
        "background-color",
        NumberCard.colors[this.#attributes.value]
      );
      this.card.style.setProperty(
        "color",
        NumberCard.fontColors[this.#attributes.value]
      );
      this.card.style.setProperty("left", `${this.#attributes.position.x}px`);
      this.card.style.setProperty("top", `${this.#attributes.position.y}px`);
      if (this.#attributes.bigger) {
        this.card.classList.remove("animate");
        this.card.offsetWidth; // trigger reflow, to restart animation
        this.card.classList.add("animate");
      } else {
        this.card.classList.remove("animate");
      }
    }
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
            .card{
                position: absolute;
                width: 90px;
                height: 90px;
                z-index: 10;
                display: grid;
                place-items:center;
                border-radius: 4px;
                font-size: 40px;
                animation: showup 0.3s ease-in-out;
                transition: top 0.3s ease-in-out, left 0.3s ease-in-out;
                font-family: sans-serif;
                font-weight: 700;
            }

            .animate{
              animation: bigger 0.2s 0.2s ease-in-out, showup 0.3s ease-in-out;
            }

            @Keyframes showup{
              from{
                transform: scale(0);
              }
                to{
                    transform: scale(1);
                }
            }

            @Keyframes bigger{
              from{
                transform: scale(1);
              }
                to{
                    transform: scale(1.2);
                }
            }


        </style>
        <div class="card"></div>
    `;
    this.card = this.shadowRoot.querySelector(".card");
    this.render();
  }
}
