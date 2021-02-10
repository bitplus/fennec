import type { Store, State } from "./types";

import { BehaviorSubject } from "rxjs";
import { initStoreData } from "./init-data";
import LcoalStore from "../utils/lcoalstore";
import AuthState from "./auth";
import KeyringState from "./keyring";
import PreferenceState from "./preference";
import ProviderState from "./provider";

const localstore = new LcoalStore();

async function initStore() {
  let store = (await localstore.get()) as Store;
  if (!store) {
    store = initStoreData;
  }

  const storeSubject = new BehaviorSubject<Store>(store);
  storeSubject.subscribe((data: Store) => {
    console.log("[store]: store changed", JSON.stringify(data));
    localstore.set(data);
  });
  return storeSubject;
}

export default async function createState(): Promise<State> {
  const store = await initStore();
  console.log("[CreateState]: init store", JSON.stringify(store.getValue()));

  const preference = new PreferenceState({ store });
  const auth = new AuthState({ store });
  const keyring = new KeyringState({ store, preference });
  const provider = new ProviderState({ preference, keyring });

  return {
    auth,
    keyring,
    preference,
    provider
  };
}
