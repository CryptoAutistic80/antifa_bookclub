"use client";
import { useEffect, useRef } from 'react';

export default function AudioLoop() {
  const audioRef = useRef(null);
  const startedRef = useRef(false);

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
    } catch {
      // Ignore attribute setting errors
    }
    // Ensure metadata is ready on iOS before play attempts
    try {
      el.load();
    } catch {
      // Ignore load errors
    }

    const events = [
      'pointerdown',
      'pointerup',
      'pointermove',
      'touchstart',
      'touchmove',
      'touchend',
      'mousedown',
      'mouseup',
      'mousemove',
      'click',
      'keydown',
      'wheel',
      'scroll',
    ];

    const listenerOptions = { capture: true, passive: true };
    let listenersAttached = false;

    const tryStartPlayback = () => {
      if (startedRef.current) return;
      el.muted = false;
      const maybePromise = el.play();
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise
          .then(() => {
            startedRef.current = true;
            detachListeners();
          })
          .catch(() => {
            // keep listeners active for the next gesture
          });
      } else {
        startedRef.current = true;
        detachListeners();
      }
    };

    const handleUserInteraction = () => {
      if (startedRef.current) return;
      tryStartPlayback();
    };

    const attachListeners = () => {
      if (listenersAttached) return;
      events.forEach((event) => {
        document.addEventListener(event, handleUserInteraction, listenerOptions);
        window.addEventListener(event, handleUserInteraction, listenerOptions);
      });
      listenersAttached = true;
    };

    const detachListeners = () => {
      if (!listenersAttached) return;
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction, listenerOptions.capture);
        window.removeEventListener(event, handleUserInteraction, listenerOptions.capture);
      });
      listenersAttached = false;
    };

    // Attempt autoplay immediately
    tryStartPlayback();
    if (!startedRef.current) {
      attachListeners();
    }

    return () => {
      detachListeners();
    };
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
