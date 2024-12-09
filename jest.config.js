// @ts-check
import { createDefaultEsmPreset } from 'ts-jest';

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  ...createDefaultEsmPreset({}),
  testEnvironment: "node",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "mts",
    "mjs",
    "js"
  ],
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.jsx?$": "$1"
  },
  setupFilesAfterEnv: [
    "./test/hooks.ts"
  ],
};