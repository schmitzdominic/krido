import {Deserializable} from "./deserializable.model";

export class Entry implements Deserializable {
  name?: string;
  price?: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
