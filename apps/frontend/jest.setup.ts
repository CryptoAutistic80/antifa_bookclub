import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import React from 'react';

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
