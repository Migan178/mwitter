import "../globals.css";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import LocalFont from "next/font/local";
import { redirect } from "next/navigation";

const pretendard = LocalFont({
	src: "../../public/fonts/pretendard/PretendardVariable.woff2",
	display: "swap",
	weight: "100 900",
	variable: "--font-pretendard",
});

export const metadata: Metadata = {
	title: "Mwitter",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (session) redirect("/");

	return (
		<html className={`${pretendard.variable}`}>
			<body>{children}</body>
		</html>
	);
}
