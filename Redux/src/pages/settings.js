import { LitElement, html } from 'lit';

import { WithStore } from '../mixins/with-store';
import { updateTitle } from '../store/actions';

export class SettingsComponent extends WithStore(LitElement) {
  static properties = {
    title: { type: String, state: true },
  };

  stateChanged(state) {
    this.title = state.title;
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const title = formData.get('title');
    this.store.dispatch(updateTitle(title));
  }

  render() {
    return html`
      <h1>Settings</h1>
      <p>Welcome to the Settings page!</p>
      <form @submit=${this.handleSubmit}>
        <div>
          <label for="title">App title:</label>
          <input type="text" id="title" name="title" .value=${this.title} />
        </div>
        <button type="submit">Submit</button>
      </form>
    `;
  }
}

customElements.define('my-settings', SettingsComponent);
