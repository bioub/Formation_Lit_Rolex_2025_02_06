import { html, LitElement } from 'lit';

export class HomeComponent extends LitElement {
  render() {
    return html`
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
    `;
  }
}

customElements.define('my-home', HomeComponent);
