<script lang="ts">
  import type { Category } from "$lib/interfaces/topics";
  import { slide } from "svelte/transition";

  export let categories: Category[];
  let topics: string[];
  let randomTopicText: string;
  let randomTopicsVisible = false;

  $: topics =
    selectedCategory === "Random"
      ? categories[Math.floor(Math.random() * categories.length)]?.topics
      : categories.find((val) => val.name === selectedCategory)?.topics || [];
  $: randomTopicText = topics[Math.floor(Math.random() * topics.length)];
  let selectedCategory: string;

  async function randomTopic() {
    randomTopicsVisible = !randomTopicsVisible;
  }
</script>

<button on:click={randomTopic}>Random Topic</button>
{#if randomTopicsVisible}
  <div transition:slide={{ duration: 200 }}>
    <select bind:value={selectedCategory}>
      <option value="Random">Random Category</option>
      {#each categories as category}
        <option value={category.name}>{category.name}</option>
      {/each}
    </select>
    {randomTopicText}
  </div>
{/if}
