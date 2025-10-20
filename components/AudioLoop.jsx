"use client";
import { useEffect, useRef } from 'react';

export default function AudioLoop() {
  const audioRef = useRef(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    // Compute base path/asset prefix at runtime for GitHub Pages
    const prefix = (globalThis.__NEXT_DATA__ && (globalThis.__NEXT_DATA__.assetPrefix || globalThis.__NEXT_DATA__.basePath)) || '';
    el.src = `${prefix}/Iron_Roses.mp3`;
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0.8; // tweak as desired

    const tryPlay = () => {
      el.play().catch(() => {
        // If autoplay is blocked, wait for first user interaction
        const onInteract = () => {
          el.play().finally(() => {
            document.removeEventListener('pointerdown', onInteract, { capture: true });
            document.removeEventListener('keydown', onInteract, { capture: true });
          });
        };
        document.addEventListener('pointerdown', onInteract, { capture: true, once: true });
        document.addEventListener('keydown', onInteract, { capture: true, once: true });
      });
    };

    tryPlay();
  }, []);

  return (
    <audio
      ref={audioRef}
      // src set in effect to support basePath/assetPrefix
      autoPlay
      loop
      playsInline
      style={{ display: 'none' }}
    />
  );
}
