<!-- Login.svelte -->
<script lang="ts">
  import { deserialize } from '$app/forms';
  import { goto } from '$app/navigation';
  import dayjs from 'dayjs';
  import localFetch from '$lib/fetch';

  import Login from '$lib/components/login.svelte';

  let error = '';

  async function handleLogin(password: string) {
    const formData = new FormData();
    formData.append('password', password);
    const resp = await localFetch('?/login', {
      method: 'POST',
      body: formData,
    });
    const result = deserialize(await resp.text());
    if (result.type === 'success' && result.data?.body['success'] === true) {
      goto(`/${dayjs(Date.now()).format('YYYYMMDD')}`);
    } else {
      error = 'Invalid password';
    }
  }
</script>

<div class="container">
  <h1>Login</h1>
  <span class="error">{error}</span>
  <Login {handleLogin} />
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
</style>
