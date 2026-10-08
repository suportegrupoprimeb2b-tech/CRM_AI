import { describe, expect, it } from 'vitest';
import PortalPage from './page';

describe('portal page', () => {
  it('renders the portal page component', () => {
    expect(typeof PortalPage).toBe('function');
  });
});
