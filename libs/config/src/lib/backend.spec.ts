import { backendEnvSchema, loadBackendConfig } from './backend';

describe('loadBackendConfig', () => {
  it('parses defaults when values are missing', () => {
    const config = loadBackendConfig({});

    expect(config.port).toBe(3000);
    expect(config.mongodbUri).toBe('mongodb://localhost:27017/antifa-bookclub');
    expect(config.nodeEnv).toBe('development');
  });

  it('validates and coerces provided values', () => {
    const config = loadBackendConfig({
      PORT: '8080',
      MONGODB_URI: 'mongodb://mongo:27017/store',
      NODE_ENV: 'production',
    });

    expect(config.port).toBe(8080);
    expect(config.mongodbUri).toBe('mongodb://mongo:27017/store');
    expect(config.nodeEnv).toBe('production');
  });

  it('falls back to the default uri when none is provided', () => {
    const parsed = backendEnvSchema.parse({ PORT: '4000' });

    expect(parsed.MONGODB_URI).toBe('mongodb://localhost:27017/antifa-bookclub');
  });
});
