import { LitElement, css, html } from 'lit';

import { di } from '../di';

export class UserDetailsComponent extends LitElement {
  router = di.inject('router');

  render() {
    return html`
      <h2>Toto</h2>
      <p>Email: toto@company.com</p>
      <p>Phone: +41 00 111 22 33</p>
    `;
  }

  static styles = css`
    h2 {
      margin-top: 0;
    }
  `;
}

customElements.define('my-user-details', UserDetailsComponent);
