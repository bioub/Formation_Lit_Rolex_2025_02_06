export class UsersController {
  host;

  items = [];
  abortController = new AbortController();

  constructor(host) {
    (this.host = host).addController(this);
  }

  async hostConnected() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      signal: this.abortController.signal,
    });
    this.items = await res.json();
    this.host.requestUpdate();
  }

  hostDisconnected() {
    this.abortController.abort();
  }
}
