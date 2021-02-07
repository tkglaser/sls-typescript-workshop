import { HelloService, Species } from "service";

export class Api {
  async hello(name: string, species: Species) {
    // test debugging:
    const svc = new HelloService();
    const result = svc.hello("debug", Species.Human);
    console.log(result);

    const resp = await fetch(
      `http://localhost:2500/dev/hello?name=${name}&species=${species}`
    );
    return resp.json();
  }
}
