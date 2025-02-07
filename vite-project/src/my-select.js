import { LitElement, css, html, nothing } from 'lit';

export class MySelect extends LitElement {
  /** @type {import('lit').PropertyDeclarations} */
  static properties = {
    selected: { type: String, reflect: true },
    items: { type: Array },
    _menuOpen: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.selected = 'Exemple item';
    this.items = ['Item 1', 'Item 2', 'Item 3'];
    this._menuOpen = false;
  }

  toggleOpen() {
    this._menuOpen = !this._menuOpen;
  }

  selectValue(item) {
    this.selected = item;
    this._menuOpen = false;
  }

  render() {
    return html`
      <div class="selected" @click=${this.toggleOpen}>${this.selected}</div>
      ${this._menuOpen
        ? html`<div class="menu">
            ${this.items.map((item) => html`<div class="item" @click=${() => this.selectValue(item)}>${item}</div>`)}
          </div>`
        : nothing}
    `;
  }

  static styles = css`
    .selected {
      padding: 10px;
      border: 1px solid #ccc;
      cursor: pointer;
    }
    .menu {
      border: 1px solid #ccc;
      border-top: none;
    }
    .item {
      padding: 10px;
      cursor: pointer;
    }
    `;
}

window.customElements.define('my-select', MySelect);
