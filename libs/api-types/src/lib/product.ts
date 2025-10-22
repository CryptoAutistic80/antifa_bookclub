import { z } from 'zod';

export const productIdSchema = z.string().min(1, 'Product id is required');

const baseProductFields = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative'),
  currency: z
    .string()
    .length(3, 'Currency must be a three character ISO-4217 code')
    .transform((value) => value.toUpperCase()),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const productDocumentSchema = baseProductFields.extend({
  _id: productIdSchema,
});

export const productSchema = productDocumentSchema.transform(({ _id, ...rest }) => ({
  id: _id,
  ...rest,
}));

export type ProductDocument = z.infer<typeof productDocumentSchema>;
export type Product = z.infer<typeof productSchema>;

export const productListSchema = z.array(productSchema);
export type ProductList = z.infer<typeof productListSchema>;
