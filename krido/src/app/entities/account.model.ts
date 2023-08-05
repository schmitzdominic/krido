interface AccountData {
  name: string;
  isCreditCard: boolean;
}

interface Account extends AccountData {}
class Account {

  constructor({name, isCreditCard}: AccountData) {
    this.name = name;
    this.isCreditCard = isCreditCard;
  }

  toObject(): AccountData {
    return {...this};
  }
}
