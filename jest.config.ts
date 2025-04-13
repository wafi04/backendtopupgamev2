import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/test'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  coverageReporters: ['clover', 'json', 'lcov', ['text', {skipFull: true}]],
  testMatch: ['**/*.test.ts'],
  verbose: true
};

export default config;