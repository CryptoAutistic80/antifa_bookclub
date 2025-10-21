import { act, render, screen } from '@testing-library/react';

import { LogoDisplay } from '../logo-display';

describe('LogoDisplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders the initial logo and subtitle', () => {
    render(<LogoDisplay />);

    expect(screen.getByText('Anti-Fascist Book Club UK')).toBeInTheDocument();
    expect(screen.getByText('Locating free and paid tomes for you')).toBeInTheDocument();
  });

  it('rotates to the next logo after the interval', async () => {
    render(<LogoDisplay />);

    await act(async () => {
      jest.advanceTimersByTime(4000);
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByText('Resistance Through Knowledge')).toBeInTheDocument();
    expect(screen.getByText("not just a book club, it's a movement")).toBeInTheDocument();
  });
});
