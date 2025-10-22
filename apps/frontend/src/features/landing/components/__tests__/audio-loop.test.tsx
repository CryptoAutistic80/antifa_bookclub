import { render, waitFor } from '@testing-library/react';

import { AudioLoop } from '../audio-loop';

describe('AudioLoop', () => {
  const originalNextData = (globalThis as { __NEXT_DATA__?: unknown }).__NEXT_DATA__;

  beforeEach(() => {
    jest.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
    jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalNextData) {
      (globalThis as { __NEXT_DATA__?: unknown }).__NEXT_DATA__ = originalNextData;
    } else {
      delete (globalThis as { __NEXT_DATA__?: unknown }).__NEXT_DATA__;
    }
  });

  it('resolves audio src using the Next.js asset prefix', async () => {
    (globalThis as { __NEXT_DATA__?: { assetPrefix?: string } }).__NEXT_DATA__ = { assetPrefix: '/static' };

    const { container } = render(<AudioLoop />);
    const audio = container.querySelector('audio');

    expect(audio).not.toBeNull();

    await waitFor(() => {
      expect(audio?.getAttribute('src')).toBe('/static/Iron_Roses.mp3');
    });
  });

  it('falls back to basePath when asset prefix is missing', async () => {
    (globalThis as { __NEXT_DATA__?: { basePath?: string } }).__NEXT_DATA__ = { basePath: '/alt' };

    const { container } = render(<AudioLoop />);
    const audio = container.querySelector('audio');

    expect(audio).not.toBeNull();

    await waitFor(() => {
      expect(audio?.getAttribute('src')).toBe('/alt/Iron_Roses.mp3');
    });
  });
});
