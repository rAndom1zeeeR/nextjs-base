import { defineConfig, globalIgnores } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importXPlugin from "eslint-plugin-import-x";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    "e2e/**",
    "e2e-results/**",
    "playwright-report/**",
  ]),

  // TypeScript конфигурация (должна быть первой для TS файлов)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      // Отключаем все правила из базового recommended config, которые конфликтуют с TypeScript
      "no-undef": "off",
      "no-redeclare": "off",
      "no-restricted-syntax": "off",
      "no-unused-vars": "off",
      "no-var": "off",
      "@typescript-eslint/no-redeclare": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "import-x/order": [
        "error",
        {
          groups: ["type", "builtin", "external", "internal", ["parent", "sibling"], "index"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
            {
              pattern: "./**",
              group: "parent",
            },
          ],
          "newlines-between": "never",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import-x/no-unresolved": "off",
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
    },
  },

  // Базовый recommended config только для JS файлов
  {
    ...js.configs.recommended,
    files: ["**/*.{js,jsx}"],
  },

  // Базовые настройки для JS файлов
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // React конфигурация (fixup для совместимости с ESLint 10)
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react: fixupPluginRules(reactPlugin),
      "react-hooks": fixupPluginRules(reactHooksPlugin),
      "jsx-a11y": fixupPluginRules(jsxA11yPlugin),
      "import-x": importXPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import-x/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: path.join(__dirname, "tsconfig.json"),
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "warn",
      "react/no-unescaped-entities": "error",
      // React Compiler rules (hooks 7+): флагают легитимные data-fetch/reset в useEffect и ручные deps в useCallback.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
    },
  },

  // Admin modals: preview arbitrary URLs; <img> avoids next/image remotePatterns churn.
  {
    files: [
      "src/app/[locale]/admin/images/ui/components/modals/metadata-modal.tsx",
      "src/app/[locale]/admin/images/ui/components/modals/server-images-modal.tsx",
    ],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },

  // TanStack Table / React Hook Form: libraries React Compiler cannot memoize; safe to ignore.
  {
    files: [
      "src/widgets/card-wallet/wallet-holder-jettons.tsx",
      "src/**/jettons/ui/jettons-table.tsx",
      "src/app/**/admin/jettons/ui/admin-jettons-table.tsx",
      "src/features/edit-entity/**/*.tsx",
    ],
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },

  // Next.js плагин
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // Правила для конкретных директорий
  {
    files: ["src/entities/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "@/features/**", "@/widgets/**"],
              message: "entities слой может импортировать только из shared",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "@/widgets/**"],
              message: "features слой может импортировать только из entities и shared",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/widgets/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**"],
              message: "widgets слой может импортировать только из features, entities и shared",
            },
          ],
        },
      ],
    },
  },

  // Prettier config - must be last to override other configs
  prettierConfig,
]);

export default eslintConfig;
