import { persisted } from 'svelte-local-storage-store';

export type AuthStore = {
  initializing: boolean;
  token?: string;
};

const authStore = persisted<AuthStore>('auth', {
  initializing: true,
  token: undefined
});

export default authStore;