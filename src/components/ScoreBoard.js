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
                  width: 90px;
                  height: 90px;
                  border-radius: 10px;
                  font-size: 40px;
                  background-color: #aaa;
                  color: #fff;
                  overflow: hidden;
              }

              .title{
                font-size: 16px;
                text-align: center;
                margin-top: 12px;
              }

              .score{
                text-align: center;
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
