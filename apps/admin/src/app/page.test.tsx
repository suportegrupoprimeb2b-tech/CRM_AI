import { describe, expect, it } from 'vitest';
import AdminPage from './page';

describe('admin page', () => {
  it('renders the admin page component', () => {
    expect(typeof AdminPage).toBe('function');
  });
});
