<script lang="ts">
  import "bytemd/dist/index.css";
  import Editor from "../../../../node_modules/bytemd/svelte/editor.svelte";
  import Viewer from "../../../../node_modules/bytemd/svelte/viewer.svelte";
  import gfm from "@bytemd/plugin-gfm";
  import gemoji from "@bytemd/plugin-gemoji";
  import highlight from "@bytemd/plugin-highlight";
  import mediumZoom from "@bytemd/plugin-medium-zoom";
  import dayjs from "dayjs";
  import { deserialize } from "$app/forms";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import localFetch from "$lib/fetch";
  import "highlight.js/styles/default.css";
  import Topics from "$lib/components/topics.svelte";
  import type { Category } from "$lib/interfaces/topics";

  export let data: PageData;
  let value: string;
  let randomTopicText: string;
  let topics: Category[];

  $: value = data.md;
  $: topics = data.topics;

  const plugins = [
    gfm(),
    gemoji(),
    mediumZoom(),
    highlight(),
    // Add more plugins here
  ];

  function handleChange(e: { detail: { value: string } }) {
    value = e.detail.value;
  }

  function uploadImages(files: File[]) {
    return Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("date", $page.params.date);
        formData.append("file", file);
        const resp = await localFetch("?/upload", {
          method: "POST",
          body: formData,
        });
        const result = deserialize(await resp.text());
        // @ts-ignore
        if (result?.data?.["success"] === false) {
          return { url: "" };
        }
        return {
          // @ts-ignore
          url: result.data.filename,
        };
      })
    );
  }

  async function save() {
    const formData = new FormData();
    formData.append("md", value);
    formData.append("date", $page.params.date);
    const resp = await localFetch("?/writeMD", {
      method: "POST",
      body: formData,
    });
    const result = deserialize(await resp.text());
    // @ts-ignore
    if (result?.data?.["success"] === false) {
      // TODO: Show some sort of error?
    }
  }
</script>

<div class="main">
  <div class="mdeditor">
    <div>
      <button on:click={save}>Save</button><Topics categories={topics} />
    </div>
    {#if $page.params.date === dayjs(Date.now()).format("YYYYMMDD")}
      <Editor {value} {plugins} on:change={handleChange} {uploadImages} />
    {:else}
      <Viewer {value} {plugins} />
    {/if}
  </div>
</div>

<style>
  :global(.bytemd) {
    height: calc(100vh - 40px);
  }
  :global(.markdown-body) {
    padding-left: 2em;
  }
</style>
