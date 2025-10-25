import { Fira_Code as FontMono, Rubik as FontSans } from "next/font/google";

export const fontSans = FontSans({
	subsets: [
		"arabic",
		"cyrillic",
		"cyrillic-ext",
		"hebrew",
		"latin",
		"latin-ext"
	],
	variable: "--font-sans",
});

export const fontMono = FontMono({
	subsets: ["latin"],
	variable: "--font-mono",
});
