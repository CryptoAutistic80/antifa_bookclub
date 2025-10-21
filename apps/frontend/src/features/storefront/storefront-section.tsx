'use client';

import { Component, type ErrorInfo, type ReactNode, Suspense } from 'react';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';

import type { ProductList } from '@antifa-bookclub/api-types';

import { MerchGrid } from './components/merch-grid';
import { useProductsQuery } from './hooks/use-products-query';

type StorefrontSectionProps = {
  title?: string;
  description?: string;
};

type StorefrontErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
  renderError: (error: Error, reset: () => void) => ReactNode;
  onReset: () => void;
};

type StorefrontErrorBoundaryState = {
  error: Error | null;
};

class StorefrontErrorBoundary extends Component<
  StorefrontErrorBoundaryProps,
  StorefrontErrorBoundaryState
> {
  state: StorefrontErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): StorefrontErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Storefront failed to render', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: StorefrontErrorBoundaryProps) {
    if (this.state.error && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    this.props.onReset();
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback, renderError } = this.props;

    if (error) {
      return renderError(error, this.resetErrorBoundary);
    }

    return <Suspense fallback={fallback}>{children}</Suspense>;
  }
}

const DEFAULT_TITLE = 'Featured antifascist titles';
const DEFAULT_DESCRIPTION =
  'Latest literature and resources from independent publishers, co-ops, and comrades-in-print.';

function StorefrontContent({ title, description }: Required<StorefrontSectionProps>) {
  const { data } = useProductsQuery<ProductList>({ suspense: true });

  return (
    <MerchGrid
      title={title}
      description={description}
      products={data}
      isLoading={false}
      isError={false}
    />
  );
}

function StorefrontLoading({ title, description }: Required<StorefrontSectionProps>) {
  return <MerchGrid title={title} description={description} products={[]} isLoading />;
}

function StorefrontError({
  title,
  description,
  error,
  onRetry,
}: Required<StorefrontSectionProps> & { error: Error; onRetry: () => void }) {
  return (
    <div className="storefront__error-boundary">
      <MerchGrid
        title={title}
        description={description}
        products={[]}
        isError
        errorMessage={error.message}
      />
      <button type="button" className="storefront__retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function StorefrontSection({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: StorefrontSectionProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <StorefrontErrorBoundary
      fallback={<StorefrontLoading title={title} description={description} />}
      renderError={(error, resetBoundary) => (
        <StorefrontError title={title} description={description} error={error} onRetry={resetBoundary} />
      )}
      onReset={reset}
    >
      <StorefrontContent title={title} description={description} />
    </StorefrontErrorBoundary>
  );
}
