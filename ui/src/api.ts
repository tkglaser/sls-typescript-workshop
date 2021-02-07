export class Api {
  async hello(name: string) {
    const resp = await fetch(`http://localhost:2500/dev/hello?name=${name}`);
    return resp.json();
  }
}
