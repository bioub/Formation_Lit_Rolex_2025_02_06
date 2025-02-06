import { LitElement, html } from 'lit'

export class MyApp extends LitElement {
  render() {
    return html`
  Hello, World!
    `
  }
}

window.customElements.define('my-app', MyApp)
