import "../../globals.css";
import type { Metadata } from "next";
import LocalFont from "next/font/local";

const pretendard = LocalFont({
	src: "../../../public/fonts/pretendard/PretendardVariable.woff2",
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
		<html className={`${pretendard.variable}`}>
			<body>{children}</body>
		</html>
	);
}
