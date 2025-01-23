import js from "@eslint/js";
import { parse, parseForESLint } from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";

export default [
	//----------------------------------------------------------------------
	// 1) Ignorar algumas pastas que você não quer que o ESLint analise
	//----------------------------------------------------------------------
	{
		ignores: ["**/node_modules/**", ".next/**"],
	},

	//----------------------------------------------------------------------
	// 2) Configurações recomendadas do ESLint “core” (já em flat config)
	//----------------------------------------------------------------------
	js.configs.recommended,

	//----------------------------------------------------------------------
	// 3) Configurações customizadas, onde definimos parser e plugins
	//----------------------------------------------------------------------
	{
		// Aplique essas regras/analise a todos os arquivos .js/.jsx/.ts/.tsx:
		files: ["**/*.{js,jsx,ts,tsx}"],

		//--------------------------------------------------------------------
		// 3.1) O parser, no novo formato, precisa ser um OBJETO com parse().
		//      Aqui usamos `@typescript-eslint/parser`, que exporta
		//      parse() e parseForESLint().
		//--------------------------------------------------------------------
		languageOptions: {
			parser: {
				parse(code, options) {
					return parse(code, {
						// Ajustes de sintaxe
						ecmaVersion: "latest",
						sourceType: "module",
						ecmaFeatures: {
							jsx: true,
						},
						...options,
					});
				},
				parseForESLint(code, options) {
					return parseForESLint(code, {
						ecmaVersion: "latest",
						sourceType: "module",
						ecmaFeatures: {
							jsx: true,
						},
						...options,
					});
				},
			},
		},

		//--------------------------------------------------------------------
		// 3.2) Plugins - no formato novo, também devem ser OBJETOS
		//--------------------------------------------------------------------
		plugins: {
			"@typescript-eslint": tsPlugin,
			react: reactPlugin,
			"react-hooks": reactHooksPlugin,
			"jsx-a11y": jsxA11yPlugin,
			prettier: prettierPlugin,
		},

		//--------------------------------------------------------------------
		// 3.3) Configurações adicionais (por ex., detectar versão do React)
		//--------------------------------------------------------------------
		settings: {
			react: {
				version: "detect",
			},
		},

		//--------------------------------------------------------------------
		// 3.4) Regras
		//--------------------------------------------------------------------
		rules: {
			// Prettier

			"no-unused-vars": "off",
			"no-undef": "off",
			"no-null": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",

			"biome/no-null": "off",
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",

			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"jsx-a11y/anchor-is-valid": "off",
			"jsx-a11y/no-noninteractive-element-interactions": "off",
			"jsx-a11y/click-events-have-key-events": "off",
			"jsx-a11y/no-static-element-interactions": "off",
		},
	},
];
