import { describe, expect, it } from 'vitest';
import { WORKERS_MODULE } from './index';

describe('workers module', () => {
  it('exposes the workers module identifier', () => {
    expect(WORKERS_MODULE).toBe('workers');
  });
});
