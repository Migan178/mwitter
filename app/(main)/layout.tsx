import "../globals.css";
import AuthProvider from "@/components/AuthProvider";
import LoginButton from "@/components/LoginButton";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import LocalFont from "next/font/local";

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

	return (
		<html lang="ko" className={`${pretendard.variable}`}>
			<body>
				<AuthProvider session={session}>
					{session ? (
						<div className="flex w-full">
							<Navbar />
							<div className="ml-100 grow">{children}</div>
						</div>
					) : (
						<div className="grid h-screen items-center justify-center">
							<div className="flex flex-col gap-y-2 text-center">
								<h1 className="text-4xl font-bold">Mwitter</h1>
								<h2 className="text-2xl font-semibold">
									로그인해서 시작하기
								</h2>
								<LoginButton />
							</div>
						</div>
					)}
				</AuthProvider>
			</body>
		</html>
	);
}
