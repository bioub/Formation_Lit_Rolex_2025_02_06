import { LitElement, css, html } from 'lit';

export class UsersFilterComponent extends LitElement {
  /** @type {import('lit').PropertyDeclarations} */
  static properties = {
    filter: { type: String, reflect: true },
  };

  handleFilterChanged(event) {
    this.filter = event.target.value;
    this.renderRoot.dispatchEvent(
      new CustomEvent('filter-changed', {
        detail: this.filter,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <input
        type="text"
        placeholder="Filter users"
        value=${this.filter}
        @input=${this.handleFilterChanged}
      />
    `;
  }

  static styles = css`
    input {
      box-sizing: border-box;
      width: 100%;
      padding: 0.5em;
      margin-bottom: 1em;
    }
  `;
}

customElements.define('my-users-filter', UsersFilterComponent);
