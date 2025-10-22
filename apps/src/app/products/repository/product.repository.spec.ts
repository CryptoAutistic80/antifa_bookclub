import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { productDocumentSchema } from '@antifa-bookclub/api-types';

import { ProductRepository } from './product.repository';
import { PRODUCT_MODEL, type ProductDocument } from '../schema/product.schema';

const createModelStub = (overrides: Partial<Model<ProductDocument>> = {}) =>
  ({
    db: { readyState: 0 },
    find: jest.fn(),
    ...overrides,
  }) as unknown as Model<ProductDocument>;

describe('ProductRepository', () => {
  it('returns seeded products when the database is unavailable', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getModelToken(PRODUCT_MODEL),
          useValue: createModelStub(),
        },
      ],
    }).compile();

    const repository = moduleRef.get(ProductRepository);
    const products = await repository.findAll();

    expect(products).toHaveLength(3);
    expect(() => productDocumentSchema.array().parse(products)).not.toThrow();
  });

  it('delegates to the mongoose model with lean queries when connected', async () => {
    const expected = productDocumentSchema.array().parse([
      {
        _id: 'prod-test-1',
        name: 'Test Product',
        description: 'A seeded product for unit tests.',
        price: 10,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
      },
    ]);

    const exec = jest.fn().mockResolvedValue(expected);
    const lean = jest.fn().mockReturnValue({ exec });
    const find = jest.fn().mockReturnValue({ lean });

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getModelToken(PRODUCT_MODEL),
          useValue: createModelStub({ db: { readyState: 1 }, find } as unknown as Model<ProductDocument>),
        },
      ],
    }).compile();

    const repository = moduleRef.get(ProductRepository);
    const products = await repository.findAll();

    expect(find).toHaveBeenCalledTimes(1);
    expect(lean).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(products).toEqual(expected);
  });
});
