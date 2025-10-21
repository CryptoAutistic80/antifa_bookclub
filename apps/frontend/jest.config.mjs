const config = {
  displayName: 'frontend',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|webp|svg)$': '<rootDir>/test/__mocks__/file-mock.ts',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: false,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
        module: {
          type: 'es6',
        },
        swcrc: false,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!three/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default config;
