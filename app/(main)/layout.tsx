import type { Metadata } from "next";
import LocalFont from "next/font/local";
import "../globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const pretendard = LocalFont({
	src: "../../public/fonts/pretendard/PretendardVariable.woff2",
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
		<html lang="ko" className={`${pretendard.variable}`}>
			<body>
				<AuthProvider>
					<Navbar />
					{children}
				</AuthProvider>
			</body>
		</html>
	);
}
