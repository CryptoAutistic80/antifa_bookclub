import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { productSchema } from '@antifa-bookclub/api-types';

import { ProductController } from './product.controller';
import { ProductRepository } from '../repository/product.repository';
import { PRODUCT_MODEL } from '../schema/product.schema';
import { ProductService } from '../service/product.service';

describe('ProductController', () => {
  it('returns seeded products through the HTTP endpoint contract', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        ProductRepository,
        {
          provide: getModelToken(PRODUCT_MODEL),
          useValue: { db: { readyState: 0 } },
        },
      ],
    }).compile();

    const controller = moduleRef.get(ProductController);
    const response = await controller.getProducts();
    const plainResponse = response.map((item) => ({ ...item }));

    expect(plainResponse).toHaveLength(3);
    plainResponse.forEach((item) => {
      expect(() => productSchema.parse({ _id: item.id, ...item })).not.toThrow();
    });
  });
});
