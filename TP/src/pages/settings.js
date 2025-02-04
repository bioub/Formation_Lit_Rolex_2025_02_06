import { LitElement, html } from 'lit';

export class SettingsComponent extends LitElement {
  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return html`
      <h1>Settings</h1>
      <p>Welcome to the Settings page!</p>
      <form @submit=${this.handleSubmit}>
        <div>
          <label for="title">App title:</label>
          <input type="text" id="title" name="title" />
        </div>
        <button type="submit">Submit</button>
      </form>
    `;
  }
}

customElements.define('my-settings', SettingsComponent);
