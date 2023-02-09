module.exports = {
	env: {
		node: true,
		es2021: true,
	},
	extends: ["standard", "prettier"],
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	rules: {
		indent: [2, "tab"],
		"no-tabs": 0,
		quotes: "off",
		allowEmptyReject: 1,
	},
};
