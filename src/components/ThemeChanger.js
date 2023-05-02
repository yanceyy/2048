export default class ThemeChanger extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>

        fieldset > div {
          margin: 0.5em 0;
        }

        input[type="radio"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        fieldset:focus-within {
          outline: 2px solid #555;
        }

        fieldset:has(input:focus:not(:focus-visible)) {
          outline: none;
        }

        input[type="radio"] + label {
          display: inline-block;
          position: relative;
          padding-left: 1.5em;
          margin-right: 0.5em;
          cursor: pointer;
        }

        input[type="radio"] + label:before {
          content: "";
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          width: 1em;
          height: 1em;
          border: 2px solid #555;
          border-radius: 50%;
          background-color: #fff;
        }

        input[type="radio"] + label:after {
          content: "";
          display: inline-block;
          position: absolute;
          left: 0.22em;
          top: 0.22em;
          width: 0.8em;
          height: 0.8em;
          border-radius: 50%;
          background-color: #555;
          opacity: 0;
          transition: opacity 0.2s;
        }

        input[type="radio"]:checked + label:after {
          opacity: 1;
        }
        </style>
        <fieldset>
        <legend>Theme:</legend>
        <div>
          <input type="radio" id="classical" name="theme" value="classical" checked>
          <label for="classical">classical</label>
        </div>
        <div>
          <input type="radio" id="jungle" name="theme" value="jungle">
          <label for="jungle">jungle</label>
        </div>
        <div>
          <input type="radio" id="ocean" name="theme" value="ocean">
          <label for="ocean">Ocean</label>
        </div>
    </fieldset>
    `;
    this.themeElement = this.shadowRoot.querySelector("fieldset");
    this.themeElement.addEventListener("change", (e) => {
      document.documentElement.className = "";
      document.documentElement.classList.add(e.target.value);
    });
  }
}
