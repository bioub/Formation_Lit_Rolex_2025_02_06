import { LitElement, html } from 'lit';

export class HomeComponent extends LitElement {
  static properties = {
    name: { type: String, state: true },
  };

  constructor() {
    super();
    this.name = 'Romain';
  }

  render() {
    return html`
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value=${this.name}
          @input=${(e) => (this.name = e.target.value)}
        />
      </div>
      <p>Hello ${this.name}!</p>
    `;
  }
}

customElements.define('my-home', HomeComponent);
