import { LitElement, css, html } from "lit";

import { di } from "../di";

export class TopBarComponent extends LitElement {
  router = di.inject("router");

  handleClick(event) {
    event.preventDefault();
    this.router.push(event.target.pathname);
  }

  render() {
    return html`
      <h1>My App</h1>
      <nav>
        <a href="/" @click=${this.handleClick}>Home</a>
        <a href="/settings" @click=${this.handleClick}>Settings</a>
        <a href="/users" @click=${this.handleClick}>Users</a>
      </nav>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--my-bg-color, lightblue);
      padding: 1rem;
    }

    h1 {
      margin: 0;
    }

    a {
      color: black;
      text-decoration: none;
      margin-right: 1rem;
    }

    a:hover {
      text-decoration: underline;
    }
  `;
}

customElements.define("my-top-bar", TopBarComponent);
