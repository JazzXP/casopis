<!-- Login.svelte -->
<script lang="ts">
  import { deserialize } from "$app/forms";
  import { goto } from "$app/navigation";
  import dayjs from "dayjs";
  import localFetch from "$lib/fetch";

  let password = "";
  let error = "";

  async function handleLogin() {
    const formData = new FormData();
    formData.append("password", password);
    const resp = await localFetch("?/login", {
      method: "POST",
      body: formData,
    });
    const result = deserialize(await resp.text());
    console.log(result.type);
    if (result.type === "success" && result.data?.body["success"] === true) {
      goto(`/${dayjs(Date.now()).format("YYYYMMDD")}`);
    } else {
      error = "Invalid password";
    }
  }
</script>

<div class="container">
  <h1>Login</h1>
  <span class="error">{error}</span>
  <form on:submit|preventDefault={handleLogin}>
    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} />

    <button type="submit">Login</button>
  </form>
</div>

<style>
  .error {
    color: red;
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f2f2f2;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #333;
  }

  input[type="password"] {
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: none;
    margin-bottom: 1rem;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  button[type="submit"] {
    background-color: #333;
    color: #fff;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
