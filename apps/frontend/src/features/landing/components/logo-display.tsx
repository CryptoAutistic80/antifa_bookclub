'use client';

import { useLogoRotation } from '../hooks/use-logo-rotation';
import type { RotatingLogo } from '../hooks/use-logo-rotation';

type LogoAsset = RotatingLogo<string>;

const LOGOS: LogoAsset[] = [
  {
    image: '/logo2.png',
    alt: 'Anti-Fascist Book Club UK',
    title: 'Anti-Fascist Book Club UK',
  },
  {
    image: '/logo1.png',
    alt: 'Resistance Symbol',
    title: 'Resistance Through Knowledge',
  },
];

const SUBTITLES = [
  'Locating free and paid tomes for you',
  "not just a book club, it's a movement",
];

export function LogoDisplay() {
  const { logo, subtitle, isTransitioning } = useLogoRotation<string>({
    logos: LOGOS,
    subtitles: SUBTITLES,
  });

  const transitionClass = isTransitioning ? 'fade-out' : 'fade-in';

  return (
    <div className="logo-container">
      <div className={`logo-subtitle ${transitionClass}`}>{subtitle}</div>
      <div className="logo-wrapper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={logo.title}
          src={logo.image}
          alt={logo.alt}
          className={`logo ${transitionClass}`}
        />
      </div>
      <div className="logo-title">{logo.title}</div>
    </div>
  );
}
