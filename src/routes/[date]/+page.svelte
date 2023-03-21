<script lang="ts">
  import "bytemd/dist/index.css";
  import Editor from "../../../node_modules/bytemd/svelte/editor.svelte";
  import gfm from "@bytemd/plugin-gfm";
  import { deserialize } from "$app/forms";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";

  export let data: PageData;
  let value: string;

  $: value = data.md;

  const plugins = [
    gfm(),
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
        const resp = await fetch("?/upload", {
          method: "POST",
          body: formData,
        });
        const result = deserialize(await resp.text());
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
    const resp = await fetch("?/writeMD", {
      method: "POST",
      body: formData,
    });
  }
</script>

<div class="main">
  <div class="mdeditor">
    <div><button on:click={save}>Save</button></div>
    <Editor {value} {plugins} on:change={handleChange} {uploadImages} />
  </div>
</div>

<style>
  :global(.bytemd) {
    height: calc(100vh - 40px);
  }
</style>
