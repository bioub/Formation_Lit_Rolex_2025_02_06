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
    window.addEventListener('selected-change', (event) => {
      console.log('selected-change', event.detail)
    });
  }

  handleSelectedChange(event) {
    console.log('selected-change', event.detail)
  }

  render() {
    return html`
     <div @selected-change=${this.handleSelectedChange} >
     <p>Hello, ${this.name}!</p>
     <my-select selected=${this.name} .items=${['Toto', 'Titi', 'Tata']}></my-select>
     </div>
    `
  }
}

window.customElements.define('my-app', MyApp)
