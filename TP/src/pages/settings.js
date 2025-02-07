import { LitElement, html } from "lit";

import { di } from "../di";

export class SettingsComponent extends LitElement {
  store = di.inject("settings-store");

  connectedCallback() {
    super.connectedCallback();
    this.store.addHost(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const title = formData.get("title");
    this.store.updateTitle(title);
  }

  render() {
    return html`
      <h1>Settings</h1>
      <p>Welcome to the Settings page!</p>
      <form @submit=${this.handleSubmit}>
        <div>
          <label for="title">App title:</label>
          <input
            type="text"
            id="title"
            name="title"
            @input=${(e) => this.title = e.target.value}
            .value=${this.store.state.title}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    `;
  }
}

customElements.define("my-settings", SettingsComponent);
