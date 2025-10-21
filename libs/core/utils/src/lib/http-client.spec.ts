import { z } from 'zod';
import { createHttpClient, HttpError } from './http-client';

describe('createHttpClient', () => {
  const fetchSpy = jest.fn();
  const client = createHttpClient({
    baseUrl: 'https://api.example.com',
    defaultHeaders: { Authorization: 'Bearer token' },
    fetchFn: fetchSpy as unknown as typeof fetch,
  });

  beforeEach(() => {
    fetchSpy.mockReset();
  });

  it('builds urls with base and query parameters', async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ hello: 'world' }), { status: 200, headers: { 'content-type': 'application/json' } }),
    );

    await client.get('/products', { query: { page: 2, tag: 'featured' } });

    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.com/products?page=2&tag=featured', expect.any(Object));
  });

  it('serialises json bodies and validates using the provided schema', async () => {
    const schema = z.object({ id: z.string() });
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ id: '123' }), { status: 200, headers: { 'content-type': 'application/json' } }),
    );

    const result = await client.post('/products', {
      body: { name: 'Example' },
      schema,
    });

    const [, init] = fetchSpy.mock.calls[0]!;
    const headers = init!.headers as Headers;

    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.com/products', expect.any(Object));
    expect(init!.method).toBe('POST');
    expect(init!.body).toBe(JSON.stringify({ name: 'Example' }));
    expect(headers.get('Authorization')).toBe('Bearer token');
    expect(headers.get('content-type')).toBe('application/json');
    expect(result).toEqual({ id: '123' });
  });

  it('throws when the response is not ok', async () => {
    fetchSpy.mockResolvedValue(new Response(null, { status: 500 }));

    await expect(client.get('/broken')).rejects.toBeInstanceOf(HttpError);
  });

  it('supports relative paths without a base url', async () => {
    const localFetch = jest.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const localClient = createHttpClient({ fetchFn: localFetch as unknown as typeof fetch });

    await localClient.post('products', { body: { hello: 'world' }, parseJson: false });

    expect(localFetch).toHaveBeenCalledWith('products', expect.objectContaining({ method: 'POST' }));
  });
});
