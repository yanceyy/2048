export default class PopupMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
            <style>
            :host {
                display: block;
            }

            .popup-menu-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
            }

            .popup-menu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #ffffff;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                z-index: 1001;
                width: 300px;
                padding: 16px;
                border-radius: 10px;
            }

            .popup-title{
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                padding-bottom: 16px;
                color: #333333;
                text-transform: uppercase;
            }
        </style>

        <div class="popup-menu-overlay">
            <div class="popup-menu">
                <div class="popup-title">Menu</div>
                <div class="popup-content">
                    <slot></slot>
                </div>
            </div>
        </div>
    `;

    this.overlay = this.shadowRoot.querySelector(".popup-menu-overlay");
    this.overlay.addEventListener("click", () => this.hide());
  }

  static get observedAttributes() {
    return ["title"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "title") {
      this.shadowRoot.querySelector(".popup-title").textContent = newValue;
    }
  }

  connectedCallback() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.hide();
      }
    });
  }

  show() {
    this.overlay.style.display = "block";
  }

  hide() {
    this.overlay.style.display = "none";
  }
}
