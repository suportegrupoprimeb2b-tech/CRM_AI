import { describe, expect, it } from 'vitest';
import { AI_MODULE } from './index';

describe('ai module', () => {
  it('exposes the ai module identifier', () => {
    expect(AI_MODULE).toBe('ai');
  });
});
