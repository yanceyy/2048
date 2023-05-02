export default class ScoreBoard extends HTMLElement {
  #score = {};

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["score"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (this.scoreElement) {
      this.scoreElement.textContent = Number.parseInt(newValue);
    }
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
          <style>
              .card{
                  width: var(--card-size);
                  height:var(--card-size);
                  border-radius: var(--radius-medium);
                  font-size: var(--font-large);
                  background-color: #aaa;
                  color: var(--font-white);
                  overflow: hidden;
                  text-align: center;
              }

              .title{
                font-size: var(--font-small);;
                margin-top: var(--margin-small);

              }
          </style>
          <div class="card">
            <div class="title">SCORE</div>
            <div class="score">0</div>
          </div>
      `;
    this.scoreElement = this.shadowRoot.querySelector(".score");
  }
}
