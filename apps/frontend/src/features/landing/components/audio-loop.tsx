'use client';

import { useEffect, useRef } from 'react';

type NextRuntimeData = {
  assetPrefix?: string;
  basePath?: string;
};

type ExtendedWindow = typeof globalThis & {
  __NEXT_DATA__?: NextRuntimeData;
};

const GESTURE_EVENTS: (keyof DocumentEventMap | keyof WindowEventMap)[] = [
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

const LISTENER_OPTIONS: AddEventListenerOptions = { capture: true, passive: true };

const resolveAudioSrc = (filename: string) => {
  const runtimeData = (globalThis as ExtendedWindow).__NEXT_DATA__;
  const prefix = runtimeData?.assetPrefix || runtimeData?.basePath || '';
  return `${prefix}/${filename}`;
};

export function AudioLoop() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) {
      return undefined;
    }

    const resolvedSrc = resolveAudioSrc('Iron_Roses.mp3');
    element.src = resolvedSrc;
    element.setAttribute('src', resolvedSrc);
    element.loop = true;
    element.preload = 'auto';
    element.volume = 0.8;

    try {
      element.setAttribute('playsinline', 'true');
      element.setAttribute('webkit-playsinline', 'true');
      element.load();
    } catch {
      // Ignore platform-specific attribute/load failures.
    }

    let listenersAttached = false;

    const detachListeners = () => {
      if (!listenersAttached) {
        return;
      }

      GESTURE_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction, LISTENER_OPTIONS);
        window.removeEventListener(event, handleUserInteraction, LISTENER_OPTIONS);
      });

      listenersAttached = false;
    };

    const completePlaybackStart = () => {
      startedRef.current = true;
      detachListeners();
    };

    const tryStartPlayback = () => {
      if (startedRef.current) {
        return;
      }

      element.muted = false;
      const result = element.play();

      if (result && typeof result.then === 'function') {
        result.then(completePlaybackStart).catch(() => {
          // Keep listeners active for the next gesture attempt.
        });
      } else {
        completePlaybackStart();
      }
    };

    function handleUserInteraction() {
      if (startedRef.current) {
        return;
      }

      tryStartPlayback();
    }

    const attachListeners = () => {
      if (listenersAttached) {
        return;
      }

      GESTURE_EVENTS.forEach((event) => {
        document.addEventListener(event, handleUserInteraction, LISTENER_OPTIONS);
        window.addEventListener(event, handleUserInteraction, LISTENER_OPTIONS);
      });

      listenersAttached = true;
    };

    tryStartPlayback();

    if (!startedRef.current) {
      attachListeners();
    }

    return () => {
      detachListeners();
    };
  }, []);

  return <audio ref={audioRef} autoPlay loop playsInline style={{ display: 'none' }} />;
}
