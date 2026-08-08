import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";

// 모션 가드 셀렉터 — raw <button> 가드 블록에서도 재사용
const motionGuardSelectors = [
  {
    selector: "Literal[value=/\\btransition-all\\b/]",
    message:
      "transition-all 금지: 애니메이션할 속성을 명시하고 토큰(var(--duration-*)/var(--ease-*))을 쓰세요.",
  },
  {
    selector: "TemplateElement[value.raw=/\\btransition-all\\b/]",
    message: "transition-all 금지: 애니메이션할 속성을 명시하고 토큰을 쓰세요.",
  },
  {
    selector: "Literal[value=/\\banimate-pulse\\b/]",
    message: "animate-pulse 금지: t-skel-sheen 스켈레톤 패턴을 쓰세요.",
  },
  {
    selector: "TemplateElement[value.raw=/\\banimate-pulse\\b/]",
    message: "animate-pulse 금지: t-skel-sheen 스켈레톤 패턴을 쓰세요.",
  },
  {
    selector: "Literal[value=/duration-\\[[0-9]/]",
    message: "임의 duration 금지: duration-[var(--duration-*)] 토큰을 쓰세요.",
  },
  {
    selector: "TemplateElement[value.raw=/duration-\\[[0-9]/]",
    message: "임의 duration 금지: duration-[var(--duration-*)] 토큰을 쓰세요.",
  },
];

export default defineConfig([
  globalIgnores([
    "dist",
    "build",
    "coverage",
    "node_modules",
    "android",
    "ios",
  ]),

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,

      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "react-hooks/set-state-in-effect": "off",

      "react-hooks/refs": "off",

      "react-hooks/exhaustive-deps": "off",
    },
  },

  // 모션 가드
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/pages/demoDay/**"],
    rules: {
      "no-restricted-syntax": ["error", ...motionGuardSelectors],
    },
  },

  // raw <button> 가드 — 탭 피드백은 Press가 소유하므로 공용 컴포넌트 내부에서만 허용
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/pages/demoDay/**", "src/components/common/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...motionGuardSelectors,
        {
          selector: "JSXOpeningElement[name.name='button']",
          message:
            "raw <button> 금지: Press/CTA_Button 등 공용 컴포넌트를 쓰세요. (스크림·도트 등 의도적 미적용은 disable 주석으로 사유를 남길 것)",
        },
      ],
    },
  },
]);
