module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
	],
	"overrides": [
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
	},
	"plugins": [
		"@typescript-eslint",
	],
	"rules": {
		"@typescript-eslint/quotes": [
			"error",
			"double",
			{
				avoidEscape: true,
				allowTemplateLiterals: true,
			},
		],
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/no-empty-function": "off",
		"no-empty": "off",
		"comma-dangle": ["error", "always-multiline"],
		indent: [2, "tab"],
		"no-tabs": 0,
		quotes: "off",
		"no-unused-vars": "off",
		allowEmptyReject: 0,
		"space-infix-ops": "error",
		"brace-style": "error",
		"space-before-blocks": "error",
		"space-before-function-paren": [
			"error",
			{
				anonymous: "always",
				named: "always",
				asyncArrow: "always",
			},
		],
		"newline-per-chained-call": "error",
		"space-in-parens": ["error", "never"],
		"array-bracket-spacing": ["error", "never"],
		"object-curly-spacing": ["error", "always"],
		"comma-spacing": [
			"error",
			{
				before: false,
				after: true,
			},
		],
		"no-multiple-empty-lines": [
			"error",
			{
				max: 1,
				maxEOF: 1,
			},
		],
	},
};
