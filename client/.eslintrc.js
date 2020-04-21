module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  plugins: ["vue"],
  extends: [
    "plugin:prettier/recommended",

    "eslint:recommended",
    "plugin:vue/essential"
  ],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    //"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    // "prettier/prettier": [
    //   "error",
    //   {
    //     endOfLine: "auto"
    //   }
    // ]
  },
  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
