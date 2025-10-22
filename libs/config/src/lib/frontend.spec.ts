import { frontendEnvSchema, loadFrontendConfig } from './frontend';

describe('loadFrontendConfig', () => {
  it('uses the default api url when env is empty', () => {
    expect(loadFrontendConfig({}).apiUrl).toBe('http://localhost:3000/api');
  });

  it('validates url shape', () => {
    expect(() => frontendEnvSchema.parse({ NEXT_PUBLIC_API_URL: 'invalid-url' })).toThrow();
  });

  it('returns provided url', () => {
    const config = loadFrontendConfig({ NEXT_PUBLIC_API_URL: 'https://example.com/api' });

    expect(config.apiUrl).toBe('https://example.com/api');
  });
});
