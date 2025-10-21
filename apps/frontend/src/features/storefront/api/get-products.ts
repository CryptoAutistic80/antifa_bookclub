import { productListSchema, type ProductList } from '@antifa-bookclub/api-types';

const PRODUCTS_PATH = '/products';

export async function getProducts(): Promise<ProductList> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  const requestUrl = new URL(PRODUCTS_PATH, baseUrl).toString();
  const response = await fetch(requestUrl, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const payload = await response.json();
  const result = productListSchema.safeParse(payload);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export const productsQueryKey = ['storefront', 'products'] as const;
