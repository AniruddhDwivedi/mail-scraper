import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js", "**/*.jsx"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },

      globals: {
        ...globals.browser,
        ...globals.node
      }
    },

    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      prettier
    },

    settings: {
      react: {
        version: "detect"
      }
    },

    rules: {
      "no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "React"
        }
      ],

      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "prettier/prettier": "warn"
    }
  }
];
