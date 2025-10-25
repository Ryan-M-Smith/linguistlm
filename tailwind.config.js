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
				"llm-chinois": 		"#255757",
				"llm-sea-glass": 	"#77C5C5",
				"llm-blue-flower": 	"#97E5E5",
				"llm-lace": 		"#F8F8F0",
				"llm-masala": 		"#303030"
			}
		},
	},
	darkMode: "class",
	plugins: [heroui()],
}

module.exports = config;