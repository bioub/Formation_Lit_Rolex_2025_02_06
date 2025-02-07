import './my-select.js'

import { LitElement, html } from 'lit'

export class MyApp extends LitElement {
  /** @type {import('lit').PropertyDeclarations} */
  static properties = {
    name: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.name = 'world'; // appelle set name(value) {  }
  }

  render() {
    return html`
      <p>Hello, ${this.name}!</p>
      <my-select selected=${this.name} .items=${['Toto', 'Titi', 'Tata']}></my-select>
    `
  }
}

window.customElements.define('my-app', MyApp)
