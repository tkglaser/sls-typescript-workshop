import { Species } from "./species";

export class HelloService {
  hello(name: string, species: Species): string {
    switch (species) {
      case Species.Cat:
        return `Meow, ${name}.`;
      case Species.Dog:
        return `Woof, ${name}`;
      case Species.Human:
        return `Hello? Yes, this is ${name}.`;
    }
  }
}
