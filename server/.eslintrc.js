module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    indent: [2, "tab"],
		"no-tabs": 0,
		quotes: "off",
		allowEmptyReject: true,
  }
}
