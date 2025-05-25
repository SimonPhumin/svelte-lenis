import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.serviceworker
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/no-unused-expressions': 'warn',
			'no-empty': 'warn',
			'no-useless-escape': 'off',
			'svelte/no-useless-mustaches': 'warn',
			'svelte/no-reactive-reassign': 'warn',
			'prefer-const': 'warn',
			'no-undef': 'error'
		}
	},
	{
		files: ['**/*.svelte'],
		ignores: ['.svelte-kit/*'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		files: ['static/**/*.js'],
		languageOptions: {
			globals: {
				...globals.serviceworker,
				define: 'readonly',
				importScripts: 'readonly',
				FetchEvent: 'readonly',
				registration: 'readonly'
			}
		}
	}
);
