import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { jest } from '@jest/globals';
import React from 'react';
import { TextDecoder, TextEncoder } from 'node:util';
import { TransformStream } from 'node:stream/web';
import { WebSocket } from 'ws';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket;
}

if (typeof globalThis.BroadcastChannel === 'undefined') {
  class MockBroadcastChannel {
    readonly name: string;

    constructor(name: string) {
      this.name = name;
    }

    postMessage() {}

    close() {}

    addEventListener() {}

    removeEventListener() {}
  }

  globalThis.BroadcastChannel = MockBroadcastChannel as unknown as typeof globalThis.BroadcastChannel;
}

if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream as unknown as typeof globalThis.TransformStream;
}


type NextImageProps = {
  src: string | { src: string };
  alt: string;
  [key: string]: unknown;
};

jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: NextImageProps) => {
      const { src, ...rest } = props;
      const resolvedSrc = typeof src === 'string' ? src : src?.src ?? '';
      return React.createElement('img', { ...rest, src: resolvedSrc });
    },
  };
});
