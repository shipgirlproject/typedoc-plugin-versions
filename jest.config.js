// @ts-check
/* eslint-disable no-undef */
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  setupFilesAfterEnv: [
    "./test/hooks.ts"
  ],
};