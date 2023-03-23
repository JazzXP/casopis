<script lang="ts">
  import dayjs from "dayjs";
  import authStore from "$lib/stores/auth";
  import { onDestroy } from "svelte";
  let today = dayjs(Date.now()).format("YYYYMMDD");
  let loggedIn = false;

  const unsubscribe = authStore.subscribe((state) => {
    if (!state.initializing && state.token !== undefined) {
      loggedIn = state.token !== null;
    }
  });

  onDestroy(unsubscribe);
</script>

{#if loggedIn}
  <a href={today}>Go To Today</a>
{:else}
  <a href="/login">Login</a>
{/if}
