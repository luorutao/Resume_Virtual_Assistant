import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "api/**/*.js",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  // exclude api/node_modules from test discovery
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/api/node_modules/",
    "<rootDir>/.next/",
  ],
};

export default createJestConfig(config);
