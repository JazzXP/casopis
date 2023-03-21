<script lang="ts">
  import { InlineCalendar } from "svelte-calendar";
  import dayjs from "dayjs";
  import { goto } from "$app/navigation";

  export let store: any;
  $: if ($store) {
    goto(`/${dayjs($store?.selected).format("YYYYMMDD")}`);
  }

  const theme = {
    calendar: {
      width: "300px",
    },
  };
</script>

<div class="main">
  <div>
    <InlineCalendar {theme} bind:store />
  </div>

  <div class="mdeditor">
    <slot />
  </div>
</div>

<style>
  .main {
    display: flex;
  }
  .mdeditor {
    flex-grow: 1;
  }
</style>
