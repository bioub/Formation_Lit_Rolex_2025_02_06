import "./components/top-bar";

import { LitElement, css, html } from "lit";

import { di } from "./di";

export class AppComponent extends LitElement {
  router = di.inject("router");

  static styles = css`
    main {
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <my-top-bar></my-top-bar>
      <main>
        <rlx-flx-router-view .router=${this.router}></rlx-flx-router-view>
      </main>
    `;
  }
}

customElements.define("my-app", AppComponent);
