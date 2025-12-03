import type { Metadata } from "next";
import LocalFont from "next/font/local";
import "./globals.css";

const pretendard = LocalFont({
	src: "../public/fonts/pretendard/PretendardVariable.woff2",
	display: "swap",
	weight: "100 900",
	variable: "--font-pretendard",
});

export const metadata: Metadata = {
	title: "Mwitter",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" className={`h-screen ${pretendard.variable}`}>
			<body className="grid h-screen items-center justify-center">
				{children}
			</body>
		</html>
	);
}
