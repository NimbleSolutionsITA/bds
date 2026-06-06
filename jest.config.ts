import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: {
    // Strip CSS/asset imports that break in Node
    '\\.(css|scss)$': '<rootDir>/__tests__/__mocks__/fileMock.js',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { allowJs: true, esModuleInterop: true } }],
  },
  collectCoverageFrom: [
    'pages/api/orders/**/*.ts',
    'src/components/ApplePayButton.tsx',
    'src/components/GooglePayButton.tsx',
    'src/components/PayPalCheckoutProvider.tsx',
  ],
};

export default config;
