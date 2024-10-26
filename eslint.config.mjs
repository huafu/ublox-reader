import globals from "globals";
import pluginJs from "@eslint/js";

export default [
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    {
        rules: {
            "no-var": "error",
            "prefer-const": "error",
            "no-unused-vars": "error",
            "no-undef": "error",
            "no-undef-init": "error",
            "no-use-before-define": "error",
            "no-shadow": "error",
            "no-shadow-restricted-names": "error",
            "no-unused-expressions": "error",
            "no-unused-labels": "error",
            "no-empty": 0,
            "no-empty-function": "error",
        },
    },
];
