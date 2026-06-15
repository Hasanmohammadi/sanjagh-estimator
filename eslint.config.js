import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  // -------------------------
  // IGNORE BUILD FILES
  // -------------------------
  {
    ignores: [".next/", "node_modules/", "dist/", "build/", "src/gen/", "**/*.config.*"],
  },

  // -------------------------
  // BASE RECOMMENDED RULES
  // -------------------------
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // -------------------------
  // REACT APP CONFIG (IMPORTANT FIX)
  // -------------------------
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "prefer-const": "warn",
      "no-var": "warn",
    },
  },

  // -------------------------
  // TYPESCRIPT RULES
  // -------------------------
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // -------------------------
  // TEST FILES (VITEST)
  // -------------------------
  {
    files: ["**/*.test.*", "**/*.spec.*"],
    languageOptions: {
      globals: {
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
    },
  },
]);
