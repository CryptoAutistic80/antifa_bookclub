import { render } from '@testing-library/react';

import { Background3D } from '../background-3d';

describe('Background3D', () => {
  it('renders a container when WebGL is unavailable', () => {
    const originalContext = (window as Window & { WebGLRenderingContext?: unknown }).WebGLRenderingContext;
    delete (window as Window & { WebGLRenderingContext?: unknown }).WebGLRenderingContext;

    const { container } = render(<Background3D />);
    const element = container.querySelector('div');

    expect(element).toHaveAttribute('aria-hidden');

    (window as Window & { WebGLRenderingContext?: unknown }).WebGLRenderingContext = originalContext;
  });
});
