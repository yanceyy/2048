export default class NumberCard extends HTMLElement {
  #attributes = {};

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["number-value", "position", "bigger"];
  }

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "number-value":
        this.#attributes.value = newValue;
        break;
      case "position":
        this.#attributes.position = JSON.parse(newValue);
        break;
      case "bigger":
        this.#attributes.bigger = newValue;
        break;
      default:
        break;
    }
    this.render();
  }

  render() {
    if (this.card) {
      this.card.textContent = this.#attributes.value;
      this.card.style.setProperty(
        "background-color",
        `var(--background-color-${this.#attributes.value})`
      );
      this.card.style.setProperty(
        "color",
        `var(--font-color-${this.#attributes.value})`
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
                width: var(--card-size);
                height: var(--card-size);
                z-index: 10;
                display: grid;
                place-items:center;
                border-radius: 3px;
                font-size: var(--font-large);
                animation: showup 0.2s ease-in-out;
                transition: top 0.2s ease-in-out, left 0.2s ease-in-out;
                font-family: sans-serif;
                font-weight: 700;
            }

            .animate{
              animation: bigger 0.1s 0.1s ease-in-out, showup 0.2s ease-in-out;
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