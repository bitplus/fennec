import { signAuthenticationToken, signEncryptedPin } from "./encrypt";

export interface Wallet {
  pin: string;
  pin_token: string;
  session_id: string;
  private_key: string;
  client_id: string;
}

export default class MixinKeyring {
  #accounts: Wallet[] = [];

  constructor() {
    this.#accounts = [];
  }

  serialize() {
    return Promise.resolve(this.#accounts.map((w) => JSON.stringify(w)));
  }

  deserialize(keys: string[]) {
    return new Promise<void>((resovle, reject) => {
      try {
        this.#accounts = keys.map((key) => {
          return JSON.parse(key);
        });
      } catch (error) {
        reject(error);
      }
      resovle();
    });
  }

  getAccountFor(clientId: string) {
    const wallet = this.#accounts.find((w) => w.client_id === clientId);
    if (!wallet) {
      throw `Mixin wallet ${clientId} not found in keyring`;
    }
    return wallet;
  }

  signAuthorizeToken(clientId: string, method: string, uri: string, params: any) {
    const wallet = this.getAccountFor(clientId);
    return Promise.resolve(
      signAuthenticationToken(wallet.client_id, wallet.session_id, wallet.private_key, method, uri, params)
    );
  }

  encryptPin(clientId: string) {
    const wallet = this.getAccountFor(clientId);
    return Promise.resolve(signEncryptedPin(wallet.pin, wallet.pin_token, wallet.session_id, wallet.private_key));
  }

  exportAccount(clientId) {
    const wallet = this.getAccountFor(clientId);
    return Promise.resolve(JSON.stringify(wallet));
  }

  removeAccount(clientId: string) {
    this.#accounts = this.#accounts.filter((w) => w.client_id !== clientId);
  }

  addAccount(configs: string) {
    const account = JSON.parse(configs);
    if (!this.checkAccount(account)) {
      throw new Error("Account config not match");
    }
    if (this.#accounts.find((x) => x.client_id === account.client_id)) {
      throw new Error(`${account.client_id} is already in you kering`);
    }
    this.#accounts.push(account);
  }

  checkAccount(obj: any) {
    const keys = ["pin", "pin_token", "session_id", "private_key", "client_id"];
    for (const key of keys) {
      if (!obj[key] || typeof obj[key] !== "string") {
        return false;
      }
    }

    return true;
  }
}
