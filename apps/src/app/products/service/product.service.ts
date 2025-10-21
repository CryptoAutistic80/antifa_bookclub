import { Injectable } from '@nestjs/common';
import {
  productListSchema,
  productSchema,
  type Product,
} from '@antifa-bookclub/api-types';

import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(): Promise<Product[]> {
    const documents = await this.productRepository.findAll();
    return productListSchema.parse(documents);
  }
}
