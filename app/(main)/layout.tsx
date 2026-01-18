import "../globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { getProfileById, ProfileResult } from "@/lib/services/user";
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
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	const session = await auth();

	let user: ProfileResult | null = null;

	if (session) {
		try {
			user = await getProfileById(Number(session.user?.id));
		} catch (err) {
			console.error(err);
			return;
		}
	}

	return (
		<html lang="ko" className={`${pretendard.variable}`}>
			<body>
				<AuthProvider session={session} user={user}>
					<div className="flex w-full">
						{session ? <Navbar /> : null}
						<div className="ml-100">{children}</div>
					</div>
					{modal}
				</AuthProvider>
			</body>
		</html>
	);
}
