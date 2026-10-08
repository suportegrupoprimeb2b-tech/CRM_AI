import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createEnv } from './env';

const publicSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
});

describe('createEnv', () => {
  it('separates public and server variables', () => {
    const env = createEnv(
      {
        NEXT_PUBLIC_APP_NAME: 'CRM B2B',
        SUPABASE_URL: 'https://example.supabase.co',
      },
      publicSchema,
    );

    expect(env.public.NEXT_PUBLIC_APP_NAME).toBe('CRM B2B');
    expect(env.server.SUPABASE_URL).toBe('https://example.supabase.co');
  });

  it('rejects service-role secrets in public variables', () => {
    expect(() =>
      createEnv(
        {
          NEXT_PUBLIC_SERVICE_ROLE_KEY: 'secret',
        },
        publicSchema,
      ),
    ).toThrow(/NEXT_PUBLIC_SERVICE_ROLE_KEY/);
  });
});
