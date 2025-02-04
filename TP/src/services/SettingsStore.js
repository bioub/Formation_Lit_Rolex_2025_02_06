import { Store } from "../lib/rlx-lit";

export class SettingsStore extends Store {
  state = {
    title: "My App",
  };

  updateTitle(title) {
    this.state.title = title;
    this.requestUpdate();
  }
}
