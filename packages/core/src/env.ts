import { z } from 'zod';

const PUBLIC_EXPOSED_KEYS = new Set([
  'NEXT_PUBLIC_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_AI_API_KEY',
  'NEXT_PUBLIC_AI_SECRET_KEY',
]);

export type PublicEnv = Record<string, string>;
export type ServerEnv = Record<string, string>;

export function createEnv<TPublic extends z.ZodRawShape>(
  raw: Record<string, string | undefined>,
  publicSchema: z.ZodObject<TPublic>,
): {
  public: z.infer<typeof publicSchema>;
  server: Record<string, string>;
} {
  const forbiddenPublicKeys = Object.keys(raw).filter((key) =>
    PUBLIC_EXPOSED_KEYS.has(key),
  );

  if (forbiddenPublicKeys.length > 0) {
    throw new Error(
      `Sensitive environment variables must not be exposed to the client: ${forbiddenPublicKeys.join(', ')}`,
    );
  }

  const validatedPublic = publicSchema.parse(raw);
  const validatedServer = Object.fromEntries(
    Object.entries(raw).filter(([key]) => !key.startsWith('NEXT_PUBLIC_')),
  ) as ServerEnv;

  return {
    public: validatedPublic,
    server: validatedServer,
  };
}
