import { LitElement, css, html } from 'lit';

import { Compose } from '../mixins/compose';
import { WithRouter } from '../mixins/with-router';
import { WithStore } from '../mixins/with-store';

export class UserDetailsComponent extends Compose(LitElement, WithRouter, WithStore) {
  static properties = {
    user: { type: Object },
  };

  stateChanged(state) {
    this.user = state.users.data.find((u) => u.id == this.router.resolver.route.parameters.id);
  }

  render() {
    return html`
      <h2>${this.user?.name}</h2>
      <p>Email: ${this.user?.email}</p>
      <p>Phone: ${this.user?.phone}</p>
    `;
  }

  static styles = css`
    h2 {
      margin-top: 0;
    }
  `;
}

customElements.define('my-user-details', UserDetailsComponent);
