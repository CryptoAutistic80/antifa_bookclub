'use client';

import {
  useQuery,
  useSuspenseQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';

import type { ProductList } from '@antifa-bookclub/api-types';

import { getProducts, productsQueryKey } from '../api/get-products';

export type UseProductsQueryOptions<TData = ProductList> = Omit<
  UseQueryOptions<ProductList, Error, TData, typeof productsQueryKey>,
  'queryKey' | 'queryFn'
>;

export type UseProductsSuspenseQueryOptions<TData = ProductList> = Omit<
  UseSuspenseQueryOptions<ProductList, Error, TData, typeof productsQueryKey>,
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

export function useProductsSuspenseQuery<TData = ProductList>(
  options?: UseProductsSuspenseQueryOptions<TData>,
): UseSuspenseQueryResult<TData, Error> {
  return useSuspenseQuery<ProductList, Error, TData, typeof productsQueryKey>({
    queryKey: productsQueryKey,
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
