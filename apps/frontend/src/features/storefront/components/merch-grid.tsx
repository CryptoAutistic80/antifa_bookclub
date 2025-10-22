import type { Product } from '@antifa-bookclub/api-types';

import { MerchCard } from './merch-card';

type MerchGridProps = {
  title: string;
  description?: string;
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
};

const SKELETON_ITEMS = Array.from({ length: 6 }, (_, index) => index);

export function MerchGrid({
  title,
  description,
  products,
  isLoading = false,
  isError = false,
  errorMessage,
}: MerchGridProps) {
  return (
    <section className="storefront" aria-labelledby="storefront-heading">
      <div className="storefront__header">
        <h2 id="storefront-heading" className="storefront__title">
          {title}
        </h2>
        {description ? <p className="storefront__description">{description}</p> : null}
      </div>
      <div className="storefront__grid" role="list" aria-label="Product grid">
        {isLoading &&
          SKELETON_ITEMS.map((item) => (
            <div
              key={`skeleton-${item}`}
              className="storefront-card storefront-card--skeleton"
              role="listitem"
              aria-hidden
            >
              <div className="storefront-card__media" />
              <div className="storefront-card__body">
                <div className="storefront-card__title" />
                <div className="storefront-card__description" />
              </div>
            </div>
          ))}

        {!isLoading && isError ? (
          <div className="storefront__state" role="alert">
            <p>We could not load the storefront right now. {errorMessage ?? 'Please try again shortly.'}</p>
          </div>
        ) : null}

        {!isLoading && !isError && products.length === 0 ? (
          <div className="storefront__state">
            <p>New merch is coming soon. Check back later!</p>
          </div>
        ) : null}

        {!isLoading && !isError
          ? products.map((product) => (
              <div key={product.id} role="listitem" className="storefront__grid-item">
                <MerchCard product={product} />
              </div>
            ))
          : null}
      </div>
    </section>
  );
}
