import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  {
    ignores: [".next/", "node_modules/", "dist/", "build/", "src/gen/", "**/*.config.*"],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "unused-imports": unusedImports,
    },

    rules: {
      "prefer-const": "warn",
      "no-var": "warn",
      "no-console": 1,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Auto-remove unused imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Vitest globals
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
