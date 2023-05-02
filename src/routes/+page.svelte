<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { Entry } from "$lib/io/io";
  import dayjs from "dayjs";
  let today = dayjs(Date.now()).format("YYYYMMDD");
  const entries = $page.data.entries as Entry[];
</script>

<a href={today}>Go To Today</a>
<div class="container">
  {#each entries.slice(0, 50) as entry}
    <article>
      <a href={`/${entry.date}`} on:click={() => goto(`/${entry.date}`)}
        >{#if entry.image !== ""}
          <img src={entry.image} alt="thumbnail for {entry.subject}" />
        {:else}
          <div class="empty-img" />
        {/if}
        {entry.formattedDate}
        {entry.subject}</a
      >
    </article>
  {/each}
</div>

<style>
  article {
    text-align: center;
  }
  img {
    height: 150px;
    display: block;
    margin: 0 auto;
  }
  .empty-img {
    height: 150px;
    width: 112px;
    display: block;
    margin: 0 auto;
    background: linear-gradient(#e66465, #9198e5);
  }
  .container {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-template-rows: masonry;
  }
</style>
