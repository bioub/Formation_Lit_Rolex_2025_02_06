import { LitElement, css, html } from "lit";

export class UsersFilterComponent extends LitElement {
  render() {
    return html`
      <input
        type="text"
        placeholder="Filter users"
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

customElements.define("my-users-filter", UsersFilterComponent);
