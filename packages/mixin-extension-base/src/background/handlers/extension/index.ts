import type { ActionTypes, ActionPayloads, ActionResponses } from "../../types";
import type { ApproveAuthPayload, RejectAuthPayload } from "../../types/auth";
import type {
  CreateAccountPayload,
  UnlockKeyringPayload,
  SignAuthorizeTokenPayload,
  GetEncryptedPinPayload,
  ExportKeyringPayload
} from "../../types/keyring";
import type { State } from "../../../state/types";

import createAuthHandlers from "./auth";
import createKeyringHandlers from "./keyring";
import createPreferenceHandlers from "./preference";
import createWalletHandlers from "./wallet";
import createPlatformHandlers from "./platform";
import {
  ApproveTransferPayload,
  RejectTransferPayload
} from "../../types/wallet";

export type ActionParams<T extends ActionTypes> = {
  id: string;
  action: T;
  payload?: ActionPayloads[T];
  port: chrome.runtime.Port;
};

export default function (state: State) {
  return async function <T extends ActionTypes>(
    params: ActionParams<T>
  ): Promise<ActionResponses[keyof ActionResponses]> {
    const { action, payload, id, port } = params;

    const handlers = {
      ...createAuthHandlers(state),
      ...createKeyringHandlers(state),
      ...createPreferenceHandlers(state),
      ...createWalletHandlers(state),
      ...createPlatformHandlers(state)
    };

    switch (action) {
      // Accounts
      case "pri(authorize.requests)":
        return handlers.authorizeSubscribe(id, port);

      case "pri(authorize.approve)":
        return handlers.approveAuthorize(payload as ApproveAuthPayload);

      case "pri(authorize.reject)":
        return handlers.rejectAuthorize(payload as RejectAuthPayload);

      // Keyring
      case "pri(keyring.createAccount)":
        return handlers.createAccount(payload as CreateAccountPayload);

      case "pri(keyring.subscribe)":
        return handlers.createKeyringStateSubscribe(id, port);

      case "pri(keyring.unlock)":
        return handlers.tryUnlockKeyring(payload as UnlockKeyringPayload);

      case "pri(keyring.signAuthorizeToken)":
        return handlers.signAuthorizeToken(
          payload as SignAuthorizeTokenPayload
        );

      case "pri(keyring.getEncryptedPin)":
        return handlers.getEncryptedPin(payload as GetEncryptedPinPayload);

      case "pri(keyring.exportAccount)":
        return handlers.exportAccount(payload as ExportKeyringPayload);

      // Preference
      case "pri(preference.subscribe)":
        return handlers.perferenceSubscribe(id, port);

      case "pri(perference.completeOnboarding)":
        return handlers.completeOnboarding();

      // Wallet
      case "pri(transfer.list)":
        return handlers.transferSubscribe(id, port);

      case "pri(transfer.approve)":
        return handlers.approveTransfer(payload as ApproveTransferPayload);

      case "pri(transfer.reject)":
        return handlers.rejectTransfer(payload as RejectTransferPayload);

      // Platform
      case "pri(platform.closePopup)":
        return handlers.closePopup();

      default:
        throw new Error(`Unable to handle message of type ${action}`);
    }
  };
}