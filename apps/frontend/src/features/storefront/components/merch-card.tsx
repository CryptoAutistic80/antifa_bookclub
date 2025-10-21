import type { Product } from '@antifa-bookclub/api-types';

type MerchCardProps = {
  product: Product;
};

const numberFormatters = new Map<string, Intl.NumberFormat>();

const getCurrencyFormatter = (currency: string) => {
  const normalized = currency.toUpperCase();
  if (!numberFormatters.has(normalized)) {
    try {
      numberFormatters.set(
        normalized,
        new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: normalized,
        }),
      );
    } catch (error) {
      numberFormatters.set(
        normalized,
        new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
        }),
      );
    }
  }

  return numberFormatters.get(normalized)!;
};

const formatPrice = (price: number, currency: string) => {
  const formatter = getCurrencyFormatter(currency);
  return formatter.format(price);
};

export function MerchCard({ product }: MerchCardProps) {
  const { name, description, price, currency, imageUrl, tags } = product;

  return (
    <article className="storefront-card" aria-labelledby={`product-${product.id}`}>
      <div className="storefront-card__media">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" loading="lazy" className="storefront-card__image" />
        ) : (
          <div className="storefront-card__placeholder">
            <span className="storefront-card__placeholder-label">Cover coming soon</span>
          </div>
        )}
      </div>
      <div className="storefront-card__body">
        <h3 id={`product-${product.id}`} className="storefront-card__title">
          {name}
        </h3>
        {description && <p className="storefront-card__description">{description}</p>}
        <div className="storefront-card__footer">
          <span className="storefront-card__price">{formatPrice(price, currency)}</span>
          {tags?.length ? (
            <ul className="storefront-card__tags" aria-label="Categories">
              {tags.map((tag) => (
                <li key={tag} className="storefront-card__tag">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}
