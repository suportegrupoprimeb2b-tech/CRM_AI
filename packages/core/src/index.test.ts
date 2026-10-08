import { describe, expect, it } from 'vitest';
import { CORE_MODULE } from './index';

describe('core module', () => {
  it('exposes the core module identifier', () => {
    expect(CORE_MODULE).toBe('core');
  });
});
