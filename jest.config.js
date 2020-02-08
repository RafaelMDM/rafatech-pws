const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    "src/services/**/*.ts"
  ],
  coverageDirectory: "src/services/coverage",
  coverageReporters: [
    "json",
    "lcov",
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" }),
  preset: '@shelf/jest-mongodb',
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/src/services/**/*.spec.ts",
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
};
