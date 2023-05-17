import type { Config } from "@jest/types"
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "jest-environment-jsdom",
}
export default config
