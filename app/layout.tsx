import { Analytics } from "@vercel/analytics/next"
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { ReactNode } from "react";

import { fontSans } from "@/config/fonts";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";

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
					"min-h-screen text-foreground bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<Providers themeProps={{ attribute: "class", enableSystem: true }}>
					<div className="relative flex flex-col h-screen">
						<main className="container mx-auto max-w-7xl pt-16 px-6 grow">
							{children}
						</main>
					</div>
				</Providers>
			</body>

			<Analytics/>
		</html>
	);
}
