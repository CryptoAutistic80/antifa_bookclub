import { productIdSchema, productListSchema, productSchema } from './product';

describe('product schemas', () => {
  it('maps Mongo _id to id', () => {
    const parsed = productSchema.parse({
      _id: 'abc123',
      name: 'Test Product',
      description: 'A nice product',
      price: 10.5,
      currency: 'usd',
      imageUrl: 'https://example.com/image.png',
      tags: ['featured'],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    });

    expect(parsed.id).toBe('abc123');
    expect(parsed).not.toHaveProperty('_id');
    expect(parsed.currency).toBe('USD');
    expect(parsed.createdAt).toBeInstanceOf(Date);
    expect(parsed.updatedAt).toBeInstanceOf(Date);
  });

  it('validates product ids', () => {
    expect(() => productIdSchema.parse('')).toThrow();
    expect(productIdSchema.parse('abc')).toBe('abc');
  });

  it('parses product collections', () => {
    const list = productListSchema.parse([
      {
        _id: 'abc123',
        name: 'Product 1',
        price: 5,
        currency: 'usd',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('abc123');
  });
});
