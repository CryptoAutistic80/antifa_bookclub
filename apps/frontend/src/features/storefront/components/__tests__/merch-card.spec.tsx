import { render, screen } from '@testing-library/react';

import type { Product } from '@antifa-bookclub/api-types';

import { MerchCard } from '../merch-card';

const baseProduct: Product = {
  id: 'product-1',
  name: 'Antifascist Handbook',
  description: 'A tactical companion for grassroots organising.',
  price: 25,
  currency: 'GBP',
  imageUrl: undefined,
  tags: ['Education', 'Strategy'],
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-02T00:00:00Z'),
};

describe('MerchCard', () => {
  it('renders the product name, description, tags, and formatted price', () => {
    render(<MerchCard product={baseProduct} />);

    expect(screen.getByRole('heading', { name: /antifascist handbook/i })).toBeInTheDocument();
    expect(screen.getByText(/tactical companion/i)).toBeInTheDocument();
    expect(screen.getByText('£25.00')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Strategy')).toBeInTheDocument();
  });

  it('shows a placeholder when no cover image is provided', () => {
    render(<MerchCard product={baseProduct} />);

    expect(screen.getByText(/cover coming soon/i)).toBeInTheDocument();
  });

  it('renders the provided cover art when imageUrl is present', () => {
    const productWithImage: Product = {
      ...baseProduct,
      id: 'product-2',
      imageUrl: 'https://example.com/cover.jpg',
    };

    render(<MerchCard product={productWithImage} />);

    const image = screen.getByRole('presentation');
    expect(image).toHaveAttribute('src', productWithImage.imageUrl);
    expect(image).toHaveAttribute('alt', '');
  });
});
