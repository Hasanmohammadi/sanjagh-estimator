import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    sequence: {
      concurrent: false,
    },
    fileParallelism: false,

    env: {
      DATABASE_URL:
        "postgresql://postgres:postgres@localhost:5433/painting_estimator_test",
      NODE_ENV: "test",
    },
  },
});
