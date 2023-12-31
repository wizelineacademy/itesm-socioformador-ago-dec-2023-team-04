module.exports = {
    extends: ['plugin:@next/next/recommended', 'xo-react'],
    ignores: [
        "./cypress/**",
        "./*",
    ],
    rules: {
        "react/require-default-props": "off",
        "react/prop-types": "off",
        "react/jsx-closing-tag-location": "off",
        "@typescript-eslint/ban-types": "off",
        "react/jsx-indent-props": "off",
        "n/file-extension-in-import": "off",
        "n/prefer-global/process": "off",
        "new-cap": "off"
    }
}
