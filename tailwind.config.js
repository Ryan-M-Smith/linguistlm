import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)"],
				mono: ["var(--font-mono)"],
			},
			colors: {
				"llm-chinois": 		"#798C8C",
				"llm-sea-glass": 	"#AEBFBE",
				"llm-blue-flower": 	"#D0D9D4",
				"llm-lace": 		"#F2EFDF",
				"llm-masala": 		"#59554C"
			}
		},
	},
	darkMode: "class",
	plugins: [heroui()],
}

module.exports = config;