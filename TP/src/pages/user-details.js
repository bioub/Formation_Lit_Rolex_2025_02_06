import { Task } from '@lit/task';
import { LitElement, css, html } from 'lit';

import { di } from '../di';

export class UserDetailsComponent extends LitElement {
  router = di.inject('router');

  constructor() {
    super();
    console.log('UserDetailsComponent constructor');
  }

  _userTask = new Task(this, {
    task: async ([userId], { signal }) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    },
    args: () => [this.router.resolver.route.parameters.id],
  });

  disconnectedCallback() {
    console.log('UserDetailsComponent disconnectedCallback');
    super.disconnectedCallback();
    this._userTask.abort();
  }

  render() {
    return html`
      ${this._userTask.render({
        pending: () => html`<p>Loading...</p>`,
        error: (error) => html`<p>Error: ${error.message}</p>`,
        complete: (user) => html`
          <h2>${user.name}</h2>
          <p>Email: ${user.email}</p>
          <p>Phone: ${user.phone}</p>
        `,
      })}
    `;
  }

  static styles = css`
    h2 {
      margin-top: 0;
    }
  `;
}

customElements.define('my-user-details', UserDetailsComponent);
