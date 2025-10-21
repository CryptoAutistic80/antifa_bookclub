import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  productDocumentSchema,
  type ProductDocument as ProductDocumentContract,
} from '@antifa-bookclub/api-types';

import { PRODUCT_MODEL, type ProductDocument } from '../schema/product.schema';

const seededAt = '2024-01-01T00:00:00.000Z';

const seededProducts: ProductDocumentContract[] = productDocumentSchema.array().parse([
  {
    _id: 'prod-anti-fascist-handbook',
    name: 'The Anti-Fascist Handbook',
    description: 'Essential strategies and historical context for anti-fascist organising.',
    price: 24.99,
    currency: 'USD',
    imageUrl: 'https://cdn.antifa-bookclub.org/products/anti-fascist-handbook.jpg',
    tags: ['books', 'education', 'organizing'],
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    _id: 'prod-mutual-aid-field-guide',
    name: 'Mutual Aid Field Guide',
    description: 'Practical frameworks for building resilient community support networks.',
    price: 18.5,
    currency: 'USD',
    imageUrl: 'https://cdn.antifa-bookclub.org/products/mutual-aid-field-guide.jpg',
    tags: ['books', 'mutual-aid'],
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    _id: 'prod-antifa-patch-set',
    name: 'Antifa Patch Set',
    description: 'Embroidered patches celebrating anti-fascist resistance movements worldwide.',
    price: 12.0,
    currency: 'USD',
    imageUrl: 'https://cdn.antifa-bookclub.org/products/antifa-patch-set.jpg',
    tags: ['merch', 'apparel'],
    createdAt: seededAt,
    updatedAt: seededAt,
  },
]);

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(
    @InjectModel(PRODUCT_MODEL)
    private readonly productModel: Model<ProductDocument>
  ) {}

  async findAll(): Promise<ProductDocumentContract[]> {
    if (this.productModel?.db?.readyState === 1) {
      const results = await this.productModel.find().lean().exec();
      return productDocumentSchema.array().parse(results);
    }

    this.logger.debug('MongoDB connection is not ready, falling back to in-memory seed data.');
    return this.createInMemoryQuery(seededProducts).lean();
  }

  private createInMemoryQuery<T extends Record<string, unknown>>(items: T[]) {
    return {
      lean: async () => items.map((item) => ({ ...item })),
    };
  }
}
