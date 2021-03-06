module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	},
	"extends": [
		"plugin:react/recommended"
	],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaFeatures": {
				"jsx": true
		},
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"plugins": [ "react" ],
	"settings": {
    "react": {
			"version": "detect"
		}
	},
	"rules": {
		"quotes": [ "error", "double" ],
		"semi": [ "error", "always"	],
		"indent": ["error", "tab", { "SwitchCase": 1}],
		"eol-last": ["error", "never"],
		"comma-dangle": ["error", "never"]
	}
};