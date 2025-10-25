import { Analytics } from "@vercel/analytics/next"
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { ReactNode } from "react";

import { fontSans } from "@/config/fonts";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import LlmNavbar from "@/components/navbar"

import "@/styles/globals.css";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html suppressHydrationWarning lang="en">
			<head/>

			<body
				className={clsx(
					"dark:text-llm-lace text-llm-masala dark:bg-llm-masala bg-llm-lace font-sans antialiased",
					fontSans.variable,
				)}
			>
				<Providers themeProps={{ attribute: "class", enableSystem: true }}>
					<div className="relative flex flex-col h-screen">
						<LlmNavbar/>
						<main className="h-full">
							{children}
						</main>
					</div>
				</Providers>
				<Analytics/>
			</body>
		</html>
	);
}
