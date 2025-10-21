import { z } from 'zod';

export const backendEnvSchema = z.object({
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI must be provided')
    .default('mongodb://localhost:27017/antifa-bookclub'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type BackendEnv = Partial<Record<'PORT' | 'MONGODB_URI' | 'NODE_ENV', string>> &
  Record<string, string | undefined>;

export interface BackendConfig {
  port: number;
  mongodbUri: string;
  nodeEnv: 'development' | 'test' | 'production';
}

export const loadBackendConfig = (env: BackendEnv = process.env): BackendConfig => {
  const parsed = backendEnvSchema.parse(env);

  return {
    port: parsed.PORT,
    mongodbUri: parsed.MONGODB_URI,
    nodeEnv: parsed.NODE_ENV,
  };
};
