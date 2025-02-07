import '../components/users-filter.js';

import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import { Compose } from '../mixins/compose.js';
import { WithRouter } from '../mixins/with-router.js';
import { WithStore } from '../mixins/with-store.js';
import { fetchUsers, updateFilter } from '../store/actions.js';

export class UsersComponent extends Compose(LitElement, WithRouter, WithStore) {
  static properties = {
    filter: { type: String },
    users: { type: Object, state: true },
  };

  connectedCallback() {
    super.connectedCallback();
    this.store.dispatch(fetchUsers());
  }

  stateChanged(state) {
    this.filter = state.users.filter;
    this.users = state.users;
  }

  handleClick(event) {
    event.preventDefault();
    this.router.push(event.target.pathname);
    this.requestUpdate();
  }

  handleFilterChanged(event) {
    this.store.dispatch(updateFilter(event.detail));
  }

  render() {
    return html`
      <div class="left">
        <my-users-filter .filter=${this.filter} @filter-changed=${this.handleFilterChanged}></my-users-filter>
        <nav>
          ${this.users.data
            .filter((u) => u.name.toLowerCase().includes(this.filter.toLowerCase()))
            .map(
              (user) => html`
                <a
                  class=${classMap({
                    active: this.router.resolver.route.parameters.id == user.id,
                  })}
                  href="/users/${user.id}"
                  @click=${this.handleClick}
                >
                  ${user.name}
                </a>
              `,
            )}
        </nav>
      </div>
      <div class="right">
        <rlx-flx-router-view></rlx-flx-router-view>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      gap: 1rem;
    }

    .left a {
      cursor: pointer;
      display: block;
      padding: 0.5rem;
      text-decoration: none;
      color: black;
    }

    .left a.active {
      background-color: var(--my-bg-color, lightblue);
    }
  `;
}

customElements.define('my-users', UsersComponent);
