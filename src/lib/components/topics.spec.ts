import Topics from './topics.svelte';
import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

test('component renders', () => {
  render(Topics, { categories: [] });

  const visibleButton = screen.getByText('Random Topic');
  expect(visibleButton).toBeTruthy();
});
