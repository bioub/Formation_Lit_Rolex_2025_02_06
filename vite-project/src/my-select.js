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

  // au lieu d'une méthode, on déclare une propriété avec une fonction fléchée
  // pour que le this soit celui de MySelect et pas window 
  // (dans une fonction fléchée, les pseudos variables ne sont pas définies,
  // donc this est celui de la portée parente)
  handleWindowClick = (event) => {
    // si on click à l'extérieur du composant, on ferme le menu
    if (!this.renderRoot.contains(event.composedPath()[0])) {
      this._menuOpen = false;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this.handleWindowClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this.handleWindowClick);
  }

  toggleOpen(event) {
    this._menuOpen = !this._menuOpen;
  }

  selectValue(event) {
    if (!event.target.classList.contains('item')) return;

    const item = event.target.dataset.item;
    this.selected = item;
    this._menuOpen = false;

    this.dispatchEvent(new CustomEvent('selected-change', {
      detail: item,
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div class="selected" @click=${this.toggleOpen}>${this.selected}</div>
      ${this._menuOpen
        ? html`<div class="menu" @click=${this.selectValue}>
            ${this.items.map((item) => html`<div class="item" data-item=${item}>${item}</div>`)}
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
