export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx,js,jsx}"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^src(.*)$": "<rootDir>/src$1",
    "^use-query-params$": "<rootDir>/node_modules/use-query-params/dist/index.js",
    "^serialize-query-params$": "<rootDir>/node_modules/serialize-query-params/dist/index.js",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!use-query-params|serialize-query-params)/"],
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", { tsconfig: { allowJs: true }, useESM: true }],
  },
};
