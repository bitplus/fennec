import type { InjectedData } from "@foxone/mixin-extension-base/src/inject/types";
import { computed, defineComponent, ref } from "vue";
import ConnectExt from "../components/ConnectExt";
import GetAccount from "../components/GetAccount";
import GetAsset from "../components/GetAsset";
import Transfer from "../components/Transfer";
import SignToken from "../components/SignToken";
import Multisigs from "../components/Multisigs";

export default defineComponent(() => {
  const ctx = ref<null | InjectedData>(null);
  const setCtx = (v: InjectedData) => (ctx.value = v);

  const connected = computed(() => Boolean(ctx.value));

  return () => (
    <section class="section">
      <div class="container">
        <div class="title is-4">Mixin Client Bot Demo</div>
        <div class="mt-5">
          <div>
            <div class="label">Connect wallet</div>
            <ConnectExt
              ctx={ctx}
              connected={connected.value}
              onUpdateCtx={setCtx}
            />
          </div>
          <div class="actions mt-5">
            <div class="label">Get Account</div>
            <GetAccount ctx={ctx.value} connected={connected.value} />
          </div>
          <div class="actions mt-5">
            <div class="label">Get Asset</div>
            <GetAsset ctx={ctx.value} connected={connected.value} />
          </div>
          <div class="action mt-5">
            <div class="label">Transfer</div>
            <Transfer ctx={ctx.value} connected={connected.value} />
          </div>
          <div class="action mt-5">
            <div class="label">Multisigs</div>
            <Multisigs ctx={ctx.value} connected={connected.value} />
          </div>
          <div class="action mt-5">
            <div class="label">Sign Token</div>
            <SignToken ctx={ctx.value} connected={connected.value} />
          </div>
        </div>
      </div>
    </section>
  );
});
