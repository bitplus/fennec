<template>
  <div class="list-wrapper">
    <div v-if="loading" class="d-flex justify-center pa-5">
      <f-loading size="28" color="primary" />
    </div>
    <div
      v-else-if="!empty"
      class="empty-hint text-secondary caption text-center pa-5"
    >
      <slot name="empty">
        {{ hint || "Data is empty" }}
      </slot>
    </div>
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class ListWapper extends Vue {
  @Prop({ type: Array, default: [] }) data!: unknown[];

  @Prop({ type: Boolean, default: false }) loading!: boolean;

  @Prop({ type: String, default: "" }) hint!: string;

  get empty() {
    const len = this.data?.length ?? 0;
    return len > 0;
  }
}
export default ListWapper;
</script>
