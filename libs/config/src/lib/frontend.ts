import { z } from 'zod';

export const frontendEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url('NEXT_PUBLIC_API_URL must be a valid URL')
    .default('http://localhost:3000/api'),
});

export type FrontendEnv = Partial<Record<'NEXT_PUBLIC_API_URL', string>> & Record<string, string | undefined>;

export interface FrontendConfig {
  apiUrl: string;
}

export const loadFrontendConfig = (env: FrontendEnv = process.env): FrontendConfig => {
  const parsed = frontendEnvSchema.parse(env);

  return {
    apiUrl: parsed.NEXT_PUBLIC_API_URL,
  };
};
