import { productDocumentSchema, productListSchema } from '@antifa-bookclub/api-types';

import { ProductService } from './product.service';
import { ProductRepository } from '../repository/product.repository';

describe('ProductService', () => {
  it('transforms product documents into API-ready payloads', async () => {
    const documents = productDocumentSchema.array().parse([
      {
        _id: 'prod-service-1',
        name: 'Service Test Product',
        description: 'A product used to test the service layer.',
        price: 42,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['service'],
      },
    ]);

    const repository: Pick<ProductRepository, 'findAll'> = {
      findAll: jest.fn().mockResolvedValue(documents),
    };

    const service = new ProductService(repository as ProductRepository);
    const products = await service.getProducts();
    const expected = productListSchema.parse(documents);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(products).toHaveLength(1);
    expect(products).toEqual(expected);
  });
});
