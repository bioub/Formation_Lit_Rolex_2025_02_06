import './components/top-bar';

import { LitElement, css, html } from 'lit';

import { providerRouter, routes } from './routes';
import { provideStore } from './store';

export class AppComponent extends LitElement {
  router = providerRouter(this, routes);
  store = provideStore(this);

  static styles = css`
    main {
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <my-top-bar></my-top-bar>
      <main>
        <rlx-flx-router-view .router=${this._routerProvider.value}></rlx-flx-router-view>
      </main>
    `;
  }
}

customElements.define('my-app', AppComponent);
