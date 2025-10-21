import { render, screen } from '@testing-library/react';

import type { Product } from '@antifa-bookclub/api-types';

import { MerchGrid } from '../merch-grid';

const products: Product[] = [
  {
    id: 'product-1',
    name: 'Organise, Educate, Agitate',
    description: 'A field manual for mutual aid collectives.',
    price: 18,
    currency: 'GBP',
    imageUrl: undefined,
    tags: ['Mutual Aid'],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  },
];

describe('MerchGrid', () => {
  it('renders the storefront heading and product cards', () => {
    render(
      <MerchGrid
        title="Featured antifascist titles"
        description="Curated by the community"
        products={products}
      />,
    );

    expect(screen.getByRole('heading', { name: /featured antifascist titles/i })).toBeInTheDocument();
    expect(screen.getByText(/curated by the community/i)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /product grid/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(screen.getByText(/organise, educate, agitate/i)).toBeInTheDocument();
  });

  it('shows skeleton cards while loading', () => {
    render(<MerchGrid title="Loading" products={[]} isLoading />);

    const skeletons = screen.getAllByRole('listitem', { hidden: true });
    expect(skeletons).toHaveLength(6);
  });

  it('shows an error message when the grid fails to load', () => {
    render(
      <MerchGrid
        title="Storefront"
        products={[]}
        isError
        errorMessage="Network offline"
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/network offline/i);
  });

  it('shows an empty state when there are no products', () => {
    render(<MerchGrid title="Empty" products={[]} />);

    expect(screen.getByText(/new merch is coming soon/i)).toBeInTheDocument();
  });
});
