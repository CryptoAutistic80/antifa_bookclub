'use client';

import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

import type { ProductList } from '@antifa-bookclub/api-types';

import { getProducts, productsQueryKey } from '../api/get-products';

export type UseProductsQueryOptions<TData = ProductList> = Omit<
  UseQueryOptions<ProductList, Error, TData, typeof productsQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useProductsQuery<TData = ProductList>(
  options?: UseProductsQueryOptions<TData>,
): UseQueryResult<TData, Error> {
  return useQuery<ProductList, Error, TData, typeof productsQueryKey>({
    queryKey: productsQueryKey,
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
