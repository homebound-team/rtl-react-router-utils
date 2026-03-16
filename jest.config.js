export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx,js,jsx}"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^src(.*)$": "<rootDir>/src$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
};
