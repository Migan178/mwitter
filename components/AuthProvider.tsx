"use client";

import UserDataInitializer from "./UserDataInitializer";
import { type ProfileResult } from "@/lib/services/user";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
	children,
	user,
	session,
}: {
	children: React.ReactNode;
	user: ProfileResult | null;
	session: Session | null;
}) {
	return (
		<SessionProvider session={session}>
			<UserDataInitializer user={user}>{children}</UserDataInitializer>
		</SessionProvider>
	);
}
