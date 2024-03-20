<script lang="ts">
  import { InlineCalendar } from 'svelte-calendar';
  import dayjs from 'dayjs';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Entry } from '$lib/io/io';

  export let store: any;
  $: if ($store) {
    goto(`/${dayjs($store?.selected).format('YYYYMMDD')}`);
  }

  const entries = $page.data.entries as Entry[];

  const theme = {
    calendar: {
      width: '300px',
    },
  };
</script>

<div class="main">
  <div>
    <InlineCalendar {theme} bind:store />
    <ul>
      {#each entries.slice(0, 10) as entry}
        <li>
          <a href={`/${entry.date}`} on:click={() => goto(`/${entry.date}`)}
            >{entry.formattedDate} {entry.subject}</a
          >
        </li>
      {/each}
    </ul>
    <hr />
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
