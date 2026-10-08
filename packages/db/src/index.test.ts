import { describe, expect, it } from 'vitest';
import { DB_MODULE } from './index';

describe('db module', () => {
  it('exposes the db module identifier', () => {
    expect(DB_MODULE).toBe('db');
  });
});
