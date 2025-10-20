"use client";
import { useEffect, useRef, useState } from 'react';

export default function AudioLoop() {
  const audioRef = useRef(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    // Compute base path/asset prefix at runtime for GitHub Pages
    const prefix =
      (globalThis.__NEXT_DATA__ &&
        (globalThis.__NEXT_DATA__.assetPrefix || globalThis.__NEXT_DATA__.basePath)) ||
      '';

    // Configure element and source
    el.src = `${prefix}/Iron_Roses.mp3`;
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0.8; // tweak as desired
    // iOS inline playback hints
    try {
      el.setAttribute('playsinline', 'true');
      el.setAttribute('webkit-playsinline', 'true');
    } catch (_) {}
    // Ensure metadata is ready on iOS before play attempts
    try {
      el.load();
    } catch (_) {}

    const events = ['pointerdown', 'touchend', 'click', 'keydown'];

    const cleanup = () => {
      events.forEach((t) => document.removeEventListener(t, onInteract, true));
    };

    const resume = async () => {
      try {
        el.muted = false;
        await el.play();
        setShowPrompt(false);
        cleanup();
      } catch (_) {
        // stay in prompted state; user may need to try again
      }
    };

    const onInteract = () => {
      // Call play() directly in the user gesture handler for iOS/Android
      void resume();
    };

    const tryPlay = async () => {
      try {
        await el.play(); // may throw on mobile
        setShowPrompt(false);
      } catch (_) {
        // Autoplay blocked — show prompt and listen for the first gesture
        setShowPrompt(true);
        events.forEach((t) =>
          document.addEventListener(t, onInteract, { capture: true, once: true })
        );
      }
    };

    void tryPlay();

    return () => {
      cleanup();
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        // src set in effect to support basePath/assetPrefix
        autoPlay
        loop
        playsInline
        style={{ display: 'none' }}
      />
      {showPrompt && (
        <button
          onClick={() => {
            const el = audioRef.current;
            if (!el) return;
            el.muted = false;
            el.play().then(() => setShowPrompt(false)).catch(() => {});
          }}
          aria-label="Enable sound (check silent mode)"
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            padding: '10px 14px',
            fontSize: 14,
            color: '#0a0a0a',
            background: '#ffffff',
            border: 'none',
            borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
        >
          Tap for sound
        </button>
      )}
    </>
  );
}
