module.exports = {
  root: true,

  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },

  env: {
    browser: true
  },

  extends: [
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended"
  ],

  // required to lint *.vue files
  plugins: ["vue"],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true
  },

  // add your custom rules here
  rules: {
    "prefer-promise-reject-errors": "off",

    // allow debugger during development only
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};
