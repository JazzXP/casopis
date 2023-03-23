<script lang="ts">
  import "bytemd/dist/index.css";
  import Editor from "../../../../node_modules/bytemd/svelte/editor.svelte";
  import gfm from "@bytemd/plugin-gfm";
  import { deserialize } from "$app/forms";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import authStore from "$lib/stores/auth";
  import { onDestroy } from "svelte";

  export let data: PageData;
  let value: string;
  let token: string;

  $: value = data.md;

  const unsubscribe = authStore.subscribe((state) => {
    if (!state.initializing && state.token !== undefined) {
      token = state.token;
    }
  });

  onDestroy(unsubscribe);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    const resp = await fetch("?/writeMD", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    <div><button on:click={save}>Save</button></div>
    <Editor {value} {plugins} on:change={handleChange} {uploadImages} />
  </div>
</div>

<style>
  :global(.bytemd) {
    height: calc(100vh - 40px);
  }
</style>
