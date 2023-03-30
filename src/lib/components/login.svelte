<script lang="ts">
  export let handleLogin: (password: string) => void;
  const loginHandler = () => {
    handleLogin(password);
  };
  let password: string;
</script>

<form on:submit|preventDefault={loginHandler}>
  <label for="password">Password</label>
  <input type="password" id="password" bind:value={password} />

  <button type="submit">Login</button>
</form>

<style>
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
