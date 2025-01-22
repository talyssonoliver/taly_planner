import { Head, Html, Main, NextScript } from "next/document";
import React from "react";
type HTMLLinkElement = globalThis.HTMLLinkElement;

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
					rel="preload"
					as="style"
					onLoad={(event) => {
						const link = event.currentTarget as HTMLLinkElement;
						link.onload = null;
						link.rel = "stylesheet";
					}}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
