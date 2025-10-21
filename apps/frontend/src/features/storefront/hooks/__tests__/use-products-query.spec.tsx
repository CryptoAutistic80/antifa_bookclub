import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { ReactNode } from 'react';

import type { ProductList } from '@antifa-bookclub/api-types';

import { useProductsQuery } from '../use-products-query';

const server = setupServer();

let consoleErrorSpy: jest.SpiedFunction<typeof console.error> | undefined;

beforeAll(() => {
  server.listen();
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  consoleErrorSpy?.mockRestore();
});

const API_URL = 'https://example.com';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

const createWrapper = (client: QueryClient) => ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

describe('useProductsQuery', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_URL;
  });

  it('returns validated products from the storefront API', async () => {
    const responsePayload = [
      {
        _id: 'product-1',
        name: 'Liberation Pedagogy',
        description: 'Transformative education for antifascist futures.',
        price: 32,
        currency: 'USD',
        imageUrl: 'https://example.com/cover.jpg',
        tags: ['Education'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    ];

    server.use(
      http.get(`${API_URL}/products`, () => {
        return HttpResponse.json(responsePayload);
      }),
    );

    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useProductsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data as ProductList;
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('product-1');
    expect(data[0].currency).toBe('USD');
    expect(data[0].createdAt).toBeInstanceOf(Date);

    queryClient.clear();
  });

  it('enters the error state when the API response fails validation', async () => {
    server.use(
      http.get(`${API_URL}/products`, () => {
        return HttpResponse.json([{ unexpected: 'value' }]);
      }),
    );

    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(() => useProductsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBeTruthy();

    queryClient.clear();
  });
});
