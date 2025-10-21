'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type RotatingLogo<TImage> = {
  image: TImage;
  alt: string;
  title: string;
};

export interface UseLogoRotationArgs<TImage> {
  logos: RotatingLogo<TImage>[];
  subtitles: string[];
  rotationMs?: number;
  transitionMs?: number;
}

export interface UseLogoRotationResult<TImage> {
  logo: RotatingLogo<TImage>;
  subtitle: string;
  isTransitioning: boolean;
}

export function useLogoRotation<TImage>({
  logos,
  subtitles,
  rotationMs = 4000,
  transitionMs = 500,
}: UseLogoRotationArgs<TImage>): UseLogoRotationResult<TImage> {
  const [currentLogo, setCurrentLogo] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCurrentLogo((prev) => (prev + 1) % logos.length);
        setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
        setIsTransitioning(false);
      }, transitionMs);
    }, rotationMs);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [logos.length, rotationMs, subtitles.length, transitionMs]);

  const logo = useMemo(() => logos[currentLogo], [currentLogo, logos]);
  const subtitle = useMemo(() => subtitles[subtitleIndex], [subtitleIndex, subtitles]);

  return { logo, subtitle, isTransitioning };
}
