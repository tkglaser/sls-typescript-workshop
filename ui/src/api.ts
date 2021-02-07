import { Species } from "service";

export class Api {
  async hello(name: string, species: Species) {
    const resp = await fetch(`http://localhost:2500/dev/hello?name=${name}&species=${species}`);
    return resp.json();
  }
}
