import type { ActionTypes, ActionPayloads, ActionResponses } from "../../types";
import type {
  ApproveAuthPayload,
  RejectAuthPayload,
  UpdateAuthUrlPayload
} from "../../types/auth";
import type {
  CreateAccountPayload,
  UnlockKeyringPayload,
  SignAuthorizeTokenPayload,
  GetEncryptedPinPayload,
  ExportKeyringPayload,
  RemoveAccountPayload,
  ExportAllAccountsPayload
} from "../../types/keyring";
import type { State } from "../../../state/types";
import {
  ApproveMultisigsPayload,
  ApproveTransferPayload,
  RejectTransferPayload,
  RejectMultisigsPayload
} from "../../types/wallet";
import {
  SelectAccountPaylod,
  UpdateAccountProvidersPayload
} from "../../types/preference";
import type { OpenWindowPayload } from "../../types/platform";

import createAuthHandlers from "./auth";
import createKeyringHandlers from "./keyring";
import createPreferenceHandlers from "./preference";
import createWalletHandlers from "./wallet";
import createPlatformHandlers from "./platform";

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

      case "pri(authorize.authUrls)":
        return handlers.getAuthUrls();

      case "pri(authorize.update)":
        return handlers.updateAuthUrl(payload as UpdateAuthUrlPayload);

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

      case "pri(keyring.exportAllAccounts)":
        return handlers.exportAllAccounts(payload as ExportAllAccountsPayload);

      case "pri(keyring.removeAccount)":
        return handlers.removeAccount(payload as RemoveAccountPayload);

      // Preference
      case "pri(preference.subscribe)":
        return handlers.perferenceSubscribe(id, port);

      case "pri(perference.completeOnboarding)":
        return handlers.completeOnboarding();

      case "pri(perference.selectAccount)":
        return handlers.selectAccount(payload as SelectAccountPaylod);

      case "pri(perference.updateAccountProviders)":
        return handlers.updateAccountProviders(
          payload as UpdateAccountProvidersPayload
        );

      // Wallet
      case "pri(transfer.list)":
        return handlers.transferSubscribe(id, port);

      case "pri(transfer.approve)":
        return handlers.approveTransfer(payload as ApproveTransferPayload);

      case "pri(transfer.reject)":
        return handlers.rejectTransfer(payload as RejectTransferPayload);

      case "pri(multisigs.list)":
        return handlers.multisigPaymentSubscribe(id, port);

      case "pri(multisigs.approve)":
        return handlers.approveMultisigsPayment(
          payload as ApproveMultisigsPayload
        );

      case "pri(multisigs.reject)":
        return handlers.rejectMultisigsPayment(
          payload as RejectMultisigsPayload
        );

      case "pri(rejectMultisigsPayment)":
        return handlers.rejectMultisigsPayment(
          payload as RejectMultisigsPayload
        );

      // Platform
      case "pri(platform.closePopup)":
        return handlers.closePopup();

      case "pri(platform.openWindow)":
        return handlers.openWindow(payload as OpenWindowPayload);

      default:
        throw new Error(`Unable to handle message of type ${action}`);
    }
  };
}
