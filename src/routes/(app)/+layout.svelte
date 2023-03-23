<script lang="ts">
  import authStore from "$lib/stores/auth";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  let ok = false;

  const unsubscribe = authStore.subscribe((state) => {
    if (!state.initializing && state.token !== undefined) {
      ok = state.token !== null;
      if (!ok) {
        goto("/");
      }
    }
  });

  onDestroy(unsubscribe);
</script>

{#if ok}
  <slot />
{:else}
  <div>Not logged in</div>
{/if}
